import { NextRequest, NextResponse } from 'next/server';
import { boxExists } from '@/lib/s3';
import { isAllowedDomain } from '@/types';

// Palavras reservadas (mesma lista do /api/boxes)
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
  'nome', 'name', 'seunome', 'yourname', 'meunome', 'myname',
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

// GET /api/check?slug=xxx&domain=xxx - Check if username is available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const domain = searchParams.get('domain');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug e obrigatorio' },
        { status: 400 }
      );
    }

    if (!domain || !isAllowedDomain(domain)) {
      return NextResponse.json(
        { error: 'Dominio invalido' },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase letters, numbers, dots, underscores, max 30 chars)
    const slugRegex = /^[a-z0-9._]{3,30}$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({
        available: false,
        error: 'Nome deve ter entre 3-30 caracteres (letras, numeros, ponto e underline)',
      });
    }

    // Check reserved words
    if (isReservedWord(slug)) {
      return NextResponse.json({
        available: false,
        error: 'Este nome nao pode ser usado',
      });
    }

    let exists = false;
    try {
      exists = await boxExists(domain, slug);
    } catch {
      // S3 not configured, assume available
      exists = false;
    }

    return NextResponse.json({
      slug,
      domain,
      available: !exists,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    // Return available: true as fallback to not block user
    return NextResponse.json({
      available: true,
    });
  }
}
