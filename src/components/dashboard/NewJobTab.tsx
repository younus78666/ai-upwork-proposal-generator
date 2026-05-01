'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileSelector } from '@/components/profile/ProfileSelector';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  Briefcase, 
  Mail, 
  Link as LinkIcon,
  User,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectedProfile {
  id: string;
  title: string;
  skills: string[];
  hourly_rate: number | null;
  is_default: boolean;
}

const MIN_DESCRIPTION_LENGTH = 50;

export function NewJobTab() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [clientName, setClientName] = useState('');
  const [applicationType, setApplicationType] = useState<'applying' | 'invitation'>('applying');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ title: false, description: false });
  const [additionalFieldsExpanded, setAdditionalFieldsExpanded] = useState(true);
  
  // Client questions from Upwork
  const [clientQuestions, setClientQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');

  const validation = {
    titleValid: jobTitle.trim().length > 0,
    descriptionValid: jobDescription.trim().length >= MIN_DESCRIPTION_LENGTH,
    get isValid() {
      return this.titleValid && this.descriptionValid;
    },
    get titleError() {
      return touched.title && !this.titleValid ? 'Job title is required' : null;
    },
    get descriptionError() {
      return touched.description && !this.descriptionValid 
        ? `Job description must be at least ${MIN_DESCRIPTION_LENGTH} characters (${jobDescription.trim().length}/${MIN_DESCRIPTION_LENGTH})`
        : null;
    }
  };

  const handleProfileSelect = (profileId: string | null, profile: SelectedProfile | null) => {
    setSelectedProfileId(profileId);
    setSelectedProfile(profile);
  };

  const addClientQuestion = () => {
    if (newQuestion.trim() && clientQuestions.length < 10) {
      setClientQuestions([...clientQuestions, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const removeClientQuestion = (index: number) => {
    setClientQuestions(clientQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true });
    
    if (!validation.isValid || !user) return;

    setIsSubmitting(true);
    
    try {
      // Create the job in the database with client questions
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          user_id: user.id,
          title: jobTitle,
          description: jobDescription,
          job_link: jobLink || null,
          client_name: clientName || null,
          application_type: applicationType,
          profile_id: selectedProfileId,
          questions: clientQuestions.map(q => ({ question: q, answer: '' })),
          answers: []
        })
        .select()
        .single();

      if (jobError) throw jobError;

      toast.success('Job created! Continue to generate proposal.');
      
      // Navigate to generate page
      router.push(`/dashboard/job/${job.id}/generate`);
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          New Proposal
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Create New Job Application
        </h1>
        <p className="text-muted-foreground">
          Add the job details and generate a personalized proposal
        </p>
      </div>

      <Card className="border border-border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Job Details
          </CardTitle>
          <CardDescription>
            Enter the Upwork job information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Selection */}
            <ProfileSelector 
              selectedProfileId={selectedProfileId} 
              onProfileSelect={handleProfileSelect} 
            />

            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="job-title">
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="job-title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                placeholder="e.g., Senior React Developer for E-commerce Platform"
                disabled={isSubmitting}
                className={cn(
                  "h-12",
                  validation.titleError && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {validation.titleError && (
                <p className="text-sm text-destructive">{validation.titleError}</p>
              )}
            </div>

            {/* Application Type */}
            <div className="space-y-3">
              <Label>How did you find this job?</Label>
              <RadioGroup
                value={applicationType}
                onValueChange={(value) => setApplicationType(value as 'applying' | 'invitation')}
                className="flex flex-col sm:flex-row gap-3"
                disabled={isSubmitting}
              >
                <div className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                  applicationType === 'applying' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}>
                  <RadioGroupItem value="applying" id="applying" />
                  <Label htmlFor="applying" className="cursor-pointer flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>I'm applying for this job</span>
                  </Label>
                </div>
                <div className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                  applicationType === 'invitation' 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}>
                  <RadioGroupItem value="invitation" id="invitation" />
                  <Label htmlFor="invitation" className="cursor-pointer flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>I received an invitation</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="job-description">
                Job Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                placeholder="Paste the full Upwork job description here..."
                disabled={isSubmitting}
                className={cn(
                  "min-h-[200px] resize-none",
                  validation.descriptionError && "border-destructive focus-visible:ring-destructive"
                )}
              />
              <div className="flex items-center justify-between">
                {validation.descriptionError ? (
                  <p className="text-sm text-destructive">{validation.descriptionError}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {jobDescription.trim().length} characters
                  </p>
                )}
              </div>
            </div>

            {/* Client Questions Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <Label>Client's Questions (from Upwork job post)</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Add any screening questions from the job posting
              </p>
              
              {/* Existing questions */}
              {clientQuestions.length > 0 && (
                <div className="space-y-2">
                  {clientQuestions.map((question, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm flex-1">{question}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeClientQuestion(index)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new question */}
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type a client question..."
                  disabled={isSubmitting || clientQuestions.length >= 10}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addClientQuestion();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addClientQuestion}
                  disabled={!newQuestion.trim() || clientQuestions.length >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {clientQuestions.length >= 10 && (
                <p className="text-sm text-muted-foreground">Maximum 10 questions</p>
              )}
            </div>

            {/* Additional Fields */}
            <div className="border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setAdditionalFieldsExpanded(!additionalFieldsExpanded)}
                className="w-full flex items-center justify-between text-left group mb-3"
              >
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    Additional Details
                    <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span>
                  </h3>
                </div>
                {additionalFieldsExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>

              {additionalFieldsExpanded && (
                <div className="space-y-4 animate-fade-in">
                  {/* Job Link */}
                  <div className="space-y-2">
                    <Label htmlFor="job-link">Upwork Job Link</Label>
                    <div className="relative">
                      <Input
                        id="job-link"
                        value={jobLink}
                        onChange={(e) => setJobLink(e.target.value)}
                        placeholder="https://www.upwork.com/jobs/..."
                        disabled={isSubmitting}
                        className="h-11 pl-10"
                      />
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Client Name */}
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Client's Name</Label>
                    <div className="relative">
                      <Input
                        id="client-name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Find client name in their Upwork reviews"
                        disabled={isSubmitting}
                        className="h-11 pl-10"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-base font-semibold"
              disabled={isSubmitting || !selectedProfileId}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating Job...
                </>
              ) : (
                <>
                  Continue to Proposal
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>

            {!selectedProfileId && (
              <p className="text-sm text-center text-muted-foreground">
                Please select a profile to continue
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
