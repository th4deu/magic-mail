'use client';

import { useState } from 'react';

interface SendMessageFormProps {
  slug: string;
  domain: string;
}

export default function SendMessageForm({ slug, domain }: SendMessageFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, domain, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }

      setSuccess(true);
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Mensagem enviada!
          </h2>
          <p className="text-gray-600 mb-6">
            Sua mensagem anonima foi entregue com sucesso.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="px-8 py-3 bg-emerald-500 text-white font-semibold rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
        <div className="mb-5">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
            Sua mensagem
          </label>
          <textarea
            id="message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva aqui o que voce quer dizer..."
            rows={6}
            maxLength={5000}
            required
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-gray-900 border-2 border-gray-200 focus:border-pink-500 focus:bg-white transition-all outline-none resize-none text-base"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-400">
              Sua identidade esta protegida
            </p>
            <span className={`text-xs ${content.length > 4500 ? 'text-amber-500' : 'text-gray-400'}`}>
              {content.length}/5000
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full px-8 py-4 bg-pink-500 text-white text-lg font-bold rounded-2xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-pink-200 disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Enviar mensagem
            </span>
          )}
        </button>
      </div>

      {/* Mode indicator */}
      <div className="mt-4 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-violet-100 text-violet-700 border border-violet-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mensagem 100% anonima
        </span>
      </div>
    </form>
  );
}
