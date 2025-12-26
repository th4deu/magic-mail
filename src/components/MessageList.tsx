'use client';

import { useState, useEffect, useCallback } from 'react';
import MessageCard from './MessageCard';
import { MessageSource } from '@/types';

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  source?: MessageSource;
  // Email fields
  from?: string;
  fromName?: string;
  subject?: string;
  replyTo?: string;
}

interface BoxInfo {
  slug: string;
  domain: string;
  email: string;
  publicUrl: string;
  createdAt: string;
}

interface InboxData {
  box: BoxInfo;
  messages: Message[];
  totalMessages: number;
  unreadCount: number;
}

interface MessageListProps {
  token: string;
}

const POLLING_INTERVAL = 5000; // 5 seconds

export default function MessageList({ token }: MessageListProps) {
  const [data, setData] = useState<InboxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  const fetchMessages = useCallback(async (isInitialLoad = false) => {
    try {
      const response = await fetch(`/api/inbox/${token}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar mensagens');
      }

      setData(result);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    fetchMessages(true);
  }, [fetchMessages]);

  // Polling for real-time updates
  useEffect(() => {
    if (!isPolling) return;

    const intervalId = setInterval(() => {
      fetchMessages(false);
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [fetchMessages, isPolling]);

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDeleteBox = async () => {
    if (!confirm('Tem certeza que deseja deletar esta caixa e todas as mensagens? Esta acao nao pode ser desfeita.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/inbox/${token}`, { method: 'DELETE' });
      if (response.ok) {
        window.location.href = '/';
      } else {
        throw new Error('Erro ao deletar caixa');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin" />
          <span>Carregando mensagens...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-semibold text-red-800 mb-2">Nao foi possivel carregar</h2>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-100 mb-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">
                  {data.box.email}
                </h1>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {data.totalMessages} mensagen{data.totalMessages !== 1 ? 's' : ''}
                </span>
                {data.unreadCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    {data.unreadCount} nov{data.unreadCount !== 1 ? 'as' : 'a'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleDeleteBox}
            disabled={deleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            title="Deletar caixa"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Share Links */}
        <div className="space-y-3">
          {/* Email */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-blue-600 mb-2 font-medium">Seu email temporario</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={data.box.email}
                className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono text-gray-700 border border-blue-200"
              />
              <button
                onClick={() => copyToClipboard(data.box.email, 'email')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
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
          <div className="bg-fuchsia-50 rounded-xl p-3 border border-fuchsia-100">
            <p className="text-xs text-fuchsia-600 mb-2 font-medium">Link para mensagens anonimas</p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={data.box.publicUrl}
                className="flex-1 px-3 py-2 bg-white rounded-lg text-sm font-mono text-gray-700 border border-fuchsia-200"
              />
              <button
                onClick={() => copyToClipboard(data.box.publicUrl, 'public')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
                  copied === 'public'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-fuchsia-500 text-white hover:bg-fuchsia-600'
                }`}
              >
                {copied === 'public' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {data.messages.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border-2 border-gray-100">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-violet-100 to-fuchsia-100">
            <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Nenhuma mensagem ainda
          </h2>
          <p className="text-gray-500 mb-6">
            Use o email para cadastros em sites ou compartilhe o link para receber mensagens anonimas.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => copyToClipboard(data.box.email, 'email')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl transition-all font-medium text-sm hover:bg-blue-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar email
            </button>
            <button
              onClick={() => copyToClipboard(data.box.publicUrl, 'public')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-fuchsia-500 text-white rounded-xl transition-all font-medium text-sm hover:bg-fuchsia-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Copiar link
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              token={token}
              onUpdate={fetchMessages}
            />
          ))}
        </div>
      )}

      {/* Polling status and controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {isPolling && (
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Atualizando automaticamente
            </span>
          )}
          {lastUpdate && (
            <span className="text-gray-400">
              · Ultima atualizacao: {lastUpdate.toLocaleTimeString('pt-BR')}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsPolling(!isPolling)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-colors font-medium text-sm ${
            isPolling
              ? 'text-gray-600 hover:bg-gray-100'
              : 'text-violet-600 hover:bg-violet-50'
          }`}
        >
          {isPolling ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pausar
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Retomar
            </>
          )}
        </button>
        <button
          onClick={() => fetchMessages(false)}
          className="inline-flex items-center gap-2 px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-xl transition-colors font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar agora
        </button>
      </div>
    </div>
  );
}
