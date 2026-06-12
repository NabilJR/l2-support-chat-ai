import crypto from 'crypto';
import { ENCRYPTED_KNOWLEDGE } from '@/data/knowledge-encrypted';

const ALGORITHM = 'aes-256-cbc';

function decrypt(encrypted: string, key: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function getKnowledgeBaseContent(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY tidak ditemukan di environment variables.');
  }
  return decrypt(ENCRYPTED_KNOWLEDGE, key);
}