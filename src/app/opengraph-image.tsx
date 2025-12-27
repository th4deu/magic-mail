import { ImageResponse } from 'next/og';

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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              backgroundColor: 'white',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
            }}
          >
            @
          </div>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: 'white',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          Email Temporario
        </div>

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

        <div
          style={{
            display: 'flex',
            gap: 20,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 20,
            }}
          >
            Gratis
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 20,
            }}
          >
            Sem Cadastro
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: 50,
              color: 'white',
              fontSize: 20,
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
