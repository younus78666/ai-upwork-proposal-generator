'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  History, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Clock,
  MessageSquare
} from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import { JobSession } from '@/types/proposal';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function JobSessionsList() {
  const { getAllSessions, loadSession, deleteSession, currentSessionId, setCurrentPage } = useProposal();
  const [sessions, setSessions] = useState<JobSession[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      const allSessions = await getAllSessions();
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchSessions();
    }
  }, [isExpanded]);

  const handleLoad = async (sessionId: string) => {
    setIsLoading(true);
    try {
      await loadSession(sessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    await deleteSession(sessionId);
    fetchSessions();
  };

  const handleQuickChat = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await loadSession(sessionId);
      setCurrentPage('output');
    } finally {
      setIsLoading(false);
    }
  };

  if (sessions.length === 0 && !isExpanded) {
    return null;
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
      >
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            My Saved Jobs
          </span>
          {sessions.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({sessions.length})
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved jobs yet. Your proposals will be saved automatically.
            </p>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  currentSessionId === session.id && "border-primary"
                )}
                onClick={() => handleLoad(session.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {session.jobTitle || 'Untitled Job'}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(session.updatedAt, 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        {session.clientName && (
                          <span className="text-xs text-muted-foreground block">
                            Client: {session.clientName}
                          </span>
                        )}
                        {session.conversations && session.conversations.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <MessageSquare className="h-3 w-3 text-primary" />
                            <span className="text-xs text-primary font-medium">
                              {session.conversations.length} message{session.conversations.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {currentSessionId === session.id && (
                        <span className="text-xs text-primary font-medium px-2">
                          Active
                        </span>
                      )}
                      {session.conversations && session.conversations.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleQuickChat(e, session.id)}
                          className="h-8 w-8 p-0 text-primary hover:text-primary/80"
                          title="Open chat"
                          disabled={isLoading}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(e, session.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
