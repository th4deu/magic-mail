import { v4 as uuidv4 } from 'uuid';

// Nomes brasileiros comuns
const FIRST_NAMES = [
  // Masculinos
  'joao', 'pedro', 'lucas', 'mateus', 'gabriel', 'rafael', 'bruno', 'diego',
  'thiago', 'andre', 'felipe', 'rodrigo', 'carlos', 'marcos', 'paulo', 'daniel',
  'leonardo', 'gustavo', 'henrique', 'victor', 'eduardo', 'marcelo', 'ricardo', 'fernando',
  'antonio', 'jose', 'luiz', 'sergio', 'fabio', 'alex', 'caio', 'vinicius',
  'guilherme', 'leandro', 'renato', 'claudio', 'roberto', 'miguel', 'arthur', 'bernardo',
  // Femininos
  'maria', 'ana', 'julia', 'beatriz', 'larissa', 'fernanda', 'camila', 'amanda',
  'patricia', 'carolina', 'mariana', 'leticia', 'gabriela', 'bruna', 'jessica', 'aline',
  'vanessa', 'natalia', 'rafaela', 'daniela', 'priscila', 'tatiana', 'isabela', 'renata',
  'carla', 'claudia', 'sandra', 'lucia', 'helena', 'sofia', 'valentina', 'alice',
  'laura', 'livia', 'bianca', 'vitoria', 'lorena', 'luiza', 'thais', 'monique',
];

// Sobrenomes brasileiros comuns
const LAST_NAMES = [
  'silva', 'santos', 'oliveira', 'souza', 'rodrigues', 'ferreira', 'alves', 'pereira',
  'lima', 'gomes', 'costa', 'ribeiro', 'martins', 'carvalho', 'almeida', 'lopes',
  'soares', 'fernandes', 'vieira', 'barbosa', 'rocha', 'dias', 'nascimento', 'andrade',
  'moreira', 'nunes', 'marques', 'machado', 'mendes', 'freitas', 'cardoso', 'ramos',
  'goncalves', 'santana', 'teixeira', 'araujo', 'pinto', 'correia', 'campos', 'cunha',
  'azevedo', 'melo', 'monteiro', 'castro', 'miranda', 'moura', 'batista', 'borges',
];

// Generate a realistic email username (nome.sobrenome or nome.sobrenome123)
export function generateUsername(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  // 50% chance de adicionar número
  const addNumber = Math.random() > 0.5;
  const number = addNumber ? Math.floor(Math.random() * 99) + 1 : '';

  // Formatos variados: nome.sobrenome, nomesobrenome, nome_sobrenome
  const formats = [
    `${firstName}.${lastName}${number}`,
    `${firstName}${lastName}${number}`,
    `${firstName}_${lastName}${number}`,
  ];

  return formats[Math.floor(Math.random() * formats.length)];
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
