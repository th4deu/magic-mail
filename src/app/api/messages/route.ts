import { NextRequest, NextResponse } from 'next/server';
import { generateMessageId, validateMessageContent, getDomainFromHeaders } from '@/lib/utils';
import { getBoxMeta, saveMessage } from '@/lib/s3';
import { sendAnonymousMessage } from '@/lib/ses';
import { isAllowedDomain, Message } from '@/types';

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // 10 messages per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// POST /api/messages - Send anonymous message
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Muitas mensagens. Aguarde um minuto.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { slug, content } = body;
    const domain = body.domain || getDomainFromHeaders(request.headers);

    // Validate inputs
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug é obrigatório' },
        { status: 400 }
      );
    }

    if (!isAllowedDomain(domain)) {
      return NextResponse.json(
        { error: 'Domínio não permitido' },
        { status: 400 }
      );
    }

    const validation = validateMessageContent(content);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check if box exists
    const box = await getBoxMeta(domain, slug);
    if (!box) {
      return NextResponse.json(
        { error: 'Caixa não encontrada' },
        { status: 404 }
      );
    }

    const messageId = generateMessageId();
    const now = new Date().toISOString();

    const message: Message = {
      id: messageId,
      content: content.trim(),
      isRead: false,
      createdAt: now,
    };

    // Save message to S3
    await saveMessage(domain, slug, message);

    // Send email notification via SES
    try {
      await sendAnonymousMessage({
        toEmail: `${slug}@${domain}`,
        fromDomain: domain,
        content: content.trim(),
        messageId,
      });
    } catch (emailError) {
      // Log but don't fail - message is already saved
      console.error('Error sending email notification:', emailError);
    }

    return NextResponse.json({
      success: true,
      messageId,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}
