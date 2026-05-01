'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Briefcase,
  MessageSquare,
  ExternalLink,
  Trash2,
  Plus,
  Loader2,
  Calendar,
  User as UserIcon,
  Copy,
  Check,
  Sparkles,
  Search,
  Filter,
  Target,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Conversation } from '@/types/database';

interface JobWithConversations {
  id: string;
  user_id: string;
  profile_id: string | null;
  title: string;
  description: string | null;
  job_link: string | null;
  client_name: string | null;
  application_type: 'applying' | 'invitation';
  status: string | null;
  source: string | null;
  budget_min: number | null;
  budget_max: number | null;
  job_type: string | null;
  eligibility_score: number | null;
  analysis: unknown;
  questions: Array<{ question: string; answer: string }>;
  answers: Array<{ question: string; answer: string }>;
  created_at: string;
  updated_at: string;
  conversations: Conversation[];
  hasProposal?: boolean;
}

type StatusFilter = 'all' | 'ready' | 'draft' | 'submitted';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; color: string }> = {
  ready: { label: 'Ready', variant: 'default', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  draft: { label: 'Draft', variant: 'secondary', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  submitted: { label: 'Submitted', variant: 'outline', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  responded: { label: 'Responded', variant: 'default', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

function getScoreProgressColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function JobsTab() {
  const [jobs, setJobs] = useState<JobWithConversations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [calculatingScore, setCalculatingScore] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const fetchJobs = async () => {
    if (!user) return;

    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch proposals to check which jobs have them
      const { data: proposalsData } = await supabase
        .from('proposals')
        .select('job_id, medium')
        .in('job_id', (jobsData || []).map(j => j.id));

      const proposalMap = new Map(proposalsData?.map(p => [p.job_id, p.medium]) || []);

      // Fetch conversations for each job
      const jobsWithConversations = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { data: convData } = await supabase
            .from('conversations')
            .select('*')
            .eq('job_id', job.id)
            .order('created_at', { ascending: true });

          return {
            ...job,
            application_type: job.application_type as 'applying' | 'invitation',
            questions: (job.questions || []) as Array<{ question: string; answer: string }>,
            answers: (job.answers || []) as Array<{ question: string; answer: string }>,
            conversations: (convData || []) as Conversation[],
            hasProposal: proposalMap.has(job.id),
          };
        })
      );

      setJobs(jobsWithConversations);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load jobs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger job monitoring on component mount
  const triggerJobMonitoring = async () => {
    try {
      setIsMonitoring(true);
      const { error } = await supabase.functions.invoke('monitor-jobs');
      if (error) {
        console.error('Monitor jobs error:', error);
      }
    } catch (error) {
      console.error('Error triggering job monitoring:', error);
    } finally {
      setIsMonitoring(false);
      // Refresh jobs after monitoring
      fetchJobs();
    }
  };

  useEffect(() => {
    fetchJobs();
    // Trigger monitoring on component mount (dashboard visit)
    if (user) {
      triggerJobMonitoring();
    }
  }, [user]);

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobId);
      if (error) throw error;

      setJobs(jobs.filter((job) => job.id !== jobId));
      toast({
        title: 'Job deleted',
        description: 'The job has been removed',
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job',
        variant: 'destructive',
      });
    }
  };

  const handleQuickCopy = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { data: proposal } = await supabase
        .from('proposals')
        .select('medium')
        .eq('job_id', jobId)
        .single();
      
      if (proposal?.medium) {
        await navigator.clipboard.writeText(proposal.medium);
        setCopiedId(jobId);
        setTimeout(() => setCopiedId(null), 2000);
        toast({ title: 'Proposal copied!' });
      }
    } catch (error) {
      console.error('Error copying proposal:', error);
    }
  };

  const handleCalculateScore = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    setCalculatingScore(jobId);
    try {
      const { data, error } = await supabase.functions.invoke('calculate-eligibility', {
        body: { job_id: jobId, user_id: user.id },
      });
      
      if (error) throw error;
      
      // Update local state
      setJobs(jobs.map(j => 
        j.id === jobId ? { ...j, eligibility_score: data.score } : j
      ));
      
      toast({
        title: `Score: ${data.score}%`,
        description: data.reasoning,
      });
    } catch (error) {
      console.error('Error calculating score:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate eligibility score',
        variant: 'destructive',
      });
    } finally {
      setCalculatingScore(null);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Count by status
  const readyCount = jobs.filter(j => j.status === 'ready').length;
  const draftCount = jobs.filter(j => j.status === 'draft').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first proposal to get started
        </p>
        <Button
          onClick={() => router.push('/dashboard/new-job')}
          className="gradient-primary text-primary-foreground btn-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Proposal
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Summary Banner */}
        {readyCount > 0 && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                <span className="font-medium">
                  {readyCount} job{readyCount !== 1 ? 's' : ''} ready to send
                </span>
                {isMonitoring && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 ml-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Checking availability...
                  </span>
                )}
                <Badge variant="secondary" className="ml-auto">
                  Auto-generated
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="ready">Ready ({readyCount})</SelectItem>
              <SelectItem value="draft">Draft ({draftCount})</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => triggerJobMonitoring()}
            disabled={isMonitoring}
            title="Refresh & check availability"
          >
            <RefreshCw className={`h-4 w-4 ${isMonitoring ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Jobs List */}
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => router.push(`/dashboard/job/${job.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {/* Eligibility Score */}
                    {job.eligibility_score !== null && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`flex items-center gap-1 font-bold ${getScoreColor(job.eligibility_score)}`}>
                            <Target className="h-4 w-4" />
                            <span>{job.eligibility_score}%</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Eligibility Score</p>
                          <Progress 
                            value={job.eligibility_score} 
                            className="h-2 w-24 mt-1"
                          />
                        </TooltipContent>
                      </Tooltip>
                    )}
                    
                    <h3 className="font-semibold truncate">{job.title}</h3>
                    
                    {/* Status Badge */}
                    {job.status && statusConfig[job.status] && (
                      <Badge 
                        variant="outline"
                        className={`shrink-0 ${statusConfig[job.status].color}`}
                      >
                        {statusConfig[job.status].label}
                      </Badge>
                    )}
                    
                    {/* Application Type Badge */}
                    <Badge
                      variant={job.application_type === 'invitation' ? 'default' : 'secondary'}
                      className="shrink-0"
                    >
                      {job.application_type === 'invitation' ? 'Invited' : 'Applied'}
                    </Badge>

                    {/* Source Badge */}
                    {job.source === 'gmail' && (
                      <Badge variant="outline" className="shrink-0 text-xs">
                        Gmail
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(job.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    
                    {job.client_name && (
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-3.5 w-3.5" />
                        <span>{job.client_name}</span>
                      </div>
                    )}

                    {job.budget_max && (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ${job.budget_min || 0} - ${job.budget_max}
                      </span>
                    )}

                    {job.conversations.length > 0 && (
                      <div className="flex items-center gap-1 text-primary">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {job.conversations.length} message{job.conversations.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Calculate Score Button */}
                  {job.eligibility_score === null && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleCalculateScore(job.id, e)}
                          disabled={calculatingScore === job.id}
                        >
                          {calculatingScore === job.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Target className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Calculate Eligibility Score</TooltipContent>
                    </Tooltip>
                  )}

                  {/* Quick Copy Button - only for jobs with proposals */}
                  {job.hasProposal && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary"
                      onClick={(e) => handleQuickCopy(job.id, e)}
                      title="Quick copy proposal"
                    >
                      {copiedId === job.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}

                  {job.job_link && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(job.job_link!, '_blank');
                      }}
                      title="Open job link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {job.conversations.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/job/${job.id}/chat`);
                      }}
                      title="Open chat"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteJob(job.id);
                    }}
                    title="Delete job"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredJobs.length === 0 && jobs.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No jobs match your search
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
