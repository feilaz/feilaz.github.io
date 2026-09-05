'use client';
import { useSyncExternalStore } from 'react';
import { resolveTheme } from '@/lib/theme';
const key = 'adam-portfolio-theme';
function storedPreference() {
  try { return localStorage.getItem(key); } catch { return null; }
}
function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#121315' : '#fcfcfc');
}
function subscribe(notify: () => void) {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const sync = () => applyTheme(resolveTheme(storedPreference(), media.matches));
  const storage = (event: StorageEvent) => { if (event.key === key || event.key === null) sync(); };
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  media.addEventListener('change', sync);
  window.addEventListener('storage', storage);
  return () => { observer.disconnect(); media.removeEventListener('change', sync); window.removeEventListener('storage', storage); };
}
const snapshot = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
const serverSnapshot = () => 'light';
export default function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(key, next); } catch { /* Theme still works when storage is unavailable. */ }
    applyTheme(next);
  }
  return <button className="theme-switch" aria-label="Dark mode" aria-pressed={theme === 'dark'} onClick={toggle} title="Toggle light and dark appearance">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg>
    <span>Appearance</span>
  </button>;
}
