import crypto from 'crypto';
import { config } from '../config.js';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(config.encryptionKey, 'utf8');

if (key.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 bytes');
}

export const encrypt = (value: string): string => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (payload: string): string => {
  const [ivHex, tagHex, encryptedHex] = payload.split(':');
  if (!ivHex || !tagHex || !encryptedHex) {
    throw new Error('Invalid encrypted payload');
  }

  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
};
