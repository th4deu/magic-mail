import { NextRequest, NextResponse } from 'next/server';
import { getBoxByToken, listMessages, deleteBox } from '@/lib/s3';

interface Params {
  params: Promise<{ token: string }>;
}

// GET /api/inbox/[token] - Get inbox messages
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { token } = await params;

    const box = await getBoxByToken(token);
    if (!box) {
      return NextResponse.json(
        { error: 'Caixa não encontrada' },
        { status: 404 }
      );
    }

    const messages = await listMessages(box.domain, box.slug);

    // Build public URL based on request host (for localhost development)
    const host = request.headers.get('host') || box.domain;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const publicUrl = `${protocol}://${host}/${box.slug}`;

    return NextResponse.json({
      box: {
        slug: box.slug,
        domain: box.domain,
        email: `${box.slug}@${box.domain}`,
        publicUrl,
        messageMode: box.messageMode,
        createdAt: box.createdAt,
      },
      messages,
      totalMessages: messages.length,
      unreadCount: messages.filter(m => !m.isRead).length,
    });
  } catch (error) {
    console.error('Error fetching inbox:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    );
  }
}

// DELETE /api/inbox/[token] - Delete entire box
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { token } = await params;

    const box = await getBoxByToken(token);
    if (!box) {
      return NextResponse.json(
        { error: 'Caixa não encontrada' },
        { status: 404 }
      );
    }

    await deleteBox(box.domain, box.slug, token);

    return NextResponse.json({
      success: true,
      message: 'Caixa deletada com sucesso',
    });
  } catch (error) {
    console.error('Error deleting box:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar caixa' },
      { status: 500 }
    );
  }
}
