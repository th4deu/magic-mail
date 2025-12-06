import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface SendMessageParams {
  toEmail: string;
  fromDomain: string;
  content: string;
  messageId: string;
}

export async function sendAnonymousMessage({
  toEmail,
  fromDomain,
  content,
  messageId,
}: SendMessageParams): Promise<void> {
  const command = new SendEmailCommand({
    Source: `anonimo@${fromDomain}`,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: `Nova mensagem anônima [${messageId}]`,
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: content,
          Charset: 'UTF-8',
        },
        Html: {
          Data: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Nova mensagem anônima</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(content)}</p>
              </div>
              <p style="color: #666; font-size: 12px;">
                Esta mensagem foi enviada anonimamente através de ${fromDomain}
              </p>
            </div>
          `,
          Charset: 'UTF-8',
        },
      },
    },
  });

  await sesClient.send(command);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
