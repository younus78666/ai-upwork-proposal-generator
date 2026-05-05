import { APIProvider } from '@/types/proposal';

export interface ModelOption {
  id: string;        // exact model id passed to the provider API
  name: string;      // human label
  badge?: string;    // e.g. "FREE" | "FASTEST"
  context?: string;  // e.g. "128K"
}

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
  /** When set, the user picks one of these. Otherwise the default `model` is used. */
  models?: ModelOption[];
  /** Default model id when models[] is set. Falls back to models[0].id. */
  defaultModelId?: string;
}

const OPENROUTER_FREE_MODELS: ModelOption[] = [
  { id: 'meta-llama/llama-3.3-70b-instruct:free',  name: 'Llama 3.3 70B',         badge: 'FREE', context: '128K' },
  { id: 'deepseek/deepseek-chat-v3-0324:free',     name: 'DeepSeek V3',           badge: 'FREE', context: '64K'  },
  { id: 'google/gemini-2.0-flash-exp:free',        name: 'Gemini 2.0 Flash',      badge: 'FREE', context: '1M'   },
  { id: 'qwen/qwen-2.5-72b-instruct:free',         name: 'Qwen 2.5 72B',          badge: 'FREE', context: '128K' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free',   name: 'Llama 3.2 3B',          badge: 'FREE', context: '128K' },
  { id: 'mistralai/mistral-7b-instruct:free',      name: 'Mistral 7B',            badge: 'FREE', context: '32K'  },
];

const NVIDIA_MODELS: ModelOption[] = [
  // Newest 2026 frontier models (top of list — picked first)
  { id: 'deepseek-ai/deepseek-v4-pro',                  name: 'DeepSeek V4 Pro',        badge: 'NEW',  context: '1M'   },
  { id: 'deepseek-ai/deepseek-v4-flash',                name: 'DeepSeek V4 Flash',      badge: 'NEW',  context: '1M'   },
  { id: 'moonshotai/kimi-k2.6',                         name: 'Kimi K2.6',              badge: 'NEW',  context: '246K' },
  { id: 'z-ai/glm-5.1',                                 name: 'GLM 5.1',                badge: 'NEW',  context: '128K' },
  { id: 'z-ai/glm-4.7',                                 name: 'GLM 4.7',                badge: 'FREE', context: '128K' },
  { id: 'minimaxai/minimax-m2.7',                       name: 'MiniMax M2.7 (230B)',    badge: 'FREE', context: '128K' },
  { id: 'mistralai/mistral-medium-3.5-128b',            name: 'Mistral Medium 3.5',     badge: 'NEW',  context: '399K' },
  { id: 'mistralai/mistral-small-4-119b-2603',          name: 'Mistral Small 4 119B',   badge: 'NEW',  context: '256K' },
  { id: 'nvidia/nemotron-3-super-120b-a12b',            name: 'Nemotron 3 Super 120B',  badge: 'NEW',  context: '1M'   },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning',name: 'Nemotron 3 Nano Omni',   badge: 'NEW',  context: '128K' },
  { id: 'google/gemma-4-31b-it',                        name: 'Gemma 4 31B',            badge: 'NEW',  context: '128K' },
  // Stable popular models
  { id: 'meta/llama-3.3-70b-instruct',                  name: 'Llama 3.3 70B',          badge: 'FREE', context: '128K' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct',       name: 'Nemotron 70B',           badge: 'FREE', context: '128K' },
  { id: 'meta/llama-3.1-405b-instruct',                 name: 'Llama 3.1 405B',         badge: 'FREE', context: '128K' },
  { id: 'mistralai/mistral-large-2-instruct',           name: 'Mistral Large 2',        badge: 'FREE', context: '128K' },
  { id: 'deepseek-ai/deepseek-r1',                      name: 'DeepSeek R1',            badge: 'FREE', context: '128K' },
  { id: 'qwen/qwen2.5-72b-instruct',                    name: 'Qwen 2.5 72B',           badge: 'FREE', context: '128K' },
  { id: 'qwen/qwen2.5-coder-32b-instruct',              name: 'Qwen 2.5 Coder 32B',     badge: 'FREE', context: '128K' },
  { id: 'google/gemma-2-27b-it',                        name: 'Gemma 2 27B',            badge: 'FREE', context: '8K'   },
  { id: 'microsoft/phi-3-medium-128k-instruct',         name: 'Phi-3 Medium',           badge: 'FREE', context: '128K' },
  { id: 'nvidia/nemotron-4-340b-instruct',              name: 'Nemotron 340B',          badge: 'FREE', context: '4K'   },
  { id: 'mistralai/mixtral-8x22b-instruct-v0.1',        name: 'Mixtral 8x22B',          badge: 'FREE', context: '64K'  },
  { id: 'meta/llama-3.2-90b-vision-instruct',           name: 'Llama 3.2 90B Vision',   badge: 'FREE', context: '128K' },
];

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
    id: 'nvidia',
    name: 'NVIDIA NIM',
    model: 'DeepSeek V4 Flash',
    badge: 'FREE',
    cost: 'Free tier (1000 credits/mo)',
    features: ['23+ frontier models incl. DeepSeek V4, Kimi K2.6, GLM 5.1', 'Llama, Mistral, Qwen, Gemma, Nemotron', 'No credit card required'],
    keyPlaceholder: 'nvapi-...',
    keyUrl: 'https://build.nvidia.com/',
    keyDocs: 'https://docs.nvidia.com/nim/large-language-models/latest/getting-started.html',
    storageKey: 'jwc_key_nvidia',
    models: NVIDIA_MODELS,
    defaultModelId: 'deepseek-ai/deepseek-v4-flash',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    model: 'Llama 3.3 70B',
    badge: 'FREE',
    cost: 'Free models available',
    features: ['6+ completely free models', 'Single key, many models', 'Pay-as-you-go on premium'],
    keyPlaceholder: 'sk-or-v1-...',
    keyUrl: 'https://openrouter.ai/keys',
    keyDocs: 'https://openrouter.ai/docs/quick-start',
    storageKey: 'jwc_key_openrouter',
    models: OPENROUTER_FREE_MODELS,
    defaultModelId: 'meta-llama/llama-3.3-70b-instruct:free',
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

interface SessionEntry { provider: APIProvider; value: string; model?: string }

function readSession(): SessionEntry | null {
  if (typeof window === 'undefined') return null;
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

/** Returns the model id the user picked for this provider, or null if none saved. */
export function loadApiModel(provider: APIProvider): string | null {
  const entry = readSession();
  return entry?.provider === provider ? entry.model ?? null : null;
}

/** Save a key + optional model id. Clears any previously stored key (only one API at a time). */
export function saveApiKey(provider: APIProvider, key: string, model?: string): void {
  if (typeof window === 'undefined') return;
  const entry: SessionEntry = { provider, value: key };
  if (model) entry.model = model;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(entry));
}

export function clearApiKey(_provider?: APIProvider): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function findFirstSavedKey(): { provider: APIProvider; key: string; model?: string } | null {
  const entry = readSession();
  if (!entry?.value) return null;
  return { provider: entry.provider, key: entry.value, model: entry.model };
}

export function hasAnyApiKey(): boolean {
  return !!readSession()?.value;
}

export function getActiveProvider(): APIProvider | null {
  return readSession()?.provider ?? null;
}

/** Returns the model id that should be sent to the backend for the active session. */
export function getActiveModel(): string | null {
  const entry = readSession();
  if (!entry) return null;
  if (entry.model) return entry.model;
  const cfg = getProvider(entry.provider);
  return cfg?.defaultModelId ?? null;
}
