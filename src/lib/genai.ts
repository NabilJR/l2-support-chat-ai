import { GoogleGenAI } from '@google/genai';
import { getKnowledgeBaseContent } from './knowledge-base';

// 1. Inisialisasi client
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY tidak ditemukan di environment variables.');
}
const genAI = new GoogleGenAI({ apiKey });

const MODEL = 'gemini-2.5-flash'; // atau 'gemini-1.5-flash-002'

// 2. System instruction untuk agen L2 support
const SYSTEM_INSTRUCTION = `Kamu adalah agen L2 Support Teknis yang ramah dan profesional.

Aturan dalam menjawab:
1. Gunakan bahasa Indonesia yang natural, santai namun tetap profesional. Jangan seperti robot.
2. Jangan menyalin mentah-mentah isi knowledge base. Ringkas, olah kembali, namun tetap kamu harus menyampaikan langkah teknis yang sesuai dengan knowledge base
3. Gunakan format Markdown untuk mempercantik jawaban:
   - Gunakan **bold** untuk penekanan penting (contoh: **Pastikan**).
   - Gunakan daftar bernomor atau bullet (1. / -) jika ada langkah-langkah. serta tambahkan enter sebagai pemisah langkah-langkahnya.
   - Gunakan paragraf pendek, maksimal 3 kalimat per paragraf.
4. Jika jawaban tidak ada di knowledge base, katakan dengan sopan bahwa kamu belum punya informasi dan arahkan ke tim developer produk. Jangan mengarang jawaban.
5. Jika ada pertanyaan yang lebih umum, harap tanyakan detailnya terlebih dahulu agar kamu tidak generate data terlalu banyak dari knowledge base.
6. Akhiri dengan tawaran bantuan lain atau semangat, misal: "Semoga membantu! Ada lagi yang bisa saya bantu?"

Contoh gaya jawaban yang diharapkan:
"""
Untuk mereset password, ikuti langkah berikut ya:

1. Buka halaman login.
2. Klik **Lupa Password**.
3. Masukkan email yang terdaftar.
4. Cek inbox email untuk tautan reset.

Setelah berhasil, pastikan kamu membuat password baru yang kuat, ya. Kalau masih terkendala, jangan ragu hubungi tim L2 kami.

Semoga lancar! Ada lagi yang bisa saya bantu?
"""`;

// 3. Fungsi untuk membuat cached content
export async function createKnowledgeCache(knowledgeText?: string): Promise<string> {
  // Gunakan knowledge base asli jika tidak diberikan parameter
  const content = knowledgeText || getKnowledgeBaseContent();

  try {
    const cache = await genAI.caches.create({
      model: MODEL,
      config: {
        displayName: 'L2 Support Knowledge Base',
        systemInstruction: SYSTEM_INSTRUCTION,
        contents: [
          {
            role: 'user',
            parts: [{ text: content }],
          },
        ],
        ttl: '14400s', // Cache berlaku 4 jam
      },
    });

    console.log(`✅ Cache berhasil dibuat. ID: ${cache.name}`);
    return cache.name!; // cache.name adalah ID cache
  } catch (error) {
    console.error('Gagal membuat cache:', error);
    throw error;
  }
}

// 4. Fungsi untuk chat non-streaming dengan cache (opsional, untuk debug/testing)
export async function chatWithCache(
  cacheId: string,
  userMessage: string
): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
      config: {
        cachedContent: cacheId,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Respons kosong dari Gemini.');
    return text;
  } catch (error) {
    console.error('Gagal menghasilkan respons:', error);
    throw error;
  }
}

// 5. Interface untuk chunk stream (biar aman tanpa any)
interface StreamChunk {
  text?: string;
}

// 6. Fungsi streaming dengan cache (digunakan di production)
export async function* chatWithCacheStream(
  cacheId: string,
  userMessage: string
): AsyncGenerator<string> {
  try {
    const stream = await genAI.models.generateContentStream({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
      config: {
        cachedContent: cacheId,
      },
    });

    for await (const chunk of stream) {
      const streamChunk = chunk as StreamChunk;
      const text: string = streamChunk.text ?? '';
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error('Gagal streaming respons:', error);
    throw error;
  }
}