// In-memory cache
const memoryCache = new Map<string, { value: any; expiry: number }>();

// TTL default: 24 ore
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

// Read from localStorage
function loadLocal(key: string) {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed.expiry && parsed.expiry < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
}

// Write to localStorage
function saveLocal(key: string, value: any, ttl: number) {
  if (typeof localStorage === "undefined") return;

  const record = {
    value,
    expiry: Date.now() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(record));
}

// Generic getter: tries memory → localStorage → fetcher
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = DEFAULT_TTL
): Promise<T> {
  // 1. Check memory cache
  const mem = memoryCache.get(key);
  if (mem && mem.expiry > Date.now()) return mem.value;

  // 2. Check local cache
  const local = loadLocal(key);
  if (local) {
    memoryCache.set(key, { value: local, expiry: Date.now() + ttl });
    return local;
  }

  // 3. Fetch fresh
  const fresh = await fetcher();

  // Save in both caches
  memoryCache.set(key, { value: fresh, expiry: Date.now() + ttl });
  saveLocal(key, fresh, ttl);

  return fresh;
}
