import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import SendMessageForm from '@/components/SendMessageForm';
import { getBoxMeta } from '@/lib/s3';
import { isAllowedDomain, ALLOWED_DOMAINS } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ domain?: string }>;
}

export default async function SendMessagePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;

  // Get domain from query param or host header
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const hostDomain = host.split(':')[0];

  // Use query param domain if provided and valid, otherwise use host
  let domain = query.domain || hostDomain;
  let box = null;

  // For localhost/development, default to first allowed domain if host is not valid
  if (!isAllowedDomain(domain)) {
    // Try to find the box in any allowed domain
    for (const allowedDomain of ALLOWED_DOMAINS) {
      const foundBox = await getBoxMeta(allowedDomain, slug);
      if (foundBox) {
        domain = allowedDomain;
        box = foundBox;
        break;
      }
    }
  } else {
    box = await getBoxMeta(domain, slug);
  }

  // Validate domain
  if (!isAllowedDomain(domain)) {
    notFound();
  }

  // Check if box exists
  if (!box) {
    notFound();
  }

  // Always show the send message form (hybrid mode)
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl mb-6 shadow-lg shadow-violet-200">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Envie uma mensagem <span className="text-fuchsia-600">anonima</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-4">
            Escreva o que voce quiser. A pessoa que criou esta caixa nao vai saber quem mandou.
          </p>

          <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow-sm border-2 border-gray-100">
            <svg className="w-4 h-4 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Mensagem anonima para {box.slug}</span>
          </div>
        </div>

        <SendMessageForm slug={slug} domain={domain} />

        {/* Email hint */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-50 rounded-2xl px-6 py-4 border border-blue-100">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm text-blue-700 font-medium">Tambem aceita emails</p>
              <p className="text-xs text-blue-600 font-mono">{box.slug}@{box.domain}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-5 shadow-sm border-2 border-gray-100">
            <div className="text-left">
              <p className="text-sm text-gray-500">Quer receber mensagens tambem?</p>
              <p className="font-semibold text-gray-900">Crie sua propria caixa</p>
            </div>
            <a
              href="/"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition-all font-medium text-sm shadow-lg shadow-violet-200"
            >
              Criar agora
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  return {
    title: `Enviar mensagem para ${slug}`,
    description: 'Envie uma mensagem anonima de forma segura e privada.',
  };
}
