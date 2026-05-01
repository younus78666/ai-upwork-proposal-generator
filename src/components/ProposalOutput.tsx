'use client'
﻿import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Loader2,
  Pencil,
  MessageSquare,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useProposal } from '@/context/ProposalContext';
import { ProposalLength, ProposalVariant, ClientQuestionAnswer } from '@/types/proposal';
import { ChatInterface } from '@/components/ChatInterface';
import { SalesPitchModal } from '@/components/SalesPitchModal';

// Strip accidental framework labels (D —, I —, Q —, etc.) that AI may leak
function stripFrameworkLabels(text: string): string {
  return text.replace(/^[DIQPC]\s*[—–-]\s*/gm, '');
}

// Pre-clean: strip Gemini/AI markdown artifacts before rendering
function preCleanText(text: string): string {
  return text
    // Flatten markdown links [text](url) → text (url)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1 ($2)')
    // Strip backtick code spans `word` → word
    .replace(/`([^`\n]+)`/g, '$1')
    // Strip ## / # markdown headers — leave the text
    .replace(/^#{1,3}\s+/gm, '');
}

// Inline: parse **bold**, highlight [placeholder] tokens
function inlineWithPlaceholders(text: string): React.ReactNode {
  const cleaned = preCleanText(text);
  // Split on **bold** spans and [placeholder] tokens — exclude markdown links via negative lookahead
  const parts = cleaned.split(/(\*\*[^*]+\*\*|\[[^\]]{1,60}\](?!\())/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        // Only highlight as placeholder if it looks like a template token, NOT a URL
        if (/^\[.{1,60}\]$/.test(part) && !part.startsWith('[http')) {
          return (
            <mark key={i} className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 rounded px-0.5 not-italic font-medium">
              {part}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// Full proposal renderer — paragraphs separated by blank lines, "- " lines become bullets
function renderProposal(text: string): React.ReactNode {
  // preCleanText handles old cached sessions that may have raw markdown from pre-fix
  const cleaned = stripFrameworkLabels(preCleanText(text));
  const blocks = cleaned.split(/\n{2,}/);

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').map(l => l.trimEnd()).filter(l => l.length > 0);
        if (lines.length === 0) return null;

        // Check if this block is a bullet list (all lines start with "- ")
        const isBulletBlock = lines.every(l => l.startsWith('- '));
        if (isBulletBlock) {
          return (
            <ul key={bi} className="space-y-1 pl-1">
              {lines.map((l, li) => (
                <li key={li} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>{inlineWithPlaceholders(l.slice(2).trim())}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Mixed block: some lines may be bullets, others prose
        const hasBullets = lines.some(l => l.startsWith('- '));
        if (hasBullets) {
          return (
            <div key={bi} className="space-y-1">
              {lines.map((l, li) =>
                l.startsWith('- ') ? (
                  <div key={li} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <span className="text-sm">{inlineWithPlaceholders(l.slice(2).trim())}</span>
                  </div>
                ) : (
                  <p key={li} className="text-sm leading-relaxed">{inlineWithPlaceholders(l)}</p>
                )
              )}
            </div>
          );
        }

        // For the last block: split out trailing name/URL lines as a sign-off
        if (bi === blocks.length - 1 && lines.length > 1) {
          let signOffStart = lines.length;
          for (let i = lines.length - 1; i >= Math.max(0, lines.length - 3); i--) {
            const l = lines[i];
            const isShortNonQuestion = l.length < 70 && !l.startsWith('- ') && !l.endsWith('?') && !l.includes('Could you') && !l.includes('Can ');
            if (isShortNonQuestion) signOffStart = i;
            else break;
          }
          if (signOffStart > 0 && signOffStart < lines.length) {
            const mainLines = lines.slice(0, signOffStart);
            const signOffLines = lines.slice(signOffStart);
            return (
              <div key={bi} className="space-y-3">
                <p className="text-sm leading-relaxed">
                  {mainLines.map((l, li) => (
                    <span key={li}>{inlineWithPlaceholders(l)}{li < mainLines.length - 1 && ' '}</span>
                  ))}
                </p>
                <div className="pt-2 border-t border-border/40 space-y-0.5">
                  {signOffLines.map((l, li) => (
                    <p key={li} className={`text-sm ${l.startsWith('http') ? 'text-primary text-xs' : 'font-medium'}`}>
                      {inlineWithPlaceholders(l)}
                    </p>
                  ))}
                </div>
              </div>
            );
          }
        }

        // Plain prose paragraph
        const isSignOff = bi === blocks.length - 1 && lines.length <= 2 && lines.every(l => l.length < 70);
        if (isSignOff && lines.length > 0) {
          return (
            <div key={bi} className="pt-2 border-t border-border/40 space-y-0.5">
              {lines.map((l, li) => (
                <p key={li} className={`text-sm ${l.startsWith('http') ? 'text-primary text-xs' : 'font-medium'}`}>
                  {inlineWithPlaceholders(l)}
                </p>
              ))}
            </div>
          );
        }

        return (
          <p key={bi} className="text-sm leading-relaxed">
            {lines.map((l, li) => (
              <span key={li}>
                {inlineWithPlaceholders(l)}
                {li < lines.length - 1 && ' '}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

interface VariantCardProps {
  variant: ProposalVariant;
  variantIndex: number;
  onCopy: (text: string) => Promise<void>;
  onRefine: (instruction: string) => Promise<void>;
  jobTitle: string;
}

const VARIANT_SUBTITLES: Record<string, string> = {
  short: 'Punchy and direct: best for busy clients scanning fast',
  medium: 'Balanced: enough detail without losing attention',
  long: 'Full context: for complex jobs that need explanation',
  // legacy fallbacks
  experience: 'Highlights your past work',
  results: 'Leads with outcomes and client ROI',
  beginner: 'Perfect for new freelancers: no experience needed',
};

const MAX_PROJECTS: Record<string, number> = { short: 1, medium: 2, long: 3, experience: 3, results: 3, beginner: 1 };

function VariantCard({ variant, onCopy, onRefine }: VariantCardProps) {
  const { savedProjects } = useProposal();
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(variant.content);
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [quickAdd, setQuickAdd] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  const maxProjects = MAX_PROJECTS[variant.type] ?? 1;

  const toggleProject = (id: string) => {
    setSelectedProjectIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= maxProjects) return prev; // at limit — ignore
      return [...prev, id];
    });
  };

  // Sync when variant content changes (after refinement or regeneration)
  useEffect(() => {
    setEditableContent(variant.content);
  }, [variant.content]);

  const wordCount = useMemo(() => {
    return editableContent.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [editableContent]);

  const wordCountLimits: Record<string, [number, number]> = {
    short: [100, 150], medium: [150, 230], long: [200, 340],
    experience: [200, 340], results: [200, 340], beginner: [200, 340],
  };
  const [minW, maxW] = wordCountLimits[variant.type] || [100, 300];
  const wordCountColor = wordCount >= minW && wordCount <= maxW
    ? 'text-green-600 dark:text-green-400'
    : 'text-amber-600 dark:text-amber-400';

  const handleRefine = async () => {
    const hasAny = refineInstruction.trim() || selectedProjectIds.length > 0 || quickAdd.trim();
    if (!hasAny || isRefining) return;
    setIsRefining(true);
    try {
      const parts: string[] = [];
      if (selectedProjectIds.length > 0) {
        const selected = savedProjects.filter(p => selectedProjectIds.includes(p.id));
        const projectList = selected.map(p => `"${p.name}" — ${p.description}${p.url ? ` (${p.url})` : ''}`).join('\n');
        parts.push(`Replace or add mentions of these projects:\n${projectList}`);
      }
      if (quickAdd.trim()) {
        parts.push(`Also weave this detail naturally into the proposal: ${quickAdd.trim()}`);
      }
      if (refineInstruction.trim()) {
        parts.push(refineInstruction.trim());
      }
      await onRefine(parts.join('\n'));
      setRefineOpen(false);
      setRefineInstruction('');
      setSelectedProjectIds([]);
      setQuickAdd('');
    } catch {
      // toast handled by context
    } finally {
      setIsRefining(false);
    }
  };

  const winChance = variant.winChance ?? 0;
  const winColor =
    winChance >= 70 ? 'text-green-600 dark:text-green-400' :
    winChance >= 45 ? 'text-amber-600 dark:text-amber-400' :
    'text-red-500 dark:text-red-400';
  const barColor =
    winChance >= 70 ? 'bg-green-500' :
    winChance >= 45 ? 'bg-amber-500' :
    'bg-red-400';

  return (
    <Card className={`border shadow-sm transition-all ${
      variant.recommended
        ? 'border-green-500 bg-green-50/30 dark:bg-green-950/20'
        : 'border-border/60'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{variant.label}</CardTitle>
            {variant.recommended && (
              <Badge className="text-xs bg-green-500 text-white hover:bg-green-600">
                BEST FIT
              </Badge>
            )}
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${wordCountColor}`}>
            <span>{wordCount}</span>
            <span className="text-muted-foreground font-normal">words</span>
          </div>
        </div>
        <CardDescription>
          {VARIANT_SUBTITLES[variant.type] || ''}
        </CardDescription>
        {winChance > 0 && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Win chance</span>
              <span className={`text-xs font-semibold ${winColor}`}>{winChance}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${winChance}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          {isEditing ? (
            <Textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="min-h-[280px] font-mono text-sm leading-relaxed resize-y"
              autoFocus
            />
          ) : (
            <div className="min-h-[220px] rounded-md border border-input bg-background px-4 py-4 overflow-auto">
              {renderProposal(editableContent)}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <Button variant="default" size="sm" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none">
              <Check className="h-4 w-4 mr-1.5" />
              Done Editing
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setRefineOpen(o => !o); setRefineInstruction(''); }}
                className={cn(
                  'flex-1 sm:flex-none',
                  refineOpen ? 'text-primary hover:text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Wand2 className="h-4 w-4 mr-1.5" />
                Fix this
              </Button>
              <Button variant="default" size="sm" onClick={() => onCopy(editableContent)} className="flex-1 sm:flex-none">
                <Copy className="h-4 w-4 mr-1.5" />
                Copy
              </Button>
            </>
          )}
        </div>

        {/* Inline refine panel */}
        {refineOpen && !isEditing && (
          <div className="animate-fade-in rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-4">
            <p className="text-xs font-semibold text-foreground">Fix this proposal</p>

            {/* Project multi-select */}
            {savedProjects.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Swap / add projects
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {selectedProjectIds.length}/{maxProjects} selected
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-0.5">
                  {savedProjects.map(p => {
                    const checked = selectedProjectIds.includes(p.id);
                    const disabled = isRefining || (!checked && selectedProjectIds.length >= maxProjects);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => !isRefining && toggleProject(p.id)}
                        disabled={disabled}
                        className={cn(
                          'w-full text-left rounded-md border px-3 py-2 text-sm transition-colors',
                          checked
                            ? 'border-primary bg-primary/10 text-foreground'
                            : disabled
                              ? 'border-border/40 bg-muted/30 text-muted-foreground cursor-not-allowed opacity-50'
                              : 'border-border/60 bg-background text-foreground hover:border-primary/50 hover:bg-primary/5'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'h-4 w-4 rounded border shrink-0 flex items-center justify-center',
                            checked ? 'border-primary bg-primary' : 'border-input bg-background'
                          )}>
                            {checked && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                          </div>
                          <span className="font-medium truncate">{p.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {maxProjects > 1 && (
                  <p className="text-[10px] text-muted-foreground">
                    Select up to {maxProjects} projects to inject into this proposal
                  </p>
                )}
              </div>
            )}

            {/* Quick text inject */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Add a detail, result, or fact
              </label>
              <input
                type="text"
                value={quickAdd}
                onChange={e => setQuickAdd(e.target.value)}
                disabled={isRefining}
                placeholder='e.g. "Delivered 3 similar sites in under 2 weeks"'
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Free-form instruction */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Other instructions (any language)
              </label>
              <Textarea
                value={refineInstruction}
                onChange={e => setRefineInstruction(e.target.value)}
                placeholder='e.g. "Too formal, make it casual" / "Pehla sentence job se related nahi"'
                disabled={isRefining}
                rows={2}
                className="resize-none text-sm bg-background"
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleRefine(); }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleRefine}
                disabled={(!refineInstruction.trim() && selectedProjectIds.length === 0 && !quickAdd.trim()) || isRefining}
                className="gap-1.5"
              >
                {isRefining
                  ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Refining…</>
                  : <><Sparkles className="h-3.5 w-3.5" /> Apply</>
                }
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setRefineOpen(false); setRefineInstruction(''); setSelectedProjectIds([]); setQuickAdd(''); }}
                disabled={isRefining}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <span className="text-[10px] text-muted-foreground ml-auto hidden sm:block">⌘↵ to apply</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Fallback card for old detailed/medium/short sessions
interface LegacyCardProps {
  title: string;
  subtitle: string;
  length: ProposalLength;
  proposal: string;
  onCopy: (text: string) => Promise<void>;
  jobTitle: string;
  recommended?: boolean;
}

function LegacyCard({
  title,
  subtitle,
  proposal,
  onCopy,
  recommended,
}: LegacyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(proposal);

  useEffect(() => {
    setEditableContent(proposal);
  }, [proposal]);

  const wordCount = useMemo(() => {
    return editableContent.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [editableContent]);

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            {recommended && (
              <Badge variant="secondary" className="text-xs">Recommended</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{wordCount}</span> words
          </div>
        </div>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          {isEditing ? (
            <Textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="min-h-[250px] font-mono text-sm leading-relaxed resize-y"
              autoFocus
            />
          ) : (
            <div className="min-h-[220px] rounded-md border border-input bg-background px-4 py-4 overflow-auto">
              {renderProposal(editableContent)}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <Button variant="default" size="sm" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none">
              <Check className="h-4 w-4 mr-1.5" />
              Done Editing
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground">
                <Pencil className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
              <Button variant="default" size="sm" onClick={() => onCopy(editableContent)} className="flex-1 sm:flex-none">
                <Copy className="h-4 w-4 mr-1.5" />
                Copy
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


function ClientQuestionAnswers({ answers }: { answers: ClientQuestionAnswer[] }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      toast.success('Answer copied!');
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Client Screening Question Answers</CardTitle>
        </div>
        <CardDescription>
          Strategic answers tailored to this job. Copy each one into the Upwork screening section.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {answers.map((qa, idx) => (
          <div key={idx} className="rounded-lg border border-border/60 overflow-hidden">
            {/* Question */}
            <div className="bg-muted/50 px-4 py-2.5 border-b border-border/40">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Question {idx + 1}</p>
              <p className="text-sm font-medium text-foreground">{qa.question}</p>
            </div>
            {/* Answer */}
            <div className="px-4 py-3 bg-background">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-foreground flex-1">{qa.answer}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(qa.answer, idx)}
                  className="shrink-0 h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  {copiedIdx === idx ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProposalOutput() {
  const { generatedProposals, jobTitle, resetApp, refineVariant } = useProposal();
  const [salesModalOpen, setSalesModalOpen] = useState(false);

  const variants = generatedProposals.variants;
  const salesQuestions = generatedProposals.salesQuestions || [];
  const clientQuestionAnswers = generatedProposals.clientQuestionAnswers || [];

  const handleCopyWithModal = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
      if (salesQuestions.length > 0) setSalesModalOpen(true);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const hasVariants = variants && variants.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 animate-fade-in">
      {/* Header */}
      <Card variant="elevated" className="border-0 shadow-lg mb-6">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto h-14 w-14 rounded-xl gradient-primary flex items-center justify-center shadow-glow mb-4">
            <Sparkles className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Your Proposals Are Ready!</CardTitle>
          <CardDescription className="text-base">
            {hasVariants
              ? 'Three unique angles for the same job. Pick the one that fits you best.'
              : 'Choose the length that fits your needs. Edit, copy, or regenerate any version.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Proposal Cards */}
      <div className="space-y-6">
        {hasVariants ? (
          variants!.map((variant, index) => (
            <VariantCard
              key={variant.type}
              variant={variant}
              variantIndex={index}
              onCopy={handleCopyWithModal}
              onRefine={(instruction) => refineVariant(variant.type, instruction)}
              jobTitle={jobTitle}
            />
          ))
        ) : (
          <>
            <LegacyCard
              title="Detailed Proposal"
              subtitle="~600 words - Comprehensive with full approach explained"
              length="detailed"
              proposal={generatedProposals.detailed}
              onCopy={handleCopyWithModal}
              jobTitle={jobTitle}
            />
            <LegacyCard
              title="Medium Proposal"
              subtitle="~400 words - Balanced with key points only"
              length="medium"
              proposal={generatedProposals.medium}
              onCopy={handleCopyWithModal}
              jobTitle={jobTitle}
              recommended
            />
            <LegacyCard
              title="Short Proposal"
              subtitle="~200 words - Quick summary for Upwork character limits"
              length="short"
              proposal={generatedProposals.short}
              onCopy={handleCopyWithModal}
              jobTitle={jobTitle}
            />
          </>
        )}
      </div>

      {/* Client Screening Question Answers */}
      {clientQuestionAnswers.length > 0 && (
        <div className="mt-8">
          <ClientQuestionAnswers answers={clientQuestionAnswers} />
        </div>
      )}

      {/* Chat Interface for Continuing Conversation */}
      <div className="mt-8">
        <ChatInterface />
      </div>

      {/* Start Over Button */}
      <div className="mt-8 flex justify-center">
        <Button
          variant="outline"
          onClick={resetApp}
          className="min-w-[200px]"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Start Over
        </Button>
      </div>

      {/* Sales Pitch Modal */}
      <SalesPitchModal
        open={salesModalOpen}
        onClose={() => setSalesModalOpen(false)}
        questions={salesQuestions}
        jobTitle={jobTitle}
      />
    </div>
  );
}
