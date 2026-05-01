'use client'
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProposalRegenerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalLength: 'short' | 'medium' | 'detailed';
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  questions: { question: string; answer: string }[];
  clientQuestions?: string[];
  clientName?: string;
  applicationType?: string;
  profileData?: {
    title: string;
    overview?: string;
    skills?: string[];
    experience?: string;
    hourlyRate?: number;
    availability?: string;
  } | null;
  onSuccess: (newProposal: string) => void;
}

const toneOptions = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-appropriate' },
  { value: 'conversational', label: 'Conversational', description: 'Warm and approachable' },
  { value: 'friendly', label: 'Friendly', description: 'Personable and enthusiastic' },
  { value: 'confident', label: 'Confident', description: 'Assertive and authoritative' },
  { value: 'enthusiastic', label: 'Enthusiastic', description: 'Excited and passionate' },
];

const styleOptions = [
  { value: 'direct', label: 'Direct', description: 'Concise and to-the-point' },
  { value: 'storytelling', label: 'Storytelling', description: 'Narrative with examples' },
  { value: 'results-focused', label: 'Results-Focused', description: 'Metrics and outcomes' },
  { value: 'problem-solving', label: 'Problem-Solving', description: 'Solution-oriented' },
  { value: 'collaborative', label: 'Collaborative', description: 'Partnership-focused' },
];

export function ProposalRegenerateDialog({
  open,
  onOpenChange,
  proposalLength,
  jobId,
  jobTitle,
  jobDescription,
  questions,
  clientQuestions,
  clientName,
  applicationType,
  profileData,
  onSuccess,
}: ProposalRegenerateDialogProps) {
  const [tone, setTone] = useState<string>('professional');
  const [style, setStyle] = useState<string>('direct');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegenerate = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'proposal',
          jobTitle,
          jobDescription,
          questions,
          clientQuestions: clientQuestions || [],
          clientName: clientName || '',
          applicationType: applicationType || 'applying',
          proposalLength,
          profileData,
          tone,
          style,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Update the proposal in the database
      const updateColumn = proposalLength === 'short' ? 'short' : 
                          proposalLength === 'medium' ? 'medium' : 'detailed';
      
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ [updateColumn]: data.proposal })
        .eq('job_id', jobId);

      if (updateError) throw updateError;

      toast.success(`${proposalLength.charAt(0).toUpperCase() + proposalLength.slice(1)} proposal regenerated!`);
      onSuccess(data.proposal);
      onOpenChange(false);
    } catch (error) {
      console.error('Error regenerating proposal:', error);
      toast.error('Failed to regenerate proposal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Regenerate {proposalLength.charAt(0).toUpperCase() + proposalLength.slice(1)} Proposal
          </DialogTitle>
          <DialogDescription>
            Choose a different tone and style to regenerate this proposal with a fresh approach.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                {styleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleRegenerate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
