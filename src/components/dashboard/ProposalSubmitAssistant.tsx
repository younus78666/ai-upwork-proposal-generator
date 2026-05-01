'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientQuestion {
  question: string;
  answer: string;
  suggested_answer?: string;
}

interface ProposalSubmitAssistantProps {
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  proposals: {
    short: string;
    medium: string;
    detailed: string;
  };
  clientQuestions: ClientQuestion[];
  profileData?: {
    title?: string;
    overview?: string;
    skills?: string[];
    experience?: string;
    hourlyRate?: number;
    availability?: string;
  };
  onQuestionsUpdate?: (questions: ClientQuestion[]) => void;
}

export function ProposalSubmitAssistant({
  jobId,
  jobTitle,
  jobDescription,
  proposals,
  clientQuestions,
  profileData,
  onQuestionsUpdate,
}: ProposalSubmitAssistantProps) {
  const [selectedProposal, setSelectedProposal] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [questions, setQuestions] = useState<ClientQuestion[]>(clientQuestions);
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  const handleCopyProposal = async () => {
    const proposalText = proposals[selectedProposal];
    await navigator.clipboard.writeText(proposalText);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
    toast({ title: 'Proposal copied!' });
  };

  const handleCopyAnswer = async (index: number) => {
    const answer = questions[index].answer || questions[index].suggested_answer || '';
    await navigator.clipboard.writeText(answer);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    const proposalText = proposals[selectedProposal];
    const answersText = questions
      .map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer || q.suggested_answer || ''}`)
      .join('\n\n');
    
    const fullText = `${proposalText}\n\n---\nQUESTION ANSWERS:\n${answersText}`;
    await navigator.clipboard.writeText(fullText);
    toast({ title: 'Proposal and all answers copied!' });
  };

  const handleRegenerateAnswer = async (index: number) => {
    setRegeneratingIndex(index);
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: {
          type: 'fill_question',
          jobTitle,
          jobDescription,
          questionToFill: questions[index].question,
          proposalContext: proposals[selectedProposal],
          previousAnswers: questions.slice(0, index).map(q => ({
            question: q.question,
            answer: q.answer || q.suggested_answer,
          })),
          profileData,
        },
      });

      if (error) throw error;

      const newQuestions = [...questions];
      newQuestions[index] = {
        ...newQuestions[index],
        answer: data.answer,
        suggested_answer: data.answer,
      };
      setQuestions(newQuestions);
      onQuestionsUpdate?.(newQuestions);
    } catch (error) {
      console.error('Error regenerating answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate answer',
        variant: 'destructive',
      });
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleAnswerChange = (index: number, newAnswer: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], answer: newAnswer };
    setQuestions(newQuestions);
    onQuestionsUpdate?.(newQuestions);
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    setIsChatLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: {
          type: 'fill_question',
          jobTitle,
          jobDescription,
          questionToFill: chatInput,
          proposalContext: proposals[selectedProposal],
          previousAnswers: questions.map(q => ({
            question: q.question,
            answer: q.answer || q.suggested_answer,
          })),
          profileData,
        },
      });

      if (error) throw error;
      setChatResponse(data.answer);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response',
        variant: 'destructive',
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopyChatResponse = async () => {
    await navigator.clipboard.writeText(chatResponse);
    toast({ title: 'Response copied!' });
  };

  return (
    <div className="space-y-6">
      {/* Proposal Selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your Proposal</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyAll}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedProposal} onValueChange={(v) => setSelectedProposal(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="short">Short</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>
            
            {(['short', 'medium', 'detailed'] as const).map((length) => (
              <TabsContent key={length} value={length}>
                <div className="relative">
                  <ScrollArea className="h-[250px] rounded-md border p-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
                      {proposals[length]}
                    </div>
                  </ScrollArea>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleCopyProposal}
                  >
                    {copiedProposal ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Client Questions */}
      {questions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Client Questions
              <Badge variant="secondary">{questions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{q.question}</p>
                  <Badge variant="outline" className="shrink-0">Q{index + 1}</Badge>
                </div>
                
                <Textarea
                  value={q.answer || q.suggested_answer || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Your answer..."
                  className="min-h-[80px] text-sm"
                />
                
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRegenerateAnswer(index)}
                    disabled={regeneratingIndex === index}
                  >
                    {regeneratingIndex === index ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Regenerate</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyAnswer(index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="ml-2">Copy</span>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chat Assistant */}
      <Card>
        <CardHeader 
          className="pb-3 cursor-pointer"
          onClick={() => setShowChat(!showChat)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Ask AI for Help
            </CardTitle>
            {showChat ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        
        {showChat && (
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste any question from the Upwork form and get a contextual answer based on your proposal and profile.
            </p>
            
            <div className="flex gap-2">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder='e.g., "What is your availability for this project?" or "Describe a similar project you have worked on"'
                className="min-h-[60px]"
              />
              <Button
                onClick={handleChatSubmit}
                disabled={isChatLoading || !chatInput.trim()}
                className="shrink-0"
              >
                {isChatLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {chatResponse && (
              <div className="relative border rounded-lg p-4 bg-muted/30">
                <p className="text-sm whitespace-pre-wrap pr-10">{chatResponse}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={handleCopyChatResponse}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
