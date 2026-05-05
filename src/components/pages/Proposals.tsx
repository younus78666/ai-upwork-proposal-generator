'use client'
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
;
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Copy,
  Check,
  Calendar,
  Trophy,
  XCircle,
  Clock,
  Coffee,
  Pencil,
  Save,
  X,
  Sparkles,
  Loader2,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { JobSession, ProposalVariant } from '@/types/proposal';
import { getAllJobSessions, deleteJobSession, saveJobSession } from '@/utils/jobStorage';
import { StandaloneChat } from '@/components/StandaloneChat';
import { SalesPitchModal } from '@/components/SalesPitchModal';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { findFirstSavedKey } from '@/config/providers';

type Tab = 'proposal' | 'chat';
type VariantTab = 'short' | 'medium' | 'long';
type HiredFormState = {
  contractType: 'hourly' | 'fixed';
  contractPrice: string;
  connectsUsed: string;
  wasBoosted: boolean;
};

function getProposalText(session: JobSession): string {
  return (
    session.generatedProposals?.variants?.[0]?.content ||
    session.generatedProposals?.detailed ||
    session.generatedProposals?.medium ||
    ''
  );
}

function OutcomeBadge({ outcome }: { outcome: JobSession['outcome'] }) {
  if (outcome === 'hired') {
    return (
      <Badge className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100">
        <Trophy className="h-3 w-3" /> Hired
      </Badge>
    );
  }
  if (outcome === 'not_hired') {
    return (
      <Badge variant="secondary" className="gap-1 text-muted-foreground">
        <XCircle className="h-3 w-3" /> Not Hired
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground border-dashed">
      <Clock className="h-3 w-3" /> Pending
    </Badge>
  );
}

export default function Proposals() {
  const [sessions, setSessions] = useState<JobSession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, Tab>>({});
  const [activeVariantTab, setActiveVariantTab] = useState<Record<string, VariantTab>>({});
  const [editingVariant, setEditingVariant] = useState<{ sessionId: string; variantType: VariantTab } | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Sales pitch modal state
  const [salesModal, setSalesModal] = useState<{ questions: string[]; jobTitle: string } | null>(null);
  // Customize/refine state
  const [refineOpenFor, setRefineOpenFor] = useState<{ sessionId: string; variantType: VariantTab } | null>(null);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  // Hired modal state
  const [hiredFormId, setHiredFormId] = useState<string | null>(null);
  const [hiredForm, setHiredForm] = useState<HiredFormState>({
    contractType: 'fixed',
    contractPrice: '',
    connectsUsed: '',
    wasBoosted: false,
  });

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const all = await getAllJobSessions();
      setSessions(all);
    } catch {
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleToggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const openChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedId(id);
    setActiveTab(prev => ({ ...prev, [id]: 'chat' }));
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteJobSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    if (expandedId === id) setExpandedId(null);
    toast.success('Proposal deleted');
  };

  // Pick 3 variant-specific questions so each tab surfaces a different angle.
  // Short → first 3, Medium → middle 3, Long → last 3 (wraps if fewer available).
  const pickVariantQuestions = (all: string[], variantType: VariantTab): string[] => {
    if (all.length === 0) return [];
    if (all.length <= 3) return all;
    const offset = variantType === 'short' ? 0 : variantType === 'medium' ? 1 : 2;
    return [all[offset % all.length], all[(offset + 1) % all.length], all[(offset + 2) % all.length]];
  };

  const handleCopy = (id: string, text: string, session?: JobSession, variantType?: VariantTab) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
    // Show sales pitch questions if available for this session
    const allQ: string[] = session?.generatedProposals?.salesQuestions || [];
    if (allQ.length > 0) {
      const questions = pickVariantQuestions(allQ, variantType || 'medium');
      setSalesModal({ questions, jobTitle: session?.jobTitle || '' });
    }
  };

  const setTab = (id: string, tab: Tab) => {
    setActiveTab(prev => ({ ...prev, [id]: tab }));
  };

  const setVariantTab = (sessionId: string, vTab: VariantTab) => {
    setActiveVariantTab(prev => ({ ...prev, [sessionId]: vTab }));
    setEditingVariant(null);
    setRefineOpenFor(null);
  };

  const startEdit = (sessionId: string, variantType: VariantTab, content: string) => {
    setEditingVariant({ sessionId, variantType });
    setEditDraft(content);
  };

  const cancelEdit = () => {
    setEditingVariant(null);
    setEditDraft('');
  };

  const saveEdit = async (sessionId: string, variantType: VariantTab) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    const variants = session.generatedProposals.variants || [];
    const updated: JobSession = {
      ...session,
      updatedAt: new Date(),
      generatedProposals: {
        ...session.generatedProposals,
        variants: variants.map(v =>
          v.type === variantType ? { ...v, content: editDraft } : v
        ),
      },
    };
    await saveJobSession(updated);
    setSessions(prev => prev.map(s => (s.id === sessionId ? updated : s)));
    setEditingVariant(null);
    setEditDraft('');
    toast.success('Proposal saved');
  };

  const handleSessionUpdate = (updated: JobSession) => {
    setSessions(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const openRefine = (sessionId: string, variantType: VariantTab) => {
    setRefineOpenFor({ sessionId, variantType });
    setRefineInstruction('');
    setEditingVariant(null);
  };

  const closeRefine = () => {
    setRefineOpenFor(null);
    setRefineInstruction('');
  };

  const handleRefine = async (session: JobSession, variantType: VariantTab) => {
    if (!refineInstruction.trim()) return;
    const savedKey = findFirstSavedKey();
    if (!savedKey) {
      toast.error('Please set your API key first (click API Key in the nav)');
      return;
    }
    const currentVariant = session.generatedProposals?.variants?.find(v => v.type === variantType);
    if (!currentVariant?.content) {
      toast.error('No proposal text found to customize.');
      return;
    }
    setIsRefining(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'refine-proposal',
          existingProposal: currentVariant.content,
          refinementInstruction: refineInstruction,
          jobTitle: session.jobTitle,
          jobDescription: session.jobDescription,
          variantType,
          apiProvider: savedKey.provider,
          apiKey: savedKey.key,

          apiModel: savedKey.model,
        },
      });
      if (error) {
        const msg = (error as any)?.context?.error || 'Failed to customize proposal.';
        toast.error(msg);
        return;
      }
      const refined: string = data?.refined;
      if (!refined) { toast.error('No result returned. Try again.'); return; }

      const variants = session.generatedProposals.variants || [];
      const updated: JobSession = {
        ...session,
        updatedAt: new Date(),
        generatedProposals: {
          ...session.generatedProposals,
          variants: variants.map(v => v.type === variantType ? { ...v, content: refined } : v),
        },
      };
      await saveJobSession(updated);
      setSessions(prev => prev.map(s => (s.id === session.id ? updated : s)));
      toast.success('Proposal updated!');
      closeRefine();
    } catch {
      toast.error('Failed to customize proposal. Please try again.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleNotHired = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    const updated: JobSession = { ...session, outcome: 'not_hired', updatedAt: new Date() };
    await saveJobSession(updated);
    setSessions(prev => prev.map(s => (s.id === id ? updated : s)));
    toast.success('Marked as not hired');
  };

  const openHiredForm = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHiredFormId(id);
    setHiredForm({ contractType: 'fixed', contractPrice: '', connectsUsed: '', wasBoosted: false });
  };

  const saveHiredOutcome = async () => {
    if (!hiredFormId) return;
    const session = sessions.find(s => s.id === hiredFormId);
    if (!session) return;
    const updated: JobSession = {
      ...session,
      outcome: 'hired',
      contractType: hiredForm.contractType,
      contractPrice: hiredForm.contractPrice ? parseFloat(hiredForm.contractPrice) : undefined,
      connectsUsed: hiredForm.connectsUsed ? parseInt(hiredForm.connectsUsed, 10) : undefined,
      wasBoosted: hiredForm.wasBoosted,
      updatedAt: new Date(),
    };
    await saveJobSession(updated);
    setSessions(prev => prev.map(s => (s.id === hiredFormId ? updated : s)));
    setHiredFormId(null);
    toast.success('Congrats! Outcome saved.');
  };

  // Stats
  const totalWithOutcome = sessions.filter(s => s.outcome).length;
  const hiredCount = sessions.filter(s => s.outcome === 'hired').length;

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Page heading */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Created Proposals</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isLoading
                ? 'Loading...'
                : sessions.length === 0
                ? 'No proposals yet. Generate one from the home page.'
                : `${sessions.length} proposal${sessions.length !== 1 ? 's' : ''} saved`}
            </p>
          </div>
          {/* Win rate pill */}
          {totalWithOutcome > 0 && (
            <div className="shrink-0 flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-3 py-1.5">
              <Trophy className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                {hiredCount}/{totalWithOutcome} hired
              </span>
            </div>
          )}
        </div>

        {/* Empty state */}
        {!isLoading && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">No proposals yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Generate your first proposal to get started
              </p>
            </div>
            <Link href="/">
              <Button>Generate a Proposal</Button>
            </Link>
          </div>
        )}

        {/* Session list */}
        {!isLoading && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map(session => {
              const isExpanded = expandedId === session.id;
              const tab: Tab = activeTab[session.id] || 'proposal';
              const proposalText = getProposalText(session);
              const msgCount = session.conversations?.length || 0;
              const isHiredFormOpen = hiredFormId === session.id;

              return (
                <Card key={session.id} className="overflow-hidden">
                  {/* Header row */}
                  <button
                    type="button"
                    className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                    onClick={() => handleToggle(session.id)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground text-sm">
                          {session.jobTitle || 'Untitled Job'}
                        </span>
                        <OutcomeBadge outcome={session.outcome} />
                        {session.applicationType === 'invitation' && (
                          <Badge className="h-5 gap-1 text-[10px] px-1.5 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-100">
                            <Mail className="h-2.5 w-2.5" />
                            Invited
                          </Badge>
                        )}
                        {msgCount > 0 && (
                          <Badge variant="secondary" className="h-5 gap-1 text-[10px] px-1.5">
                            <MessageSquare className="h-2.5 w-2.5" />
                            {msgCount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {session.clientName && (
                          <span className="text-xs text-muted-foreground">
                            {session.clientName}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(session.updatedAt, 'MMM d, yyyy')}
                        </div>
                        {session.outcome === 'hired' && session.contractPrice && (
                          <span className="text-xs font-medium text-green-600">
                            ${session.contractPrice}{session.contractType === 'hourly' ? '/hr' : ' fixed'}
                          </span>
                        )}
                        {session.jobLink && (
                          <a
                            href={session.jobLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Job
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={e => handleDelete(e, session.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete proposal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />
                      )}
                    </div>
                  </button>

                  {/* Quick action bar — always visible */}
                  <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
                    {/* Communicate button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs"
                      onClick={e => openChat(e, session.id)}
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-primary" />
                      Communicate
                      {msgCount > 0 && (
                        <span className="bg-primary/15 text-primary text-[10px] font-bold rounded-full px-1.5 min-w-[16px] h-4 flex items-center justify-center">
                          {msgCount}
                        </span>
                      )}
                    </Button>

                    {/* Outcome buttons — only if not yet set */}
                    {!session.outcome && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                          onClick={e => openHiredForm(e, session.id)}
                        >
                          <Trophy className="h-3.5 w-3.5" />
                          Hired!
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs text-muted-foreground"
                          onClick={e => handleNotHired(e, session.id)}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Not Hired
                        </Button>
                      </>
                    )}

                    {/* Change outcome if already set */}
                    {session.outcome && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                        onClick={e => {
                          e.stopPropagation();
                          if (session.outcome === 'not_hired') {
                            openHiredForm(e, session.id);
                          } else {
                            handleNotHired(e, session.id);
                          }
                        }}
                      >
                        {session.outcome === 'hired' ? 'Mark as not hired' : 'Mark as hired'}
                      </button>
                    )}
                  </div>

                  {/* Hired form (inline, shown on demand) */}
                  {isHiredFormOpen && (
                    <div className="mx-4 mb-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50/60 dark:bg-green-900/10 p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                          Congrats on the hire! Tell us about it.
                        </p>
                      </div>

                      {/* Contract type */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Contract type</p>
                        <div className="flex gap-2">
                          {(['hourly', 'fixed'] as const).map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setHiredForm(f => ({ ...f, contractType: t }))}
                              className={cn(
                                'flex-1 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                                hiredForm.contractType === t
                                  ? 'bg-green-600 text-white border-green-600'
                                  : 'bg-background text-muted-foreground border-border hover:border-green-400'
                              )}
                            >
                              {t === 'hourly' ? 'Hourly' : 'Fixed Price'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          {hiredForm.contractType === 'hourly' ? 'Hourly rate ($)' : 'Fixed price ($)'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder={hiredForm.contractType === 'hourly' ? 'e.g. 35' : 'e.g. 500'}
                          value={hiredForm.contractPrice}
                          onChange={e => setHiredForm(f => ({ ...f, contractPrice: e.target.value }))}
                          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                      </div>

                      {/* Connects used */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Connects used (optional)
                        </label>
                        <input
                          type="number"
                          min="0"
                          placeholder="e.g. 6"
                          value={hiredForm.connectsUsed}
                          onChange={e => setHiredForm(f => ({ ...f, connectsUsed: e.target.value }))}
                          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                      </div>

                      {/* Boosted */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          Was this a boosted proposal?
                        </span>
                        <button
                          type="button"
                          onClick={() => setHiredForm(f => ({ ...f, wasBoosted: !f.wasBoosted }))}
                          className={cn(
                            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                            hiredForm.wasBoosted ? 'bg-green-500' : 'bg-muted'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                              hiredForm.wasBoosted ? 'translate-x-4.5' : 'translate-x-0.5'
                            )}
                          />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          onClick={saveHiredOutcome}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setHiredFormId(null)}
                        >
                          Cancel
                        </Button>
                        {/* Buy me a coffee — optional */}
                        <a
                          href="https://buymeacoffee.com/muhammadyounus"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline"
                          title="Optional: buy me a coffee if this helped!"
                        >
                          <Coffee className="h-3.5 w-3.5" />
                          Buy me a coffee ☕
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div className="border-t">
                      {/* Tab strip */}
                      <div className="flex border-b bg-muted/20">
                        <button
                          type="button"
                          className={cn(
                            'flex-1 py-2.5 text-sm font-medium transition-colors',
                            tab === 'proposal'
                              ? 'text-primary border-b-2 border-primary bg-background'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                          onClick={() => setTab(session.id, 'proposal')}
                        >
                          Proposal
                        </button>
                        <button
                          type="button"
                          className={cn(
                            'flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5',
                            tab === 'chat'
                              ? 'text-primary border-b-2 border-primary bg-background'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                          onClick={() => setTab(session.id, 'chat')}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Chat
                          {msgCount > 0 && (
                            <span className="bg-primary/15 text-primary text-[10px] font-bold rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center">
                              {msgCount}
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Proposal tab */}
                      {tab === 'proposal' && (() => {
                        const variants = session.generatedProposals?.variants;
                        if (variants && variants.length > 0) {
                          const activeVTab: VariantTab = activeVariantTab[session.id] || (() => {
                            const rec = variants.find(v => v.recommended);
                            return (rec?.type === 'short' || rec?.type === 'medium' || rec?.type === 'long' ? rec.type : 'medium') as VariantTab;
                          })();
                          const currentVariant = variants.find(v => v.type === activeVTab) || variants[0];
                          const isEditing = editingVariant?.sessionId === session.id && editingVariant?.variantType === activeVTab;
                          const isRefineOpen = refineOpenFor?.sessionId === session.id && refineOpenFor?.variantType === activeVTab;
                          const copyKey = `${session.id}-${activeVTab}`;
                          return (
                            <div>
                              {/* Variant sub-tabs */}
                              <div className="flex border-b bg-muted/10">
                                {(['short', 'medium', 'long'] as VariantTab[]).map(vt => {
                                  const v = variants.find(variant => variant.type === vt);
                                  if (!v) return null;
                                  return (
                                    <button
                                      key={vt}
                                      type="button"
                                      className={cn(
                                        'flex-1 py-2 text-xs font-medium transition-colors relative',
                                        activeVTab === vt
                                          ? 'text-primary border-b-2 border-primary bg-background'
                                          : 'text-muted-foreground hover:text-foreground'
                                      )}
                                      onClick={() => setVariantTab(session.id, vt)}
                                    >
                                      {v.label || (vt === 'short' ? 'Short' : vt === 'medium' ? 'Medium' : 'Detailed')}
                                      {v.recommended && (
                                        <span className="ml-1 inline-block px-1 py-0.5 text-[9px] bg-primary/10 text-primary rounded-full leading-none">rec</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                              {/* Content */}
                              <div className="p-4">
                                <div className="flex justify-end gap-2 mb-3">
                                  {isEditing ? (
                                    <>
                                      <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={cancelEdit}>
                                        <X className="h-3 w-3" /> Cancel
                                      </Button>
                                      <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => saveEdit(session.id, activeVTab)}>
                                        <Save className="h-3 w-3" /> Save
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                          'h-7 gap-1.5 text-xs',
                                          isRefineOpen
                                            ? 'text-primary bg-primary/5 hover:bg-primary/10'
                                            : 'text-muted-foreground hover:text-foreground'
                                        )}
                                        onClick={() => isRefineOpen ? closeRefine() : openRefine(session.id, activeVTab)}
                                      >
                                        <Sparkles className="h-3 w-3" />
                                        Customize
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 gap-1.5 text-xs"
                                        onClick={() => startEdit(session.id, activeVTab, currentVariant?.content || '')}
                                      >
                                        <Pencil className="h-3 w-3" /> Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 gap-1.5 text-xs"
                                        onClick={() => handleCopy(copyKey, currentVariant?.content || '', session, activeVTab)}
                                      >
                                        {copiedId === copyKey ? (
                                          <><Check className="h-3 w-3 text-green-600" /> Copied</>
                                        ) : (
                                          <><Copy className="h-3 w-3" /> Copy</>
                                        )}
                                      </Button>
                                    </>
                                  )}
                                </div>

                                {/* Inline customize panel */}
                                {isRefineOpen && !isEditing && (
                                  <div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
                                    <p className="text-xs font-medium text-primary">What do you want to change?</p>
                                    <textarea
                                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                      rows={3}
                                      placeholder="e.g. Make the opening hook stronger, mention React more, shorten the middle section, answer the question about timeline differently..."
                                      value={refineInstruction}
                                      onChange={e => setRefineInstruction(e.target.value)}
                                      onKeyDown={e => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                          e.preventDefault();
                                          handleRefine(session, activeVTab);
                                        }
                                      }}
                                      disabled={isRefining}
                                      autoFocus
                                    />
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        className="h-7 gap-1.5 text-xs"
                                        onClick={() => handleRefine(session, activeVTab)}
                                        disabled={!refineInstruction.trim() || isRefining}
                                      >
                                        {isRefining ? (
                                          <><Loader2 className="h-3 w-3 animate-spin" /> Applying...</>
                                        ) : (
                                          <><Sparkles className="h-3 w-3" /> Apply</>
                                        )}
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={closeRefine} disabled={isRefining}>
                                        Cancel
                                      </Button>
                                      <span className="ml-auto text-[10px] text-muted-foreground">Ctrl+Enter to apply</span>
                                    </div>
                                  </div>
                                )}

                                {isEditing ? (
                                  <textarea
                                    className="w-full min-h-[300px] text-sm text-foreground leading-relaxed font-sans p-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                                    value={editDraft}
                                    onChange={e => setEditDraft(e.target.value)}
                                  />
                                ) : (
                                  <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                                    {currentVariant?.content || ''}
                                  </pre>
                                )}
                              </div>
                            </div>
                          );
                        }
                        // Legacy fallback
                        return (
                          <div className="p-4">
                            {proposalText ? (
                              <>
                                <div className="flex justify-end mb-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 gap-1.5 text-xs"
                                    onClick={() => handleCopy(session.id, proposalText, session, 'medium')}
                                  >
                                    {copiedId === session.id ? (
                                      <><Check className="h-3 w-3 text-green-600" /> Copied</>
                                    ) : (
                                      <><Copy className="h-3 w-3" /> Copy Proposal</>
                                    )}
                                  </Button>
                                </div>
                                <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                                  {proposalText}
                                </pre>
                              </>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-8">
                                No proposal text saved for this session.
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      {/* Chat tab */}
                      {tab === 'chat' && (
                        <StandaloneChat
                          session={session}
                          onSessionUpdate={handleSessionUpdate}
                        />
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Sales pitch questions popup — appears after copying any proposal */}
      <SalesPitchModal
        open={!!salesModal}
        onClose={() => setSalesModal(null)}
        questions={salesModal?.questions || []}
        jobTitle={salesModal?.jobTitle || ''}
      />
    </div>
  );
}
