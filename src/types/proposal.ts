export interface JobDetails {
  title: string;
  description: string;
}

export interface JobAnalysis {
  jobType: string;
  clientProblem: string;
  requiredSkills: string[];
  projectScope: string;
  budget: string;
  timeline: string;
  clientPreferences: string[];
  keyDeliverables: string[];
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  suggestion: string;
  isCustom?: boolean;
}

export interface ScreeningQuestion {
  id: string;
  question: string;
  answer: string;
  sampleAnswer?: string;
}

export interface InputScreeningQuestion {
  id: string;
  question: string;
  answer: string;
  sampleAnswer: string;
}

export interface ClientQuestion {
  id: string;
  question: string;
}

export type APIProvider =
  | 'openai'
  | 'claude'
  | 'perplexity'
  | 'gemini'
  | 'groq'
  | 'deepseek'
  | 'kimi'
  | 'mistral'
  | 'grok';

export type ApplicationType = 'applying' | 'invitation';

export type InvitationStatus = 'fresh' | 'multiple-invited' | 'already-hired';

export type PageType = 'input' | 'questions' | 'api-selection' | 'output';

export type ProposalLength = 'detailed' | 'medium' | 'short';

export interface ProposalVariant {
  type: 'short' | 'medium' | 'long' | 'experience' | 'results' | 'beginner'; // last 3 kept for legacy sessions
  label: string;
  content: string;
  recommended: boolean;
  winChance?: number; // 0-100 — AI-assessed win probability for this variant vs this specific job
  placeholders: string[];
}

export interface GeneratedVariants {
  variants: ProposalVariant[];
  salesQuestions: string[];  // 3 strategic follow-up questions
}

export interface SavedProject {
  id: string;
  name: string;
  description: string;  // max 300 words
  url?: string;
  skills?: string[];
}

export interface SavedNote {
  id: string;
  text: string;
  links?: string[];
}

export interface SiteRedFlag {
  title: string;
  description: string;
  category: 'grammar' | 'seo' | 'technical' | 'ux';
}

export interface ClientQuestionAnswer {
  question: string;
  answer: string;
}

export interface GeneratedProposals {
  detailed: string;
  medium: string;
  short: string;
  variants?: ProposalVariant[];
  salesQuestions?: string[];
  clientQuestionAnswers?: ClientQuestionAnswer[];
}

// Chat/Conversation types for client communication
export interface ConversationMessage {
  id: string;
  type: 'client' | 'assistant';
  content: string;
  timestamp: Date;
}

// Job Session for persistence
export interface JobSession {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  jobTitle: string;
  jobDescription: string;
  jobLink?: string;
  clientMessage?: string;
  clientName: string;
  userName: string;
  clientQuestions: ClientQuestion[];
  jobAnalysis: JobAnalysis | null;
  userAnswers: string[];
  questions: Question[];
  generatedProposals: GeneratedProposals;
  conversations: ConversationMessage[];
  selectedAPI: APIProvider;
  applicationType: ApplicationType;
  // Outcome tracking
  outcome?: 'hired' | 'not_hired';
  contractType?: 'hourly' | 'fixed';
  contractPrice?: number;
  connectsUsed?: number;
  wasBoosted?: boolean;
}

export interface ProposalState {
  // Input data
  jobTitle: string;
  jobDescription: string;
  jobLink: string;
  clientMessage: string;
  clientName: string;
  userName: string;
  applicationType: ApplicationType;
  invitationStatus: InvitationStatus;
  website: string;
  savedProjects: SavedProject[];
  attachmentDetected: boolean;
  
  // Input screening questions (5 predefined on input page)
  inputScreeningQuestions: InputScreeningQuestion[];
  
  // Client's questions from Upwork job posting
  clientQuestions: ClientQuestion[];
  
  // Analysis data
  jobAnalysis: JobAnalysis | null;
  
  // Questions flow
  currentQuestionIndex: number;
  userAnswers: string[];
  questions: Question[];
  
  // Screening questions (from job posting)
  screeningQuestions: ScreeningQuestion[];
  
  // API Selection
  selectedAPI: APIProvider;
  
  // UI state
  isLoading: boolean;
  isAnalyzing: boolean;
  isGeneratingAnswer: boolean;
  isGeneratingProposal: boolean;
  regeneratingProposal: ProposalLength | null;
  currentError: string | null;
  currentPage: PageType;
  
  // Output - now 3 proposals
  generatedProposals: GeneratedProposals;
  generatedProposal: string; // Keep for backward compatibility
  
  // Chat/Conversation
  conversations: ConversationMessage[];
  isGeneratingReply: boolean;

  // Job Sessions
  currentSessionId: string | null;

