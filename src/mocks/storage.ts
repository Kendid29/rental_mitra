const STORAGE_VERSION = 'v1';
const STORE_KEY = `rental_mitra_${STORAGE_VERSION}_store`;

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[MockStorage] Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

export function saveToLocalStorage<T>(key: string, data: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[MockStorage] Error saving ${key} to localStorage:`, err);
  }
}

export function clearLocalStorage(key?: string): void {
  if (!isBrowser()) return;
  try {
    if (key) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.removeItem(STORE_KEY);
    }
  } catch (err) {
    console.warn('[MockStorage] Error clearing storage:', err);
  }
}

export { STORE_KEY };
