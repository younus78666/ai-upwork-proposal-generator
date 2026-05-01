'use client'
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Loader2, ArrowRight, ArrowLeft, Sparkles, AlertCircle, RefreshCw,
  Plus, X, User, Briefcase, Mail, Globe, FolderOpen, Check, Wand2,
  ChevronDown, ChevronUp, Search, Save,
} from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import { JobSessionsList } from '@/components/JobSessionsList';
import { AttachmentReminderModal } from '@/components/AttachmentReminderModal';
import { NoProjectsModal } from '@/components/NoProjectsModal';
import { SkillMismatchModal } from '@/components/SkillMismatchModal';
import { cn } from '@/lib/utils';
import { ApplicationType, InvitationStatus } from '@/types/proposal';
import { toast } from 'sonner';

const MIN_DESCRIPTION_LENGTH = 50;

const STEPS = [
  { num: 1, label: 'Job Post' },
  { num: 2, label: 'Your Profile' },
  { num: 3, label: 'Screening' },
  { num: 4, label: 'About You' },
];

interface InputFormProps {
  embedded?: boolean;
}

export function InputForm({ embedded = false }: InputFormProps) {
  const {
    jobTitle, jobDescription, jobLink, clientMessage, clientName, userName,
    applicationType, invitationStatus, clientQuestions, website, isAgency,
    savedProjects, pinnedProjectIds, attachmentDetected,
    showNoProjectsModal, personalNotes, isPolishingNotes, savedNotes,
    showSkillMismatchModal, skillMismatchDetails,
    setJobTitle, setJobDescription, setJobLink, setClientMessage, setClientName, setUserName,
    setApplicationType, setInvitationStatus, setWebsite, setIsAgency,
    addClientQuestion, updateClientQuestion, removeClientQuestion,
    addSavedProject,
    analyzeJob, isAnalyzing, isLoading, isGeneratingProposal, currentError, clearError,
    setShowNoProjectsModal, proceedAsBeginnerAndGenerate, setPinnedProjectIds,
    setShowSkillMismatchModal, proceedDespiteMismatch,
    setPersonalNotes, polishNotes, removeSavedNote,
    siteRedFlags, isAnalyzingSite, analyzeSiteFromJobDescription, clearSiteRedFlags,
  } = useProposal();

  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState({ title: false, description: false });
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesSearch, setNotesSearch] = useState('');
  const notesDropdownRef = useRef<HTMLDivElement>(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const projectsDropdownRef = useRef<HTMLDivElement>(null);

  // Quick-add project
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [quickSkillInput, setQuickSkillInput] = useState('');
  const [quickSkills, setQuickSkills] = useState<string[]>([]);

  useEffect(() => {
    if (!notesOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (notesDropdownRef.current && !notesDropdownRef.current.contains(e.target as Node)) {
        setNotesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notesOpen]);

  useEffect(() => {
    if (!projectsOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(e.target as Node)) {
        setProjectsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [projectsOpen]);

  // Score saved notes by keyword overlap with the current job description
  const scoredNotes = useMemo(() => {
    if (savedNotes.length === 0) return [];
    const stopWords = new Set(['this','that','with','have','your','from','they','what','will','been','more','also','when','were','their','which','about','there','just','into','than','then','some','only','over','after','could','would','should','very','much','need','want']);
    const jobWords = [...new Set((jobDescription.toLowerCase().match(/\b[a-z]{4,}\b/g) || []).filter(w => !stopWords.has(w)))].slice(0, 40);
    return savedNotes.map(note => {
      const lower = note.text.toLowerCase();
      const score = jobWords.reduce((s, w) => s + (lower.includes(w) ? 1 : 0), 0);
      return { ...note, score };
    }).sort((a, b) => b.score - a.score);
  }, [savedNotes, jobDescription]);

  const filteredNotes = useMemo(() => {
    if (!notesSearch.trim()) return scoredNotes;
    const q = notesSearch.toLowerCase();
    return scoredNotes.filter(n => n.text.toLowerCase().includes(q));
  }, [scoredNotes, notesSearch]);

  const validation = useMemo(() => {
    const titleValid = jobTitle.trim().length > 0;
    const descriptionValid = jobDescription.trim().length >= MIN_DESCRIPTION_LENGTH;
    return {
      titleValid,
      descriptionValid,
      isValid: titleValid && descriptionValid,
      titleError: touched.title && !titleValid ? 'Job title is required' : null,
      descriptionError: touched.description && !descriptionValid
        ? `At least ${MIN_DESCRIPTION_LENGTH} characters (${jobDescription.trim().length}/${MIN_DESCRIPTION_LENGTH})`
        : null,
    };
  }, [jobTitle, jobDescription, touched]);

  const handleNext = () => {
    if (step === 1) {
      setTouched({ title: true, description: true });
      if (!validation.isValid) return;
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Guard: form submits via Enter key or non-explicit buttons on steps 1–2
    // should advance the wizard, not trigger generation.
    if (step < 4) {
      handleNext();
      return;
    }
    if (attachmentDetected) {
      setShowAttachmentModal(true);
    } else {
      analyzeJob();
    }
  };

  const showLoading = isAnalyzing || isLoading || isGeneratingProposal;

  return (
    <>
    <div className={cn('w-full mx-auto animate-fade-in', embedded ? 'max-w-full' : 'max-w-2xl px-4 sm:px-6')}>
      {!embedded && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
            Upwork Proposal Generator
          </h1>
          <p className="text-lg text-muted-foreground">3 proposals in 60 seconds</p>
        </div>
      )}

      <JobSessionsList />

      {currentError && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-destructive font-medium">Something went wrong</p>
              <p className="text-sm text-destructive/80 mt-1">{currentError}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={clearError}
              className="text-destructive border-destructive/30 hover:bg-destructive/10">
              Dismiss
            </Button>
            <Button variant="outline" size="sm" onClick={analyzeJob} disabled={!validation.isValid}
              className="text-primary border-primary/30 hover:bg-primary/10">
              <RefreshCw className="h-4 w-4 mr-1" /> Retry
            </Button>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center mb-6 px-1">
        {STEPS.map((s, i) => {
          const done = step > s.num;
          const active = step === s.num;
          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
                  done ? 'border-primary bg-primary text-white' :
                  active ? 'border-primary bg-primary/10 text-primary' :
                  'border-border bg-background text-muted-foreground'
                )}>
                  {done ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className={cn(
                  'text-[10px] font-mono uppercase tracking-wider whitespace-nowrap',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'flex-1 h-px mx-2 mb-4 transition-all duration-300',
                  done ? 'bg-primary' : 'bg-border'
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form card */}
      <div className="bg-card rounded-2xl border border-border shadow-[0_4px_24px_rgba(26,26,46,0.08)]">
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            // On step 3, Enter in any input must never submit the form.
            // The Generate button must be clicked explicitly.
            if (e.key === 'Enter' && step >= 3 && (e.target as HTMLElement).tagName === 'INPUT') {
              e.preventDefault();
            }
          }}
        >

          {/* ── STEP 1: Job Post ── */}
          {step === 1 && (
            <div className="p-6 md:p-8 space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <label htmlFor="job-title" className="block text-sm font-medium text-foreground">
                  Job Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="job-title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, title: true }))}
                  placeholder="e.g., Senior React Developer for E-commerce Platform"
                  disabled={showLoading}
                  className={cn('h-11', validation.titleError && 'border-destructive')}
                />
                {validation.titleError && (
                  <p className="text-xs text-destructive">{validation.titleError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="job-link" className="block text-sm font-medium text-foreground">
                  Job Link <span className="text-muted-foreground font-normal text-xs">(optional — save to apply later)</span>
                </label>
                <Input
                  id="job-link"
                  type="url"
                  value={jobLink}
                  onChange={(e) => setJobLink(e.target.value)}
                  placeholder="https://www.upwork.com/jobs/~..."
                  disabled={showLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  How did you find this job?
                </label>
                <RadioGroup
                  value={applicationType}
                  onValueChange={(v) => setApplicationType(v as ApplicationType)}
                  className="flex flex-col sm:flex-row gap-2"
                  disabled={showLoading}
                >
                  {[
                    { value: 'applying', label: "I'm applying", icon: Briefcase },
                    { value: 'invitation', label: 'Invited by client', icon: Mail },
                  ].map(({ value, label, icon: Icon }) => (
                    <div key={value} className={cn(
                      'flex flex-1 flex-col rounded-xl border cursor-pointer transition-all',
                      applicationType === value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    )}>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <RadioGroupItem value={value} id={value} />
                        <Label htmlFor={value} className="cursor-pointer flex items-center gap-2 text-sm">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {label}
                        </Label>
                      </div>
                      {/* Invitation sub-status options */}
                      {value === 'invitation' && applicationType === 'invitation' && (
                        <div className="px-4 pb-3 space-y-1.5 animate-fade-in border-t border-primary/10 pt-2.5">
                          <p className="text-[11px] text-muted-foreground mb-1.5">What's the current status?</p>
                          {([
                            { val: 'fresh', label: "Fresh invite — haven't replied yet" },
                            { val: 'multiple-invited', label: 'Client invited others too (some haven\'t replied)' },
                            { val: 'already-hired', label: 'Client may have already hired someone' },
                          ] as { val: InvitationStatus; label: string }[]).map(opt => (
                            <button
                              key={opt.val}
                              type="button"
                              onClick={() => setInvitationStatus(opt.val)}
                              className={cn(
                                'w-full text-left flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all',
                                invitationStatus === opt.val
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:bg-primary/5'
                              )}
                            >
                              <div className={cn(
                                'h-2.5 w-2.5 rounded-full border-2 shrink-0 transition-all',
                                invitationStatus === opt.val ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                              )} />
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="job-description" className="block text-sm font-medium text-foreground">
                  Job Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  onBlur={() => setTouched(p => ({ ...p, description: true }))}
                  placeholder="Paste the full Upwork job description here, including any screening questions at the bottom..."
                  disabled={showLoading}
                  className={cn('resize-none text-sm leading-relaxed h-48 overflow-y-auto', validation.descriptionError && 'border-destructive')}
                />
                <div className="flex items-center justify-between">
                  {validation.descriptionError
                    ? <p className="text-xs text-destructive">{validation.descriptionError}</p>
                    : <p className="text-xs text-muted-foreground">{jobDescription.trim().length} characters</p>
                  }
                  {jobDescription.trim().length > 0 && !validation.descriptionError && (
                    <span className="text-xs text-green-600 font-medium">✓ Ready</span>
                  )}
                </div>

                {/* Site analysis trigger */}
                {(() => {
                  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
                  const allText = `${jobDescription} ${clientMessage}`;
                  const urls = (allText.match(urlRegex) || []).filter(u =>
                    !u.includes('upwork.com') && u.length < 200
                  );
                  if (urls.length === 0) return null;

                  return (
                    <div className="mt-2">
                      {siteRedFlags.length === 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={analyzeSiteFromJobDescription}
                          disabled={isAnalyzingSite}
                          className="gap-1.5 h-8 text-xs border-amber-500/40 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                        >
                          {isAnalyzingSite ? (
                            <><Loader2 className="h-3 w-3 animate-spin" /> Analyzing client site...</>
                          ) : (
                            <><Search className="h-3 w-3" /> Analyze Client Site</>
                          )}
                        </Button>
                      ) : (
                        <div className="border border-amber-500/30 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                              <AlertCircle className="h-3.5 w-3.5" />
                              3 Site Issues Found — Use in your proposal
                            </p>
                            <button
                              type="button"
                              onClick={clearSiteRedFlags}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            {siteRedFlags.map((flag, i) => (
                              <div key={i} className="flex gap-2">
                                <span className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400 font-bold text-xs">{i + 1}.</span>
                                <div>
                                  <p className="text-xs font-medium text-foreground">{flag.title}</p>
                                  <p className="text-xs text-muted-foreground">{flag.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground italic">Mention these in your proposal to show deep expertise</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Message from client — only for invitations */}
              {applicationType === 'invitation' && (
                <div className="space-y-1.5 animate-fade-in">
                  <label htmlFor="client-message" className="block text-sm font-medium text-foreground">
                    Message from Client <span className="text-muted-foreground font-normal text-xs">(optional — what they said in the invite)</span>
                  </label>
                  <Textarea
                    id="client-message"
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    placeholder="Paste what the client wrote when they invited you, e.g. 'Hi, I saw your profile and think you'd be a great fit for our project...'"
                    disabled={showLoading}
                    rows={4}
                    className="resize-none text-sm leading-relaxed"
                  />
                  <p className="text-xs text-muted-foreground">The AI will reference this message to write a more personal, direct response.</p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Your Profile ── */}
          {step === 2 && (
            <div className="p-6 md:p-8 space-y-6 animate-fade-in">
              {/* Projects dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    Select Projects
                    <span className="text-xs font-normal text-muted-foreground">(up to 3)</span>
                  </h3>
                  <Link href="/projects" target="_blank">
                    <Button variant="outline" size="sm" className="gap-1.5 shrink-0 text-xs h-7">
                      <Plus className="h-3.5 w-3.5" />
                      {savedProjects.length > 0 ? 'Manage' : 'Add'}
                    </Button>
                  </Link>
                </div>

                {savedProjects.length > 0 ? (
                  <div className="relative" ref={projectsDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setProjectsOpen(o => !o)}
                      className={cn(
                        'w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-all bg-card',
                        projectsOpen ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span className="text-xs truncate">
                        {pinnedProjectIds.length > 0
                          ? <span className="text-foreground">
                              {savedProjects.filter(p => pinnedProjectIds.includes(p.id)).map(p => p.name).join(', ')}
                            </span>
                          : <span className="text-muted-foreground">AI picks the best match — or select up to 3</span>
                        }
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {pinnedProjectIds.length > 0 && (
                          <span className="text-[10px] font-mono text-primary">{pinnedProjectIds.length}/3</span>
                        )}
                        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', projectsOpen && 'rotate-180')} />
                      </div>
                    </button>

                    {projectsOpen && (
                      <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                        <div className="max-h-56 overflow-y-auto">
                          {savedProjects.map(p => {
                            const isPinned = pinnedProjectIds.includes(p.id);
                            const atLimit = pinnedProjectIds.length >= 3 && !isPinned;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                disabled={atLimit}
                                onClick={() => {
                                  if (isPinned) setPinnedProjectIds(pinnedProjectIds.filter(id => id !== p.id));
                                  else if (!atLimit) setPinnedProjectIds([...pinnedProjectIds, p.id]);
                                }}
                                className={cn(
                                  'w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors',
                                  isPinned ? 'bg-primary/8' : atLimit ? 'opacity-35 cursor-not-allowed' : 'hover:bg-muted/40'
                                )}
                              >
                                <div className={cn(
                                  'h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-all',
                                  isPinned ? 'bg-primary border-primary' : 'border-border'
                                )}>
                                  {isPinned && <Check className="h-2.5 w-2.5 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-foreground truncate">{p.name || 'Unnamed project'}</p>
                                  {p.skills && p.skills.length > 0 && (
                                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                                      {p.skills.slice(0, 4).join(' · ')}{p.skills.length > 4 && ` +${p.skills.length - 4}`}
                                    </p>
                                  )}
                                </div>
                                {isPinned && <span className="text-[10px] font-mono uppercase tracking-wider text-primary shrink-0">Selected</span>}
                              </button>
                            );
                          })}
                        </div>
                        {pinnedProjectIds.length > 0 && (
                          <div className="border-t border-border px-3 py-2">
                            <button
                              type="button"
                              onClick={() => setPinnedProjectIds([])}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Clear selection → let AI pick
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                    <FolderOpen className="h-5 w-5 shrink-0 text-muted-foreground/50" />
                    <span>Add past projects once. The AI picks the most relevant one per proposal.</span>
                  </div>
                )}

                {/* Quick Add Project */}
                <div className="border border-dashed border-border rounded-xl overflow-hidden mt-3">
                  <button
                    type="button"
                    onClick={() => setQuickAddOpen(p => !p)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add a project now
                    </span>
                    {quickAddOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {quickAddOpen && (
                    <div className="px-4 pb-4 space-y-3 border-t border-dashed border-border">
                      <Input
                        placeholder="Project name *"
                        value={quickName}
                        onChange={e => setQuickName(e.target.value)}
                        className="h-9 text-sm mt-3"
                        disabled={showLoading}
                      />
                      <Textarea
                        placeholder="What you built, problem solved, result achieved..."
                        value={quickDesc}
                        onChange={e => setQuickDesc(e.target.value)}
                        rows={3}
                        className="resize-none text-sm"
                        disabled={showLoading}
                      />
                      {/* Skills tag input */}
                      <div
                        className="min-h-9 flex flex-wrap gap-1.5 items-center px-3 py-1.5 rounded-md border border-input bg-background text-sm cursor-text"
                        onClick={e => (e.currentTarget as HTMLElement).querySelector('input')?.focus()}
                      >
                        {quickSkills.map(s => (
                          <span key={s} className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                            {s}
                            <button type="button" onClick={() => setQuickSkills(prev => prev.filter(x => x !== s))}>
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={quickSkillInput}
                          placeholder={quickSkills.length === 0 ? 'Skills/tech used (Enter or comma to add)' : ''}
                          className="flex-1 min-w-24 bg-transparent outline-none text-xs placeholder:text-muted-foreground"
                          disabled={showLoading}
                          onChange={e => {
                            const v = e.target.value;
                            if (v.includes(',')) {
                              const tag = v.replace(',', '').trim();
                              if (tag && !quickSkills.includes(tag)) setQuickSkills(p => [...p, tag]);
                              setQuickSkillInput('');
                            } else {
                              setQuickSkillInput(v);
                            }
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const tag = quickSkillInput.trim();
                              if (tag && !quickSkills.includes(tag)) setQuickSkills(p => [...p, tag]);
                              setQuickSkillInput('');
                            } else if (e.key === 'Backspace' && !quickSkillInput) {
                              setQuickSkills(p => p.slice(0, -1));
                            }
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        disabled={!quickName.trim() || showLoading}
                        className="w-full gap-1.5"
                        onClick={() => {
                          if (!quickName.trim()) return;
                          addSavedProject({ name: quickName.trim(), description: quickDesc.trim(), url: '', skills: quickSkills });
                          setQuickName('');
                          setQuickDesc('');
                          setQuickSkills([]);
                          setQuickSkillInput('');
                          setQuickAddOpen(false);
                          toast.success('Project saved!');
                        }}
                      >
                        <Save className="h-4 w-4" />
                        Save Project
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Names + website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="user-name" className="text-sm font-medium text-foreground">Your Name</label>
                  <div className="relative">
                    <Input id="user-name" value={userName} onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name for sign-off" className="h-11 pl-9 text-sm" />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="client-name" className="text-sm font-medium text-foreground">Client's Name</label>
                  <Input id="client-name" value={clientName} onChange={(e) => setClientName(e.target.value)}
                    placeholder="Find in their reviews" className="h-11 text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="website" className="text-sm font-medium text-foreground">Your Website</label>
                <div className="relative">
                  <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com" className="h-11 pl-9 text-sm" />
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Linked naturally inside the proposal</p>
              </div>

              {/* Freelancer type toggle */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Proposal Voice</label>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsAgency(false)}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      !isAgency
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Solo Freelancer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAgency(true)}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      isAgency
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Agency / Team
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isAgency ? 'Proposals use "we/our team" — agency voice' : 'Proposals use "I/my" — solo freelancer voice'}
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Screening Questions ── */}
          {step === 3 && (
            <div className="p-6 md:p-8 space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Client's Screening Questions
                  <span className="text-xs font-normal text-muted-foreground ml-2">(Optional)</span>
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Paste any questions the client included in the job post. The AI will answer each one specifically.
                </p>

                <div className="space-y-2.5">
                  {clientQuestions.map((cq, i) => (
                    <div key={cq.id} className="flex gap-2 items-center">
                      <span className="text-xs font-mono text-muted-foreground shrink-0 w-5">{i + 1}.</span>
                      <Input
                        value={cq.question}
                        onChange={(e) => updateClientQuestion(cq.id, e.target.value)}
                        placeholder={`e.g., "How many revisions do you offer?"`}
                        disabled={showLoading}
                        className="h-10 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // stop form submit
                            addClientQuestion(); // add next question row
                          }
                        }}
                      />
                      <Button type="button" variant="ghost" size="icon"
                        onClick={() => removeClientQuestion(cq.id)}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline" size="sm"
                    onClick={addClientQuestion} disabled={showLoading}
                    className="w-full border-dashed gap-2 mt-1">
                    <Plus className="h-3.5 w-3.5" />
                    Add Question
                  </Button>
                </div>

                {clientQuestions.length === 0 && (
                  <p className="text-xs text-muted-foreground/60 italic text-center mt-3">
                    No questions? That's fine. The AI still writes targeted proposals.
                  </p>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5 text-sm">
                <p className="font-medium text-foreground text-xs uppercase tracking-wider font-mono text-muted-foreground mb-2">Ready to generate</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <span>{jobTitle}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <span>{jobDescription.trim().length} character job description</span>
                </div>
                {pinnedProjectIds.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span>{pinnedProjectIds.length} project{pinnedProjectIds.length > 1 ? 's' : ''} selected</span>
                  </div>
                )}
                {clientQuestions.filter(q => q.question.trim()).length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span>{clientQuestions.filter(q => q.question.trim()).length} screening question{clientQuestions.filter(q => q.question.trim()).length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── STEP 4: About You ── */}
          {step === 4 && (
            <div className="p-6 md:p-8 space-y-5 animate-fade-in">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Tell us about yourself
                  <span className="text-xs font-normal text-muted-foreground ml-2">(Optional)</span>
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Write anything: your approach, a case study, past results, process, skills. Any language is fine: Roman Urdu, Hindi, English, or mixed. The AI will translate, polish, and weave it into the proposal.
                </p>

                {/* Saved notes dropdown */}
                {savedNotes.length > 0 && (
                  <div className="mb-4 relative" ref={notesDropdownRef}>
                    <p className="text-xs font-medium text-foreground mb-1.5">
                      Saved Notes
                      <span className="text-muted-foreground font-normal ml-1">({savedNotes.length}/30)</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => { setNotesOpen(o => !o); setNotesSearch(''); }}
                      className={cn(
                        'w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition-all bg-card',
                        notesOpen ? 'border-primary ring-1 ring-primary/20' : 'border-border hover:border-primary/40'
                      )}
                    >
                      <span className="text-xs truncate">
                        {savedNotes.some(n => n.text.trim() === personalNotes.trim())
                          ? <span className="text-foreground">{personalNotes.slice(0, 70)}{personalNotes.length > 70 ? '…' : ''}</span>
                          : <span className="text-muted-foreground">Select a saved note or search…</span>
                        }
                      </span>
                      <ChevronDown className={cn('h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200', notesOpen && 'rotate-180')} />
                    </button>

                    {notesOpen && (
                      <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                        <div className="p-2 border-b border-border">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            <input
                              type="text"
                              value={notesSearch}
                              onChange={e => setNotesSearch(e.target.value)}
                              placeholder="Search notes…"
                              autoFocus
                              className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/40 rounded-lg border-0 outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/60"
                            />
                          </div>
                        </div>
                        <div className="max-h-56 overflow-y-auto">
                          {filteredNotes.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-5">No matching notes</p>
                          ) : (
                            filteredNotes.map((note, i) => {
                              const isActive = personalNotes.trim() === note.text.trim();
                              const isRecommended = !notesSearch.trim() && note.score > 0 && i < 3;
                              return (
                                <div
                                  key={note.id}
                                  className={cn(
                                    'flex items-start gap-2 px-3 py-2.5 transition-colors group',
                                    isActive ? 'bg-primary/8' : 'hover:bg-muted/40'
                                  )}
                                >
                                  <button
                                    type="button"
                                    className="flex-1 text-left min-w-0"
                                    onClick={() => { setPersonalNotes(note.text); setNotesOpen(false); }}
                                  >
                                    {(isActive || isRecommended) && (
                                      <div className="flex items-center gap-1.5 mb-0.5">
                                        {isActive && <span className="text-[10px] font-mono uppercase tracking-wider text-primary">Active</span>}
                                        {isRecommended && !isActive && <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500">Best match</span>}
                                      </div>
                                    )}
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{note.text}</p>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); removeSavedNote(note.id); }}
                                    className="text-muted-foreground/0 group-hover:text-muted-foreground/50 hover:!text-destructive transition-colors shrink-0 mt-0.5"
                                    aria-label="Delete note"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Textarea
                  value={personalNotes}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= 300) setPersonalNotes(e.target.value);
                  }}
                  placeholder="e.g., Main ne 5 saal React mein kaam kiya hai aur 30+ e-commerce stores bana chuka hun. Ek client ka conversion rate 40% barha meri wajah se. My approach: I first audit the existing code, identify bottlenecks, then fix with clean scalable solutions. I believe in clear communication and on-time delivery."
                  disabled={showLoading || isPolishingNotes}
                  rows={6}
                  className="resize-none text-sm leading-relaxed"
                />

                <div className="flex items-center justify-between mt-2">
                  {(() => {
                    const wordCount = personalNotes.trim() ? personalNotes.trim().split(/\s+/).filter(Boolean).length : 0;
                    const nearLimit = wordCount >= 250;
                    const atLimit = wordCount >= 300;
                    return (
                      <span className={cn('text-xs', atLimit ? 'text-destructive font-medium' : nearLimit ? 'text-amber-500' : 'text-muted-foreground')}>
                        {wordCount} / 300 words
                      </span>
                    );
                  })()}

                  {personalNotes.trim().length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={polishNotes}
                      disabled={showLoading || isPolishingNotes}
                      className="gap-1.5 text-xs h-8 border-primary/40 text-primary hover:bg-primary/5"
                    >
                      {isPolishingNotes
                        ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Polishing…</>
                        : <><Wand2 className="h-3.5 w-3.5" /> Polish & Save</>
                      }
                    </Button>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5 text-sm">
                <p className="font-medium text-foreground text-xs uppercase tracking-wider font-mono text-muted-foreground mb-2">Ready to generate</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <span>{jobTitle}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  <span>{jobDescription.trim().length} character job description</span>
                </div>
                {pinnedProjectIds.length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span>{pinnedProjectIds.length} project{pinnedProjectIds.length > 1 ? 's' : ''} selected</span>
                  </div>
                )}
                {clientQuestions.filter(q => q.question.trim()).length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span>{clientQuestions.filter(q => q.question.trim()).length} screening question{clientQuestions.filter(q => q.question.trim()).length > 1 ? 's' : ''}</span>
                  </div>
                )}
                {personalNotes.trim().length > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span>Personal notes added ({personalNotes.trim().length} chars)</span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Navigation footer */}
          <div className={cn(
            'flex gap-3 px-6 md:px-8 pb-6 md:pb-8',
            step === 1 ? 'justify-end' : 'justify-between'
          )}>
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} disabled={showLoading}
                className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            )}

            {step < 4 ? (
              <Button type="button" onClick={handleNext} disabled={showLoading} className="gap-2">
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                size="lg"
                disabled={showLoading}
                className="gap-2 px-8"
                onClick={() => {
                  if (attachmentDetected) setShowAttachmentModal(true);
                  else analyzeJob();
                }}
              >
                {showLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {isGeneratingProposal ? 'Writing…' : 'Analyzing…'}</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generate 3 Proposals</>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>

      <AttachmentReminderModal
        open={showAttachmentModal}
        onConfirm={() => { setShowAttachmentModal(false); analyzeJob(); }}
        onSkip={() => { setShowAttachmentModal(false); analyzeJob(); }}
      />
      <NoProjectsModal
        open={showNoProjectsModal}
        onContinueAsBeginner={proceedAsBeginnerAndGenerate}
        onClose={() => setShowNoProjectsModal(false)}
      />
      <SkillMismatchModal
        open={showSkillMismatchModal}
        jobRequires={skillMismatchDetails?.jobRequires || []}
        missingSkills={skillMismatchDetails?.missingSkills || []}
        onProceed={proceedDespiteMismatch}
        onCancel={() => setShowSkillMismatchModal(false)}
      />
    </div>
    </>
  );
}
