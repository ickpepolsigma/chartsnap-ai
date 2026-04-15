export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
}

export interface AnalysisResponse {
  decision: 'Buy' | 'Sell' | 'Nothing';
  reason: string;
  analyzedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}
