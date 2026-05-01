import { SavedNote } from '@/types/proposal';

const NOTES_KEY = 'jwc_saved_notes';

export function loadSavedNotes(): SavedNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch { return []; }
}

export function saveNotesToStorage(notes: SavedNote[]): void {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes.slice(0, 30)));
}
