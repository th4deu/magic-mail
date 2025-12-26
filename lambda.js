/**
 * AWS Lambda para processar emails recebidos pelo SES
 *
 * Fluxo: Email -> SES -> S3 (raw) -> Lambda -> S3 (app) -> App
 *
 * Le de:  magic-mails-inboxes/emails/{messageId}
 * Salva:  magic-mails-inboxes/{domain}/{slug}/messages/{messageId}.json
 *
 * Exemplo:
 * Entrada: magic-mails-inboxes/emails/abc123
 * Saida:   magic-mails-inboxes/xablau.email/meunome/messages/abc123.json
 *
 * Configurar no AWS Lambda:
 * - Runtime: Node.js 18.x ou 20.x
 * - Handler: lambda.handler
 * - Timeout: 30 segundos
 * - Memory: 256 MB
 *
 * Variaveis de ambiente:
 * - AWS_REGION: us-east-1
 * - INBOX_BUCKET: magic-mails-inboxes (onde SES salva emails raw)
 * - APP_BUCKET: magic-mails-inboxes (onde a aplicacao le as mensagens)
 */

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { simpleParser } = require('mailparser');

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

const INBOX_BUCKET = process.env.INBOX_BUCKET || 'magic-mails-inboxes';
const APP_BUCKET = process.env.APP_BUCKET || 'magic-mails-inboxes';

/**
 * Handler principal - invocado pelo SES quando email chega
 */
exports.handler = async (event) => {
  console.log('Evento recebido:', JSON.stringify(event, null, 2));

  try {
    const sesRecord = event.Records[0].ses;
    const messageId = sesRecord.mail.messageId;
    const recipient = sesRecord.mail.destination[0];
    const [slug, domain] = recipient.split('@');

    console.log(`Processando email: ${messageId}`);
    console.log(`Destinatário: ${slug}@${domain}`);

    // 0. Verificar se a caixa existe
    try {
      await s3.send(new GetObjectCommand({
        Bucket: APP_BUCKET,
        Key: `${domain}/${slug}/meta.json`
      }));
      console.log(`Caixa ${slug}@${domain} encontrada`);
    } catch (err) {
      if (err.name === 'NoSuchKey') {
        console.log(`Caixa ${slug}@${domain} não existe - ignorando email`);
        return { statusCode: 200, body: 'Ignored - box does not exist' };
      }
      throw err;
    }

    // 1. Ler email raw do S3
    const rawEmail = await s3.send(new GetObjectCommand({
      Bucket: INBOX_BUCKET,
      Key: `emails/${messageId}`
    }));
    const emailContent = await rawEmail.Body.transformToString();

    // 2. Parse do email MIME
    const parsed = await simpleParser(emailContent);

    // 3. Montar mensagem estruturada
    const message = {
      id: messageId,
      source: 'email',
      from: parsed.from?.value[0]?.address || null,
      fromName: parsed.from?.value[0]?.name || null,
      subject: parsed.subject || '(Sem assunto)',
      content: extractTextContent(parsed),
      replyTo: parsed.replyTo?.value[0]?.address || parsed.from?.value[0]?.address || null,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    // 4. Salvar no bucket da aplicação: {domain}/{slug}/messages/{messageId}.json
    const messageKey = `${domain}/${slug}/messages/${messageId}.json`;
    await s3.send(new PutObjectCommand({
      Bucket: APP_BUCKET,
      Key: messageKey,
      Body: JSON.stringify(message, null, 2),
      ContentType: 'application/json'
    }));

    console.log(`Email salvo: s3://${APP_BUCKET}/${messageKey}`);
    return { statusCode: 200, body: 'Email processed' };

  } catch (error) {
    console.error('Erro ao processar email:', error);
    throw error;
  }
};

/**
 * Extrai conteúdo de texto do email
 * Prioriza texto plano, faz fallback para HTML limpo
 */
function extractTextContent(parsed) {
  // Priorizar texto plano
  if (parsed.text) {
    return parsed.text.trim();
  }

  // Fallback: limpar HTML
  if (parsed.html) {
    return stripHtml(parsed.html);
  }

  return '';
}

/**
 * Remove tags HTML e retorna texto limpo
 */
function stripHtml(html) {
  if (!html) return '';

  return html
    // Remove scripts e styles
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Converte <br> e </p> em quebras de linha
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    // Remove todas as outras tags
    .replace(/<[^>]*>/g, '')
    // Decodifica entidades HTML comuns
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    // Remove espaços extras
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
