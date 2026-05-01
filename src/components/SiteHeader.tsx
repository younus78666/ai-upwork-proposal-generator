'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronDown, Menu, X, FileText, StickyNote, FolderOpen, KeyRound } from 'lucide-react'
import { hasAnyApiKey } from '@/config/providers'
import { loadSavedProjects } from '@/config/projects'
import { loadSavedNotes } from '@/config/notes'
import { getAllJobSessions } from '@/utils/jobStorage'

const TOOLS = [
  { href: '/upwork-proposal-generator', label: 'Proposal Generator', desc: 'Get 3 AI variants in 60 seconds' },
  { href: '/schema-audit', label: 'Schema Audit Tool', desc: 'Validate structured data' },
]
const COMING_TOOLS = [
  { label: 'Profile Analyzer', desc: 'Score your Upwork profile' },
  { label: 'Resume Builder', desc: 'Freelancer-focused CVs' },
]
const RESOURCES = [
  { href: '/upwork-proposal-examples', label: 'Proposal Examples' },
  { href: '/upwork-proposal-examples-by-niche', label: 'Examples by Niche' },
  { href: '/upwork-cover-letter-examples', label: 'Cover Letter Examples' },
  { href: '/upwork-bio-examples', label: 'Bio Examples' },
  { href: '/upwork-message-to-client-sample', label: 'Message Templates' },
  { href: '/upwork-proposal-template', label: 'Proposal Templates' },
  { href: '/freelance-proposal-template', label: 'Freelance Templates' },
  { href: '/upwork-screening-questions', label: 'Screening Questions' },
]
const GUIDES = [
  { href: '/how-to-write-upwork-proposal', label: 'Write an Upwork Proposal' },
  { href: '/how-to-write-upwork-cover-letter', label: 'Write a Cover Letter' },
  { href: '/how-to-submit-proposal-upwork', label: 'Submit a Proposal' },
  { href: '/how-to-win-upwork-jobs', label: 'Win Jobs on Upwork' },
]

type DropdownKey = 'tools' | 'resources' | 'guides' | null

