export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';

export interface StudyTask {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  priority: Priority;
  due_date: string | null;
  status: Status;
  notes: string | null;
  created_at: string;
}

export interface StudyTaskInput {
  title: string;
  subject: string;
  priority: Priority;
  due_date: string | null;
  status: Status;
  notes: string | null;
}

export type Page = 'home' | 'tasks' | 'assistant';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AuthUser {
  id: string;
  email: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}
