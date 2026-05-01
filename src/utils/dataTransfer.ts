import { loadSavedNotes, saveNotesToStorage } from '@/config/notes';
import { loadSavedProjects, saveSavedProjectsToStorage } from '@/config/projects';
import { getAllJobSessions, saveJobSession, getUserName, getWebsite, saveUserName, saveWebsite } from '@/utils/jobStorage';
import type { SavedNote, SavedProject, JobSession } from '@/types/proposal';

const BUNDLE_VERSION = '1.0';
const BUNDLE_APP = 'UltimateFreelancers';

interface ExportBundle {
  version: string;
  exportedAt: string;
  app: string;
  counts: { projects: number; notes: number; sessions: number };
  data: {
    projects: SavedProject[];
    notes: SavedNote[];
    sessions: Record<string, any>[];
    profile: { userName: string; website: string };
  };
}

export interface ImportResult {
  projects: number;
  notes: number;
  sessions: number;
  skipped: number;
  errors: string[];
}

// ── EXPORT ────────────────────────────────────────────────────────────────────

export async function exportAllData(): Promise<void> {
  const [sessions, notes, projects] = await Promise.all([
    getAllJobSessions(),
    Promise.resolve(loadSavedNotes()),
    Promise.resolve(loadSavedProjects()),
  ]);

  // Serialise Date objects to ISO strings for JSON
  const serialisedSessions = sessions.map(s => ({
    ...s,
    createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt,
    updatedAt: s.updatedAt instanceof Date ? s.updatedAt.toISOString() : s.updatedAt,
    conversations: (s.conversations ?? []).map((c: any) => ({
      ...c,
      timestamp: c.timestamp instanceof Date ? c.timestamp.toISOString() : c.timestamp,
    })),
  }));

  const bundle: ExportBundle = {
    version: BUNDLE_VERSION,
    exportedAt: new Date().toISOString(),
    app: BUNDLE_APP,
    counts: { projects: projects.length, notes: notes.length, sessions: sessions.length },
    data: {
      projects,
      notes,
      sessions: serialisedSessions,
      profile: { userName: getUserName(), website: getWebsite() },
    },
  };

  const json = JSON.stringify(bundle, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `uf-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── IMPORT ────────────────────────────────────────────────────────────────────

export async function importAllData(file: File): Promise<ImportResult> {
  const result: ImportResult = { projects: 0, notes: 0, sessions: 0, skipped: 0, errors: [] };

  const text = await file.text();
  let bundle: ExportBundle;

  try {
    bundle = JSON.parse(text);
  } catch {
    throw new Error('Invalid file — could not parse JSON. Make sure you selected the correct .json backup file.');
  }

  if (bundle.app !== BUNDLE_APP) {
    throw new Error('This file is not an Ultimate Freelancers backup.');
  }
  if (!bundle.data) {
    throw new Error('Backup file is missing the data section.');
  }

  // ── Projects ──
  if (Array.isArray(bundle.data.projects)) {
    const existing = loadSavedProjects();
    const existingIds = new Set(existing.map(p => p.id));
    const incoming = bundle.data.projects.filter(p => {
      if (!p.id || typeof p.name !== 'string') return false;
      if (existingIds.has(p.id)) { result.skipped++; return false; }
      return true;
    });
    saveSavedProjectsToStorage([...existing, ...incoming].slice(0, 20));
    result.projects = incoming.length;
  }

  // ── Notes ──
  if (Array.isArray(bundle.data.notes)) {
    const existing = loadSavedNotes();
    const existingIds = new Set(existing.map(n => n.id));
    const incoming = bundle.data.notes.filter(n => {
      if (!n.id || typeof n.text !== 'string') return false;
      if (existingIds.has(n.id)) { result.skipped++; return false; }
      return true;
    });
    saveNotesToStorage([...existing, ...incoming].slice(0, 30));
    result.notes = incoming.length;
  }

  // ── Sessions ──
  if (Array.isArray(bundle.data.sessions)) {
    const existing = await getAllJobSessions();
    const existingIds = new Set(existing.map(s => s.id));

    for (const raw of bundle.data.sessions) {
      if (!raw.id) continue;
      if (existingIds.has(raw.id)) { result.skipped++; continue; }
      try {
        const session = {
          ...raw,
          createdAt: new Date(raw.createdAt),
          updatedAt: new Date(raw.updatedAt),
          conversations: (raw.conversations ?? []).map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp),
          })),
        } as JobSession;
        await saveJobSession(session);
        result.sessions++;
      } catch (e) {
        result.errors.push(`Session "${raw.jobTitle || raw.id}": ${e}`);
      }
    }
  }

  // ── Profile (only fills in if currently empty) ──
  if (bundle.data.profile) {
    if (bundle.data.profile.userName && !getUserName()) saveUserName(bundle.data.profile.userName);
    if (bundle.data.profile.website && !getWebsite()) saveWebsite(bundle.data.profile.website);
  }

  return result;
}

// ── PREVIEW (read file without importing) ─────────────────────────────────────

export async function previewBackup(file: File): Promise<{ valid: boolean; counts?: ExportBundle['counts']; exportedAt?: string; error?: string }> {
  try {
    const text = await file.text();
    const bundle: ExportBundle = JSON.parse(text);
    if (bundle.app !== BUNDLE_APP) return { valid: false, error: 'Not an Ultimate Freelancers backup.' };
    if (!bundle.data) return { valid: false, error: 'Missing data section.' };
    const counts = bundle.counts ?? {
      projects: bundle.data.projects?.length ?? 0,
      notes: bundle.data.notes?.length ?? 0,
      sessions: bundle.data.sessions?.length ?? 0,
    };
    return { valid: true, counts, exportedAt: bundle.exportedAt };
  } catch {
    return { valid: false, error: 'Could not read file.' };
  }
}
