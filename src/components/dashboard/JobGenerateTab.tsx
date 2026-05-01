'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
  Loader2, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  FileText,
  Check,
  LayoutTemplate,
  X,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
  Trophy,
  Heart,
  HelpCircle,
  MessageCircle,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TemplateSelectDialog } from './TemplateSelectDialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePersonalInfo } from '@/hooks/usePersonalInfo';

interface Job {
  id: string;
  title: string;
  description: string | null;
  client_name: string | null;
  application_type: string | null;
  profile_id: string | null;
  questions: Array<{ question: string; answer: string }>;
}

interface Profile {
  id: string;
  title: string;
  overview: string | null;
  skills: string[] | null;
  experience: string | null;
  hourly_rate: number | null;
  availability: string | null;
  display_name: string | null;
  portfolio_website: string | null;
}

export function JobGenerateTab() {
  const params = useParams()
  const id = params?.id as string;
  const { user } = useAuth();
  const router = useRouter();
  
  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string; content: string } | null>(null);
  
  // Personal info from hook (auto-loads saved data)
  const { 
    personalInfo, 
    setPersonalInfo, 
    isLoading: isLoadingPersonalInfo, 
    isSaving: isSavingPersonalInfo,
    savePersonalInfo 
  } = usePersonalInfo();
  const [expandedPersonalInfo, setExpandedPersonalInfo] = useState(false);
  
  // Local personal info state for form (maps to hook's interface)
  const [localPersonalInfo, setLocalPersonalInfo] = useState({
    education: '',
    workExperience: '',
    upworkStats: '',
    personalStory: ''
  });
  
  // Sync local state with loaded personal info
  useEffect(() => {
    if (!isLoadingPersonalInfo) {
      setLocalPersonalInfo({
        education: personalInfo.education,
        workExperience: personalInfo.workExperience,
        upworkStats: personalInfo.upworkStats,
        personalStory: personalInfo.personalStory
      });
    }
  }, [personalInfo, isLoadingPersonalInfo]);
  
  // Job-specific questions
  const [jobSpecificQuestions, setJobSpecificQuestions] = useState<string[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [expandedJobQuestions, setExpandedJobQuestions] = useState(true);

  // Default questions for Q&A flow
  const defaultQuestions = [
    "What specific experience do you have that's relevant to this project?",
    "How would you approach this project?",
    "What's your timeline for completing this work?",
    "What questions do you have for the client?"
  ];

  // Combine default questions with client questions
  const allQuestions = job?.questions?.length 
    ? [...job.questions.map(q => q.question), ...defaultQuestions]
    : defaultQuestions;

  useEffect(() => {
    if (!id || !user) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch job
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (jobError) throw jobError;
        
        const parsedQuestions = Array.isArray(jobData.questions) 
          ? jobData.questions as Array<{ question: string; answer: string }>
          : [];
        
        setJob({ ...jobData, questions: parsedQuestions });
        
        // Initialize answers
        const questionCount = parsedQuestions.length + defaultQuestions.length;
        setAnswers(new Array(questionCount).fill(''));

        // Fetch profile if linked
        if (jobData.profile_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', jobData.profile_id)
            .single();
          
          if (profileData) {
            setProfile({
              ...profileData,
              skills: Array.isArray(profileData.skills) ? profileData.skills as string[] : []
            });
          }
        }
        
        // Generate job-specific questions
        if (jobData.description) {
          generateJobQuestions(jobData.title, jobData.description);
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const generateJobQuestions = async (title: string, description: string) => {
    setIsLoadingQuestions(true);
    try {
      const response = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'generate-questions',
          jobTitle: title,
          jobDescription: description
        }
      });

      if (response.data?.questions) {
        setJobSpecificQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const generateSuggestion = async () => {
    if (!job) return;
    
    setIsGeneratingSuggestion(true);
    
    try {
      const response = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'suggestion',
          jobTitle: job.title,
          jobDescription: job.description,
          question: allQuestions[currentStep],
          personalInfo: (localPersonalInfo.education || localPersonalInfo.workExperience || localPersonalInfo.upworkStats || localPersonalInfo.personalStory) 
            ? { ...localPersonalInfo, experience: localPersonalInfo.workExperience } 
            : undefined,
          profileData: profile ? {
            title: profile.title,
            overview: profile.overview,
            skills: profile.skills,
            experience: profile.experience,
            hourlyRate: profile.hourly_rate,
            availability: profile.availability,
            displayName: profile.display_name,
            portfolioWebsite: profile.portfolio_website
          } : null
        }
      });

      if (response.error) throw response.error;
      
      if (response.data?.suggestion) {
        handleAnswerChange(currentStep, response.data.suggestion);
        toast.success('Suggestion generated!');
      }
    } catch (error) {
      console.error('Error generating suggestion:', error);
      toast.error('Failed to generate suggestion');
    } finally {
      setIsGeneratingSuggestion(false);
    }
  };

  const generateProposal = async () => {
    if (!job) return;
    
    setIsGeneratingProposal(true);
    
    try {
      // Build Q&A array
      const qaArray = allQuestions.map((question, index) => ({
        question,
        answer: answers[index] || ''
      }));

      // Extract client questions (first N questions from job.questions)
      const clientQuestions = job.questions?.map(q => q.question) || [];

      // Generate all three proposal lengths in parallel
      const proposalLengths = ['short', 'medium', 'detailed'] as const;
      
      const responses = await Promise.all(
        proposalLengths.map(length =>
          supabase.functions.invoke('generate-proposal', {
            body: {
              type: 'proposal',
              jobTitle: job.title,
              jobDescription: job.description,
              questions: qaArray,
              clientQuestions,
              clientName: job.client_name,
              applicationType: job.application_type,
              proposalLength: length,
              personalInfo: (localPersonalInfo.education || localPersonalInfo.workExperience || localPersonalInfo.upworkStats || localPersonalInfo.personalStory) 
                ? { ...localPersonalInfo, experience: localPersonalInfo.workExperience } 
                : undefined,
              profileData: profile ? {
                title: profile.title,
                overview: profile.overview,
                skills: profile.skills,
                experience: profile.experience,
                hourlyRate: profile.hourly_rate,
                availability: profile.availability,
                displayName: profile.display_name,
                portfolioWebsite: profile.portfolio_website
              } : null,
              templateContent: selectedTemplate?.content || null,
              userId: user?.id,
              profileId: profile?.id
            }
          })
        )
      );

      // Check for errors
      const firstError = responses.find(r => r.error);
      if (firstError?.error) {
        throw firstError.error;
      }
      
      // Build proposal data object
      const proposalData: Record<string, string> = {};
      proposalLengths.forEach((length, index) => {
        if (responses[index].data?.proposal) {
          proposalData[length] = responses[index].data.proposal;
        }
      });

      // Check if proposal exists
      const { data: existing } = await supabase
        .from('proposals')
        .select('id')
        .eq('job_id', job.id)
        .single();

      if (existing) {
        await supabase
          .from('proposals')
          .update(proposalData)
          .eq('job_id', job.id);
      } else {
        await supabase
          .from('proposals')
          .insert({
            job_id: job.id,
            ...proposalData
          });
      }

      // Update job answers
      await supabase
        .from('jobs')
        .update({ 
          answers: qaArray 
        })
        .eq('id', job.id);

      toast.success('All proposals generated!');
      router.push(`/dashboard/job/${job.id}`);
    } catch (error) {
      console.error('Error generating proposal:', error);
      toast.error('Failed to generate proposal');
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job not found</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isLastStep = currentStep === allQuestions.length - 1;
  const progress = ((currentStep + 1) / allQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/dashboard')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Sparkles className="h-4 w-4" />
            Generate Proposal
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">{job.title}</h1>
          {profile && (
            <p className="text-sm text-muted-foreground">
              Using profile: {profile.title}
            </p>
          )}
        </div>
      </div>

      {/* Job-Specific Questions Panel */}
      {jobSpecificQuestions.length > 0 && (
        <Collapsible open={expandedJobQuestions} onOpenChange={setExpandedJobQuestions} className="mb-4">
          <Card className="border-primary/20 bg-primary/5">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm font-medium">Questions to Ask Client</CardTitle>
                  </div>
                  {expandedJobQuestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
                <CardDescription className="text-xs">
                  Job-specific questions to understand the project better
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {jobSpecificQuestions.map((q, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <HelpCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{q}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Personal Info Panel */}
      <Collapsible open={expandedPersonalInfo} onOpenChange={setExpandedPersonalInfo} className="mb-4">
        <Card className="border-dashed">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-medium">Personal Touch (Optional)</CardTitle>
                </div>
                {expandedPersonalInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
              <CardDescription className="text-xs">
                Add your story for more natural, personalized proposals
              </CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              {isLoadingPersonalInfo ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading saved info...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" /> Education
                      </Label>
                      <Input
                        placeholder="e.g., BSCS from University of Karachi, 2022"
                        value={localPersonalInfo.education}
                        onChange={(e) => setLocalPersonalInfo({ ...localPersonalInfo, education: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Upwork Stats
                      </Label>
                      <Input
                        placeholder="e.g., 99% Success, 400+ projects, Top Rated"
                        value={localPersonalInfo.upworkStats}
                        onChange={(e) => setLocalPersonalInfo({ ...localPersonalInfo, upworkStats: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> Work Experience
                    </Label>
                    <Textarea
                      placeholder="e.g., 6 years WordPress development, worked with Canadian company on eCommerce sites..."
                      value={localPersonalInfo.workExperience}
                      onChange={(e) => setLocalPersonalInfo({ ...localPersonalInfo, workExperience: e.target.value })}
                      className="text-sm min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs flex items-center gap-1">
                      <Heart className="h-3 w-3" /> Your Story
                    </Label>
                    <Textarea
                      placeholder="e.g., How you got started, mentors who shaped you, why you love what you do..."
                      value={localPersonalInfo.personalStory}
                      onChange={(e) => setLocalPersonalInfo({ ...localPersonalInfo, personalStory: e.target.value })}
                      className="text-sm min-h-[60px]"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => savePersonalInfo(localPersonalInfo)}
                    disabled={isSavingPersonalInfo}
                    className="w-full"
                  >
                    {isSavingPersonalInfo ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-2" />
                        Save for Future Proposals
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentStep + 1} of {allQuestions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{allQuestions[currentStep]}</CardTitle>
          {currentStep < (job.questions?.length || 0) && (
            <CardDescription className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Client's question from job posting
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={answers[currentStep] || ''}
            onChange={(e) => handleAnswerChange(currentStep, e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[150px] resize-none"
            disabled={isGeneratingSuggestion}
          />
          
          <Button
            variant="outline"
            onClick={generateSuggestion}
            disabled={isGeneratingSuggestion}
            className="w-full"
          >
            {isGeneratingSuggestion ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Suggestion
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Template Selection */}
      {isLastStep && (
        <Card className="mb-6 border-dashed">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <LayoutTemplate className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {selectedTemplate ? selectedTemplate.name : 'Use a Template'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTemplate 
                      ? 'Template will guide structure and style' 
                      : 'Optional: Use a saved template as reference'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedTemplate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTemplateDialogOpen(true)}
                >
                  {selectedTemplate ? 'Change' : 'Select'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {isLastStep ? (
          <Button
            onClick={generateProposal}
            disabled={isGeneratingProposal}
            className="flex-1"
          >
            {isGeneratingProposal ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating All Proposals...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Generate All Proposals
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStep(Math.min(allQuestions.length - 1, currentStep + 1))}
            className="flex-1"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Template Select Dialog */}
      <TemplateSelectDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSelect={setSelectedTemplate}
        selectedTemplateId={selectedTemplate?.id}
      />
    </div>
  );
}
