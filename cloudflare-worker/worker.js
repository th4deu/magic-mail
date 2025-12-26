/**
 * Cloudflare Email Worker
 * Processa emails recebidos e salva no R2
 */

// Dominios permitidos
const ALLOWED_DOMAINS = [
  'biscoito.email',
  'bolacha.email',
  'tuamaeaquelaursa.email',
  'aquelaursa.email',
  'xablau.email',
  'porranenhuma.com',
];

export default {
  async email(message, env, ctx) {
    try {
      const to = message.to;
      const from = message.from;

      console.log(`Email recebido: ${from} -> ${to}`);

      // Extrair slug e dominio
      const atIndex = to.indexOf('@');
      if (atIndex === -1) {
        console.log('Email invalido:', to);
        return;
      }

      const slug = to.substring(0, atIndex).toLowerCase();
      const domain = to.substring(atIndex + 1).toLowerCase();

      // Verificar se dominio e permitido
      if (!ALLOWED_DOMAINS.includes(domain)) {
        console.log('Dominio nao permitido:', domain);
        return;
      }

      // Verificar se a caixa existe
      const metaKey = `${domain}/${slug}/meta.json`;
      const metaObject = await env.INBOX_BUCKET.get(metaKey);

      if (!metaObject) {
        console.log('Caixa nao existe:', `${slug}@${domain}`);
        return;
      }

      // Ler email raw
      const rawEmail = await streamToString(message.raw);

      // Extrair informacoes do email
      const subject = message.headers.get('subject') || '(sem assunto)';
      const replyTo = message.headers.get('reply-to') || from;
      const fromName = extractFromName(from);
      const body = extractEmailBody(rawEmail);

      // Gerar ID da mensagem
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      const messageId = `msg-${timestamp}-${random}`;
      const now = new Date().toISOString();

      // Criar objeto da mensagem
      const messageData = {
        id: messageId,
        source: 'email',
        from: from,
        fromName: fromName,
        subject: subject,
        content: body,
        replyTo: replyTo,
        isRead: false,
        createdAt: now,
      };

      // Salvar no R2
      const messageKey = `${domain}/${slug}/messages/${messageId}.json`;
      await env.INBOX_BUCKET.put(messageKey, JSON.stringify(messageData, null, 2), {
        httpMetadata: {
          contentType: 'application/json',
        },
      });

      console.log('Email salvo:', messageId);

    } catch (error) {
      console.error('Erro ao processar email:', error);
    }
  },
};

// Converter ReadableStream para string
async function streamToString(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }

  return result;
}

// Extrair nome do remetente
function extractFromName(from) {
  // Formato: "Nome" <email@domain.com> ou Nome <email@domain.com>
  const match = from.match(/^"?([^"<]+)"?\s*</);
  if (match) {
    return match[1].trim();
  }
  // Fallback: usar parte antes do @
  const atIndex = from.indexOf('@');
  if (atIndex > 0) {
    return from.substring(0, atIndex);
  }
  return from;
}

// Extrair corpo do email
function extractEmailBody(rawEmail) {
  try {
    // Separar headers do body
    const headerBodySplit = rawEmail.indexOf('\r\n\r\n');
    if (headerBodySplit === -1) {
      return rawEmail.substring(0, 5000);
    }

    const headers = rawEmail.substring(0, headerBodySplit).toLowerCase();
    let body = rawEmail.substring(headerBodySplit + 4);

    // Verificar Content-Type
    const contentTypeMatch = headers.match(/content-type:\s*([^\r\n;]+)/);
    const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : 'text/plain';

    // Se for multipart, tentar extrair texto
    if (contentType.includes('multipart')) {
      const boundaryMatch = headers.match(/boundary="?([^"\r\n]+)"?/);
      if (boundaryMatch) {
        const boundary = boundaryMatch[1];
        const parts = body.split('--' + boundary);

        for (const part of parts) {
          // Procurar parte text/plain
          if (part.toLowerCase().includes('content-type: text/plain')) {
            const partBodyStart = part.indexOf('\r\n\r\n');
            if (partBodyStart !== -1) {
              body = part.substring(partBodyStart + 4);
              break;
            }
          }
          // Fallback para text/html
          if (part.toLowerCase().includes('content-type: text/html')) {
            const partBodyStart = part.indexOf('\r\n\r\n');
            if (partBodyStart !== -1) {
              body = stripHtml(part.substring(partBodyStart + 4));
            }
          }
        }
      }
    }

    // Se for HTML, remover tags
    if (contentType.includes('html')) {
      body = stripHtml(body);
    }

    // Decodificar quoted-printable se necessario
    if (headers.includes('content-transfer-encoding: quoted-printable')) {
      body = decodeQuotedPrintable(body);
    }

    // Decodificar base64 se necessario
    if (headers.includes('content-transfer-encoding: base64')) {
      try {
        body = atob(body.replace(/\s/g, ''));
      } catch (e) {
        // Manter como esta se falhar
      }
    }

    // Limpar e limitar tamanho
    body = body.trim();
    if (body.length > 5000) {
      body = body.substring(0, 5000) + '...';
    }

    return body || '(email sem conteudo de texto)';

  } catch (error) {
    console.error('Erro ao extrair corpo:', error);
    return '(erro ao processar email)';
  }
}

// Remover tags HTML
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Decodificar quoted-printable
function decodeQuotedPrintable(str) {
  return str
    .replace(/=\r?\n/g, '')
    .replace(/=([0-9A-F]{2})/gi, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
}
