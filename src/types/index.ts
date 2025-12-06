export type MessageMode = 'anonymous' | 'identified';

export interface Box {
  slug: string;
  domain: string;
  token: string;
  messageMode: MessageMode;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  // Email mode fields (when box.messageMode is 'identified')
  from?: string;        // Sender email address
  fromName?: string;    // Sender display name
  subject?: string;     // Email subject
  replyTo?: string;     // Reply-to address
  // Anonymous mode has no sender info
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
  'biscoito.email',
  'bolacha.email',
  'tuamaeaquelaursa.email',
  'aquelaursa.email',
  'xablau.email',
  'porranenhuma.com',
] as const;

export type AllowedDomain = typeof ALLOWED_DOMAINS[number];

export function isAllowedDomain(domain: string): domain is AllowedDomain {
  return ALLOWED_DOMAINS.includes(domain as AllowedDomain);
}
