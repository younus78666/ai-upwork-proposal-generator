'use client'
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Loader2,
  Send,
  Copy,
  Check,
  ArrowLeft,
  User,
  Bot,
  Trash2,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  message_type: string;
  content: string;
  created_at: string | null;
}

interface Job {
  id: string;
  title: string;
  description: string | null;
  client_name: string | null;
  profile_id: string | null;
  outcome: string | null;
}

interface Profile {
  title: string;
  overview: string | null;
  skills: string[];
  experience: string | null;
  hourly_rate: number | null;
}

interface Proposal {
  detailed: string | null;
  medium: string | null;
  short: string | null;
}

interface WinProbability {
  probability: number;
  stage: string;
  positive_signals: string[];
  negative_signals: string[];
  next_action: string;
  analysis: string;
}

const STAGES = ['Applied', 'Interested', 'Engaged', 'Negotiating', 'Close to Hire'];

function getProbabilityColor(p: number) {
  if (p >= 60) return { text: 'text-green-600', bg: 'bg-green-600', light: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-700' };
  if (p >= 35) return { text: 'text-amber-600', bg: 'bg-amber-500', light: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700' };
  return { text: 'text-red-600', bg: 'bg-red-500', light: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700' };
}

function getProbabilityLabel(p: number) {
  if (p >= 75) return 'Very likely to win';
  if (p >= 60) return 'Good chance';
  if (p >= 40) return 'Possible';
  if (p >= 25) return 'Needs improvement';
  return 'At risk';
}

export function JobChatTab() {
  const params = useParams()
  const id = params?.id as string;
  const { user } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [job, setJob] = useState<Job | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [winData, setWinData] = useState<WinProbability | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!id || !user) return;
    fetchData();
  }, [id, user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('user_id', user!.id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      if (jobData.profile_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('title, overview, skills, experience, hourly_rate')
          .eq('id', jobData.profile_id)
          .single();

        if (profileData) {
          setProfile({
            ...profileData,
            skills: Array.isArray(profileData.skills) ? profileData.skills as string[] : [],
          });
        }
      }

      const { data: proposalData } = await supabase
        .from('proposals')
        .select('detailed, medium, short')
        .eq('job_id', id)
        .single();

      if (proposalData) setProposal(proposalData);

      const { data: conversationsData } = await supabase
        .from('conversations')
        .select('*')
        .eq('job_id', id)
        .order('created_at', { ascending: true });

      if (conversationsData) setMessages(conversationsData);

      // Load latest win probability log if exists
      const { data: latestLog } = await supabase
        .from('win_probability_logs')
        .select('*')
        .eq('job_id', id)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestLog) {
        setWinData({
          probability: latestLog.probability,
          stage: latestLog.stage,
          positive_signals: (latestLog.positive_signals as string[]) || [],
          negative_signals: (latestLog.negative_signals as string[]) || [],
          next_action: latestLog.next_action || '',
          analysis: latestLog.analysis || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !job || isSending) return;

    const clientMessage = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      // Save client message
      const { data: clientMsg, error: clientErr } = await supabase
        .from('conversations')
        .insert({ job_id: job.id, message_type: 'client', content: clientMessage })
        .select()
        .single();

      if (clientErr) throw clientErr;
      setMessages(prev => [...prev, clientMsg]);

      // Generate reply
      const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
      const response = await supabase.functions.invoke('generate-reply', {
        body: {
          type: 'reply',
          clientMessage,
          jobTitle: job.title,
          jobDescription: job.description,
          generatedProposals: proposal,
          previousConversations: messages.map(m => ({ type: m.message_type, content: m.content })),
          clientName: job.client_name,
          userName,
          profileData: profile ? {
            title: profile.title,
            overview: profile.overview,
            skills: profile.skills,
            experience: profile.experience,
            hourlyRate: profile.hourly_rate,
          } : null,
        },
      });

      if (response.error) throw response.error;

      const generatedReply = response.data?.reply;
      if (!generatedReply) throw new Error('No reply generated');

      // Save assistant reply
      const { data: assistantMsg, error: assistantErr } = await supabase
        .from('conversations')
        .insert({ job_id: job.id, message_type: 'assistant', content: generatedReply })
        .select()
        .single();

      if (assistantErr) throw assistantErr;
      setMessages(prev => [...prev, assistantMsg]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to generate reply. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCalculateWinProbability = async () => {
    if (!job || isCalculating) return;
    setIsCalculating(true);

    try {
      const proposalText = proposal?.medium || proposal?.short || proposal?.detailed || '';
      const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';

      const response = await supabase.functions.invoke('calculate-win-probability', {
        body: {
          jobTitle: job.title,
          jobDescription: job.description,
          proposalText,
          conversations: messages.map(m => ({ type: m.message_type, content: m.content, created_at: m.created_at })),
          clientName: job.client_name,
          userName,
        },
      });

      if (response.error) throw response.error;

      const result = response.data as WinProbability;
      setWinData(result);

      // Save to database
      await supabase.from('win_probability_logs').insert({
        user_id: user!.id,
        job_id: job.id,
        probability: result.probability,
        stage: result.stage,
        positive_signals: result.positive_signals,
        negative_signals: result.negative_signals,
        next_action: result.next_action,
        analysis: result.analysis,
      });

      toast.success('Win probability calculated');
    } catch (error) {
      console.error('Error calculating win probability:', error);
      toast.error('Failed to calculate. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSendReport = async () => {
    if (!user || isSendingReport) return;
    setIsSendingReport(true);

    try {
      const response = await supabase.functions.invoke('send-win-report', {
        body: {
          user_id: user.id,
          user_email: user.email,
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        },
      });

      if (response.error) throw response.error;

      const report = response.data?.report;
      if (report?.emailSent) {
        toast.success(`Report sent to ${user.email}`);
      } else {
        toast.success(`Report generated: ${report?.totalJobs || 0} proposals, ${report?.winRate || 0}% win rate`);
      }
    } catch (error) {
      console.error('Error sending report:', error);
      toast.error('Failed to generate report.');
    } finally {
      setIsSendingReport(false);
    }
  };

  const handleCopy = async (msgId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(msgId);
      toast.success('Copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleClearChat = async () => {
    if (!job) return;
    try {
      const { error } = await supabase.from('conversations').delete().eq('job_id', job.id);
      if (error) throw error;
      setMessages([]);
      setWinData(null);
      toast.success('Chat cleared');
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error('Failed to clear chat');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Job not found</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  const colors = winData ? getProbabilityColor(winData.probability) : null;
  const stageIndex = winData ? STAGES.indexOf(winData.stage) : -1;

  return (
    <div className="max-w-3xl mx-auto space-y-4">

      {/* Win Probability Panel */}
      <Card className={cn('border', winData && colors ? colors.light : 'border-border')}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              Win Probability
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendReport}
                disabled={isSendingReport}
              >
                {isSendingReport ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                ) : (
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                )}
                Email Report
              </Button>
              <Button
                size="sm"
                onClick={handleCalculateWinProbability}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                ) : (
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                )}
                {winData ? 'Recalculate' : 'Calculate'}
              </Button>
            </div>
          </div>
        </CardHeader>

        {winData && colors ? (
          <CardContent className="space-y-4">
            {/* Score + Stage */}
            <div className="flex items-center gap-6">
              <div className="text-center min-w-[80px]">
                <p className={cn('text-5xl font-bold', colors.text)}>{winData.probability}%</p>
                <p className={cn('text-xs font-medium mt-1', colors.text)}>{getProbabilityLabel(winData.probability)}</p>
              </div>
              <div className="flex-1 space-y-2">
                {/* Progress bar */}
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', colors.bg)}
                    style={{ width: `${winData.probability}%` }}
                  />
                </div>
                {/* Stage pipeline */}
                <div className="flex items-center gap-1 flex-wrap">
                  {STAGES.map((s, i) => (
                    <div key={s} className="flex items-center gap-1">
                      <span className={cn(
                        'text-[11px] px-2 py-0.5 rounded-full font-medium',
                        i === stageIndex
                          ? colors.badge
                          : i < stageIndex
                          ? 'bg-muted text-muted-foreground line-through'
                          : 'text-muted-foreground'
                      )}>
                        {s}
                      </span>
                      {i < STAGES.length - 1 && (
                        <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis */}
            {winData.analysis && (
              <p className="text-sm text-muted-foreground border-t pt-3">{winData.analysis}</p>
            )}

            {/* Signals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {winData.positive_signals.length > 0 && (
                <div className="space-y-1">
                  {winData.positive_signals.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {winData.negative_signals.length > 0 && (
                <div className="space-y-1">
                  {winData.negative_signals.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-sm">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Next action */}
            {winData.next_action && (
              <div className={cn('flex items-start gap-2 p-3 rounded-lg border text-sm', colors.light)}>
                <TrendingUp className={cn('h-4 w-4 mt-0.5 shrink-0', colors.text)} />
                <div>
                  <span className="font-medium">Next move: </span>
                  <span className="text-muted-foreground">{winData.next_action}</span>
                </div>
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Paste the client's reply below, generate a response, then hit "Calculate" to see your win probability and what to do next.
            </p>
          </CardContent>
        )}
      </Card>

      {/* Chat Card */}
      <Card className="h-[calc(100vh-26rem)] min-h-[400px] flex flex-col">
        <CardHeader className="border-b pb-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/job/${id}`)}
                className="-ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Job
              </Button>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-primary" />
                {job.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                {job.client_name && <Badge variant="outline" className="text-xs">{job.client_name}</Badge>}
                {messages.length > 0 && (
                  <span className="text-xs text-muted-foreground">{Math.ceil(messages.length / 2)} exchange{Math.ceil(messages.length / 2) !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 overflow-hidden p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                <MessageSquare className="h-10 w-10 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">No messages yet</p>
                <p className="text-xs text-muted-foreground/60">Paste the client's reply to generate a professional response</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3 p-3 rounded-lg',
                    msg.message_type === 'client' ? 'bg-muted/50' : 'bg-primary/5 border border-primary/10'
                  )}
                >
                  <div className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    msg.message_type === 'client' ? 'bg-muted-foreground/15' : 'bg-primary/15'
                  )}>
                    {msg.message_type === 'client'
                      ? <User className="h-3.5 w-3.5 text-muted-foreground" />
                      : <Bot className="h-3.5 w-3.5 text-primary" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {msg.message_type === 'client' ? (job.client_name || 'Client') : 'Your Reply'}
                      </span>
                      <div className="flex items-center gap-1">
                        {msg.created_at && (
                          <span className="text-[10px] text-muted-foreground/60">
                            {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        {msg.message_type === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="h-6 w-6 p-0"
                          >
                            {copiedId === msg.id
                              ? <Check className="h-3 w-3 text-green-500" />
                              : <Copy className="h-3 w-3" />
                            }
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 space-y-2 shrink-0">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Paste ${job.client_name || 'the client'}'s message here...`}
              className="min-h-[72px] resize-none text-sm"
              disabled={isSending}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Enter to send &bull; Shift+Enter for new line</p>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                size="sm"
              >
                {isSending ? (
                  <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Generating...</>
                ) : (
                  <><Send className="h-3.5 w-3.5 mr-1.5" />Generate Reply</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
