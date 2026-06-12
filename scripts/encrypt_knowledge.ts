import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ========== DEBUGGING ==========
console.log('📁 Current working directory:', process.cwd());

// Cek apakah file .env.local ada
const envPath = path.resolve(process.cwd(), '.env');
console.log('🔍 Mencoba membaca:', envPath);

if (fs.existsSync(envPath)) {
  console.log('✅ File .env.local ditemukan.');
  const raw = fs.readFileSync(envPath, 'utf-8').trim();
  console.log('📄 Isi .env.local (30 karakter pertama):', raw.substring(0, 30) + '...');
} else {
  console.log('❌ File .env.local TIDAK ditemukan!');
}

// Load .env.local
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('❌ Gagal load .env.local:', result.error);
  process.exit(1);
}
console.log('✅ .env.local dimuat oleh dotenv.');

// Cek nilai ENCRYPTION_KEY
const key = process.env.ENCRYPTION_KEY;
console.log('🔑 ENCRYPTION_KEY:', key ? `ditemukan (panjang: ${key.length})` : 'TIDAK DITEMUKAN');
// ========== END DEBUGGING ==========

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function main() {
  if (!key || key.length !== 64) {
    console.error('❌ ENCRYPTION_KEY harus 64 karakter hex. Nilai yang didapat:', key);
    process.exit(1);
  }

  const knowledgeDir = path.join(process.cwd(), 'knowledge-base');
  if (!fs.existsSync(knowledgeDir)) {
    console.error('❌ Folder knowledge-base/ tidak ditemukan.');
    process.exit(1);
  }

  const files = fs.readdirSync(knowledgeDir).filter(f => path.extname(f) === '.md');
  if (files.length === 0) {
    console.error('❌ Tidak ada file .md di folder knowledge-base/.');
    process.exit(1);
  }

  let combined = '';
  for (const file of files) {
    const content = fs.readFileSync(path.join(knowledgeDir, file), 'utf-8');
    combined += `\n---\n# Sumber: ${file}\n---\n\n${content}\n`;
  }

  const encrypted = encrypt(combined, key);

  const outputPath = path.join(process.cwd(), 'src/data/knowledge-encrypted.ts');
  const outputContent = `// File ini dihasilkan oleh scripts/encrypt-knowledge.ts\n// Jangan diedit manual.\nexport const ENCRYPTED_KNOWLEDGE = '${encrypted}';\n`;
  fs.writeFileSync(outputPath, outputContent, 'utf-8');

  console.log(`✅ File terenkripsi berhasil dibuat: ${outputPath}`);
  console.log(`📄 ${files.length} file .md diproses.`);
}

main();