import { NextRequest, NextResponse } from 'next/server';
import { generateUsername } from '@/lib/utils';
import { isAllowedDomain, ALLOWED_DOMAINS } from '@/types';

// GET /api/suggest?domain=xxx - Suggest a username
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || ALLOWED_DOMAINS[0];

    if (!isAllowedDomain(domain)) {
      return NextResponse.json(
        { error: 'Domínio não permitido' },
        { status: 400 }
      );
    }

    // Generate a random username
    // The actual availability check will be done by /api/check
    const username = generateUsername();

    return NextResponse.json({
      username,
      email: `${username}@${domain}`,
    });
  } catch (error) {
    console.error('Error suggesting username:', error);
    return NextResponse.json(
      { error: 'Erro ao sugerir nome' },
      { status: 500 }
    );
  }
}
