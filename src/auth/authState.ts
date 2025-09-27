// src/auth/authState.ts
export type AuthStatus = 'unknown' | 'ok' | 'missing' | 'invalid';

let status: AuthStatus = 'unknown';
const listeners = new Set<() => void>();

export function getAuthStatus(): AuthStatus {
  return status;
}

export function setAuthStatus(next: AuthStatus) {
  status = next;
  listeners.forEach((fn) => fn());
}

export function onAuthChange(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

const SESSION_KEY = 'cnpj_logado';
const USER_HASH_KEY = 'user_hash';

export function setSessionUser(cnpj: string, userHash?: string) {
  sessionStorage.setItem(SESSION_KEY, cnpj);
  if (userHash) sessionStorage.setItem(USER_HASH_KEY, userHash);
}

export function getSessionUser(): { cnpj: string | null; userHash: string | null } {
  return {
    cnpj: sessionStorage.getItem(SESSION_KEY),
    userHash: sessionStorage.getItem(USER_HASH_KEY),
  };
}
