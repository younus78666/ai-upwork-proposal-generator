import { APIProvider } from '@/types/proposal';

export interface ProviderConfig {
  id: APIProvider;
  name: string;
  model: string;
  badge?: string;       // e.g. "RECOMMENDED" | "FREE TIER" | "FASTEST"
  cost: string;
  features: string[];
  keyPlaceholder: string;
  keyUrl: string;
  keyDocs: string;
  storageKey: string;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'claude',
    name: 'Claude',
    model: 'Sonnet 4.6',
    badge: 'BEST QUALITY',
    cost: '~$0.03/proposal',
    features: ['Best instruction-following', 'Most human-sounding output', 'Strict no-AI-tone rules'],
    keyPlaceholder: 'sk-ant-api03-...',
    keyUrl: 'https://console.anthropic.com/',
    keyDocs: 'https://docs.anthropic.com/en/api/getting-started',
    storageKey: 'jwc_key_claude',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    model: 'GPT-4o',
    badge: 'POPULAR',
    cost: '~$0.04/proposal',
    features: ['Most widely tested', 'Reliable & consistent', 'Great for creative writing'],
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyDocs: 'https://platform.openai.com/docs/quickstart',
    storageKey: 'jwc_key_openai',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    model: 'Gemini 2.5 Flash',
    badge: 'FREE TIER',
    cost: 'Free tier available',
    features: ['Google AI Studio free tier', 'Fast responses', '1M token context'],
    keyPlaceholder: 'AIzaSy...',
    keyUrl: 'https://aistudio.google.com/apikey',
    keyDocs: 'https://ai.google.dev/gemini-api/docs/quickstart',
    storageKey: 'jwc_key_gemini',
  },
  {
    id: 'groq',
    name: 'Groq',
    model: 'Llama 3.3 70B',
    badge: 'FASTEST',
    cost: 'Free tier available',
    features: ['Fastest inference speed', 'Free tier (6000 req/day)', 'Llama 3.3 70B quality'],
    keyPlaceholder: 'gsk_...',
    keyUrl: 'https://console.groq.com/keys',
    keyDocs: 'https://console.groq.com/docs/quickstart',
    storageKey: 'jwc_key_groq',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    model: 'DeepSeek V3',
    badge: 'CHEAPEST',
    cost: '~$0.003/proposal',
    features: ['10x cheaper than GPT-4o', 'Strong reasoning', 'OpenAI-compatible'],
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://platform.deepseek.com/api_keys',
    keyDocs: 'https://api-docs.deepseek.com/',
    storageKey: 'jwc_key_deepseek',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    model: 'Sonar Pro',
    cost: '~$0.03/proposal',
    features: ['Real-time web search', 'Up-to-date market info', 'Good for research-heavy jobs'],
    keyPlaceholder: 'pplx-...',
    keyUrl: 'https://www.perplexity.ai/settings/api',
    keyDocs: 'https://docs.perplexity.ai/api-reference/chat-completions',
    storageKey: 'jwc_key_perplexity',
  },
  {
    id: 'kimi',
    name: 'Kimi (Moonshot)',
    model: 'moonshot-v1-128k',
    cost: '~$0.02/proposal',
    features: ['128K context window', 'Great for long job posts', 'Affordable pricing'],
    keyPlaceholder: 'sk-...',
    keyUrl: 'https://platform.moonshot.cn/',
    keyDocs: 'https://platform.moonshot.cn/docs/api/chat',
    storageKey: 'jwc_key_kimi',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    model: 'Mistral Large',
    cost: '~$0.02/proposal',
    features: ['European privacy standards', 'Strong multilingual support', 'Fast & affordable'],
    keyPlaceholder: '...',
    keyUrl: 'https://console.mistral.ai/api-keys/',
    keyDocs: 'https://docs.mistral.ai/getting-started/quickstart/',
    storageKey: 'jwc_key_mistral',
  },
  {
    id: 'grok',
    name: 'xAI Grok',
    model: 'Grok 2',
    cost: '~$0.03/proposal',
    features: ['Real-time X/Twitter data', 'Strong creative writing', 'Elon-backed AI'],
    keyPlaceholder: 'xai-...',
    keyUrl: 'https://console.x.ai/',
    keyDocs: 'https://docs.x.ai/docs/overview',
    storageKey: 'jwc_key_grok',
  },
];

export function getProvider(id: APIProvider): ProviderConfig | undefined {
  return PROVIDERS.find(p => p.id === id);
}

// sessionStorage helpers — key lives only for this browser session (cleared on close)
// Only one provider key is stored at a time.

const SESSION_KEY = 'jwc_session_api';

interface SessionEntry { provider: APIProvider; value: string }

function readSession(): SessionEntry | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionEntry;
  } catch { return null; }
}

export function loadApiKey(provider: APIProvider): string {
  const entry = readSession();
  return entry?.provider === provider ? entry.value : '';
}

/** Save a key. Clears any previously stored key (only one API at a time). */
export function saveApiKey(provider: APIProvider, key: string): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ provider, value: key }));
}

export function clearApiKey(_provider?: APIProvider): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function findFirstSavedKey(): { provider: APIProvider; key: string } | null {
  const entry = readSession();
  if (!entry?.value) return null;
  return { provider: entry.provider, key: entry.value };
}

export function hasAnyApiKey(): boolean {
  return !!readSession()?.value;
}

export function getActiveProvider(): APIProvider | null {
  return readSession()?.provider ?? null;
}
