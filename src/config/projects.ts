import { SavedProject } from '@/types/proposal';
export type { SavedProject };

const STORAGE_KEY = 'jwc_saved_projects';

export function loadSavedProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Old format: plain array
    if (Array.isArray(parsed)) return parsed;
    // Old format: { data, expiry } — migrate to plain array, drop expiry
    if (parsed && Array.isArray(parsed.data)) {
      const projects = parsed.data as SavedProject[];
      saveSavedProjectsToStorage(projects);
      return projects;
    }
    return [];
  } catch { return []; }
}

export function saveSavedProjectsToStorage(projects: SavedProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}
