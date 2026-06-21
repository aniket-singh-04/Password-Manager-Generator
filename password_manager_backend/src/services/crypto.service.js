import crypto from 'crypto';
import { env } from '../config/env.js';

function getKey() {
  const raw = env.encryptionKey.trim();
  if (/^[a-f0-9]{64}$/i.test(raw)) {
    return Buffer.from(raw, 'hex');
  }
  const decoded = Buffer.from(raw, 'base64');
  if (decoded.length === 32) {
    return decoded;
  }
  throw new Error('ENCRYPTION_KEY must be 32 bytes encoded as 64 hex characters or base64.');
}

const key = getKey();

export function encryptSecret(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const value = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    value: value.toString('base64')
  };
}

export function decryptSecret(payload) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(payload.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.value, 'base64')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}

