import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Email Temporario e Mensagens Anonimas';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Envelope Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
          >
            <rect x="10" y="30" width="100" height="70" rx="8" fill="white" />
            <path d="M10 40L60 75L110 40" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" />
            <circle cx="60" cy="55" r="15" fill="#8B5CF6" opacity="0.2" />
            <text x="52" y="62" fill="#7C3AED" fontSize="20" fontWeight="bold">@</text>
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          Email Temporario
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          + Mensagens Anonimas
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 24,
            }}
          >
            Gratis
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 24,
            }}
          >
            Sem Cadastro
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 24,
            }}
          >
            100% Privado
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
