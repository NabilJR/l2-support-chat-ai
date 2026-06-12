'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send } from '@deemlol/next-icons';

interface Props {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 sm:p-4">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-600 bg-gray-800 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pertanyaan teknis..."
          disabled={isLoading}
          rows={1}
          className="flex-1 resize-none bg-transparent text-gray-100 placeholder-gray-400 p-2 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Kirim pesan"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Send size={20} color="currentColor" />
          )}
        </button>
      </div>
    </form>
  );
}