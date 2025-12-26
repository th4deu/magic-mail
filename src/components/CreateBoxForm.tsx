'use client';

import { useState, useEffect, useCallback } from 'react';
import { ALLOWED_DOMAINS } from '@/types';

interface BoxResult {
  slug: string;
  domain: string;
  token: string;
  publicUrl: string;
  inboxUrl: string;
  email: string;
}

// Nomes reais para fallback
const FIRST_NAMES = ['joao', 'maria', 'pedro', 'ana', 'lucas', 'julia', 'gabriel', 'beatriz', 'rafael', 'camila'];
const LAST_NAMES = ['silva', 'santos', 'oliveira', 'souza', 'costa', 'pereira', 'lima', 'rodrigues', 'almeida', 'nascimento'];

function generateFallbackName(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${firstName}.${lastName}${num}`;
}

export default function CreateBoxForm() {
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BoxResult | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>(ALLOWED_DOMAINS[0]);
  const [customName, setCustomName] = useState('');
  const [suggestedName, setSuggestedName] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const suggestName = useCallback(async () => {
    setSuggesting(true);
    try {
      const response = await fetch(`/api/suggest?domain=${selectedDomain}`);
      const data = await response.json();
      if (data.username) {
        setSuggestedName(data.username);
        setCustomName(data.username);
        setIsAvailable(null);
      }
    } catch {
      const fallbackName = generateFallbackName();
      setSuggestedName(fallbackName);
      setCustomName(fallbackName);
      setIsAvailable(null);
    } finally {
      setSuggesting(false);
    }
  }, [selectedDomain]);

  useEffect(() => {
    suggestName();
  }, [suggestName]);

  useEffect(() => {
    if (!customName || customName === suggestedName) {
      setIsAvailable(customName ? true : null);
      return;
    }

    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const response = await fetch(`/api/check?slug=${customName}&domain=${selectedDomain}`);
        const data = await response.json();
        setIsAvailable(data.available);
      } catch {
        setIsAvailable(null);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customName, selectedDomain, suggestedName]);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/boxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: selectedDomain, slug: customName || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar caixa');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (result) {
    return (
      <div className="w-full max-w-xl mx-auto">
        {/* Success Card */}
        <div className="rounded-3xl p-8 mb-8 border-2 bg-violet-50 border-violet-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-violet-500">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Caixa criada!</h2>
              <p className="text-gray-600 font-mono">{result.email}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Use o email para cadastros em sites e o link para receber mensagens anônimas. Tudo chega na mesma caixa!
          </p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">Seu email temporário</span>
                <p className="text-xs text-gray-500">Use para cadastros em sites</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={result.email}
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm font-mono text-gray-800 border border-gray-200"
              />
              <button
                onClick={() => copyToClipboard(result.email, 'email')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  copied === 'email'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {copied === 'email' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Public Link */}
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-fuchsia-100">
                <svg className="w-5 h-5 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">Link para mensagens anônimas</span>
                <p className="text-xs text-gray-500">Compartilhe para receber mensagens secretas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={result.publicUrl}
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm font-mono text-gray-800 border border-gray-200"
              />
              <button
                onClick={() => copyToClipboard(result.publicUrl, 'public')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  copied === 'public'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-fuchsia-500 text-white hover:bg-fuchsia-600'
                }`}
              >
                {copied === 'public' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Private Link */}
          <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">Seu link secreto</span>
                <p className="text-xs text-amber-600 font-medium">Guarde bem! Use para ver suas mensagens</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={result.inboxUrl}
                className="flex-1 px-4 py-3 bg-white rounded-xl text-sm font-mono text-gray-800 border border-amber-200"
              />
              <button
                onClick={() => copyToClipboard(result.inboxUrl, 'inbox')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  copied === 'inbox'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {copied === 'inbox' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <a
              href={result.inboxUrl}
              className="flex-1 text-center px-6 py-4 rounded-2xl font-bold transition-all shadow-lg bg-violet-500 text-white hover:bg-violet-600 shadow-violet-200"
            >
              Abrir minha caixa
            </a>
            <button
              onClick={() => {
                setResult(null);
                setCustomName('');
                suggestName();
              }}
              className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-colors font-medium border border-gray-200"
            >
              Nova
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Title with animated envelope */}
      <div className="text-center mb-12">
        <div className="inline-block mb-8">
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            @keyframes wiggle {
              0%, 100% { transform: rotate(-3deg); }
              50% { transform: rotate(3deg); }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
              50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.5); }
            }
            .float-animation { animation: float 3s ease-in-out infinite; }
            .wiggle-animation { animation: wiggle 2s ease-in-out infinite; }
            .pulse-glow-animation { animation: pulse-glow 2s ease-in-out infinite; }
          `}</style>

          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="float-animation cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            {/* Sombra suave */}
            <ellipse cx="70" cy="125" rx="35" ry="8" fill="#8B5CF6" opacity="0.2" />

            {/* Envelope principal com wiggle */}
            <g className="wiggle-animation" style={{ transformOrigin: '70px 75px' }}>
              {/* Corpo do envelope */}
              <rect x="25" y="45" width="90" height="60" rx="8" fill="url(#envelopeGradient)" />

              {/* Aba do envelope */}
              <path d="M25 53C25 48.5817 28.5817 45 33 45H107C111.418 45 115 48.5817 115 53L70 85L25 53Z" fill="#A78BFA" />

              {/* Linhas internas */}
              <path d="M30 50L70 78L110 50" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              <path d="M25 100L50 80" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
              <path d="M115 100L90 80" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

              {/* Icone @ no centro */}
              <circle cx="70" cy="72" r="12" fill="white" opacity="0.9" />
              <text x="63" y="78" fill="#7C3AED" fontSize="16" fontWeight="bold" fontFamily="system-ui">@</text>
            </g>

            {/* Estrelas decorativas */}
            <g opacity="0.6">
              <circle cx="20" cy="55" r="2" fill="#C4B5FD" />
              <circle cx="120" cy="60" r="3" fill="#A78BFA" />
              <circle cx="25" cy="90" r="2" fill="#DDD6FE" />
              <circle cx="115" cy="95" r="2" fill="#C4B5FD" />
            </g>

            {/* Gradiente */}
            <defs>
              <linearGradient id="envelopeGradient" x1="25" y1="45" x2="115" y2="105" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B5CF6" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-violet-600">
          {selectedDomain.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{
                transform: `translateY(${index % 2 === 0 ? '-3px' : '3px'}) rotate(${index % 2 === 0 ? '-3deg' : '3deg'})`,
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed">
          Crie um email temporário + receba mensagens anônimas
        </p>
        <p className="text-base text-gray-400 mt-2">
          Tudo na mesma caixa. Sem cadastro. Sem senha.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-xl">
        {/* Preview */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-4 bg-violet-100 text-violet-700">
            <span className="w-2 h-2 rounded-full animate-pulse bg-violet-500" />
            Seu email será
          </div>

          <div className="text-2xl md:text-3xl font-black break-all">
            <span className="text-violet-600">
              {customName || '...'}
            </span>
            <span className="text-gray-400">@</span>
            <span className="text-violet-400">
              {selectedDomain}
            </span>
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
            Escolha seu nome
          </label>
          <div className="relative">
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))}
              placeholder="nome.sobrenome"
              maxLength={30}
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-lg font-medium text-gray-900 border-2 border-gray-200 focus:border-violet-500 focus:bg-white transition-all outline-none placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {checking && (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin" />
              )}
              {!checking && isAvailable === true && customName && (
                <span className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {!checking && isAvailable === false && (
                <span className="text-red-500 text-sm font-medium">Indisponível</span>
              )}
              <button
                onClick={suggestName}
                disabled={suggesting}
                className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                title="Sugerir nome"
              >
                <svg className={`w-5 h-5 ${suggesting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Domain Select */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
            Domínio
          </label>
          <div className="flex flex-wrap gap-2 justify-center">
            {ALLOWED_DOMAINS.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDomain === domain
                    ? 'bg-violet-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                @{domain}
              </button>
            ))}
          </div>
        </div>

        {/* Features hint */}
        <div className="mb-8 grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-blue-700 font-medium">Recebe emails de sites</p>
          </div>
          <div className="bg-fuchsia-50 rounded-xl p-4 text-center">
            <div className="w-8 h-8 bg-fuchsia-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-fuchsia-700 font-medium">Recebe mensagens anônimas</p>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={loading || !customName || isAvailable === false}
          className="w-full px-8 py-5 text-white text-lg font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-violet-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Criando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Criar minha caixa
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
