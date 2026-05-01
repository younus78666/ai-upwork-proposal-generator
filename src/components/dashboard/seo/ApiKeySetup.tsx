'use client'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Key, Check, Eye, EyeOff, ExternalLink, AlertTriangle } from 'lucide-react';

interface ApiKeySetupProps {
  onKeyChange: (key: string | null) => void;
}

export function ApiKeySetup({ onKeyChange }: ApiKeySetupProps) {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('openai_api_key');
    if (stored) {
      setSavedKey(stored);
      onKeyChange(stored);
    }
  }, [onKeyChange]);

  const handleSave = () => {
    if (!apiKey.startsWith('sk-')) {
      toast({
        title: 'Invalid API Key',
        description: 'OpenAI API keys should start with "sk-"',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setSavedKey(apiKey);
    onKeyChange(apiKey);
    setApiKey('');
    setIsEditing(false);
    toast({
      title: 'API Key Saved',
      description: 'Your OpenAI API key has been saved locally',
    });
  };

  const handleRemove = () => {
    localStorage.removeItem('openai_api_key');
    setSavedKey(null);
    onKeyChange(null);
    toast({
      title: 'API Key Removed',
      description: 'Your OpenAI API key has been removed',
    });
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return key.substring(0, 7) + '••••••••' + key.substring(key.length - 4);
  };

  if (savedKey && !isEditing) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            OpenAI API Key Configured
          </CardTitle>
          <CardDescription>
            Your API key is saved and ready to use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 p-2 bg-background rounded border">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono flex-1">
              {showKey ? savedKey : maskKey(savedKey)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKey(!showKey)}
              className="h-6 w-6 p-0"
            >
              {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Change Key
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive"
            >
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-500/20 bg-yellow-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          OpenAI API Key Required
        </CardTitle>
        <CardDescription>
          Add your OpenAI API key to use the Profile SEO Optimizer. Your key is stored locally in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">OpenAI API Key</Label>
          <Input
            id="apiKey"
            type={showKey ? 'text' : 'password'}
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally and never sent to our servers
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!apiKey}>
            Save API Key
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
        </div>
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          Get your API key from OpenAI
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>
    </Card>
  );
}
