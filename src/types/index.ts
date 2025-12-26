export type MessageSource = 'email' | 'anonymous';

export interface Box {
  slug: string;
  domain: string;
  token: string;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  source?: MessageSource;  // 'email' or 'anonymous' - undefined for legacy messages
  // Email fields (when source is 'email')
  from?: string;        // Sender email address
  fromName?: string;    // Sender display name
  subject?: string;     // Email subject
  replyTo?: string;     // Reply-to address
}

export interface BoxesIndex {
  [key: string]: {
    token: string;
    createdAt: string;
  };
}

export interface TokenLookup {
  slug: string;
  domain: string;
}

export const ALLOWED_DOMAINS = [
  'porranenhuma.com',  // Default domain (first)
  'biscoito.email',
  'bolacha.email',
  'tuamaeaquelaursa.email',
  'aquelaursa.email',
  'xablau.email',
  'suamaeaquelaursa.com',
] as const;

export const DEFAULT_DOMAIN = ALLOWED_DOMAINS[0];

export type AllowedDomain = typeof ALLOWED_DOMAINS[number];

export function isAllowedDomain(domain: string): domain is AllowedDomain {
  return ALLOWED_DOMAINS.includes(domain as AllowedDomain);
}
