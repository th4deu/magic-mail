import { ImageResponse } from 'next/og';

export const alt = 'Email Temporario e Mensagens Anonimas';
export const size = {
  width: 1200,
  height: 600,
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
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              backgroundColor: 'white',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 50,
            }}
          >
            @
          </div>
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: 'white',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Email Temporario
        </div>

        <div
          style={{
            fontSize: 26,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
          }}
        >
          + Mensagens Anonimas | Gratis | Sem Cadastro
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
