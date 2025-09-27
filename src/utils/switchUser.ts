// src/utils/switchUser.ts
import { clearSession } from '../auth/authState';

export function switchUserViaHash(userHash: string) {
  clearSession();
  window.location.href = `/#login=${encodeURIComponent(userHash)}`;
}
