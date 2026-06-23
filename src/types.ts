export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export type AuditType = 'free' | 'deep';
export type AuditStatus = 'Pending' | 'In Progress' | 'Completed' | 'Scheduled' | 'Requires Payment';

export interface Audit {
  id: string;
  type: AuditType;
  title: string;
  status: AuditStatus;
  createdAt: number;
  fixedCost: number;
  outcomeSummary: string;
  recommendedRemedies: string[];
}

export interface User {
  name: string;
  email: string;
}

export interface PaymentInfo {
  billingName: string;
  cardBrand: string;
  last4: string;
  expiry: string;
}
