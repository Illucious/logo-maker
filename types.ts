
export interface LogoPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'minimalist' | 'geometric' | 'abstract' | 'typographic';
}

export interface GeneratedLogo {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}
