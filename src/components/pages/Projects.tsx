'use client'
import { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, FolderOpen, Plus, Trash2, Loader2, Sparkles, Info, X,
  Download, Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { SavedProject } from '@/types/proposal';
import { findFirstSavedKey } from '@/config/providers';
import { supabase } from '@/integrations/supabase/client';
import { useProposal } from '@/context/ProposalContext';
;
import { DataTransferPanel } from '@/components/DataTransferPanel';
import { exportAllData, importAllData, previewBackup } from '@/utils/dataTransfer';

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export default function Projects() {
  // Single source of truth: context only. No local projects state.
  const { savedProjects, addSavedProject, updateSavedProject, removeSavedProject } = useProposal();
  const [polishingId, setPolishingId] = useState<string | null>(null);
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const topImportRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    addSavedProject({ name: '', description: '', url: '', skills: [] });
  };

  const handleQuickExport = async () => {
    setIsExporting(true);
    try {
      await exportAllData();
      toast.success('Backup downloaded.');
    } catch {
      toast.error('Export failed. Try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const check = await previewBackup(file);
    if (!check.valid) { toast.error(check.error ?? 'Invalid backup file.'); return; }
    setIsImporting(true);
    try {
      const result = await importAllData(file);
      const total = result.projects + result.notes + result.sessions;
      if (total === 0 && result.skipped > 0) {
        toast.info(`All ${result.skipped} items already exist.`);
      } else {
        toast.success(`Imported ${total} item(s). Reloading…`);
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Import failed.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleUpdate = (id: string, field: keyof Omit<SavedProject, 'id'>, value: string | string[]) => {
    updateSavedProject(id, { [field]: value });
  };

  const addSkillTag = (id: string, raw: string) => {
    const tag = raw.trim().replace(/,+$/, '').trim();
    if (!tag) return;
    const project = savedProjects.find(p => p.id === id);
    const existing = project?.skills || [];
    if (!existing.includes(tag)) {
      updateSavedProject(id, { skills: [...existing, tag] });
    }
    setSkillInputs(prev => ({ ...prev, [id]: '' }));
  };

  const removeSkillTag = (id: string, tag: string) => {
    const project = savedProjects.find(p => p.id === id);
    updateSavedProject(id, { skills: (project?.skills || []).filter(s => s !== tag) });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    const value = skillInputs[id] || '';
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkillTag(id, value);
    } else if (e.key === 'Backspace' && !value) {
      const project = savedProjects.find(p => p.id === id);
      const skills = project?.skills || [];
      if (skills.length > 0) {
        updateSavedProject(id, { skills: skills.slice(0, -1) });
      }
    }
  };

  const handleRemove = (id: string) => {
    removeSavedProject(id);
  };

  const handlePolish = async (project: SavedProject) => {
    if (!project.description.trim()) {
      toast.error('Add a description first before polishing.');
      return;
    }
    const savedKey = findFirstSavedKey();
    if (!savedKey) {
      toast.error('Please set your API key first (click API Key in the nav)');
      return;
    }

    setPolishingId(project.id);
    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'polish-project',
          jobTitle: project.name || 'this project',
          jobDescription: project.description,
          apiProvider: savedKey.provider,
          apiKey: savedKey.key,
        },
      });

      if (error) {
        const errMsg = (error as { context?: { error?: string } }).context?.error || 'Failed to polish description.';
        toast.error(errMsg);
        return;
      }

      if (data?.description) {
        updateSavedProject(project.id, { description: data.description });
        toast.success('Description polished!');
      }
    } catch {
      toast.error('Failed to polish description. Please try again.');
    } finally {
      setPolishingId(null);
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
              <FolderOpen className="h-6 w-6 text-primary" />
              Your Projects
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Saved in your browser · Unlimited projects</p>
          </div>
          <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            {savedProjects.length}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Add past projects once. The AI will pick the most relevant one for each proposal you generate.
        </p>

        {/* Quick backup bar */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-2.5 mb-8">
          <span className="text-xs text-muted-foreground">Backup &amp; Restore — transfer data to another browser or PC</span>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickExport}
              disabled={isExporting}
              className="h-7 gap-1.5 text-xs"
            >
              {isExporting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => topImportRef.current?.click()}
              disabled={isImporting}
              className="h-7 gap-1.5 text-xs"
            >
              {isImporting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              Import
            </Button>
            <input
              ref={topImportRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleQuickImport}
            />
          </div>
        </div>

        {/* Empty state */}
        {savedProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-base font-medium text-muted-foreground">No projects yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1 mb-6">Add your first project to strengthen your proposals</p>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Project
            </Button>
          </div>
        )}

        {/* Project cards */}
        <div className="space-y-6">
          {savedProjects.map((project) => {
            const descWords = wordCount(project.description);
            const isPolishing = polishingId === project.id;

            return (
              <div
                key={project.id}
                className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 relative"
              >
                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(project.id)}
                  className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Project Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={project.name}
                    onChange={(e) => handleUpdate(project.id, 'name', e.target.value)}
                    placeholder="e.g., E-commerce Redesign for TechStore"
                    className="h-11"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">Description</label>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${descWords > 200 ? 'text-destructive font-medium' : descWords > 160 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                        {descWords}/200 words
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handlePolish(project)}
                        disabled={isPolishing || !project.description.trim()}
                        className="gap-1.5 h-7 text-xs"
                      >
                        {isPolishing ? (
                          <><Loader2 className="h-3 w-3 animate-spin" /> Polishing...</>
                        ) : (
                          <><Sparkles className="h-3 w-3" /> Polish with AI</>
                        )}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={project.description}
                    onChange={(e) => handleUpdate(project.id, 'description', e.target.value)}
                    placeholder="Describe what you built, the challenge you solved, and the result achieved..."
                    rows={5}
                    className={`resize-none text-sm ${descWords > 200 ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {descWords > 200 && (
                    <p className="text-xs text-destructive">Over 200 words. Consider trimming for best results.</p>
                  )}
                </div>

                {/* URL */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Project URL <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    value={project.url || ''}
                    onChange={(e) => handleUpdate(project.id, 'url', e.target.value)}
                    placeholder="https://example.com"
                    className="h-11 text-sm"
                  />
                </div>

                {/* Features */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Features built <span className="text-muted-foreground font-normal">(Enter or comma to add)</span>
                  </label>
                  <div
                    className="min-h-11 flex flex-wrap gap-1.5 items-center px-3 py-2 rounded-md border border-input bg-background text-sm cursor-text"
                    onClick={(e) => {
                      const input = (e.currentTarget as HTMLElement).querySelector('input');
                      input?.focus();
                    }}
                  >
                    {(project.skills || []).map(skill => (
                      <span key={skill} className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkillTag(project.id, skill)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={skillInputs[project.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.includes(',')) {
                          addSkillTag(project.id, val);
                        } else {
                          setSkillInputs(prev => ({ ...prev, [project.id]: val }));
                        }
                      }}
                      onKeyDown={(e) => handleSkillKeyDown(e, project.id)}
                      onBlur={() => addSkillTag(project.id, skillInputs[project.id] || '')}
                      placeholder={(project.skills || []).length === 0 ? 'e.g., Mobile responsive, Contact form, Google Analytics, SEO setup, Dark mode' : ''}
                      className="flex-1 min-w-24 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Features are pulled across all your projects and used to build a deliverables list in every proposal.</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Project button */}
        {savedProjects.length > 0 && (
          <Button
            variant="outline"
            onClick={handleAdd}
            className="w-full mt-6 border-dashed gap-2 h-12"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        )}

        {/* Info box */}
        <div className="mt-8 flex items-start gap-3 bg-muted/30 rounded-lg p-4 border border-border/40">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            All data lives in your browser only — never on our servers. Use the backup panel below to transfer your data to another browser or PC.
          </p>
        </div>

        {/* Backup & Restore */}
        <div className="mt-4">
          <DataTransferPanel />
        </div>
      </div>
    </div>
  );
}
