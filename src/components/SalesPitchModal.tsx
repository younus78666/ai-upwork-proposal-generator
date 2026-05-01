'use client'
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SalesPitchModalProps {
  open: boolean;
  onClose: () => void;
  questions: string[];
  jobTitle: string;
}

export function SalesPitchModal({ open, onClose, questions, jobTitle }: SalesPitchModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyOne = async (question: string, index: number) => {
    try {
      await navigator.clipboard.writeText(question);
      setCopiedIndex(index);
      toast.success('Question copied!');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleCopyAll = async () => {
    try {
      const allText = questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      toast.success('All questions copied!');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="text-base">Follow-Up Sales Questions</DialogTitle>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2.5 flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              Send one of these as a follow-up message after submitting your proposal
              {jobTitle ? ` for "${jobTitle}"` : ''}. Clients who receive a targeted question
              are significantly more likely to reply.
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-2.5 mt-1">
          {questions.map((question, index) => (
            <div
              key={index}
              className="group relative flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <span className="text-xs font-bold text-primary">{index + 1}</span>
              </div>
              <p className="flex-1 text-sm text-foreground leading-relaxed pr-1">{question}</p>
              <button
                type="button"
                className="flex-shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                onClick={() => handleCopyOne(question, index)}
                title="Copy this question"
              >
                {copiedIndex === index ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          ))}

          {questions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No sales questions available for this proposal.
            </p>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground/70 text-center mt-1">
          Send only one question per message. Multiple questions get partial answers.
        </p>

        <div className="flex gap-2.5 mt-2">
          {questions.length > 0 && (
            <Button
              variant="outline"
              className="flex-1 gap-2 text-sm"
              onClick={handleCopyAll}
            >
              {copiedAll ? (
                <><Check className="h-3.5 w-3.5 text-green-500" /> Copied All</>
              ) : (
                <><Copy className="h-3.5 w-3.5" /> Copy All 3</>
              )}
            </Button>
          )}
          <Button className="flex-1 text-sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
