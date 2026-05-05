'use client'
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { JobSession, ConversationMessage } from '@/types/proposal';
import { saveJobSession } from '@/utils/jobStorage';
import { findFirstSavedKey } from '@/config/providers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface StandaloneChatProps {
  session: JobSession;
  onSessionUpdate: (session: JobSession) => void;
}

export function StandaloneChat({ session, onSessionUpdate }: StandaloneChatProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>(
    () => (session.conversations || []).map(c => ({ ...c, timestamp: new Date(c.timestamp) }))
  );
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const savedKey = findFirstSavedKey();

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isGenerating) return;

    if (!savedKey) {
      toast.error('No API key found. Set one in API Key settings.');
      return;
    }

    const clientMsg: ConversationMessage = {
      id: crypto.randomUUID(),
      type: 'client',
      content: text,
      timestamp: new Date(),
    };

    const withClient = [...messages, clientMsg];
    setMessages(withClient);
    setInput('');
    setIsGenerating(true);

    try {
      const originalProposal =
        session.generatedProposals?.variants?.[0]?.content ||
        session.generatedProposals?.detailed ||
        session.generatedProposals?.medium ||
        '';

      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: {
          type: 'reply',
          clientMessage: text,
          jobTitle: session.jobTitle,
          jobDescription: session.jobDescription,
          jobAnalysis: session.jobAnalysis,
          generatedProposals: { medium: originalProposal },
          previousConversations: messages,
          clientName: session.clientName,
          userName: session.userName,
          apiProvider: savedKey.provider,
          apiKey: savedKey.key,

          apiModel: savedKey.model,
        },
      });

      if (error) {
        const msg =
          typeof (error as { context?: { error?: string } }).context?.error === 'string'
            ? (error as { context: { error: string } }).context.error
            : 'Failed to generate reply.';
        throw new Error(msg);
      }

      const replyMsg: ConversationMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      const allMessages = [...withClient, replyMsg];
      setMessages(allMessages);

      const updatedSession: JobSession = {
        ...session,
        conversations: allMessages,
        updatedAt: new Date(),
      };
      await saveJobSession(updatedSession);
      onSessionUpdate(updatedSession);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate reply.';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!savedKey) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <KeyRound className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">API key required</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add an API key to use the reply assistant
          </p>
        </div>
        <Link href="/api-key">
          <Button size="sm" variant="outline">
            Add API Key
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: '420px' }}>
      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            Paste a message from your client to generate a human-sounding reply
          </p>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              'flex flex-col gap-1',
              msg.type === 'client' ? 'items-start' : 'items-end'
            )}
          >
            <span className="text-[10px] text-muted-foreground px-1">
              {msg.type === 'client'
                ? session.clientName || 'Client'
                : session.userName || 'You'}
              {' · '}
              {format(new Date(msg.timestamp), 'h:mm a')}
            </span>
            <div
              className={cn(
                'max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
                msg.type === 'client'
                  ? 'bg-muted text-foreground rounded-tl-sm'
                  : 'bg-primary text-primary-foreground rounded-tr-sm'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-muted-foreground px-1">
              {session.userName || 'You'} · writing...
            </span>
            <div className="bg-primary/15 rounded-2xl rounded-tr-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div className="border-t bg-background p-3 flex gap-2 items-end">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste client's message here..."
          className="resize-none text-sm min-h-[60px] max-h-[120px]"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isGenerating}
          size="icon"
          className="h-10 w-10 shrink-0"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
