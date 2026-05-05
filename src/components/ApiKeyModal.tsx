'use client'
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Check, ExternalLink, Trash2, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APIProvider } from '@/types/proposal';
import { PROVIDERS, loadApiKey, loadApiModel, saveApiKey, clearApiKey, getActiveProvider, getProvider } from '@/config/providers';
import { useProposal } from '@/context/ProposalContext';

const PRIMARY_PROVIDERS: APIProvider[] = ['claude', 'openai', 'gemini', 'groq', 'nvidia', 'openrouter'];

const BADGE_COLORS: Record<string, string> = {
  'BEST QUALITY': 'bg-violet-600',
  'POPULAR': 'bg-blue-600',
  'FREE TIER': 'bg-green-600',
  'FASTEST': 'bg-orange-500',
  'FREE': 'bg-emerald-600',
};

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyModal({ open, onOpenChange }: ApiKeyModalProps) {
  const { selectedAPI, setSelectedAPI } = useProposal();

  const [selected, setSelected] = useState<APIProvider>(() => getActiveProvider() ?? 'claude');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [modelId, setModelId] = useState<string>('');

  // Sync state when modal opens
  useEffect(() => {
    if (!open) return;
    const active = getActiveProvider();
    if (active) {
      setSelected(active);
      setApiKey(loadApiKey(active));
      const cfg = getProvider(active);
      setModelId(loadApiModel(active) ?? cfg?.defaultModelId ?? '');
      setSaved(true);
    } else {
      setSelected('claude');
      setApiKey('');
      setModelId('');
      setSaved(false);
    }
    setShowKey(false);
  }, [open]);

  // When provider card is clicked, load its key (if any)
  const handleSelectProvider = (id: APIProvider) => {
    setSelected(id);
    setApiKey(loadApiKey(id));
    setSaved(!!loadApiKey(id));
    setShowKey(false);
    const cfg = getProvider(id);
    setModelId(loadApiModel(id) ?? cfg?.defaultModelId ?? '');
  };

  const handleSave = () => {
    if (!apiKey.trim()) return;
    const cfg = getProvider(selected);
    const modelToSave = cfg?.models ? (modelId || cfg.defaultModelId) : undefined;
    saveApiKey(selected, apiKey.trim(), modelToSave);
    setSelectedAPI(selected);
    setSaved(true);
    onOpenChange(false);
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setSaved(false);
  };

  const currentProvider = getProvider(selected);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            API Key
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground -mt-1 mb-1">
          Stored in this browser session only. Cleared automatically when you close the browser.
          Never sent to our servers. One provider at a time.
        </p>

        {/* Provider selection */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {PRIMARY_PROVIDERS.map(id => {
            const p = getProvider(id)!;
            const isSelected = selected === id;
            const isActive = getActiveProvider() === id;

            return (
              <button
                key={id}
                onClick={() => handleSelectProvider(id)}
                className={cn(
                  'relative rounded-lg border-2 p-3 text-left transition-all duration-150',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/40'
                )}
              >
                {p.badge && (
                  <span className={cn(
                    'absolute -top-2 right-2 px-1.5 py-0.5 text-white text-[9px] font-bold rounded-full tracking-wide',
                    BADGE_COLORS[p.badge] ?? 'bg-primary'
                  )}>
                    {p.badge}
                  </span>
                )}
                {isActive && !isSelected && (
                  <span className="absolute -top-2 left-2 px-1.5 py-0.5 bg-green-600 text-white text-[9px] font-bold rounded-full tracking-wide">
                    ACTIVE
                  </span>
                )}
                <div className="flex items-start gap-2">
                  <div className={cn(
                    'mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0',
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                  )}>
                    {isSelected && <Check className="h-2 w-2 text-primary-foreground" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.model}</p>
                    <p className="text-[10px] text-primary font-medium mt-0.5">{p.cost}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Key input */}
        {currentProvider && (
          <div className="space-y-3">
            <div className="relative">
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
                Get your {currentProvider.name} API key
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {currentProvider.models && currentProvider.models.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                  Model
                </label>
                <select
                  value={modelId || currentProvider.defaultModelId || ''}
                  onChange={e => { setModelId(e.target.value); setSaved(false); }}
                  className="w-full text-xs rounded-md border border-input bg-background px-2.5 py-1.5 font-mono"
                >
                  {currentProvider.models.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name}{m.context ? ` — ${m.context}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {saved && apiKey.trim() && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                {currentProvider.name} key active for this session
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          {saved && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-destructive hover:text-destructive gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            Save &amp; Use
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
