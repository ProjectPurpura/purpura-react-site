// src/bootstrapAuth.ts
const STORAGE_KEY = 'purpura.currentUserId';

export function getCurrentUserId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setCurrentUserId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
}

async function resolveUserIdFromHash(raw: string): Promise<string> {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/empresa/hash/${raw}`);
  if (!res.ok) throw new Error('Hash inválida');
  const data = await res.json();
  return data?.id ?? raw;
}

export async function bootstrapAuthFromHash(): Promise<void> {
  const hash = window.location.hash || '';
  const match = hash.match(/#login=([^&]+)/);
  if (!match || !match[1]) return;

  const raw = decodeURIComponent(match[1]);
  const userId = await resolveUserIdFromHash(raw);

  setCurrentUserId(userId);

  window.history.replaceState(null, '', window.location.pathname + window.location.search);

  console.log('[Auth] Sessão iniciada para:', userId);
}
