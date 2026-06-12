import { NextRequest } from 'next/server';
import { createKnowledgeCache, chatWithCacheStream } from '@/lib/genai';
import { ChatRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Validasi token akses
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (token !== process.env.APP_ACCESS_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body: ChatRequest = await request.json();
    const { message, cacheId: clientCacheId, history } = body;

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Pesan tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Tentukan cache ID (buat baru jika belum ada)
    let activeCacheId: string | null = clientCacheId || null;
    if (!activeCacheId) {
      activeCacheId = await createKnowledgeCache();
    }

    // 2. Bangun konteks dari riwayat percakapan
    let contextFromHistory = '';
    if (history && history.length > 0) {
      contextFromHistory = history
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Asisten'}: ${msg.content}`)
        .join('\n');
    }

    // 3. Gabungkan riwayat (jika ada) dengan pesan terbaru
    const enrichedMessage = contextFromHistory
      ? `Riwayat percakapan:\n${contextFromHistory}\n\nPertanyaan terbaru: ${message}`
      : message;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 4. Kirim stream dengan pesan yang sudah diperkaya
          await streamResponse(controller, encoder, activeCacheId!, enrichedMessage);
        } catch (error: unknown) {
          // Fallback jika cache tidak valid (403)
          if (error instanceof Error && error.message.includes('403')) {
            console.log('🔄 Cache tidak valid, membuat ulang...');
            try {
              activeCacheId = await createKnowledgeCache();
              await streamResponse(controller, encoder, activeCacheId, enrichedMessage);
            } catch (fallbackError) {
              sendError(controller, encoder, fallbackError);
            }
          } else {
            sendError(controller, encoder, error);
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Cache-Id': activeCacheId ?? '',
        'Access-Control-Expose-Headers': 'X-Cache-Id',
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan internal.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function streamResponse(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  cacheId: string,
  userMessage: string
) {
  const gen = chatWithCacheStream(cacheId, userMessage);
  for await (const chunk of gen) {
    const sseFormatted = `data: ${chunk.replace(/\n/g, '\\n')}\n\n`;
    controller.enqueue(encoder.encode(sseFormatted));
  }
  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
  controller.close();
}

function sendError(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  error: unknown
) {
  const message = error instanceof Error ? error.message : 'Stream error';
  controller.enqueue(encoder.encode(`data: ERROR: ${message}\n\n`));
  controller.close();
}