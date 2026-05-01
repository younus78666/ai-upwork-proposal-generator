'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, RefreshCw, Unlink, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface GmailConnection {
  id: string;
  email: string;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
}

export function GmailIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connection, setConnection] = useState<GmailConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConnection();
    }
  }, [user]);

  // Listen for OAuth popup messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'gmail-oauth-success') {
        toast({
          title: 'Gmail Connected',
          description: 'Your Gmail account has been connected successfully.',
        });
        fetchConnection();
        setIsConnecting(false);
      } else if (event.data?.type === 'gmail-oauth-error') {
        toast({
          title: 'Connection Failed',
          description: event.data.error || 'Failed to connect Gmail account.',
          variant: 'destructive',
        });
        setIsConnecting(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast]);

  const fetchConnection = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('gmail_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setConnection(data);
    } catch (error) {
      console.error('Error fetching Gmail connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!user) return;

    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-auth', {
        body: {
          user_id: user.id,
          redirect_url: window.location.origin + '/dashboard',
        },
      });

      if (error) throw error;

      // Open OAuth popup
      const popup = window.open(
        data.url,
        'gmail-oauth',
        'width=600,height=700,left=200,top=100'
      );

      // Check if popup was blocked
      if (!popup) {
        toast({
          title: 'Popup Blocked',
          description: 'Please allow popups to connect your Gmail account.',
          variant: 'destructive',
        });
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Error initiating Gmail auth:', error);
      toast({
        title: 'Error',
        description: 'Failed to start Gmail authentication.',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    if (!user) return;

    setIsSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-sync', {
        body: { user_id: user.id },
      });

      if (error) throw error;

      toast({
        title: 'Sync Complete',
        description: `Found ${data.total_emails} emails. Created ${data.jobs_created} new jobs.`,
      });

      // Refresh connection to get updated last_sync_at
      fetchConnection();
    } catch (error) {
      console.error('Error syncing Gmail:', error);
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Failed to sync Gmail.',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connection) return;

    try {
      const { error } = await supabase
        .from('gmail_connections')
        .update({ is_active: false })
        .eq('id', connection.id);

      if (error) throw error;

      setConnection(null);
      toast({
        title: 'Gmail Disconnected',
        description: 'Your Gmail account has been disconnected.',
      });
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect Gmail account.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle>Gmail Integration</CardTitle>
        </div>
        <CardDescription>
          Connect your Gmail to automatically import Upwork job notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connection ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">{connection.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {connection.last_sync_at
                      ? `Last synced: ${new Date(connection.last_sync_at).toLocaleString()}`
                      : 'Never synced'}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Connected
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-1"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Unlink className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disconnect Gmail?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will stop importing new Upwork jobs from your Gmail.
                      Existing jobs will not be affected.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisconnect}>
                      Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Connect Gmail Account
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
