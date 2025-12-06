import { NextRequest, NextResponse } from 'next/server';
import { generateUsername, generateToken, getDomainFromHeaders } from '@/lib/utils';
import {
  getBoxesIndex,
  saveBoxesIndex,
  saveBoxMeta,
  saveTokenLookup,
  boxExists,
  getBoxMeta,
} from '@/lib/s3';
import { isAllowedDomain, Box, MessageMode } from '@/types';

// POST /api/boxes - Create a new box
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const domain = body.domain || getDomainFromHeaders(request.headers);
    let slug = body.slug?.toLowerCase().trim();
    const messageMode: MessageMode = body.messageMode === 'identified' ? 'identified' : 'anonymous';

    // Validate domain
    if (!isAllowedDomain(domain)) {
      return NextResponse.json(
        { error: 'Domínio não permitido' },
        { status: 400 }
      );
    }

    // If custom slug provided, validate it
    if (slug) {
      const slugRegex = /^[a-z0-9]{3,30}$/;
      if (!slugRegex.test(slug)) {
        return NextResponse.json(
          { error: 'Nome deve ter entre 3-30 caracteres (apenas letras minúsculas e números)' },
          { status: 400 }
        );
      }

      // Check if already exists
      if (await boxExists(domain, slug)) {
        return NextResponse.json(
          { error: 'Este nome já está em uso. Escolha outro.' },
          { status: 409 }
        );
      }
    } else {
      // Generate unique username
      slug = generateUsername();
      let attempts = 0;
      while (await boxExists(domain, slug) && attempts < 10) {
        slug = generateUsername();
        attempts++;
      }

      if (attempts >= 10) {
        return NextResponse.json(
          { error: 'Não foi possível gerar um nome único' },
          { status: 500 }
        );
      }
    }

    const token = generateToken();
    const now = new Date().toISOString();

    const box: Box = {
      slug,
      domain,
      token,
      messageMode,
      createdAt: now,
    };

    // Save box meta
    await saveBoxMeta(domain, slug, box);

    // Save token lookup
    await saveTokenLookup(token, { slug, domain });

    // Update boxes index
    const index = await getBoxesIndex();
    index[`${domain}:${slug}`] = { token, createdAt: now };
    await saveBoxesIndex(index);

    // Build URLs based on the request host (for localhost development)
    const host = request.headers.get('host') || domain;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    return NextResponse.json({
      slug,
      domain,
      token,
      messageMode,
      publicUrl: `${baseUrl}/${slug}`,
      inboxUrl: `${baseUrl}/inbox/${token}`,
      email: `${slug}@${domain}`,
    });
  } catch (error) {
    console.error('Error creating box:', error);
    return NextResponse.json(
      { error: 'Erro ao criar caixa' },
      { status: 500 }
    );
  }
}

// GET /api/boxes?slug=xxx&domain=xxx - Check if box exists
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const domain = searchParams.get('domain') || getDomainFromHeaders(request.headers);

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

    const box = await getBoxMeta(domain, slug);

    if (!box) {
      return NextResponse.json(
        { error: 'Caixa não encontrada' },
        { status: 404 }
      );
    }

    // Return public info only (no token)
    return NextResponse.json({
      slug: box.slug,
      domain: box.domain,
      email: `${box.slug}@${box.domain}`,
      exists: true,
    });
  } catch (error) {
    console.error('Error checking box:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar caixa' },
      { status: 500 }
    );
  }
}
