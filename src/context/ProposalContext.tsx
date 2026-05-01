'use client'
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  ProposalContextType,
  ProposalState,
  PageType,
  JobAnalysis,
  Question,
  ScreeningQuestion,
  InputScreeningQuestion,
  ClientQuestion,
  APIProvider,
  ApplicationType,
  InvitationStatus,
  ProposalLength,
  GeneratedProposals,
  SavedProject,
  SavedNote,
  SiteRedFlag,
  ConversationMessage,
  JobSession
} from '@/types/proposal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Extract a human-readable message from Supabase FunctionsHttpError.
// The raw error always says "Edge Function returned a non-2xx status code"
// but the real message lives in error.context.error (the JSON body we returned).
async function extractFnError(error: unknown): Promise<string> {
  if (!error || typeof error !== 'object') return 'Unknown error. Please try again.';
  const e = error as Record<string, unknown>;

  // Supabase FunctionsHttpError: context holds the parsed response body
  if (e.context && typeof e.context === 'object') {
    const ctx = e.context as Record<string, unknown>;
    if (typeof ctx.error === 'string') return ctx.error;
    if (typeof ctx.message === 'string') return ctx.message;
  }

  // Try reading context as a Response (older client versions)
  if (e.context instanceof Response) {
    try {
      const body = await (e.context as Response).json();
      if (body?.error) return body.error;
      if (body?.message) return body.message;
    } catch { /* ignore */ }
  }

  if (typeof e.message === 'string' && e.message !== 'Edge Function returned a non-2xx status code') {
    return e.message;
  }
  return 'API call failed. Please check your API key and try again.';
}
import { loadSavedProjects, saveSavedProjectsToStorage } from '@/config/projects';
import { detectSkillMismatch } from '@/utils/skillMatch';
import { loadSavedNotes, saveNotesToStorage } from '@/config/notes';
import {
  saveJobSession,
  getJobSession,
  getAllJobSessions,
  deleteJobSession,
  saveUserName,
  getUserName,
  saveWebsite,
  getWebsite,
  saveIsAgency,
  getIsAgency,
} from '@/utils/jobStorage';

function findFirstSavedKey(): { provider: APIProvider; key: string } | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem('jwc_session_api');
    if (!raw) return null;
    const entry = JSON.parse(raw) as { provider: APIProvider; value: string };
    if (!entry?.value) return null;
    return { provider: entry.provider, key: entry.value };
  } catch { return null; }
}

const PROPOSAL_QUESTIONS = [
  "What is the job title or main service you are bidding on? Can you also share the key requirements the client mentioned?",
  "Do you have previous experience or case studies directly related to this type of work? If yes, what was the specific result you achieved?",
  "What are the specific skills or tools you will use to complete this project?",
  "What do you think is the real problem the client is trying to solve, beyond the surface request?",
  "How long do you estimate this project will take from start to finish? Break it down by phases if possible.",
  "What is your total project price? If milestone based, break down the payment structure.",
  "What makes you different from other freelancers bidding on this job?",
  "Should this be a short proposal (around 400 words), medium (600-900 words), or long (1200-1500 words)?",
  "What tone and personality should the proposal have? (e.g., professional but friendly, casual and excited, detail-oriented)",
  "What are the 3 to 5 main deliverables you will provide?"
];

const DEFAULT_QUESTIONS: Omit<Question, 'suggestion'>[] = PROPOSAL_QUESTIONS.map((question, index) => ({
  id: index + 1,
  question,
  answer: ''
}));

// Default input screening questions with sample answers
const DEFAULT_INPUT_SCREENING_QUESTIONS: InputScreeningQuestion[] = [
  {
    id: 'screening-1',
    question: "What's your biggest frustration with this project?",
    answer: '',
    sampleAnswer: "The site is slow and our contact form doesn't work well"
  },
  {
    id: 'screening-2',
    question: "What does success look like for you in 3 months?",
    answer: '',
    sampleAnswer: "30% more inquiries and faster page load time"
  },
  {
    id: 'screening-3',
    question: "Is this a complete project or ongoing work?",
    answer: '',
    sampleAnswer: "One-time build, then I'll manage it myself"
  },
  {
    id: 'screening-4',
    question: "How many team members will be involved?",
    answer: '',
    sampleAnswer: "It's just me and my business partner"
  },
  {
    id: 'screening-5',
    question: "What's your approximate budget range?",
    answer: '',
    sampleAnswer: "$4,000 to $7,000 sounds right"
  }
];

