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
import { isAllowedDomain, Box } from '@/types';

// Palavras reservadas e sugestivas (nao podem ser usadas como email)
const RESERVED_WORDS = [
  // Palavras do sistema
  'admin', 'administrator', 'root', 'system', 'mail', 'email', 'suporte', 'support',
  'help', 'ajuda', 'info', 'contact', 'contato', 'webmaster', 'postmaster',
  'hostmaster', 'abuse', 'noreply', 'no-reply', 'security', 'seguranca',
  'billing', 'sales', 'marketing', 'legal', 'compliance', 'privacy',
  'newsletter', 'notification', 'alert', 'daemon', 'mailer', 'ftp', 'www',
  // Genericas/Placeholders
  'qualquercoisa', 'qualquer', 'algumacois', 'nada', 'tudo', 'algo',
  'teste', 'test', 'testing', 'temp', 'temporario', 'temporary', 'tmp',
  'anonimo', 'anonymous', 'fake', 'falso', 'null', 'undefined', 'void',
  'exemplo', 'example', 'sample', 'demo', 'default', 'user', 'usuario',
  'nome', 'name', 'email', 'seunome', 'yourname', 'meunome', 'myname',
  'asdf', 'qwerty', 'aaa', 'bbb', 'ccc', 'abc', 'xyz', '123', '1234',
  // Sugestivas/Ofensivas
  'porra', 'caralho', 'foda', 'fodase', 'buceta', 'pinto', 'cu', 'merda', 'bosta',
  'puta', 'putaria', 'viado', 'bicha', 'gay', 'lesbica', 'travesti', 'pederasta',
  'nazista', 'nazi', 'hitler', 'kkk', 'racista', 'fascista', 'supremacist',
  'sex', 'sexo', 'porn', 'porno', 'xxx', 'nude', 'nudes', 'nsfw', 'adult',
  'droga', 'drug', 'cocaina', 'maconha', 'crack', 'heroina',
  // Marcas/Empresas
  'google', 'facebook', 'instagram', 'twitter', 'meta', 'apple', 'microsoft',
  'amazon', 'netflix', 'spotify', 'whatsapp', 'telegram', 'discord', 'tiktok',
  'youtube', 'linkedin', 'snapchat', 'pinterest', 'reddit', 'twitch',
  'paypal', 'mercadopago', 'nubank', 'itau', 'bradesco', 'santander',
  // Dominios proprios
  'porranenhuma', 'xablau', 'biscoito', 'bolacha', 'aquelaursa', 'tuamaeaquelaursa',
  'uaise', 'sorteador', 'sorteando', 'gerador',
];

function isReservedWord(slug: string): boolean {
  const normalized = slug.toLowerCase().replace(/[._]/g, '');
  return RESERVED_WORDS.some(word => normalized.includes(word));
}

// POST /api/boxes - Create a new box
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const domain = body.domain || getDomainFromHeaders(request.headers);
    let slug = body.slug?.toLowerCase().trim();

    // Validate domain
    if (!isAllowedDomain(domain)) {
      return NextResponse.json(
        { error: 'Dominio nao permitido' },
        { status: 400 }
      );
    }

    // If custom slug provided, validate it
    if (slug) {
      const slugRegex = /^[a-z0-9._]{3,30}$/;
      if (!slugRegex.test(slug)) {
        return NextResponse.json(
          { error: 'Nome deve ter entre 3-30 caracteres (letras, numeros, ponto e underline)' },
          { status: 400 }
        );
      }

      // Check reserved words
      if (isReservedWord(slug)) {
        return NextResponse.json(
          { error: 'Este nome nao pode ser usado. Escolha outro.' },
          { status: 400 }
        );
      }

      // Check if already exists
      if (await boxExists(domain, slug)) {
        return NextResponse.json(
          { error: 'Este nome ja esta em uso. Escolha outro.' },
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

    // Build URLs based on the selected domain
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost');
    const protocol = isLocalhost ? 'http' : 'https';
    // Em localhost, usa o host local; em producao, usa o dominio selecionado
    const baseUrl = isLocalhost ? `${protocol}://${host}` : `${protocol}://${domain}`;

    return NextResponse.json({
      slug,
      domain,
      token,
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
