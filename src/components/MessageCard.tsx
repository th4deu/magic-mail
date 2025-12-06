'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

type MessageMode = 'anonymous' | 'identified';

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  // Email mode fields
  from?: string;
  fromName?: string;
  subject?: string;
  replyTo?: string;
}

interface MessageCardProps {
  message: Message;
  messageMode: MessageMode;
  token: string;
  onUpdate: () => void;
}

export default function MessageCard({ message, messageMode, token, onUpdate }: MessageCardProps) {
  const isEmailMode = messageMode === 'identified';
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDeleteModal(false);
    };
    if (showDeleteModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showDeleteModal]);

  const toggleRead = async () => {
    setLoading(true);
    try {
      await fetch(`/api/inbox/${token}/messages/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !message.isRead }),
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating message:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/inbox/${token}/messages/${message.id}`, {
        method: 'DELETE',
      });
      setShowDeleteModal(false);
      onUpdate();
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
        message.isRead
          ? 'border-gray-100'
          : 'border-violet-200 bg-gradient-to-br from-violet-50/50 to-purple-50/50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-3">
            {!message.isRead && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                Nova
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(message.createdAt)}
            </span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleRead}
            disabled={loading}
            className={`p-2.5 rounded-xl transition-all ${
              message.isRead
                ? 'text-gray-400 hover:text-violet-600 hover:bg-violet-50'
                : 'text-violet-600 hover:text-violet-700 hover:bg-violet-100'
            }`}
            title={message.isRead ? 'Marcar como não lida' : 'Marcar como lida'}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin" />
            ) : message.isRead ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            )}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Deletar mensagem"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setShowDeleteModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Icon */}
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Deletar mensagem?
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-center mb-6">
              Essa acao nao pode ser desfeita. A mensagem sera removida permanentemente.
            </p>

            {/* Message Preview */}
            <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100">
              <p className="text-sm text-gray-600 line-clamp-2">
                {message.content}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deletando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Deletar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