const initialState: ProposalState = {
  jobTitle: '',
  jobDescription: '',
  jobLink: '',
  clientMessage: '',
  clientName: '',
  userName: '',
  applicationType: 'applying',
  invitationStatus: 'fresh' as InvitationStatus,
  website: '',
  savedProjects: loadSavedProjects(),
  attachmentDetected: false,
  inputScreeningQuestions: DEFAULT_INPUT_SCREENING_QUESTIONS,
  clientQuestions: [],
  jobAnalysis: null,
  currentQuestionIndex: 0,
  userAnswers: Array(10).fill(''),
  questions: [],
  screeningQuestions: [],
  selectedAPI: 'perplexity',
  isLoading: false,
  isAnalyzing: false,
  isGeneratingAnswer: false,
  isGeneratingProposal: false,
  regeneratingProposal: null,
  currentError: null,
  currentPage: 'input',
  generatedProposals: {
    detailed: '',
    medium: '',
    short: ''
  },
  generatedProposal: '',
  conversations: [],
  isGeneratingReply: false,
  currentSessionId: null,
  lastApiKey: '',
  lastApiProvider: null,
  isBeginnerMode: false,
  showNoProjectsModal: false,
  isAgency: getIsAgency(),
  showSkillMismatchModal: false,
  skillMismatchDetails: null,
  pinnedProjectIds: [],
  personalNotes: '',
  isPolishingNotes: false,
  savedNotes: [],
  siteRedFlags: [],
  isAnalyzingSite: false,
};

