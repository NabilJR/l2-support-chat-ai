'use client';

import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { useEffect, useRef } from 'react';

export default function ChatContainer() {
  const { messages, isLoading, error, sendMessage, thinkingTime } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null); // ref ke container pesan

  // Auto-scroll ke bawah setiap kali messages atau isLoading berubah
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Selalu gulir ke paling bawah
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="w-full p-4 border-b border-gray-700 flex-shrink-0">
        <div className="max-w-4xl mx-auto w-full px-2 sm:px-4">
          <h1 className="text-xl font-semibold">L2 Support Chat</h1>
          <p className="text-sm text-gray-400">Asisten teknis berbasis AI</p>
        </div>
      </div>

      {/* Messages — overflow-y-scroll agar selalu memiliki scrollbar internal */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-scroll w-full px-2 sm:px-4 py-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <p>👋 Selamat datang! Tanyakan masalah teknis Anda.</p>
            </div>
          )}
          {messages.map((msg, idx) => {
            const isLastAssistant =
              msg.role === 'assistant' &&
              idx > 0 &&
              messages[idx - 1]?.role === 'user';
            return (
              <ChatMessage
                key={idx}
                message={msg}
                thinkingTime={isLastAssistant ? thinkingTime : null}
                showThinking={isLastAssistant}
              />
            );
          })}
          {isLoading && <TypingIndicator />}
          {error && (
            <div className="text-red-400 text-sm mt-2">Error: {error}</div>
          )}
          {/* Elemen ini tetap ada untuk referensi akhir, tapi tidak diperlukan untuk scroll */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="w-full border-t border-gray-700 flex-shrink-0">
        <div className="max-w-4xl mx-auto w-full">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}