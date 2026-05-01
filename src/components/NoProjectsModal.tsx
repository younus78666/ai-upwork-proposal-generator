import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FolderOpen, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NoProjectsModalProps {
  open: boolean;
  onContinueAsBeginner: () => void;
  onClose: () => void;
}

export function NoProjectsModal({ open, onContinueAsBeginner, onClose }: NoProjectsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            No Projects Added Yet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You haven't added any past projects. Proposals with relevant project references win
            <strong className="text-foreground"> 3x more often</strong> on Upwork.
          </p>

          <div className="bg-muted/40 rounded-lg p-3 border border-border/40">
            <p className="text-xs text-muted-foreground font-medium mb-1.5">What you'll get with projects:</p>
            <ul className="space-y-1">
              {['AI picks the most relevant project for each job', 'Woven naturally, not listed', 'Instantly stronger social proof'].map(t => (
                <li key={t} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="text-green-500">✓</span> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/projects" onClick={onClose}>
              <Button variant="hero" className="w-full gap-2">
                <FolderOpen className="h-4 w-4" />
                Add Projects First
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Button variant="outline" onClick={onContinueAsBeginner} className="w-full gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Continue without projects (beginner mode)
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Projects are saved for 6 months. Add once, use forever.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