function Badge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
      {count}
    </span>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState<DropdownKey>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hasKey, setHasKey] = useState(false)
  const [projectCount, setProjectCount] = useState(0)
  const [proposalCount, setProposalCount] = useState(0)
  const [noteCount, setNoteCount] = useState(0)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const refreshCounts = () => {
    setHasKey(hasAnyApiKey())
    setProjectCount(loadSavedProjects().length)
    setNoteCount(loadSavedNotes().length)
    getAllJobSessions().then(s => setProposalCount(s.length)).catch(() => {})
  }

  useEffect(() => {
    refreshCounts()
    window.addEventListener('focus', refreshCounts)
    return () => window.removeEventListener('focus', refreshCounts)
  }, [])

  const onEnter = (key: DropdownKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(key)
  }
  const onLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 150)
  }

  const linkCls = 'px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50'
  const dropItemCls = 'block px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-foreground'

  return (
    <header>
      <nav
        aria-label="Main navigation"
        className={`sticky top-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-[24px] saturate-150 border-b border-border transition-shadow duration-200${scrolled ? ' shadow-[0_2px_8px_rgba(26,26,46,0.06)]' : ''}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[64px]">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <picture>
                <source srcSet="/logo.webp" type="image/webp" />
                <img
                  src="/Logo---Ultimate-Freelancers.png"
                  alt="Ultimate Freelancers"
                  className="h-8 w-auto"
                  width="160"
                  height="32"
                />
              </picture>
            </Link>

            {/* Desktop center nav */}
            <div className="hidden lg:flex items-center gap-0.5" onMouseLeave={onLeave}>

              {/* Tools */}
              <div className="relative" onMouseEnter={() => onEnter('tools')}>
                <button className={`${linkCls} flex items-center gap-1`} aria-expanded={open === 'tools'}>
                  Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform${open === 'tools' ? ' rotate-180' : ''}`} />
                </button>
                {open === 'tools' && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-xl shadow-lg p-2" onMouseEnter={() => onEnter('tools')}>
                    {TOOLS.map(t => (
                      <Link key={t.href} href={t.href} className="block px-3 py-2.5 rounded-lg hover:bg-muted transition-colors" onClick={() => setOpen(null)}>
                        <div className="text-sm font-medium text-foreground">{t.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                      </Link>
                    ))}
                    <div className="mx-3 my-1.5 border-t border-border" />
                    {COMING_TOOLS.map(t => (
                      <div key={t.label} className="px-3 py-2.5 rounded-lg opacity-50 cursor-not-allowed select-none">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{t.label}</span>
                          <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Soon</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources */}
              <div className="relative" onMouseEnter={() => onEnter('resources')}>
                <button className={`${linkCls} flex items-center gap-1`} aria-expanded={open === 'resources'}>
                  Resources
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform${open === 'resources' ? ' rotate-180' : ''}`} />
                </button>
                {open === 'resources' && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-popover border border-border rounded-xl shadow-lg p-2" onMouseEnter={() => onEnter('resources')}>
                    {RESOURCES.map(r => (
                      <Link key={r.href} href={r.href} className={dropItemCls} onClick={() => setOpen(null)}>
                        {r.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Guides */}
              <div className="relative" onMouseEnter={() => onEnter('guides')}>
                <button className={`${linkCls} flex items-center gap-1`} aria-expanded={open === 'guides'}>
                  Guides
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform${open === 'guides' ? ' rotate-180' : ''}`} />
                </button>
                {open === 'guides' && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-popover border border-border rounded-xl shadow-lg p-2" onMouseEnter={() => onEnter('guides')}>
                    {GUIDES.map(g => (
                      <Link key={g.href} href={g.href} className={dropItemCls} onClick={() => setOpen(null)}>
                        {g.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/blog" className={linkCls}>Blog</Link>
              <Link href="/about" className={linkCls}>About</Link>
            </div>

            {/* Desktop right: workspace + CTA */}
            <div className="hidden lg:flex items-center gap-0.5">
              <Link href="/proposals">
                <Button variant="ghost" size="sm" className="relative gap-1.5 text-muted-foreground hover:text-foreground text-xs">
                  <FileText className="h-3.5 w-3.5" /> Proposals
                  <Badge count={proposalCount} />
                </Button>
              </Link>
              <Link href="/notes">
                <Button variant="ghost" size="sm" className="relative gap-1.5 text-muted-foreground hover:text-foreground text-xs">
                  <StickyNote className="h-3.5 w-3.5" /> Notes
                  <Badge count={noteCount} />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="ghost" size="sm" className="relative gap-1.5 text-muted-foreground hover:text-foreground text-xs">
                  <FolderOpen className="h-3.5 w-3.5" /> Projects
                  <Badge count={projectCount} />
                </Button>
              </Link>
              <Link href="/api-key">
                <Button variant="ghost" size="sm" className="relative gap-1.5 text-muted-foreground hover:text-foreground text-xs">
                  <KeyRound className="h-3.5 w-3.5" /> API Key
                  {hasKey && <span className="absolute top-1.5 right-1 w-1.5 h-1.5 bg-green-500 rounded-full" />}
                </Button>
              </Link>
              <div className="w-px h-5 bg-border mx-1.5" />
              <Link href="/upwork-proposal-generator">
                <Button size="sm" className="gradient-primary text-primary-foreground font-semibold px-4">
                  Try Free
                </Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 -mr-1 text-foreground"
              onClick={() => setMenuOpen(p => !p)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-5 space-y-5">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tools</p>
                {TOOLS.map(t => (
                  <Link key={t.href} href={t.href} className="block py-2 text-sm font-medium text-foreground" onClick={() => setMenuOpen(false)}>
                    {t.label}
                  </Link>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Resources</p>
                {RESOURCES.map(r => (
                  <Link key={r.href} href={r.href} className="block py-1.5 text-sm text-foreground/80" onClick={() => setMenuOpen(false)}>
                    {r.label}
                  </Link>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Guides</p>
                {GUIDES.map(g => (
                  <Link key={g.href} href={g.href} className="block py-1.5 text-sm text-foreground/80" onClick={() => setMenuOpen(false)}>
                    {g.label}
                  </Link>
                ))}
              </div>
              <div className="flex gap-3 border-t border-border pt-4">
                <Link href="/blog" className="text-sm font-medium text-muted-foreground" onClick={() => setMenuOpen(false)}>Blog</Link>
                <Link href="/about" className="text-sm font-medium text-muted-foreground" onClick={() => setMenuOpen(false)}>About</Link>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Workspace</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: '/proposals', icon: <FileText className="h-4 w-4" />, label: 'Proposals', count: proposalCount },
                    { href: '/notes', icon: <StickyNote className="h-4 w-4" />, label: 'Notes', count: noteCount },
                    { href: '/projects', icon: <FolderOpen className="h-4 w-4" />, label: 'Projects', count: projectCount },
                    { href: '/api-key', icon: <KeyRound className="h-4 w-4" />, label: 'API Key', count: 0 },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full gap-2 justify-start">
                        {item.icon}
                        {item.label}
                        {item.count > 0 && <span className="ml-auto text-xs text-muted-foreground">{item.count}</span>}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/upwork-proposal-generator" onClick={() => setMenuOpen(false)}>
                <Button className="w-full gradient-primary text-primary-foreground font-semibold">
                  Try Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
