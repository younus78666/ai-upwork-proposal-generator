'use client'
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { 
  Loader2, 
  ExternalLink, 
  MessageSquare, 
  FileText, 
  Copy,
  Check,
  ArrowLeft,
  Calendar,
  User as UserIcon,
  RefreshCw,
  Pencil,
  Save,
  X,
  BookmarkPlus,
  Send
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ProposalRegenerateDialog } from './ProposalRegenerateDialog';
import { SaveTemplateDialog } from './SaveTemplateDialog';
import { ProposalSubmitAssistant } from './ProposalSubmitAssistant';
import { JobDescriptionCard } from './JobDescriptionCard';

interface Job {
  id: string;
  title: string;
  description: string | null;
  job_link: string | null;
  client_name: string | null;
  application_type: string | null;
  status: string | null;
  created_at: string | null;
  profile_id: string | null;
  questions: { question: string; answer: string; suggested_answer?: string }[] | null;
  answers: { question: string; answer: string; suggested_answer?: string }[] | null;
  budget_min?: number | null;
  budget_max?: number | null;
  job_type?: string | null;
}

interface Proposal {
  id: string;
  detailed: string | null;
  medium: string | null;
  short: string | null;
}

interface Profile {
  title: string;
  overview: string | null;
  skills: string[] | null;
  experience: string | null;
  hourly_rate: number | null;
  availability: string | null;
}

