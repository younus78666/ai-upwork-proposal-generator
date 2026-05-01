import { JobSession } from '@/types/proposal';

const DB_NAME = 'UltimateFreelancersDB';
const DB_VERSION = 1;
const STORE_NAME = 'jobSessions';
const USER_NAME_KEY = 'uf_user_name';
const WEBSITE_KEY = 'uf_website';
const IS_AGENCY_KEY = 'uf_is_agency';

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('jobTitle', 'jobTitle', { unique: false });
      }
    };
  });
  
  return dbPromise;
}

export async function saveJobSession(session: JobSession): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Convert dates to ISO strings for storage
    const sessionToStore = {
      ...session,
      createdAt: session.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
      conversations: session.conversations.map(c => ({
        ...c,
        timestamp: c.timestamp.toISOString()
      }))
    };
    
    const request = store.put(sessionToStore);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getJobSession(id: string): Promise<JobSession | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => {
      if (request.result) {
        // Convert ISO strings back to Date objects
        const session = {
          ...request.result,
          createdAt: new Date(request.result.createdAt),
          updatedAt: new Date(request.result.updatedAt),
          conversations: (request.result.conversations || []).map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp)
          }))
        };
        resolve(session);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getAllJobSessions(): Promise<JobSession[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('updatedAt');
    const request = index.openCursor(null, 'prev'); // Most recent first
    
    const sessions: JobSession[] = [];
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const session = {
          ...cursor.value,
          createdAt: new Date(cursor.value.createdAt),
          updatedAt: new Date(cursor.value.updatedAt),
          conversations: (cursor.value.conversations || []).map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp)
          }))
        };
        sessions.push(session);
        cursor.continue();
      } else {
        resolve(sessions);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteJobSession(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// User name persistence (simple localStorage)
export function saveUserName(name: string): void {
  localStorage.setItem(USER_NAME_KEY, name);
}

export function getUserName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(USER_NAME_KEY) || '';
}

export function saveWebsite(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WEBSITE_KEY, url);
}

export function getWebsite(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(WEBSITE_KEY) || '';
}

export function saveIsAgency(value: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(IS_AGENCY_KEY, value ? '1' : '0');
}

export function getIsAgency(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(IS_AGENCY_KEY) === '1';
}