  // Last-used API credentials — held in memory so refine doesn't need re-entry
  lastApiKey: string;
  lastApiProvider: APIProvider | null;

  // Beginner mode
  isBeginnerMode: boolean;
  showNoProjectsModal: boolean;

  // Agency vs solo freelancer
  isAgency: boolean;

  // Selected projects for this proposal (up to 3). Empty = AI picks from all.
  pinnedProjectIds: string[];

  // Free-text personal notes (any language — AI translates + incorporates)
  personalNotes: string;
  isPolishingNotes: boolean;

  // Saved note library (persisted in browser, up to 5)
  savedNotes: SavedNote[];

  // Skill mismatch modal
  showSkillMismatchModal: boolean;
  skillMismatchDetails: { jobRequires: string[]; missingSkills: string[] } | null;

  // Site red flags from job description URL analysis
  siteRedFlags: SiteRedFlag[];
  isAnalyzingSite: boolean;
}

export interface ProposalContextType extends ProposalState {
  // Navigation
  setCurrentPage: (page: PageType) => void;
  
  // Input updates
  setJobTitle: (title: string) => void;
  setJobDescription: (description: string) => void;
  setJobLink: (url: string) => void;
  setClientMessage: (msg: string) => void;
  setClientName: (name: string) => void;
  setUserName: (name: string) => void;
  setApplicationType: (type: ApplicationType) => void;
  setInvitationStatus: (status: InvitationStatus) => void;
  setWebsite: (url: string) => void;
  addSavedProject: (project: Omit<SavedProject, 'id'>) => void;
  updateSavedProject: (id: string, project: Partial<Omit<SavedProject, 'id'>>) => void;
  removeSavedProject: (id: string) => void;
  setAttachmentDetected: (v: boolean) => void;
  
  // Input screening questions
  updateInputScreeningQuestion: (id: string, answer: string) => void;
  
  // Client questions from Upwork
  addClientQuestion: () => void;
  updateClientQuestion: (id: string, question: string) => void;
  removeClientQuestion: (id: string) => void;
  
  // Analysis
  setJobAnalysis: (analysis: JobAnalysis) => void;
  analyzeJob: () => Promise<void>;
  
  // Question navigation
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  setCurrentQuestionIndex: (index: number) => void;
  
  // Answer management
  updateAnswer: (index: number, answer: string) => void;
  regenerateAnswer: (index: number) => Promise<void>;
  
  // Screening questions
  addScreeningQuestion: (question: string) => void;
  updateScreeningQuestion: (id: string, answer: string) => void;
  removeScreeningQuestion: (id: string) => void;
  
  // API Selection
  setSelectedAPI: (api: APIProvider) => void;
  
  // Proposal generation
  generateProposal: (apiKey: string) => Promise<void>;
  regenerateProposal: (apiKey: string, length: ProposalLength) => Promise<void>;
  runPipelineWithKey: (apiKey: string, apiProvider: APIProvider) => Promise<void>;
  
  // Chat/Conversation
  addClientMessage: (content: string) => void;
  generateReply: (clientMessage: string, apiKey: string) => Promise<void>;
  clearConversations: () => void;
  
  // Error handling
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Beginner mode
  setBeginnerMode: (v: boolean) => void;
  setShowNoProjectsModal: (v: boolean) => void;
  proceedAsBeginnerAndGenerate: () => void;

  // Agency vs solo freelancer
  setIsAgency: (v: boolean) => void;

  // Pinned projects for current proposal
  setPinnedProjectIds: (ids: string[]) => void;

  // Personal notes
  setPersonalNotes: (notes: string) => void;
  polishNotes: () => Promise<void>;
  addSavedNote: (text: string) => void;
  removeSavedNote: (id: string) => void;
  updateSavedNote: (id: string, text: string) => void;
  updateSavedNoteLinks: (id: string, links: string[]) => void;

  // Site analysis
  siteRedFlags: SiteRedFlag[];
  isAnalyzingSite: boolean;
  analyzeSiteFromJobDescription: () => Promise<void>;
  clearSiteRedFlags: () => void;

  // Skill mismatch modal
  showSkillMismatchModal: boolean;
  skillMismatchDetails: { jobRequires: string[]; missingSkills: string[] } | null;
  setShowSkillMismatchModal: (v: boolean) => void;
  proceedDespiteMismatch: () => void;

  // Refine a specific proposal variant with user instructions
  refineVariant: (variantType: string, instruction: string) => Promise<void>;

  // Reset
  resetApp: () => void;
  
  // Job Sessions
  saveCurrentSession: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  getAllSessions: () => Promise<JobSession[]>;
}
