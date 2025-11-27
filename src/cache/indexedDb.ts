/**
 * cache/indexedDb
 *
 * Robust IndexedDB wrapper with automatic Node fallback.
 * Works in browser and Node environments.
 */

export type IDBEntry<T> = { key: string; value: T };

/** Detect if IndexedDB is available */
function hasIndexedDB(): boolean {
  try {
    if (typeof window === "undefined") return false;
    if (!("indexedDB" in window)) return false;

    // alcuni browser la espongono ma non la supportano davvero
    const db = window.indexedDB.open("test");
    return true;
  } catch (_) {
    return false;
  }
}

/** Create IDB connection safely */
function openIndexedDB(dbName: string, storeName: string, version = 1): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!hasIndexedDB()) {
      reject(new Error("IndexedDB not available in this environment"));
      return;
    }

    const req = window.indexedDB.open(dbName, version);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "key" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * IndexedDbStore<T>
 *
 * Automatically falls back to memory Map when IndexedDB is not available.
 */
export class IndexedDbStore<T> {
  private readonly memory = new Map<string, T>();
  private readonly isIDBAvailable = hasIndexedDB();
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(
    private dbName = "app-cache-db",
    private storeName = "cache",
    private version = 1
  ) {
    if (this.isIDBAvailable) {
      this.dbPromise = openIndexedDB(this.dbName, this.storeName, this.version);
    }
  }

  /** Node fallback: memory Map */
  private async memoryGet(key: string): Promise<T | undefined> {
    return this.memory.get(key);
  }
  private async memorySet(key: string, value: T): Promise<void> {
    this.memory.set(key, value);
  }
  private async memoryDelete(key: string): Promise<void> {
    this.memory.delete(key);
  }
  private async memoryClear(): Promise<void> {
    this.memory.clear();
  }
  private async memoryKeys(): Promise<string[]> {
    return Array.from(this.memory.keys());
  }

  /** Open transaction wrapper */
  private async tx(mode: IDBTransactionMode) {
    if (!this.dbPromise) throw new Error("IndexedDB not initialized");
    const db = await this.dbPromise;
    const tx = db.transaction(this.storeName, mode);
    const store = tx.objectStore(this.storeName);
    return { tx, store };
  }

  // PUBLIC API -----------------------------------------------------

  async get(key: string): Promise<T | undefined> {
    if (!this.isIDBAvailable) return this.memoryGet(key);

    const { tx, store } = await this.tx("readonly");
    return new Promise((resolve, reject) => {
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result?.value ?? undefined);
      req.onerror = () => reject(req.error);
    });
  }

  async set(key: string, value: T): Promise<void> {
    if (!this.isIDBAvailable) return this.memorySet(key, value);

    const { tx, store } = await this.tx("readwrite");
    return new Promise((resolve, reject) => {
      const req = store.put({ key, value });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async delete(key: string): Promise<void> {
    if (!this.isIDBAvailable) return this.memoryDelete(key);

    const { tx, store } = await this.tx("readwrite");
    return new Promise((resolve, reject) => {
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async clear(): Promise<void> {
    if (!this.isIDBAvailable) return this.memoryClear();

    const { tx, store } = await this.tx("readwrite");
    return new Promise((resolve, reject) => {
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async keys(): Promise<string[]> {
    if (!this.isIDBAvailable) return this.memoryKeys();

    const { tx, store } = await this.tx("readonly");
    return new Promise((resolve, reject) => {
      const req = store.getAllKeys();
      req.onsuccess = () => resolve(req.result as string[]);
      req.onerror = () => reject(req.error);
    });
  }
}