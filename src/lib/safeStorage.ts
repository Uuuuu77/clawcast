// Safe storage wrapper that handles localStorage access denial gracefully
// This is needed because some iframe contexts block localStorage access

const memoryStorage: { [key: string]: string } = {};

const createSafeStorage = (): Storage => {
  try {
    // Test if localStorage is accessible
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return localStorage;
  } catch {
    // Return a memory-based fallback when localStorage is blocked
    console.warn('localStorage is not available, using in-memory storage. Sessions will not persist across page reloads.');
    return {
      getItem: (key: string) => memoryStorage[key] ?? null,
      setItem: (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: (key: string) => { delete memoryStorage[key]; },
      clear: () => { Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]); },
      key: (index: number) => Object.keys(memoryStorage)[index] ?? null,
      get length() { return Object.keys(memoryStorage).length; },
    };
  }
};

export const safeStorage = createSafeStorage();
