'use client'
import { useRef, useState } from 'react';
import { Download, Upload, FileJson, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { exportAllData, importAllData, previewBackup } from '@/utils/dataTransfer';
import { loadSavedProjects } from '@/config/projects';
import { loadSavedNotes } from '@/config/notes';
import { getAllJobSessions } from '@/utils/jobStorage';
import { useEffect } from 'react';

interface Counts { projects: number; notes: number; sessions: number }

interface Preview {
  counts: Counts;
  exportedAt: string;
}

export function DataTransferPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{ projects: number; notes: number; sessions: number; skipped: number } | null>(null);
  const [currentCounts, setCurrentCounts] = useState<Counts>({ projects: 0, notes: 0, sessions: 0 });

  useEffect(() => {
    (async () => {
      const [sessions] = await Promise.all([getAllJobSessions()]);
      setCurrentCounts({
        projects: loadSavedProjects().length,
        notes: loadSavedNotes().length,
        sessions: sessions.length,
      });
    })();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAllData();
      toast.success('Backup downloaded successfully.');
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setPreviewError('Please select a .json backup file.');
      setPreview(null);
      setPendingFile(null);
      return;
    }
    setPreviewError(null);
    setImportResult(null);
    const result = await previewBackup(file);
    if (!result.valid) {
      setPreviewError(result.error ?? 'Invalid backup file.');
      setPreview(null);
      setPendingFile(null);
    } else {
      setPreview({ counts: result.counts!, exportedAt: result.exportedAt! });
      setPendingFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;
    setIsImporting(true);
    try {
      const result = await importAllData(pendingFile);
      setImportResult(result);
      setPendingFile(null);
      setPreview(null);
      const total = result.projects + result.notes + result.sessions;
      if (result.errors.length > 0) {
        toast.error(`Import finished with ${result.errors.length} error(s).`);
      } else if (total === 0 && result.skipped > 0) {
        toast.info(`All ${result.skipped} items already exist — nothing new to import.`);
      } else {
        toast.success(`Imported ${total} item(s). Reload to see your data.`);
      }
    } catch (e: any) {
      toast.error(e.message ?? 'Import failed.');
    } finally {
      setIsImporting(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return iso; }
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-secondary/20">
        <h2 className="text-sm font-bold text-foreground">Backup & Restore</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Export all your data to move between browsers or PCs. Import merges with existing data — duplicates are skipped.
        </p>
      </div>

      <div className="p-6 space-y-6">

        {/* ── EXPORT ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Export</h3>
            <span className="text-[11px] text-muted-foreground">Downloads a .json file to your computer</span>
          </div>

          {/* Current data summary */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Projects', count: currentCounts.projects },
              { label: 'Notes', count: currentCounts.notes },
              { label: 'Sessions', count: currentCounts.sessions },
            ].map(({ label, count }) => (
              <div key={label} className="rounded-xl border border-border bg-background px-3 py-2.5 text-center">
                <div className="text-lg font-bold text-foreground">{count}</div>
                <div className="text-[11px] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting || (currentCounts.projects + currentCounts.notes + currentCounts.sessions === 0)}
            className="w-full gap-2 bg-primary text-white hover:bg-primary/90"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? 'Preparing download…' : 'Export All Data'}
          </Button>
        </div>

        <div className="border-t border-border" />

        {/* ── IMPORT ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Import</h3>
            <span className="text-[11px] text-muted-foreground">Select a backup .json file</span>
          </div>

          {/* Drop zone */}
          {!preview && !importResult && (
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                'rounded-xl border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-all',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-secondary/30'
              )}
            >
              <FileJson className={cn('w-8 h-8 mx-auto mb-2 transition-colors', isDragging ? 'text-primary' : 'text-muted-foreground/50')} />
              <p className="text-sm font-medium text-foreground mb-0.5">Drop your backup file here</p>
              <p className="text-xs text-muted-foreground">or click to browse — only .json files from this app</p>
              <input
                ref={fileRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
              />
            </div>
          )}

          {/* Preview / confirm */}
          {preview && pendingFile && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <FileJson className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{pendingFile.name}</p>
                  <p className="text-[11px] text-muted-foreground">Exported on {formatDate(preview.exportedAt)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Projects', count: preview.counts.projects },
                  { label: 'Notes', count: preview.counts.notes },
                  { label: 'Sessions', count: preview.counts.sessions },
                ].map(({ label, count }) => (
                  <div key={label} className="rounded-lg border border-primary/20 bg-white/60 dark:bg-background px-2 py-2 text-center">
                    <div className="text-base font-bold text-primary">{count}</div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Items with matching IDs will be skipped. New items will be merged with your existing data.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmImport}
                  disabled={isImporting}
                  size="sm"
                  className="flex-1 gap-1.5 bg-primary text-white hover:bg-primary/90"
                >
                  {isImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {isImporting ? 'Importing…' : 'Confirm Import'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setPreview(null); setPendingFile(null); }}
                  disabled={isImporting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Error */}
          {previewError && (
            <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-destructive">{previewError}</p>
                <button onClick={() => { setPreviewError(null); fileRef.current?.click(); }} className="text-[11px] text-muted-foreground hover:text-foreground mt-1 underline underline-offset-2">
                  Try another file
                </button>
              </div>
            </div>
          )}

          {/* Success result */}
          {importResult && (
            <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <p className="text-xs font-semibold text-green-800 dark:text-green-400">Import complete</p>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Projects', count: importResult.projects },
                  { label: 'Notes', count: importResult.notes },
                  { label: 'Sessions', count: importResult.sessions },
                  { label: 'Skipped', count: importResult.skipped },
                ].map(({ label, count }) => (
                  <div key={label} className="rounded-lg border border-green-200 dark:border-green-800 bg-white/60 dark:bg-background px-2 py-1.5">
                    <div className="text-sm font-bold text-foreground">{count}</div>
                    <div className="text-[10px] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full gap-1.5 border-green-300 text-green-800 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload to see imported data
              </Button>
            </div>
          )}

          {/* Reset — new import after result */}
          {importResult && (
            <button
              onClick={() => { setImportResult(null); setPreviewError(null); }}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 block"
            >
              Import another file
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
