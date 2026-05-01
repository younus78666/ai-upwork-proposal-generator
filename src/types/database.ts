// Database types for the application

export interface UserProfile {
  id: string;
  user_id: string;
  title: string;
  overview: string | null;
  skills: string[];
  hourly_rate: number | null;
  experience: string | null;
  portfolio_links: string[];
  availability: string;
  order_index: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  user_id: string;
  profile_id: string | null;
  title: string;
  description: string | null;
  job_link: string | null;
  client_name: string | null;
  application_type: 'applying' | 'invitation';
  analysis: Record<string, unknown> | null;
  questions: Array<{ question: string; answer: string }>;
  answers: Array<{ question: string; answer: string }>;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  job_id: string;
  detailed: string | null;
  medium: string | null;
  short: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  job_id: string;
  message_type: 'client' | 'assistant';
  content: string;
  created_at: string;
}

// Form types
export interface ProfileFormData {
  title: string;
  overview: string;
  skills: string[];
  hourly_rate: number | null;
  experience: string;
  portfolio_links: string[];
  availability: string;
  is_default: boolean;
}

export interface JobFormData {
  title: string;
  description: string;
  job_link: string;
  client_name: string;
  application_type: 'applying' | 'invitation';
  profile_id: string | null;
}
