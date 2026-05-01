'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Eye, EyeOff, Check, ExternalLink, Trash2, KeyRound,
  ArrowLeft, Sparkles, ShieldCheck, Clock, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APIProvider } from '@/types/proposal';
import {
  PROVIDERS, loadApiKey, saveApiKey, clearApiKey,
  getActiveProvider, getProvider,
} from '@/config/providers';
import { useProposal } from '@/context/ProposalContext';

const PRIMARY_PROVIDERS: APIProvider[] = ['claude', 'openai', 'gemini', 'groq'];

const BADGE_COLORS: Record<string, string> = {
  'BEST QUALITY': 'bg-violet-600',
  'POPULAR': 'bg-blue-600',
  'FREE TIER': 'bg-green-600',
  'FASTEST': 'bg-orange-500',
};

export default function ApiKeyPage() {
  const router = useRouter();
  const { setSelectedAPI } = useProposal();

  const [selected, setSelected] = useState<APIProvider>(() => getActiveProvider() ?? 'claude');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const active = getActiveProvider();
    if (active) {
      setSelected(active);
      setApiKey(loadApiKey(active));
      setSaved(true);
    }
  }, []);

  const handleSelectProvider = (id: APIProvider) => {
    setSelected(id);
    const existing = loadApiKey(id);
    setApiKey(existing);
    setSaved(!!existing);
    setShowKey(false);
  };

  const handleSave = () => {
    if (!apiKey.trim()) return;
    saveApiKey(selected, apiKey.trim());
    setSelectedAPI(selected);
    setSaved(true);
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setSaved(false);
  };

  const handleSaveAndGenerate = () => {
    handleSave();
    router.push('/');
  };

  const currentProvider = getProvider(selected);
  const activeProvider = getActiveProvider();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="w-full border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/Favicon.png" alt="logo" className="h-9 w-9 rounded-lg shadow-md" />
            <span className="font-semibold text-foreground hidden sm:inline">Ultimate Freelancers</span>
          </Link>
          <div className="flex-1" />
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <KeyRound className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Add Your API Key</h1>
          <p className="text-muted-foreground">
            Pick an AI provider, paste your key, and start generating winning proposals.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Never stored on our servers
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-500" />
            Cleared when browser closes
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-blue-500" />
            One provider at a time
          </span>
        </div>

        {/* Active key banner */}
        {activeProvider && (
          <div className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
            <p className="text-sm font-medium flex-1">
              {getProvider(activeProvider)?.name} is active for this session
            </p>
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive gap-1.5 h-7 text-xs">
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        )}

        {/* Provider grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PRIMARY_PROVIDERS.map(id => {
            const p = getProvider(id)!;
            const isSelected = selected === id;
            const isActive = activeProvider === id;

            return (
              <button
                key={id}
                onClick={() => handleSelectProvider(id)}
                className={cn(
                  'relative rounded-xl border-2 p-4 text-left transition-all duration-150',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/40 bg-card'
                )}
              >
                {p.badge && (
                  <span className={cn(
                    'absolute -top-2.5 right-3 px-2 py-0.5 text-white text-[10px] font-bold rounded-full tracking-wide',
                    BADGE_COLORS[p.badge] ?? 'bg-primary'
                  )}>
                    {p.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -top-2.5 left-3 px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded-full tracking-wide">
                    ACTIVE
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <div className={cn(
                    'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                  )}>
                    {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.model}</p>
                    <p className="text-xs text-primary font-medium mt-1">{p.cost}</p>
                    <ul className="mt-1.5 space-y-0.5">
                      {p.features.slice(0, 2).map(f => (
                        <li key={f} className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <span className="text-green-500">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Key input card */}
        {currentProvider && (
          <Card className="border shadow-sm mb-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{currentProvider.name} API Key</h3>
                {saved && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Active this session
                  </span>
                )}
              </div>

              <div className="relative mb-3">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => { setApiKey(e.target.value); setSaved(false); }}
                  placeholder={currentProvider.keyPlaceholder}
                  className="pr-10 font-mono text-sm"
                  onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {!apiKey.trim() && (
                <a
                  href={currentProvider.keyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Get your free {currentProvider.name} API key
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        )}

        {/* Privacy note */}
        <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-4 py-3 border border-border/40 mb-6">
          Your key is stored in your browser session only and never sent to our servers.
          It is automatically removed when you close this browser tab or window.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!apiKey.trim() || saved}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            {saved ? 'Key saved' : 'Save key'}
          </Button>
          <Button
            variant="hero"
            onClick={handleSaveAndGenerate}
            disabled={!apiKey.trim()}
            className="flex-1 gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {saved ? 'Go generate proposals' : 'Save & start generating'}
          </Button>
        </div>
      </main>
    </div>
  );
}
