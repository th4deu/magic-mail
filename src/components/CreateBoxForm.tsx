'use client';

import { useState, useEffect, useCallback } from 'react';
import { ALLOWED_DOMAINS, MessageMode } from '@/types';

interface BoxResult {
  slug: string;
  domain: string;
  token: string;
  publicUrl: string;
  inboxUrl: string;
  email: string;
  messageMode: MessageMode;
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
  const [messageMode, setMessageMode] = useState<MessageMode>('identified');

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
      const adjectives = ['azul', 'verde', 'dourado', 'solar', 'lunar', 'veloz', 'sereno', 'magico'];
      const nouns = ['lobo', 'falcao', 'coruja', 'fenix', 'aurora', 'estrela', 'oceano', 'floresta'];
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];
      const num = Math.floor(Math.random() * 100);
      const fallbackName = `${noun}${adj}${num}`;
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
        body: JSON.stringify({ domain: selectedDomain, slug: customName || undefined, messageMode }),
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
    const isEmailMode = result.messageMode === 'identified';

    return (
      <div className="w-full max-w-xl mx-auto">
        {/* Success Card */}
        <div className={`rounded-3xl p-8 mb-8 border-2 ${
          isEmailMode ? 'bg-blue-50 border-blue-200' : 'bg-fuchsia-50 border-fuchsia-200'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isEmailMode ? 'bg-blue-500' : 'bg-fuchsia-500'
            }`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEmailMode ? 'Email criado!' : 'Caixa criada!'}
              </h2>
              <p className="text-gray-600 font-mono">{result.email}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            {isEmailMode
              ? 'Use este email para se cadastrar em sites. Os emails chegarao na sua caixa de entrada.'
              : 'Compartilhe o link publico para receber mensagens anonimas. Guarde o link privado para ver suas mensagens.'}
          </p>
        </div>

        <div className="space-y-4">
          {/* Email or Public Link */}
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isEmailMode ? 'bg-blue-100' : 'bg-fuchsia-100'
              }`}>
                <svg className={`w-5 h-5 ${isEmailMode ? 'text-blue-600' : 'text-fuchsia-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isEmailMode ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  )}
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-900">
                  {isEmailMode ? 'Seu email temporario' : 'Link para compartilhar'}
                </span>
                <p className="text-xs text-gray-500">
                  {isEmailMode ? 'Use para cadastros em sites' : 'Envie para receber mensagens'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={isEmailMode ? result.email : result.publicUrl}
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl text-sm font-mono text-gray-800 border border-gray-200"
              />
              <button
                onClick={() => copyToClipboard(isEmailMode ? result.email : result.publicUrl, 'public')}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  copied === 'public'
                    ? 'bg-emerald-500 text-white'
                    : isEmailMode
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
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
              className={`flex-1 text-center px-6 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                isEmailMode
                  ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200'
                  : 'bg-fuchsia-500 text-white hover:bg-fuchsia-600 shadow-fuchsia-200'
              }`}
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
      {/* Dynamic Title */}
      <div className="text-center mb-12">
        <div className="inline-block mb-8">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer shadow-lg ${
            messageMode === 'identified' ? 'bg-blue-500' : 'bg-fuchsia-500'
          }`}>
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {messageMode === 'identified' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-gray-900">
          {messageMode === 'identified' ? 'Email Magico' : 'Caixa Secreta'}
        </h1>

        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-2">
          {messageMode === 'identified' ? (
            <>Crie um email temporario em <span className="text-blue-600 font-semibold">2 segundos</span></>
          ) : (
            <>Receba mensagens <span className="text-fuchsia-600 font-semibold">anonimas</span> de qualquer pessoa</>
          )}
        </p>
        <p className="text-lg text-gray-400">
          {messageMode === 'identified'
            ? 'Sem cadastro. Sem senha. Sem frescura.'
            : 'Compartilhe o link. Receba confissoes.'}
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
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-4 ${
            messageMode === 'identified'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-fuchsia-100 text-fuchsia-700'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              messageMode === 'identified' ? 'bg-blue-500' : 'bg-fuchsia-500'
            }`} />
            {messageMode === 'identified' ? 'Seu email sera' : 'Seu link sera'}
          </div>

          {messageMode === 'identified' ? (
            <div className="text-2xl md:text-3xl font-black break-all">
              <span className="text-blue-600">
                {customName || '...'}
              </span>
              <span className="text-gray-400">@</span>
              <span className="text-blue-400">
                {selectedDomain}
              </span>
            </div>
          ) : (
            <div className="text-2xl md:text-3xl font-black break-all">
              <span className="text-fuchsia-400">
                {selectedDomain}
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-fuchsia-600">
                {customName || '...'}
              </span>
            </div>
          )}
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
              onChange={(e) => setCustomName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
              placeholder="seunome"
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
                <span className="text-red-500 text-sm font-medium">Indisponivel</span>
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
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
            Dominio
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

        {/* Message Mode Select */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
            Tipo de caixa
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMessageMode('identified')}
              className={`p-4 rounded-2xl text-left transition-all border-2 ${
                messageMode === 'identified'
                  ? 'bg-blue-50 border-blue-400'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  messageMode === 'identified' ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                  <svg className={`w-5 h-5 ${messageMode === 'identified' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className={`font-semibold ${messageMode === 'identified' ? 'text-blue-700' : 'text-gray-600'}`}>
                  Email
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                Receba emails de sites
              </p>
              <p className={`text-xs font-mono ${messageMode === 'identified' ? 'text-blue-600' : 'text-gray-400'}`}>
                nome@dominio
              </p>
            </button>

            <button
              onClick={() => setMessageMode('anonymous')}
              className={`p-4 rounded-2xl text-left transition-all border-2 ${
                messageMode === 'anonymous'
                  ? 'bg-fuchsia-50 border-fuchsia-400'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  messageMode === 'anonymous' ? 'bg-fuchsia-500' : 'bg-gray-200'
                }`}>
                  <svg className={`w-5 h-5 ${messageMode === 'anonymous' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`font-semibold ${messageMode === 'anonymous' ? 'text-fuchsia-700' : 'text-gray-600'}`}>
                  Anonimo
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                Receba mensagens secretas
              </p>
              <p className={`text-xs font-mono ${messageMode === 'anonymous' ? 'text-fuchsia-600' : 'text-gray-400'}`}>
                dominio/nome
              </p>
            </button>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={loading || !customName || isAvailable === false}
          className={`w-full px-8 py-5 text-white text-lg font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg ${
            messageMode === 'identified'
              ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'
              : 'bg-fuchsia-500 hover:bg-fuchsia-600 shadow-fuchsia-200'
          }`}
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
