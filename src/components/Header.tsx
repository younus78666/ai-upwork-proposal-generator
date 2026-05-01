'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { KeyRound, FolderOpen, FileText, StickyNote } from 'lucide-react';
import { hasAnyApiKey } from '@/config/providers';
import { loadSavedProjects } from '@/config/projects';
import { loadSavedNotes } from '@/config/notes';
import { getAllJobSessions } from '@/utils/jobStorage';

export function Header() {
  const [hasKey, setHasKey] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [proposalCount, setProposalCount] = useState(0);
  const [noteCount, setNoteCount] = useState(0);

  const refresh = () => {
    setHasKey(hasAnyApiKey());
    setProjectCount(loadSavedProjects().length);
    setNoteCount(loadSavedNotes().length);
    getAllJobSessions().then(s => setProposalCount(s.length)).catch(() => {});
  };

  useEffect(() => {
    refresh();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  return (
    <header className="w-full border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/Favicon.png"
            alt="Ultimate Freelancers logo"
            className="h-9 w-9 rounded-lg shadow-md"
          />
          <span className="font-semibold text-foreground">Ultimate Freelancers</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Proposals link */}
          <Link href="/proposals">
            <Button variant="ghost" size="sm" className="gap-2 relative">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Proposals</span>
              {proposalCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {proposalCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Notes link */}
          <Link href="/notes">
            <Button variant="ghost" size="sm" className="gap-2 relative">
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
              {noteCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {noteCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Projects link */}
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-2 relative">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
              {projectCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {projectCount}
                </span>
              )}
            </Button>
          </Link>

          {/* API key page link - always visible */}
          <Link href="/api-key">
            <Button variant="ghost" size="sm" className="gap-2 relative">
              <KeyRound className="h-4 w-4" />
              <span className="hidden sm:inline">API Key</span>
              {hasKey && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </Button>
          </Link>

        </div>
      </div>
    </header>
  );
}