export function JobDetailTab() {
  const params = useParams()
  const id = params?.id as string;
  const { user } = useAuth();
  const router = useRouter();
  
  const [job, setJob] = useState<Job | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [conversationCount, setConversationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [regenerateLength, setRegenerateLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [editingTab, setEditingTab] = useState<'short' | 'medium' | 'detailed' | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
  const [templateContent, setTemplateContent] = useState('');
  const [showSubmitAssistant, setShowSubmitAssistant] = useState(false);
  const [clientQuestions, setClientQuestions] = useState<{ question: string; answer: string; suggested_answer?: string }[]>([]);

  useEffect(() => {
    if (!id || !user) return;

    const fetchJobDetails = async () => {
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
        setJob(jobData as unknown as Job);

        // Fetch proposal
        const { data: proposalData } = await supabase
          .from('proposals')
          .select('*')
          .eq('job_id', id)
          .single();

        if (proposalData) {
          setProposal(proposalData);
        }

        // Set client questions from job data
        if (jobData.questions && Array.isArray(jobData.questions)) {
          setClientQuestions(jobData.questions as { question: string; answer: string; suggested_answer?: string }[]);
        }

        // Fetch profile if linked
        if (jobData.profile_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('title, overview, skills, experience, hourly_rate, availability')
            .eq('id', jobData.profile_id)
            .single();
          
          if (profileData) {
            setProfile(profileData as unknown as Profile);
          }
        }

        // Count conversations
        const { count } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', id);

        setConversationCount(count || 0);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job details');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, user]);

  const handleCopy = async (content: string | null, tab: string) => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopiedTab(tab);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleRegenerate = (length: 'short' | 'medium' | 'detailed') => {
    setRegenerateLength(length);
    setRegenerateDialogOpen(true);
  };

  const handleRegenerateSuccess = (newProposal: string) => {
    if (proposal) {
      setProposal({
        ...proposal,
        [regenerateLength]: newProposal,
      });
    }
  };

  const handleStartEdit = (tab: 'short' | 'medium' | 'detailed') => {
    if (!proposal) return;
    const content = tab === 'short' ? proposal.short : 
                   tab === 'medium' ? proposal.medium : 
                   proposal.detailed;
    setEditContent(content || '');
    setEditingTab(tab);
  };

  const handleCancelEdit = () => {
    setEditingTab(null);
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    if (!proposal || !editingTab) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('proposals')
        .update({ [editingTab]: editContent })
        .eq('id', proposal.id);

      if (error) throw error;

      setProposal({
        ...proposal,
        [editingTab]: editContent,
      });
      toast.success('Proposal saved!');
      setEditingTab(null);
      setEditContent('');
    } catch (error) {
      console.error('Error saving proposal:', error);
      toast.error('Failed to save proposal');
    } finally {
      setIsSaving(false);
    }
  };

  // Get questions from job data (answers stored in answers field)
  const getQuestionsWithAnswers = (): { question: string; answer: string }[] => {
    if (job?.answers && Array.isArray(job.answers)) {
      return job.answers;
    }
    return [];
  };

  const handleQuestionsUpdate = async (updatedQuestions: { question: string; answer: string; suggested_answer?: string }[]) => {
    setClientQuestions(updatedQuestions);
    // Save to database
    if (job) {
      await supabase
        .from('jobs')
        .update({ questions: updatedQuestions, answers: updatedQuestions })
        .eq('id', job.id);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
            className="mb-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {job.created_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(job.created_at), 'MMM d, yyyy')}
              </span>
            )}
            {job.client_name && (
              <span className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {job.client_name}
              </span>
            )}
            <Badge variant="outline">
              {job.application_type === 'invitation' ? 'Invitation' : 'Applied'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2">
          {job.job_link && (
            <Button variant="outline" size="sm" asChild>
              <a href={job.job_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View Job
              </a>
            </Button>
          )}
          <Button size="sm" onClick={() => router.push(`/dashboard/job/${id}/chat`)}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat ({conversationCount})
          </Button>
          {proposal && (
            <Button 
              size="sm" 
              variant={showSubmitAssistant ? "secondary" : "default"}
              onClick={() => setShowSubmitAssistant(!showSubmitAssistant)}
              className="gradient-primary text-primary-foreground"
            >
              <Send className="h-4 w-4 mr-1" />
              {showSubmitAssistant ? 'Hide Assistant' : 'Submit Helper'}
            </Button>
          )}
        </div>
      </div>

      {/* Submit Assistant */}
      {showSubmitAssistant && proposal && job && (
        <ProposalSubmitAssistant
          jobId={job.id}
          jobTitle={job.title}
          jobDescription={job.description || ''}
          proposals={{
            short: proposal.short || '',
            medium: proposal.medium || '',
            detailed: proposal.detailed || '',
          }}
          clientQuestions={clientQuestions}
          profileData={profile ? {
            title: profile.title,
            overview: profile.overview || undefined,
            skills: profile.skills || undefined,
            experience: profile.experience || undefined,
            hourlyRate: profile.hourly_rate || undefined,
            availability: profile.availability || undefined,
          } : undefined}
          onQuestionsUpdate={handleQuestionsUpdate}
        />
      )}

      {/* Profile Used */}
      {profile && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Profile used:</span>
              <span className="font-medium">{profile.title}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proposals */}
      {proposal ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Generated Proposals
            </CardTitle>
            <CardDescription>
              Copy any version to use in your Upwork application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="medium" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="short">Short</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
              </TabsList>
              
              {(['short', 'medium', 'detailed'] as const).map((tab) => {
                const isEditing = editingTab === tab;
                const content = tab === 'short' ? proposal.short : 
                               tab === 'medium' ? proposal.medium : 
                               proposal.detailed;
                
                return (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <div className="relative">
                      <div className="absolute top-2 right-2 z-10 flex gap-2">
                        {isEditing ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              disabled={isSaving}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={isSaving}
                            >
                              {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartEdit(tab)}
                              title="Edit proposal"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRegenerate(tab)}
                              title="Regenerate with different tone/style"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (content) {
                                  setTemplateContent(content);
                                  setSaveTemplateDialogOpen(true);
                                }
                              }}
                              title="Save as template"
                            >
                              <BookmarkPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(content, tab)}
                            >
                              {copiedTab === tab ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                      {isEditing ? (
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[400px] font-sans text-sm resize-none"
                          placeholder="Edit your proposal..."
                        />
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/30 rounded-lg border max-h-[400px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans text-sm">
                            {content || 'No proposal generated for this length.'}
                          </pre>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No proposal generated yet</p>
            <Button onClick={() => router.push(`/dashboard/job/${id}/generate`)}>
              Generate Proposal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Regenerate Dialog */}
      {job && (
        <ProposalRegenerateDialog
          open={regenerateDialogOpen}
          onOpenChange={setRegenerateDialogOpen}
          proposalLength={regenerateLength}
          jobId={job.id}
          jobTitle={job.title}
          jobDescription={job.description || ''}
          questions={getQuestionsWithAnswers()}
          clientName={job.client_name || undefined}
          applicationType={job.application_type || undefined}
          profileData={profile ? {
            title: profile.title,
            overview: profile.overview || undefined,
            skills: profile.skills || undefined,
            experience: profile.experience || undefined,
            hourlyRate: profile.hourly_rate || undefined,
            availability: profile.availability || undefined,
          } : null}
          onSuccess={handleRegenerateSuccess}
        />
      )}

      {/* Save Template Dialog */}
      <SaveTemplateDialog
        open={saveTemplateDialogOpen}
        onOpenChange={setSaveTemplateDialogOpen}
        content={templateContent}
      />

      {/* Job Description */}
      <JobDescriptionCard
        jobId={job.id}
        description={job.description}
        jobLink={job.job_link}
        budgetMin={job.budget_min}
        budgetMax={job.budget_max}
        jobType={job.job_type}
        clientName={job.client_name}
        onJobUpdated={() => {
          // Refetch job data
          supabase
            .from('jobs')
            .select('*')
            .eq('id', job.id)
            .single()
            .then(({ data }) => {
              if (data) setJob(data as unknown as Job);
            });
        }}
      />
    </div>
  );
}
