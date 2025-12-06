import { v4 as uuidv4 } from 'uuid';

// Lista de adjetivos em português - mais naturais e semânticos
const ADJECTIVES = [
  // Cores
  'azul', 'verde', 'vermelho', 'amarelo', 'roxo', 'laranja', 'rosa', 'dourado', 'prateado',
  // Natureza
  'solar', 'lunar', 'estelar', 'tropical', 'polar', 'oceano', 'floresta', 'montanha',
  // Sentimentos positivos
  'feliz', 'alegre', 'sereno', 'calmo', 'tranquilo', 'gentil', 'doce',
  // Características
  'rapido', 'veloz', 'agil', 'forte', 'bravo', 'esperto', 'sabio',
  // Clima/Tempo
  'quente', 'frio', 'fresco', 'morno',
  // Épocas
  'outono', 'verao', 'inverno', 'primavera',
  // Mistério
  'secreto', 'oculto', 'misterioso', 'magico', 'encantado',
];

// Lista de substantivos em português - mais naturais e semânticos
const NOUNS = [
  // Animais comuns
  'gato', 'cachorro', 'passaro', 'peixe', 'coruja', 'aguia', 'falcao',
  'lobo', 'raposa', 'urso', 'tigre', 'leao', 'pantera', 'jaguar',
  'coelho', 'esquilo', 'castor', 'lontra', 'foca', 'golfinho', 'baleia',
  'pato', 'cisne', 'flamingo', 'tucano', 'arara', 'papagaio', 'beija',
  // Natureza
  'rio', 'lago', 'mar', 'oceano', 'cachoeira', 'fonte', 'nascente',
  'floresta', 'bosque', 'jardim', 'prado', 'vale', 'colina', 'montanha',
  'nuvem', 'vento', 'brisa', 'tempestade', 'trovao', 'raio', 'aurora',
  'estrela', 'lua', 'sol', 'cometa', 'galaxia', 'nebulosa', 'constelacao',
  // Elementos
  'fogo', 'agua', 'terra', 'ar', 'cristal', 'diamante', 'rubi', 'safira',
  // Plantas
  'rosa', 'lirio', 'tulipa', 'orquidea', 'girassol', 'margarida', 'violeta',
  'carvalho', 'cedro', 'pinheiro', 'bamboo', 'sequoia', 'oliveira',
  // Fantasia
  'dragao', 'fenix', 'unicornio', 'grifo', 'sereia', 'fada', 'elfo',
];

// Generate a fun, memorable username (Portuguese style: noun + adjective)
export function generateUsername(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 100);
  return `${noun}${adjective}${number}`;
}

// Generate a short, memorable slug (6 characters)
export function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 6; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

// Generate a secure token (UUID v4)
export function generateToken(): string {
  return uuidv4();
}

// Generate a message ID
export function generateMessageId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `msg-${timestamp}-${random}`;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Get domain from request headers
export function getDomainFromHeaders(headers: Headers): string {
  const host = headers.get('host') || headers.get('x-forwarded-host') || '';
  // Remove port if present
  return host.split(':')[0];
}

// Validate message content
export function validateMessageContent(content: string): { valid: boolean; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Mensagem não pode estar vazia' };
  }
  if (content.length > 5000) {
    return { valid: false, error: 'Mensagem muito longa (máximo 5000 caracteres)' };
  }
  return { valid: true };
}
