// src/lib/types.ts

export type Role = 'user' | 'assistant';

export interface ChatMessage {
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  /** Pesan terbaru dari user */
  message: string;
  /** Opsional: cache ID yang sudah ada dari percakapan sebelumnya */
  cacheId?: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  /** Balasan dari AI */
  reply: string;
  /** Opsional: cache ID baru (jika baru dibuat) agar frontend bisa menyimpannya */
  cacheId?: string;
  /** Jika ada error */
  error?: string;
}