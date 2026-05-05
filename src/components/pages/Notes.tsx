'use client'
import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, StickyNote, Plus, Trash2, Loader2, Wand2, Sparkles, X, Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProposal } from '@/context/ProposalContext';
;
import { findFirstSavedKey } from '@/config/providers';
import { supabase } from '@/integrations/supabase/client';

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export default function Notes() {
  const { savedNotes, addSavedNote, removeSavedNote, updateSavedNote, updateSavedNoteLinks } = useProposal();
  const [polishingId, setPolishingId] = useState<string | null>(null);
  const [customizingId, setCustomizingId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<Record<string, string>>({});
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({});
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const handleAdd = () => {
    if (savedNotes.length >= 30) return;
    addSavedNote('');
    // Focus the new note's textarea on next tick — addSavedNote prepends, so index 0
    setTimeout(() => {
      const firstRef = textareaRefs.current[savedNotes[0]?.id ?? ''];
      // The new note doesn't have an id yet from our perspective, so we focus by querying
      const allTextareas = document.querySelectorAll<HTMLTextAreaElement>('[data-note-textarea]');
      if (allTextareas[0]) allTextareas[0].focus();
    }, 50);
  };

  const handlePolish = async (noteId: string, text: string) => {
    const savedKey = findFirstSavedKey();
    if (!savedKey) {
      toast.error('Please set your API key first (click API Key in the nav)');
      return;
    }
    if (!text.trim()) return;

    // Extract URLs that might get lost during polishing
    const extractedUrls = text.match(/https?:\/\/[^\s]+/g) || [];

    setPolishingId(noteId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'polish-notes',
          personalNotes: text,
          apiProvider: savedKey.provider,
          apiKey: savedKey.key,

          apiModel: savedKey.model,
        },
      });

      if (error) {
        const errMsg = (error as { context?: { error?: string } }).context?.error || 'Failed to polish note.';
        toast.error(errMsg);
        return;
      }

      if (data?.polished) {
        let polished = data.polished;
        // Re-append any URLs that were in the original but are missing from polished
        for (const url of extractedUrls) {
          if (!polished.includes(url)) {
            polished = polished.trimEnd() + '\n' + url;
          }
        }
        updateSavedNote(noteId, polished);
        toast.success('Note polished!');
      }
    } catch {
      toast.error('Failed to polish note. Please try again.');
    } finally {
      setPolishingId(null);
    }
  };

  const handleApplyCustomize = async (noteId: string, text: string) => {
    const savedKey = findFirstSavedKey();
    if (!savedKey) {
      toast.error('Please set your API key first (click API Key in the nav)');
      return;
    }

    const instruction = instructions[noteId] || '';
    if (!instruction.trim()) return;

    setApplyingId(noteId);
    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'refine-proposal',
          existingProposal: text,
          refinementInstruction: instruction,
          variantType: 'medium',
          apiProvider: savedKey.provider,
          apiKey: savedKey.key,

          apiModel: savedKey.model,
        },
      });

      if (error) {
        const errMsg = (error as { context?: { error?: string } }).context?.error || 'Failed to customize note.';
        toast.error(errMsg);
        return;
      }

      if (data?.refined) {
        updateSavedNote(noteId, data.refined);
        toast.success('Note updated!');
        setCustomizingId(null);
        setInstructions(prev => ({ ...prev, [noteId]: '' }));
      }
    } catch {
      toast.error('Failed to customize note. Please try again.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <StickyNote className="h-6 w-6 text-primary" />
              Your Notes
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Saved in your browser · Up to 30 notes</p>
          </div>
          <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            {savedNotes.length}/30
          </span>
        </div>

        {/* Empty state */}
        {savedNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl text-center mt-6">
            <StickyNote className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-base font-medium text-muted-foreground">No notes yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1 mb-6">Jot down anything you want to remember or use in proposals</p>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Note
            </Button>
          </div>
        )}

        {/* Note cards */}
        <div className="space-y-4 mt-6">
          {savedNotes.map((note) => {
            const wc = wordCount(note.text);
            const isPolishing = polishingId === note.id;
            const isCustomizing = customizingId === note.id;
            const isApplying = applyingId === note.id;
            const savedKey = findFirstSavedKey();

            return (
              <div
                key={note.id}
                className="bg-card border border-border rounded-xl p-4 shadow-sm relative"
              >
                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSavedNote(note.id)}
                  className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Note textarea */}
                <Textarea
                  ref={el => { textareaRefs.current[note.id] = el; }}
                  data-note-textarea
                  value={note.text}
                  onChange={e => updateSavedNote(note.id, e.target.value)}
                  placeholder="Write your note here..."
                  rows={4}
                  className="resize-none text-sm pr-10"
                />

                {/* Word count */}
                <p className={`text-xs mt-1.5 ${wc > 300 ? 'text-destructive font-medium' : wc > 240 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  {wc}/300 words
                </p>

                {/* Links section */}
                <div className="mt-2">
                  {(note.links || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(note.links || []).map((link, i) => (
                        <div key={i} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full max-w-[200px]">
                          <a href={link} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{link.replace(/^https?:\/\//, '')}</a>
                          <button onClick={() => {
                            const newLinks = (note.links || []).filter((_, li) => li !== i);
                            updateSavedNoteLinks(note.id, newLinks);
                          }} className="ml-0.5 text-primary/60 hover:text-destructive shrink-0">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={linkInputs[note.id] || ''}
                      onChange={e => setLinkInputs(prev => ({ ...prev, [note.id]: e.target.value }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (linkInputs[note.id] || '').trim();
                          if (val && (val.startsWith('http://') || val.startsWith('https://'))) {
                            updateSavedNoteLinks(note.id, [...(note.links || []), val]);
                            setLinkInputs(prev => ({ ...prev, [note.id]: '' }));
                          }
                        }
                      }}
                      placeholder="Add link (paste URL + Enter)"
                      className="flex-1 text-xs h-7 px-2 rounded border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Customize inline panel */}
                {isCustomizing && (
                  <div className="mt-3 border border-border rounded-lg p-3 bg-muted/30 space-y-2">
                    <p className="text-xs font-medium text-foreground">What do you want to change?</p>
                    <Textarea
                      value={instructions[note.id] || ''}
                      onChange={e => setInstructions(prev => ({ ...prev, [note.id]: e.target.value }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                          e.preventDefault();
                          handleApplyCustomize(note.id, note.text);
                        }
                      }}
                      placeholder="e.g., Make it more concise, translate to English, add more detail about results..."
                      rows={2}
                      className="resize-none text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApplyCustomize(note.id, note.text)}
                        disabled={isApplying || !instructions[note.id]?.trim()}
                        className="gap-1.5 h-8 text-xs"
                      >
                        {isApplying ? (
                          <><Loader2 className="h-3 w-3 animate-spin" /> Applying...</>
                        ) : (
                          'Apply'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCustomizingId(null)}
                        disabled={isApplying}
                        className="h-8 text-xs gap-1.5"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                      <span className="text-xs text-muted-foreground ml-auto">Ctrl+Enter to apply</span>
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePolish(note.id, note.text)}
                    disabled={isPolishing || !note.text.trim() || !savedKey}
                    className="gap-1.5 h-8 text-xs"
                  >
                    {isPolishing ? (
                      <><Loader2 className="h-3 w-3 animate-spin" /> Polishing...</>
                    ) : (
                      <><Wand2 className="h-3 w-3" /> Polish with AI</>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomizingId(isCustomizing ? null : note.id)}
                    disabled={isPolishing || isApplying}
                    className="gap-1.5 h-8 text-xs"
                  >
                    <Sparkles className="h-3 w-3" />
                    Customize
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Note button (when notes exist and under limit) */}
        {savedNotes.length > 0 && savedNotes.length < 30 && (
          <Button
            variant="outline"
            onClick={handleAdd}
            className="w-full mt-6 border-dashed gap-2 h-12"
          >
            <Plus className="h-4 w-4" />
            Add Note ({savedNotes.length}/30)
          </Button>
        )}
        {savedNotes.length >= 30 && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Maximum 30 notes reached. Remove one to add another.
          </p>
        )}

        {/* Info box */}
        <div className="mt-8 flex items-start gap-3 bg-muted/30 rounded-lg p-4 border border-border/40">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            All notes are saved in your browser only. Use the backup panel on the Projects page to export and import your data across browsers or PCs.
          </p>
        </div>
      </div>
    </div>
  );
}
