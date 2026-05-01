'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Send, 
  Copy, 
  Check, 
  Loader2, 
  MessageSquare,
  User,
  Bot,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useProposal } from '@/context/ProposalContext';
import { findFirstSavedKey } from '@/config/providers';
import { cn } from '@/lib/utils';

export function ChatInterface() {
  const { 
    conversations, 
    isGeneratingReply, 
    addClientMessage, 
    generateReply, 
    clearConversations,
    selectedAPI,
    jobTitle
  } = useProposal();
  
  const [clientMessage, setClientMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getStoredApiKey = (): string => findFirstSavedKey()?.key ?? '';

  const handleSendMessage = async () => {
    if (!clientMessage.trim()) return;
    
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      toast.error('API key not found. Please go back and re-enter your API key.');
      return;
    }
    
    const message = clientMessage.trim();
    setClientMessage('');
    addClientMessage(message);
    await generateReply(message, apiKey);
  };

  const handleCopy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast.success('Reply copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!jobTitle) return null;

  return (
    <Card className="border border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Continue Conversation</CardTitle>
          </div>
          {conversations.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversations}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <CardDescription>
          Paste client's reply and get AI-generated responses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Conversation History */}
        {conversations.length > 0 && (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {conversations.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 p-3 rounded-lg",
                  msg.type === 'client' 
                    ? "bg-muted/50" 
                    : "bg-primary/5 border border-primary/10"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  msg.type === 'client' 
                    ? "bg-muted-foreground/20" 
                    : "bg-primary/20"
                )}>
                  {msg.type === 'client' 
                    ? <User className="h-4 w-4 text-muted-foreground" />
                    : <Bot className="h-4 w-4 text-primary" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {msg.type === 'client' ? "Client's Message" : "Your Reply"}
                    </span>
                    {msg.type === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="h-7 px-2"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <Textarea
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste the client's message here..."
            className="min-h-[100px] resize-none"
            disabled={isGeneratingReply}
          />
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
            <Button
              onClick={handleSendMessage}
              disabled={!clientMessage.trim() || isGeneratingReply}
              size="sm"
            >
              {isGeneratingReply ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1.5" />
                  Generate Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
