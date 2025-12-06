import { NextRequest, NextResponse } from 'next/server';
import { getBoxByToken, getMessage, saveMessage, deleteMessage } from '@/lib/s3';

interface Params {
  params: Promise<{ token: string; messageId: string }>;
}

// PATCH /api/inbox/[token]/messages/[messageId] - Mark as read/unread
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { token, messageId } = await params;
    const body = await request.json();

    const box = await getBoxByToken(token);
    if (!box) {
      return NextResponse.json(
        { error: 'Caixa não encontrada' },
        { status: 404 }
      );
    }

    const message = await getMessage(box.domain, box.slug, messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      );
    }

    // Update message
    if (typeof body.isRead === 'boolean') {
      message.isRead = body.isRead;
    }

    await saveMessage(box.domain, box.slug, message);

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar mensagem' },
      { status: 500 }
    );
  }
}

// DELETE /api/inbox/[token]/messages/[messageId] - Delete message
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { token, messageId } = await params;

    const box = await getBoxByToken(token);
    if (!box) {
      return NextResponse.json(
        { error: 'Caixa não encontrada' },
        { status: 404 }
      );
    }

    const message = await getMessage(box.domain, box.slug, messageId);
    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      );
    }

    await deleteMessage(box.domain, box.slug, messageId);

    return NextResponse.json({
      success: true,
      message: 'Mensagem deletada com sucesso',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar mensagem' },
      { status: 500 }
    );
  }
}
