export type Role = 'system' | 'user' | 'assistant' | 'tool';

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number; // Date.now()
  error?: string;
};

export type SendPayload = {
  messages: Array<Pick<ChatMessage, 'role' | 'content'>>;
  locale?: 'ru' | 'de';
};