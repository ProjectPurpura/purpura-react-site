// src/auth/hmac.ts
const SHARED_SECRET = process.env.REACT_APP_SHARED_HMAC_SECRET || '';

function base64UrlDecodeBytes(input: string): Uint8Array {
  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function base64UrlDecode(input: string): string {
  const bytes = base64UrlDecodeBytes(input);
  const dec = new TextDecoder();
  return dec.decode(bytes);
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const bytes = new Uint8Array(sig);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAndParseTokenAsync(token: string, maxSkewSec = 300): Promise<{ cnpj: string; ts: number } | null> {
  if (!token || !token.includes('.')) return null;
  const [msgB64u, sigHex] = token.split('.');
  try {
    const message = base64UrlDecode(msgB64u);
    const [cnpj, tsStr] = message.split('|');
    const ts = parseInt(tsStr, 10);

    const hmac = await hmacSha256Hex(message, SHARED_SECRET);
    if (hmac !== sigHex) return null;

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - ts) > maxSkewSec) return null;

    const normalized = (cnpj || '').replace(/\D+/g, '').padStart(14, '0');
    if (normalized.length !== 14) return null;

    return { cnpj: normalized, ts };
  } catch {
    return null;
  }
}
