import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: 'Email Temporario Gratis - Mensagens Anonimas | Sem Cadastro',
    template: '%s | Email Temporario',
  },
  description: 'Crie um email temporario gratis em segundos. Receba emails de confirmacao sem spam. Envie e receba mensagens anonimas. Sem cadastro, sem senha, 100% privado.',
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
    siteName: 'Email Temporario',
    title: 'Email Temporario Gratis - Mensagens Anonimas',
    description: 'Crie um email temporario gratis em segundos. Receba emails sem spam. Mensagens anonimas sem cadastro.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email Temporario Gratis - Mensagens Anonimas',
    description: 'Crie um email temporario gratis em segundos. Receba emails sem spam. Mensagens anonimas sem cadastro.',
    creator: '@uaborei',
  },
  alternates: {
    canonical: '/',
  },
  category: 'technology',
  classification: 'Email Service',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Email Temp',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
  },
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Email Temporario',
  description: 'Servico gratuito de email temporario e mensagens anonimas. Crie um email descartavel em segundos, sem cadastro.',
  url: 'https://porranenhuma.com',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
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
