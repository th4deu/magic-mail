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
      default: `Email Temporario Gratis - ${domain}`,
      template: `%s | ${domain}`,
    },
    description: `Crie um email temporario gratis em ${domain}. Receba emails de confirmacao sem spam. Envie e receba mensagens anonimas. Sem cadastro, sem senha, 100% privado.`,
    keywords: [
      'email temporario',
      'email descartavel',
      'email fake',
      'email falso',
      'temp mail',
      'email gratis',
      'mensagens anonimas',
      'mensagem secreta',
      'inbox anonimo',
      'email sem cadastro',
      'email privado',
      'anti spam',
      'email teste',
      'disposable email',
      'temporary email',
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
      title: `Email Temporario Gratis - ${domain}`,
      description: `Crie um email temporario gratis em ${domain}. Receba emails sem spam. Mensagens anonimas sem cadastro.`,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${domain} - Email Temporario e Mensagens Anonimas`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Email Temporario Gratis - ${domain}`,
      description: `Crie um email temporario gratis em ${domain}. Receba emails sem spam. Mensagens anonimas sem cadastro.`,
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
    name: `Email Temporario - ${domain}`,
    description: `Servico gratuito de email temporario e mensagens anonimas em ${domain}. Crie um email descartavel em segundos, sem cadastro.`,
    url: baseUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    featureList: [
      'Email temporario gratis',
      'Mensagens anonimas',
      'Sem cadastro necessario',
      'Privacidade total',
      'Recebimento instantaneo',
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
