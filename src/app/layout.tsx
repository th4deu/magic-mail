import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { ALLOWED_DOMAINS } from "@/types";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#8B5CF6',
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const domain = ALLOWED_DOMAINS.find(d => host.includes(d)) || 'porranenhuma.com';
  const isLocalhost = host.includes('localhost');
  const protocol = isLocalhost ? 'http' : 'https';
  const baseUrl = isLocalhost ? `${protocol}://${host}` : `${protocol}://${domain}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `Email Temporário Grátis - ${domain}`,
      template: `%s | ${domain}`,
    },
    description: `Crie um email temporário grátis em ${domain}. Receba emails de confirmação sem spam. Receba feedbacks anônimos, mensagens secretas e confissões. Ideal para testes de sites, cadastros em promoções e caixa de sugestões. Sem cadastro, sem senha, 100% privado.`,
    keywords: [
      // Email temporário
      'email temporário',
      'email descartável',
      'email fake',
      'email falso',
      'temp mail',
      'email grátis',
      'disposable email',
      'temporary email',
      'email sem cadastro',
      'email privado',
      'anti spam',
      // Mensagens anônimas
      'mensagens anônimas',
      'mensagem secreta',
      'inbox anônimo',
      'confissões anônimas',
      'perguntas anônimas',
      'feedback anônimo',
      // Casos de uso
      'email para testes',
      'email para desenvolvimento',
      'email temporário para sites',
      'email para cadastro',
      'email para promoções',
      'email para newsletters',
      'caixa de sugestões anônima',
      'feedback de clientes',
      'receber feedbacks',
      'ask me anything',
      'pergunta secreta',
      'confissão secreta',
      // Domínio
      domain,
    ],
    authors: [{ name: 'UAISE', url: 'https://uaise.com' }],
    creator: 'UAISE',
    publisher: 'UAISE',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: baseUrl,
      siteName: domain,
      title: `Email Temporário Grátis - ${domain}`,
      description: `Crie um email temporário grátis em ${domain}. Receba emails sem spam. Mensagens anônimas sem cadastro.`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${domain} - Email Temporário e Mensagens Anônimas`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Email Temporário Grátis - ${domain}`,
      description: `Crie um email temporário grátis em ${domain}. Receba emails sem spam. Mensagens anônimas sem cadastro.`,
      images: [`${baseUrl}/og-image.png`],
      creator: '@uaborei',
    },
    alternates: {
      canonical: baseUrl,
    },
    category: 'technology',
    classification: 'Email Service',
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': domain,
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const domain = ALLOWED_DOMAINS.find(d => host.includes(d)) || 'porranenhuma.com';
  const isLocalhost = host.includes('localhost');
  const protocol = isLocalhost ? 'http' : 'https';
  const baseUrl = isLocalhost ? `${protocol}://${host}` : `${protocol}://${domain}`;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `Email Temporário - ${domain}`,
    description: `Serviço gratuito de email temporário e mensagens anônimas em ${domain}. Crie um email descartável em segundos, sem cadastro.`,
    url: baseUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    featureList: [
      'Email temporário grátis',
      'Mensagens anônimas',
      'Sem cadastro necessário',
      'Privacidade total',
      'Recebimento instantâneo',
      'Feedbacks anônimos',
      'Caixa de sugestões anônima',
      'Email para testes de sites',
      'Email para cadastros em promoções',
      'Confissões e perguntas secretas',
      'Proteção contra spam',
      'Múltiplos domínios disponíveis',
    ],
    author: {
      '@type': 'Organization',
      name: 'UAISE',
      url: 'https://uaise.com',
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-28KRR6SED7" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-28KRR6SED7');
            `,
          }}
        />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
