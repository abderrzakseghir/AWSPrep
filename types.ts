export type Domain = 
  | 'Cloud Concepts' 
  | 'Security and Compliance' 
  | 'Cloud Technology and Services' 
  | 'Billing, Pricing, and Support';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctAnswerIds: string[];
  explanation: string;
  category: Domain; // Made mandatory and strictly typed
  references?: string[];
}

export enum QuizStatus {
  IDLE = 'IDLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface DomainScore {
  domain: Domain;
  correct: number;
  total: number;
  weight: number;
}