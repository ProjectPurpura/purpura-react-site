// src/config.ts
const STORAGE_KEY = 'purpura.currentUserId';
export function getCurrentUserId(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}
export function setCurrentUserId(id: string) {
  try { localStorage.setItem(STORAGE_KEY, id); } catch {}
}
export function switchUser(id: string) {
  setCurrentUserId(id);
  window.location.reload();
}