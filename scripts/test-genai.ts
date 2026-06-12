//gunakan script ini untuk test koneksi ke gemini 
//agar mengetahui seberapa besar jumlah token yang dibuat
//oleh knowledge base
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Verifikasi kunci setelah dotenv
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('❌ GOOGLE_API_KEY tidak ditemukan');
  process.exit(1);
}
console.log('✅ GOOGLE_API_KEY berhasil dimuat.');

async function test() {
  // Dynamic import: modul genai baru di-load sekarang
  const { createKnowledgeCache, chatWithCache } = await import('../src/lib/genai');
  
  try {
    console.log('🚀 Memulai tes...');
    const cacheId = await createKnowledgeCache();
    console.log('✅ Cache ID:', cacheId);
    const answer = await chatWithCache(cacheId, 'Bagaimana cara install Produk A?');
    console.log('✅ Jawaban:', answer);
  } catch (error) {
    console.error('❌ Error saat tes:', error);
  }
}

test();