// src/auth/authState.ts
const KEY = 'purpura.session';

export type SessionUser = {
  cnpj: string;
  telefone: string;
  email: string;
  nome: string;
  urlFoto: string;
  userHash: string;
};

export type AuthStatus = 'idle' | 'loading' | 'ok' | 'missing' | 'invalid' | 'error';

let status: AuthStatus = 'idle';

export function getAuthStatus(): AuthStatus {
  return status;
}

export function setAuthStatus(s: AuthStatus) {
  status = s;
}

export function setSessionUser(user: SessionUser | null) {
  localStorage.removeItem(KEY);
  try {
    if (user) {
      const cleanUser = {
        ...user,
        cnpj: user.cnpj ? user.cnpj.replace(/\D/g, '') : user.cnpj
      };
      localStorage.setItem(KEY, JSON.stringify(cleanUser));
    } else {
      localStorage.removeItem(KEY);
    }
  } catch {}
}


export function getSessionUser(): SessionUser | {} {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function clearSession() {
  try { localStorage.removeItem('purpura.session'); } catch {}
}