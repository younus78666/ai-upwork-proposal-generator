import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

interface AttachmentReminderModalProps {
  open: boolean;
  onConfirm: () => void;
  onSkip: () => void;
}

export function AttachmentReminderModal({ open, onConfirm, onSkip }: AttachmentReminderModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => onSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Paperclip className="h-5 w-5 text-amber-600" />
            </div>
            <DialogTitle>Attachment Mentioned</DialogTitle>
          </div>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          The client mentioned an <strong>attachment, document, or link</strong> in their job description. Have you reviewed it?
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Your proposal will be stronger if you reference details from it.
        </p>
        <div className="flex gap-3 mt-4">
          <Button variant="default" className="flex-1" onClick={onConfirm}>
            Yes, I've reviewed it
          </Button>
          <Button variant="outline" className="flex-1" onClick={onSkip}>
            Skip for now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
