import { NextRequest, NextResponse } from 'next/server';
import { boxExists } from '@/lib/s3';
import { isAllowedDomain } from '@/types';

// GET /api/check?slug=xxx&domain=xxx - Check if username is available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const domain = searchParams.get('domain');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug é obrigatório' },
        { status: 400 }
      );
    }

    if (!domain || !isAllowedDomain(domain)) {
      return NextResponse.json(
        { error: 'Domínio inválido' },
        { status: 400 }
      );
    }

    // Validate slug format (lowercase letters, numbers, max 30 chars)
    const slugRegex = /^[a-z0-9]{3,30}$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({
        available: false,
        error: 'Nome deve ter entre 3-30 caracteres (apenas letras minúsculas e números)',
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
