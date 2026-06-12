
"use client";

import { useState, useCallback } from "react";
import { ChatMessage } from "@/lib/types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thinkingTime, setThinkingTime] = useState<number | null>(null);

  // Inisialisasi cacheId dari sessionStorage (hanya di browser)
  const [cacheId, setCacheId] = useState<string | undefined>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("geminiCacheId") || undefined;
    }
    return undefined;
  });

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userTimestamp = Date.now();
      const userMessage: ChatMessage = {
        role: "user",
        content,
        timestamp: userTimestamp,
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Placeholder untuk asisten (akan diisi bertahap)
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "", timestamp: Date.now() },
      ]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            // Kirim token akses ke API
            Authorization: `Bearer ${sessionStorage.getItem("appAccessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            cacheId,
            history: messages.slice(-10),
          }),
        });

        if (response.status === 401) {
          sessionStorage.removeItem("appAccessToken");
          throw new Error("Token akses tidak valid. Silakan login ulang.");
        }

        if (!response.ok) {
          let errorMessage = "Gagal mengirim pesan.";
          let errorBody: { error?: string } | null = null;
          try {
            errorBody = await response.json();
          } catch {
            errorBody = null;
          }
          if (errorBody?.error) errorMessage = errorBody.error;
          throw new Error(errorMessage);
        }

        // Ambil cacheId terbaru dari header
        const newCacheId = response.headers.get("X-Cache-Id");
        if (newCacheId) {
          setCacheId(newCacheId);
          sessionStorage.setItem("geminiCacheId", newCacheId); // Simpan ke sessionStorage
        }

        if (!response.body) throw new Error("Response body tidak tersedia.");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              if (data.startsWith("ERROR:")) {
                throw new Error(data.slice(6).trim());
              }
              // Kembalikan escape newline
              const cleanData = data.replace(/\\n/g, "\n");
              fullContent += cleanData;

              // Update pesan asisten terakhir
              setMessages((prev) => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                updated[lastIdx] = {
                  ...updated[lastIdx],
                  content: fullContent,
                  timestamp: Date.now(),
                };
                return updated;
              });
            }
          }
        }

        const endTime = Date.now();
        setThinkingTime((endTime - userTimestamp) / 1000);
      } catch (err: unknown) {
        let message = "Terjadi kesalahan.";
        if (err instanceof Error) message = err.message;
        setError(message);
        setMessages((prev) => prev.slice(0, -1)); // Hapus placeholder jika error
      } finally {
        setIsLoading(false);
      }
    },
    [cacheId, messages]
  );

  return { messages, isLoading, error, sendMessage, thinkingTime };
}