const ProposalContext = createContext<ProposalContextType | null>(null);

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProposalState>(() => ({
    ...initialState,
    userName: getUserName(),
    website: getWebsite(),
    savedNotes: loadSavedNotes(),
  }));

  // Save user name whenever it changes
  useEffect(() => {
    if (state.userName) {
      saveUserName(state.userName);
    }
  }, [state.userName]);

  // Persist projects to localStorage whenever they change.
  // This is the single, authoritative write — no other code should call saveSavedProjectsToStorage.
  useEffect(() => {
    saveSavedProjectsToStorage(state.savedProjects);
  }, [state.savedProjects]);

  // Save website whenever it changes
  useEffect(() => {
    saveWebsite(state.website);
  }, [state.website]);

  // Persist saved notes whenever they change
  useEffect(() => {
    saveNotesToStorage(state.savedNotes);
  }, [state.savedNotes]);

  // Navigation
  const setCurrentPage = useCallback((page: PageType) => {
    setState(prev => ({ ...prev, currentPage: page, currentError: null }));
  }, []);

  // Input updates
  const setJobTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, jobTitle: title }));
  }, []);

  const setJobDescription = useCallback((description: string) => {
    setState(prev => ({ ...prev, jobDescription: description }));
  }, []);

  const setJobLink = useCallback((url: string) => {
    setState(prev => ({ ...prev, jobLink: url }));
  }, []);

  const setClientMessage = useCallback((msg: string) => {
    setState(prev => ({ ...prev, clientMessage: msg }));
  }, []);

  const setClientName = useCallback((name: string) => {
    setState(prev => ({ ...prev, clientName: name }));
  }, []);

  const setUserName = useCallback((name: string) => {
    setState(prev => ({ ...prev, userName: name }));
  }, []);

  const setApplicationType = useCallback((type: ApplicationType) => {
    setState(prev => ({ ...prev, applicationType: type }));
  }, []);

  const setInvitationStatus = useCallback((status: InvitationStatus) => {
    setState(prev => ({ ...prev, invitationStatus: status }));
  }, []);

  const setWebsite = useCallback((url: string) => {
    setState(prev => ({ ...prev, website: url }));
  }, []);

  const addSavedProject = useCallback((project: Omit<SavedProject, 'id'>) => {
    setState(prev => {
      const newProject: SavedProject = { ...project, id: crypto.randomUUID() };
      const updated = [...prev.savedProjects, newProject];
      return { ...prev, savedProjects: updated };
    });
  }, []);

  const updateSavedProject = useCallback((id: string, project: Partial<Omit<SavedProject, 'id'>>) => {
    setState(prev => {
      const updated = prev.savedProjects.map(p => p.id === id ? { ...p, ...project } : p);
      return { ...prev, savedProjects: updated };
    });
  }, []);

  const removeSavedProject = useCallback((id: string) => {
    setState(prev => {
      const updated = prev.savedProjects.filter(p => p.id !== id);
      return { ...prev, savedProjects: updated };
    });
    toast.success('Project removed');
  }, []);

  const setAttachmentDetected = useCallback((v: boolean) => {
    setState(prev => ({ ...prev, attachmentDetected: v }));
  }, []);

  const setBeginnerMode = useCallback((v: boolean) => {
    setState(prev => ({ ...prev, isBeginnerMode: v }));
  }, []);

  const setIsAgency = useCallback((v: boolean) => {
    saveIsAgency(v);
    setState(prev => ({ ...prev, isAgency: v }));
  }, []);

  const setShowNoProjectsModal = useCallback((v: boolean) => {
    setState(prev => ({ ...prev, showNoProjectsModal: v }));
  }, []);

  const setShowSkillMismatchModal = useCallback((v: boolean) => {
    setState(prev => ({ ...prev, showSkillMismatchModal: v }));
  }, []);

  const proceedDespiteMismatch = useCallback(async () => {
    setState(prev => ({ ...prev, showSkillMismatchModal: false, skillMismatchDetails: null }));
    const savedKey = findFirstSavedKey();
    if (!savedKey) {
      setState(prev => ({ ...prev, currentPage: 'api-selection' }));
      return;
    }
    await runPipelineWithKey(savedKey.key, savedKey.provider);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPinnedProjectIds = useCallback((ids: string[]) => {
    setState(prev => ({ ...prev, pinnedProjectIds: ids }));
  }, []);

  const setPersonalNotes = useCallback((notes: string) => {
    setState(prev => ({ ...prev, personalNotes: notes }));
  }, []);

  const addSavedNote = useCallback((text: string) => {
    setState(prev => {
      const normalized = text.trim();
      const exists = normalized && prev.savedNotes.some(n => n.text === normalized);
      if (exists) return prev;
      const newNote: SavedNote = { id: crypto.randomUUID(), text };
      return { ...prev, savedNotes: [newNote, ...prev.savedNotes].slice(0, 30) };
    });
  }, []);

  const removeSavedNote = useCallback((id: string) => {
    setState(prev => ({ ...prev, savedNotes: prev.savedNotes.filter(n => n.id !== id) }));
  }, []);

  const updateSavedNote = useCallback((id: string, text: string) => {
    setState(prev => ({
      ...prev,
      savedNotes: prev.savedNotes.map(n => n.id === id ? { ...n, text } : n),
    }));
  }, []);

  const updateSavedNoteLinks = useCallback((id: string, links: string[]) => {
    setState(prev => {
      const updated = prev.savedNotes.map(n => n.id === id ? { ...n, links } : n);
      localStorage.setItem('jwc_saved_notes', JSON.stringify(updated));
      return { ...prev, savedNotes: updated };
    });
  }, []);

  const polishNotes = useCallback(async () => {
    if (!state.personalNotes.trim()) return;
    const savedKey = findFirstSavedKey();
    if (!savedKey) {
      toast.error('Add an API key first to use the Polish feature.');
      return;
    }
    setState(prev => ({ ...prev, isPolishingNotes: true }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'polish-notes',
          personalNotes: state.personalNotes,
          apiProvider: savedKey.provider,
          apiKey: savedKey.key,
        },
      });
      if (error) throw error;
      if (data?.polished) {
        const polished = data.polished.trim();
        setState(prev => {
          const exists = prev.savedNotes.some(n => n.text === polished);
          const newNote: SavedNote = { id: crypto.randomUUID(), text: polished };
          const updatedNotes = exists ? prev.savedNotes : [newNote, ...prev.savedNotes].slice(0, 30);
          return { ...prev, personalNotes: polished, isPolishingNotes: false, savedNotes: updatedNotes };
        });
        toast.success('Notes polished and saved.');
      } else {
        throw new Error('No response from AI');
      }
    } catch (err) {
      console.error('Polish notes error:', err);
      toast.error('Could not polish notes. Please try again.');
      setState(prev => ({ ...prev, isPolishingNotes: false }));
    }
  }, [state.personalNotes]);

  // Attachment detection helper
  const detectAttachment = (description: string): boolean => {
    const lower = description.toLowerCase();
    return ['attach', 'document', 'pdf', 'file uploaded', 'see link', 'url:', 'http', 'google drive', 'dropbox', 'portfolio link', 'see below', 'refer to'].some(kw => lower.includes(kw));
  };

  // Input screening questions
  const updateInputScreeningQuestion = useCallback((id: string, answer: string) => {
    setState(prev => ({
      ...prev,
      inputScreeningQuestions: prev.inputScreeningQuestions.map(sq =>
        sq.id === id ? { ...sq, answer } : sq
      )
    }));
  }, []);

  // Client questions from Upwork
  const addClientQuestion = useCallback(() => {
    const newQuestion: ClientQuestion = {
      id: crypto.randomUUID(),
      question: ''
    };
    setState(prev => ({
      ...prev,
      clientQuestions: [...prev.clientQuestions, newQuestion]
    }));
  }, []);

  const updateClientQuestion = useCallback((id: string, question: string) => {
    setState(prev => ({
      ...prev,
      clientQuestions: prev.clientQuestions.map(cq =>
        cq.id === id ? { ...cq, question } : cq
      )
    }));
  }, []);

  const removeClientQuestion = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      clientQuestions: prev.clientQuestions.filter(cq => cq.id !== id)
    }));
    toast.success('Question removed');
  }, []);

  // Analysis
  const setJobAnalysis = useCallback((analysis: JobAnalysis) => {
    setState(prev => ({ ...prev, jobAnalysis: analysis }));
  }, []);

  // Full pipeline: analyze job → generate proposals (2 steps, no intermediate Q&A)
  const runPipelineWithKey = useCallback(async (apiKey: string, apiProvider: APIProvider) => {
    setState(prev => ({ ...prev, isAnalyzing: true, isLoading: true, isGeneratingProposal: false, currentError: null }));
    const apiCredentials = { apiProvider, apiKey };

    try {
      // Step 1: Analyze job posting
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-job-posting', {
        body: { jobTitle: state.jobTitle, jobDescription: state.jobDescription, ...apiCredentials }
      });
      if (analysisError) {
        const msg = await extractFnError(analysisError);
        throw new Error(`Analysis failed: ${msg}`);
      }
      const jobAnalysis = analysisData.analysis;

      // Build screening context from user-filled input screening questions
      const screeningContext = state.inputScreeningQuestions
        .filter(sq => sq.answer.trim())
        .map(sq => `${sq.question}: ${sq.answer}`)
        .join('\n');

      const screeningQs: ScreeningQuestion[] = (jobAnalysis.screeningQuestions || []).map((q: string, i: number) => ({ id: `screening-${i}`, question: q, answer: '' }));

      // Move straight to proposal generation — no 10x generate-answer loop needed
      setState(prev => ({
        ...prev,
        jobAnalysis,
        screeningQuestions: screeningQs,
        currentPage: 'api-selection',
        selectedAPI: apiProvider,
        isAnalyzing: false,
        isLoading: false,
        isGeneratingProposal: true,
      }));

      toast.success('Analyzed! Writing your proposals...');

      // Step 2: Generate 3 proposal variants in one call
      const clientQuestionsToAnswer = state.clientQuestions.filter(cq => cq.question.trim()).map(cq => cq.question);
      // Pass job analysis fields as structured Q&A context
      const allQA = [
        { question: 'Job type and scope', answer: `${jobAnalysis.jobType || ''}${jobAnalysis.projectScope ? ', ' + jobAnalysis.projectScope : ''}` },
        { question: "Client's core problem", answer: jobAnalysis.clientProblem || '' },
        { question: 'Required skills', answer: (jobAnalysis.requiredSkills || []).join(', ') },
        { question: 'Timeline', answer: jobAnalysis.timeline || 'Not specified' },
        { question: 'Budget', answer: jobAnalysis.budget || 'Not specified' },
        { question: 'Key deliverables', answer: (jobAnalysis.keyDeliverables || []).join(', ') },
        { question: 'Client preferences', answer: (jobAnalysis.clientPreferences || []).join(', ') },
        { question: 'Freelancer context', answer: screeningContext || 'Not provided' },
      ];

      // Use pinned projects if user selected some; otherwise send all for AI to pick
      const projectsToSend = state.pinnedProjectIds.length > 0
        ? state.savedProjects.filter(p => state.pinnedProjectIds.includes(p.id))
        : state.savedProjects;

      const variantResult = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'proposal',
          proposalType: 'variants',
          jobTitle: state.jobTitle,
          jobDescription: state.jobDescription,
          jobLink: state.jobLink || undefined,
          clientMessage: state.clientMessage || undefined,
          questions: allQA,
          clientQuestions: clientQuestionsToAnswer,
          clientName: state.clientName,
          userName: state.userName,
          website: state.website,
          savedProjects: projectsToSend,
          hasPinnedProjects: state.pinnedProjectIds.length > 0,
          applicationType: state.applicationType,
          invitationStatus: state.invitationStatus,
          isBeginnerMode: state.isBeginnerMode,
          isAgency: state.isAgency,
          personalNotes: state.personalNotes || '',
          apiProvider,
          apiKey,
        }
      });
      if (variantResult.error) {
        const msg = await extractFnError(variantResult.error);
        throw new Error(`Proposal generation failed: ${msg}`);
      }
      const { variants, salesQuestions, clientQuestionAnswers } = variantResult.data;
      // Keep backward compat:
      const detailed = variants?.[0]?.content || '';
      const medium = variants?.[1]?.content || '';
      const short = variants?.[2]?.content || '';

      const sessionId = crypto.randomUUID();
      setState(prev => ({
        ...prev,
        generatedProposals: { detailed, medium, short, variants, salesQuestions, clientQuestionAnswers },
        generatedProposal: medium,
        currentPage: 'output',
        isGeneratingProposal: false,
        currentSessionId: sessionId,
        lastApiKey: apiKey,
        lastApiProvider: apiProvider,
      }));

      await saveJobSession({
        id: sessionId, createdAt: new Date(), updatedAt: new Date(),
        jobTitle: state.jobTitle, jobDescription: state.jobDescription,
        jobLink: state.jobLink || undefined,
        clientMessage: state.clientMessage || undefined,
        clientName: state.clientName, userName: state.userName,
        clientQuestions: state.clientQuestions, jobAnalysis,
        userAnswers: [], questions: [],
        generatedProposals: { detailed, medium, short, variants, salesQuestions, clientQuestionAnswers },
        conversations: state.conversations, selectedAPI: apiProvider,
        applicationType: state.applicationType,
      });

      toast.success('3 proposal variants generated!');
    } catch (error) {
      console.error('Pipeline error:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : await extractFnError(error);
      setState(prev => ({
        ...prev,
        currentError: errorMessage,
        isAnalyzing: false,
        isLoading: false,
        isGeneratingProposal: false,
        currentPage: 'input', // Return to form so user can retry from the wizard
      }));
      toast.error(errorMessage);
    }
  }, [state.jobTitle, state.jobDescription, state.clientName, state.userName, state.applicationType, state.clientQuestions, state.inputScreeningQuestions, state.conversations, state.website, state.savedProjects]);

  const analyzeJob = useCallback(async () => {
    // Detect attachment before starting pipeline
    setAttachmentDetected(detectAttachment(state.jobDescription));

    // If no projects, show modal (unless already in beginner mode)
    if (state.savedProjects.length === 0 && !state.isBeginnerMode) {
      setState(prev => ({ ...prev, showNoProjectsModal: true }));
      return;
    }

    // Check for skill mismatch between job and user's saved projects/notes
    if (state.savedProjects.length > 0) {
      const noteTexts = state.savedNotes.map(n => n.text);
      const mismatch = detectSkillMismatch(state.jobTitle, state.jobDescription, state.savedProjects, noteTexts);
      if (mismatch.hasMismatch) {
        setState(prev => ({
          ...prev,
          showSkillMismatchModal: true,
          skillMismatchDetails: { jobRequires: mismatch.jobRequires, missingSkills: mismatch.missingSkills },
        }));
        return;
      }
    }

    const savedKey = findFirstSavedKey();

    if (!savedKey) {
      // No API key saved — go to the key entry screen first
      setState(prev => ({ ...prev, currentPage: 'api-selection', currentError: null }));
      return;
    }

    // Key found — run the full pipeline immediately
    await runPipelineWithKey(savedKey.key, savedKey.provider);
  }, [runPipelineWithKey, state.jobDescription, state.savedProjects, state.isBeginnerMode]);

  const proceedAsBeginnerAndGenerate = useCallback(async () => {
    setState(prev => ({ ...prev, showNoProjectsModal: false, isBeginnerMode: true }));
    const savedKey = findFirstSavedKey();
    if (!savedKey) {
      setState(prev => ({ ...prev, currentPage: 'api-selection' }));
      return;
    }
    await runPipelineWithKey(savedKey.key, savedKey.provider);
  }, [runPipelineWithKey]);

  // Question navigation
  const goToNextQuestion = useCallback(() => {
    setState(prev => {
      const maxIndex = prev.questions.length - 1;
      if (prev.currentQuestionIndex < maxIndex) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 };
      }
      return prev;
    });
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex > 0) {
        return { ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 };
      }
      return prev;
    });
  }, []);

  const setCurrentQuestionIndex = useCallback((index: number) => {
    setState(prev => ({ ...prev, currentQuestionIndex: index }));
  }, []);

  // Answer management
  const updateAnswer = useCallback((index: number, answer: string) => {
    setState(prev => {
      const newAnswers = [...prev.userAnswers];
      newAnswers[index] = answer;
      
      const newQuestions = prev.questions.map((q, i) => 
        i === index ? { ...q, answer } : q
      );
      
      return { ...prev, userAnswers: newAnswers, questions: newQuestions };
    });
  }, []);

  const regenerateAnswer = useCallback(async (index: number) => {
    setState(prev => ({ ...prev, isGeneratingAnswer: true }));
    
    try {
      const question = state.questions[index];
      const previousAnswers = state.questions
        .slice(0, index)
        .map(q => ({ question: q.question, answer: q.answer }));
      
      const { data, error } = await supabase.functions.invoke('generate-answer', {
        body: { 
          question: question.question,
          jobTitle: state.jobTitle,
          jobDescription: state.jobDescription,
          jobAnalysis: state.jobAnalysis,
          previousAnswers
        }
      });
      
      if (error) throw error;
      
      setState(prev => {
        const newAnswers = [...prev.userAnswers];
        newAnswers[index] = data.suggestion;
        
        const newQuestions = prev.questions.map((q, i) => 
          i === index ? { ...q, suggestion: data.suggestion, answer: data.suggestion } : q
        );
        
        return { ...prev, userAnswers: newAnswers, questions: newQuestions, isGeneratingAnswer: false };
      });
      
      toast.success('Answer regenerated!');
    } catch (error) {
      console.error('Error regenerating answer:', error);
      setState(prev => ({ ...prev, isGeneratingAnswer: false }));
      toast.error('Failed to regenerate answer. Please try again.');
    }
  }, [state.jobTitle, state.jobDescription, state.jobAnalysis, state.questions]);

  // Screening questions
  const addScreeningQuestion = useCallback((question: string) => {
    const newScreeningQuestion: ScreeningQuestion = {
      id: crypto.randomUUID(),
      question,
      answer: ''
    };
    
    setState(prev => ({
      ...prev,
      screeningQuestions: [...prev.screeningQuestions, newScreeningQuestion]
    }));
    
    toast.success('Screening question added!');
  }, []);

  const updateScreeningQuestion = useCallback((id: string, answer: string) => {
    setState(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.map(sq =>
        sq.id === id ? { ...sq, answer } : sq
      )
    }));
  }, []);

  const removeScreeningQuestion = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      screeningQuestions: prev.screeningQuestions.filter(sq => sq.id !== id)
    }));
    toast.success('Screening question removed!');
  }, []);

  // API Selection
  const setSelectedAPI = useCallback((api: APIProvider) => {
    setState(prev => ({ ...prev, selectedAPI: api }));
  }, []);

  // Helper function to generate a single proposal
  const generateSingleProposal = async (apiKey: string, length: ProposalLength) => {
    // Include input screening questions with answers
    const inputScreeningWithAnswers = state.inputScreeningQuestions
      .filter(sq => sq.answer.trim())
      .map(sq => ({ question: sq.question, answer: sq.answer }));
    
    const allQuestions = [
      ...state.questions.map(q => ({ question: q.question, answer: q.answer })),
      ...state.screeningQuestions.map(sq => ({ question: sq.question, answer: sq.answer })),
      ...inputScreeningWithAnswers
    ];

    // Client questions to answer in the proposal
    const clientQuestionsToAnswer = state.clientQuestions
      .filter(cq => cq.question.trim())
      .map(cq => cq.question);
    
    const { data, error } = await supabase.functions.invoke('generate-proposal', {
      body: {
        type: 'proposal',
        jobTitle: state.jobTitle,
        jobDescription: state.jobDescription,
        questions: allQuestions,
        clientQuestions: clientQuestionsToAnswer,
        clientName: state.clientName,
        userName: state.userName,
        website: state.website,
        savedProjects: state.savedProjects,
        applicationType: state.applicationType,
        apiProvider: state.selectedAPI,
        apiKey: apiKey,
        proposalLength: length
      }
    });

    if (error) {
      const msg = await extractFnError(error);
      throw new Error(msg);
    }
    return data.proposal;
  };

  // Proposal generation with user-provided API key - generates all 3 lengths
  const generateProposal = useCallback(async (apiKey: string) => {
    setState(prev => ({ ...prev, isGeneratingProposal: true, currentError: null }));
    
    try {
      // Generate all 3 proposals in parallel
      const [detailed, medium, short] = await Promise.all([
        generateSingleProposal(apiKey, 'detailed'),
        generateSingleProposal(apiKey, 'medium'),
        generateSingleProposal(apiKey, 'short')
      ]);
      
      const sessionId = state.currentSessionId || crypto.randomUUID();
      
      setState(prev => ({ 
        ...prev, 
        generatedProposals: { detailed, medium, short },
        generatedProposal: medium, // Keep for backward compatibility
        currentPage: 'output',
        isGeneratingProposal: false,
        currentSessionId: sessionId
      }));
      
      // Auto-save the session
      const session: JobSession = {
        id: sessionId,
        createdAt: new Date(),
        updatedAt: new Date(),
        jobTitle: state.jobTitle,
        jobDescription: state.jobDescription,
        jobLink: state.jobLink || undefined,
        clientMessage: state.clientMessage || undefined,
        clientName: state.clientName,
        userName: state.userName,
        clientQuestions: state.clientQuestions,
        jobAnalysis: state.jobAnalysis,
        userAnswers: state.userAnswers,
        questions: state.questions,
        generatedProposals: { detailed, medium, short },
        conversations: state.conversations,
        selectedAPI: state.selectedAPI,
        applicationType: state.applicationType
      };
      
      await saveJobSession(session);
      
      toast.success('All 3 proposals generated and saved!');
    } catch (error) {
      console.error('Error generating proposals:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate proposals';
      setState(prev => ({ ...prev, currentError: errorMessage, isGeneratingProposal: false }));
      toast.error('Failed to generate proposals. Please try again.');
    }
  }, [state.jobTitle, state.jobDescription, state.questions, state.screeningQuestions, state.inputScreeningQuestions, state.clientQuestions, state.selectedAPI, state.clientName, state.userName, state.currentSessionId, state.jobAnalysis, state.userAnswers, state.conversations]);

  // Regenerate a single proposal
  const regenerateProposal = useCallback(async (apiKey: string, length: ProposalLength) => {
    setState(prev => ({ ...prev, regeneratingProposal: length, currentError: null }));
    
    try {
      const proposal = await generateSingleProposal(apiKey, length);
      
      setState(prev => ({ 
        ...prev, 
        generatedProposals: {
          ...prev.generatedProposals,
          [length]: proposal
        },
        regeneratingProposal: null 
      }));
      
      toast.success(`${length.charAt(0).toUpperCase() + length.slice(1)} proposal regenerated!`);
    } catch (error) {
      console.error('Error regenerating proposal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to regenerate proposal';
      setState(prev => ({ ...prev, currentError: errorMessage, regeneratingProposal: null }));
      toast.error('Failed to regenerate proposal. Please try again.');
    }
  }, [state.jobTitle, state.jobDescription, state.questions, state.screeningQuestions, state.inputScreeningQuestions, state.clientQuestions, state.selectedAPI, state.clientName, state.userName]);

  // Chat/Conversation functions
  const addClientMessage = useCallback((content: string) => {
    const newMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      type: 'client',
      content,
      timestamp: new Date()
    };
    setState(prev => ({
      ...prev,
      conversations: [...prev.conversations, newMessage]
    }));
  }, []);

  const generateReply = useCallback(async (clientMessage: string, apiKey: string) => {
    setState(prev => ({ ...prev, isGeneratingReply: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: {
          clientMessage,
          jobTitle: state.jobTitle,
          jobDescription: state.jobDescription,
          jobAnalysis: state.jobAnalysis,
          generatedProposals: state.generatedProposals,
          previousConversations: state.conversations,
          clientName: state.clientName,
          userName: state.userName,
          apiProvider: state.selectedAPI,
          apiKey
        }
      });
      
      if (error) throw error;
      
      const replyMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };
      
      setState(prev => ({
        ...prev,
        conversations: [...prev.conversations, replyMessage],
        isGeneratingReply: false
      }));
      
      // Save session with new conversation
      if (state.currentSessionId) {
        const session = await getJobSession(state.currentSessionId);
        if (session) {
          session.conversations = [...state.conversations, replyMessage];
          session.updatedAt = new Date();
          await saveJobSession(session);
        }
      }
      
      toast.success('Reply generated!');
    } catch (error) {
      console.error('Error generating reply:', error);
      setState(prev => ({ ...prev, isGeneratingReply: false }));
      toast.error('Failed to generate reply. Please try again.');
    }
  }, [state.jobTitle, state.jobDescription, state.jobAnalysis, state.generatedProposals, state.conversations, state.clientName, state.userName, state.selectedAPI, state.currentSessionId]);

  const clearConversations = useCallback(() => {
    setState(prev => ({ ...prev, conversations: [] }));
    toast.success('Conversation cleared');
  }, []);

  // Job Session functions
  const saveCurrentSession = useCallback(async () => {
    const sessionId = state.currentSessionId || crypto.randomUUID();
    
    const session: JobSession = {
      id: sessionId,
      createdAt: new Date(),
      updatedAt: new Date(),
      jobTitle: state.jobTitle,
      jobDescription: state.jobDescription,
      jobLink: state.jobLink || undefined,
      clientMessage: state.clientMessage || undefined,
      clientName: state.clientName,
      userName: state.userName,
      clientQuestions: state.clientQuestions,
      jobAnalysis: state.jobAnalysis,
      userAnswers: state.userAnswers,
      questions: state.questions,
      generatedProposals: state.generatedProposals,
      conversations: state.conversations,
      selectedAPI: state.selectedAPI,
      applicationType: state.applicationType
    };

    await saveJobSession(session);
    setState(prev => ({ ...prev, currentSessionId: sessionId }));
    toast.success('Session saved!');
  }, [state]);

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const session = await getJobSession(sessionId);
      if (!session) {
        toast.error('Session not found');
        return;
      }
      
      setState(prev => ({
        ...prev,
        jobTitle: session.jobTitle,
        jobDescription: session.jobDescription,
        clientName: session.clientName,
        userName: session.userName,
        applicationType: session.applicationType || 'applying',
        clientQuestions: session.clientQuestions,
        jobAnalysis: session.jobAnalysis,
        userAnswers: session.userAnswers,
        questions: session.questions,
        generatedProposals: session.generatedProposals,
        conversations: session.conversations,
        selectedAPI: session.selectedAPI,
        currentSessionId: sessionId,
        currentPage: session.generatedProposals.medium ? 'output' : 'input'
      }));
      
      toast.success('Session loaded!');
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load session');
    }
  }, []);

  const deleteSessionHandler = useCallback(async (sessionId: string) => {
    try {
      await deleteJobSession(sessionId);
      if (state.currentSessionId === sessionId) {
        setState(prev => ({ ...prev, currentSessionId: null }));
      }
      toast.success('Session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  }, [state.currentSessionId]);

  const getAllSessionsHandler = useCallback(async (): Promise<JobSession[]> => {
    try {
      return await getAllJobSessions();
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }, []);

  // Error handling
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, currentError: error }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, currentError: null }));
  }, []);

  // Refine a single proposal variant with user instructions (any language)
  const refineVariant = useCallback(async (variantType: string, instruction: string) => {
    if (!state.lastApiKey) {
      toast.error('Session expired — please generate a new proposal first.');
      return;
    }
    const currentVariant = state.generatedProposals.variants?.find(v => v.type === variantType);
    if (!currentVariant) return;

    try {
      const result = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'refine-proposal',
          existingProposal: currentVariant.content,
          refinementInstruction: instruction,
          jobTitle: state.jobTitle,
          jobDescription: state.jobDescription,
          userName: state.userName,
          website: state.website,
          clientName: state.clientName,
          applicationType: state.applicationType,
          invitationStatus: state.invitationStatus,
          variantType,
          apiProvider: state.lastApiProvider || state.selectedAPI,
          apiKey: state.lastApiKey,
        }
      });

      if (result.error) {
        const msg = await extractFnError(result.error);
        throw new Error(msg);
      }

      const { refined } = result.data;
      if (!refined) throw new Error('No refined proposal returned.');

      setState(prev => ({
        ...prev,
        generatedProposals: {
          ...prev.generatedProposals,
          variants: prev.generatedProposals.variants?.map(v =>
            v.type === variantType ? { ...v, content: refined } : v
          ),
        },
      }));

      toast.success('Proposal updated!');
    } catch (error) {
      const msg = error instanceof Error ? error.message : await extractFnError(error);
      toast.error(msg);
      throw error;
    }
  }, [state.lastApiKey, state.lastApiProvider, state.selectedAPI, state.generatedProposals.variants,
      state.jobTitle, state.jobDescription, state.userName, state.website, state.clientName,
      state.applicationType, state.invitationStatus]);

  // Site analysis
  const analyzeSiteFromJobDescription = useCallback(async () => {
    const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
    const allText = `${state.jobDescription} ${state.clientMessage}`;
    const urls = (allText.match(urlRegex) || []).filter(
      u => !u.includes('upwork.com') && !u.includes('freelancer.com') && !u.includes('fiverr.com') && u.length < 200
    );
    if (urls.length === 0) return;
    const siteUrl = urls[0];

    const savedKey = findFirstSavedKey();
    if (!savedKey) return;

    setState(prev => ({ ...prev, isAnalyzingSite: true }));
    try {
      const { data, error } = await supabase.functions.invoke('generate-proposal', {
        body: {
          type: 'analyze-site',
          siteUrl,
          apiProvider: savedKey.provider,
          apiKey: savedKey.key,
        },
      });      if (error) {
        toast.error('Site analysis failed. Check your API key and try again.');
      } else if (data?.redFlags?.length > 0) {
        // Normalize: ensure every flag has non-empty title+description
        const flags = (data.redFlags as SiteRedFlag[]).filter(f => f.title?.trim() && f.description?.trim());
        if (flags.length > 0) {
          setState(prev => ({ ...prev, siteRedFlags: flags }));
          toast.success(`Found ${flags.length} site issues`);
        } else {
          toast.error('Analysis returned empty flags. Raw: ' + JSON.stringify(data.redFlags).slice(0, 100));
        }
      } else if (data?.error) {
        toast.error(data.error.slice(0, 120));
      } else {
        toast.error('No flags returned. Data: ' + JSON.stringify(data).slice(0, 100));
      }
    } catch (e) {
      toast.error('Exception: ' + String(e).slice(0, 100));
    } finally {
      setState(prev => ({ ...prev, isAnalyzingSite: false }));
    }
  }, [state.jobDescription, state.clientMessage]);

  const clearSiteRedFlags = useCallback(() => {
    setState(prev => ({ ...prev, siteRedFlags: [] }));
  }, []);

  // Reset
  const resetApp = useCallback(() => {
    setState(prev => ({
      ...initialState,
      userName: prev.userName,
      website: prev.website,
      savedProjects: prev.savedProjects,
      savedNotes: prev.savedNotes,
    }));
    toast.info('App reset. Start fresh!');
  }, []);

  const contextValue: ProposalContextType = {
    ...state,
    setCurrentPage,
    setJobTitle,
    setJobDescription,
    setJobLink,
    setClientMessage,
    setClientName,
    setUserName,
    setApplicationType,
    setInvitationStatus,
    setWebsite,
    addSavedProject,
    updateSavedProject,
    removeSavedProject,
    setAttachmentDetected,
    setBeginnerMode,
    setIsAgency,
    setShowNoProjectsModal,
    proceedAsBeginnerAndGenerate,
    setShowSkillMismatchModal,
    proceedDespiteMismatch,
    setPinnedProjectIds,
    setPersonalNotes,
    polishNotes,
    addSavedNote,
    removeSavedNote,
    updateSavedNote,
    updateSavedNoteLinks,
    analyzeSiteFromJobDescription,
    clearSiteRedFlags,
    updateInputScreeningQuestion,
    addClientQuestion,
    updateClientQuestion,
    removeClientQuestion,
    setJobAnalysis,
    analyzeJob,
    goToNextQuestion,
    goToPreviousQuestion,
    setCurrentQuestionIndex,
    updateAnswer,
    regenerateAnswer,
    addScreeningQuestion,
    updateScreeningQuestion,
    removeScreeningQuestion,
    setSelectedAPI,
    generateProposal,
    regenerateProposal,
    runPipelineWithKey,
    addClientMessage,
    generateReply,
    clearConversations,
    refineVariant,
    resetApp,
    setError,
    clearError,
    saveCurrentSession,
    loadSession,
    deleteSession: deleteSessionHandler,
    getAllSessions: getAllSessionsHandler,
  };

  return (
    <ProposalContext.Provider value={contextValue}>
      {children}
    </ProposalContext.Provider>
  );
}

export function useProposal(): ProposalContextType {
  const context = useContext(ProposalContext);
  if (!context) {
    throw new Error('useProposal must be used within a ProposalProvider');
  }
  return context;
}
