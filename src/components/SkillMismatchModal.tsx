import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Sparkles, X } from 'lucide-react';

interface SkillMismatchModalProps {
  open: boolean;
  jobRequires: string[];
  missingSkills: string[];
  onProceed: () => void;
  onCancel: () => void;
}

export function SkillMismatchModal({ open, jobRequires, missingSkills, onProceed, onCancel }: SkillMismatchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Possible Skill Mismatch
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This job seems to require skills that aren't in your saved projects or notes.
            Sending a proposal anyway could waste your Upwork connects.
          </p>
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5">Job requires:</p>
              <div className="flex flex-wrap gap-1.5">
                {jobRequires.map(s => (
                  <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-medium ${missingSkills.includes(s) ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {missingSkills.includes(s) ? '✗ ' : '✓ '}{s}
                  </span>
                ))}
              </div>
            </div>
            {missingSkills.length > 0 && (
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <span className="font-semibold">Not found in your projects/notes:</span> {missingSkills.join(', ')}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Add a matching project first for a stronger proposal, or proceed if you have this skill and just haven't added it yet.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="flex-1 gap-1.5">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={onProceed} className="flex-1 gap-1.5">
              <Sparkles className="h-4 w-4" /> Generate Anyway
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
