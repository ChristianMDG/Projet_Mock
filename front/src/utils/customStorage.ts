const memoryStore: Record<string, string> = {};

export const customStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      try {
        const val = localStorage.getItem(key);
        if (val !== null) return val;
      } catch {
        // Storage access blocked by tracking prevention
      }
      return memoryStore[key] ?? null;
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Storage access blocked by tracking prevention
      }
      memoryStore[key] = value;
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch {
        // Storage access blocked by tracking prevention
      }
      delete memoryStore[key];
    }
  },
  clear: (): void => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch {
        // Storage access blocked by tracking prevention
      }
      for (const k of Object.keys(memoryStore)) {
        delete memoryStore[k];
      }
    }
  },
};
