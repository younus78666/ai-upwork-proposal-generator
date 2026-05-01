'use client'
import { useState, useCallback, useRef, useMemo } from 'react';
import { Helmet } from '@/lib/helmet-stub';
import {
  Search, Plus, Trash2, Play, RotateCcw, Copy, Check,
  ChevronDown, ChevronRight, AlertCircle, AlertTriangle,
  CheckCircle2, Loader2, ExternalLink, X, Globe, Sparkles,
  FileText, Tag, Link2, Eye, EyeOff, Zap,
  Monitor, MessageSquare, ListChecks, ClipboardList, Download, ShieldOff
} from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string;
const CHECKER_URL = `${SUPABASE_URL}/functions/v1/schema-checker`;
const CRAWLER_URL = `${SUPABASE_URL}/functions/v1/crawl-domain`;

// URL patterns that typically should NOT be indexed
const NOINDEX_PATTERNS = [
  /\/privacy(-policy)?/i, /\/terms(-of-(service|use))?/i, /\/cookie(-policy)?/i,
  /\/login\/?$/i, /\/register\/?$/i, /\/signup\/?$/i, /\/sign-up\/?$/i,
  /\/cart\/?$/i, /\/checkout\/?/i, /\/thank(-you|you)\/?/i,
  /\/account\/?/i, /\/dashboard\/?/i, /\/admin\/?/i, /\/wp-admin\/?/i,
  /\/search(\?|\/|$)/i, /\/404\/?$/i, /\?.*page=/i, /\?.*s=/i,
];

function shouldBeNoindex(url: string): boolean {
  try { const u = new URL(url); return NOINDEX_PATTERNS.some(p => p.test(u.pathname + u.search)); }
  catch { return false; }
}

const RULES: Record<string, { required: string[]; recommended: string[] }> = {
  Article: { required: ['headline', 'author', 'datePublished', 'publisher'], recommended: ['dateModified', 'image', 'description', 'url'] },
  BlogPosting: { required: ['headline', 'author', 'datePublished', 'publisher'], recommended: ['dateModified', 'image', 'description', 'url'] },
  FAQPage: { required: ['mainEntity'], recommended: [] },
  HowTo: { required: ['name', 'step'], recommended: ['description', 'totalTime'] },
  BreadcrumbList: { required: ['itemListElement'], recommended: [] },
  SoftwareApplication: { required: ['name', 'applicationCategory', 'offers'], recommended: ['aggregateRating', 'featureList', 'operatingSystem', 'url'] },
  Organization: { required: ['name', 'url'], recommended: ['logo', 'email', 'sameAs', 'description'] },
  WebPage: { required: ['url', 'name'], recommended: ['isPartOf', 'author'] },
  WebSite: { required: ['url', 'name'], recommended: ['publisher', 'potentialAction'] },
  Blog: { required: ['name', 'url'], recommended: ['publisher', 'blogPost'] },
  Person: { required: ['name'], recommended: ['url', 'jobTitle'] },
  SiteNavigationElement: { required: ['name'], recommended: ['url', 'hasPart'] },
  AggregateRating: { required: ['ratingValue', 'ratingCount'], recommended: ['bestRating', 'worstRating'] },
  Product: { required: ['name'], recommended: ['image', 'description', 'offers', 'aggregateRating'] },
  LocalBusiness: { required: ['name', 'address'], recommended: ['telephone', 'openingHours', 'geo', 'url'] },
  Service: { required: ['name'], recommended: ['description', 'provider', 'areaServed'] },
};

interface ValidationResult { errors: string[]; warnings: string[]; info: string[]; }

function deepValidate(item: any): ValidationResult {
  const errors: string[] = []; const warnings: string[] = []; const info: string[] = [];
  const type = item['@type'];
  const rules = RULES[type as string];
  if (!rules) { info.push(`@type "${type}" — no validation rules defined`); return { errors, warnings, info }; }
  for (const f of rules.required) { if (item[f] == null) errors.push(`Missing required: "${f}"`); }
  for (const f of rules.recommended) { if (item[f] == null) warnings.push(`Missing recommended: "${f}"`); }
  if (type === 'FAQPage') {
    const qs = item.mainEntity || [];
    if (!qs.length) errors.push('mainEntity is empty');
    qs.forEach((q: any, i: number) => {
      if (!q.name) errors.push(`Q${i + 1}: missing "name"`);
      if (!q.acceptedAnswer?.text) errors.push(`Q${i + 1}: missing acceptedAnswer.text`);
    });
    info.push(`${qs.length} questions`);
  }
  if (type === 'BreadcrumbList') {
    const items = item.itemListElement || [];
    items.forEach((li: any, i: number) => {
      if (!li.position) errors.push(`Item ${i + 1}: missing position`);
      if (!li.name) errors.push(`Item ${i + 1}: missing name`);
      if (!li.item) errors.push(`Item ${i + 1}: missing item URL`);
    });
    info.push(`${items.length} breadcrumbs`);
  }
  if (type === 'HowTo') {
    const steps = item.step || [];
    steps.forEach((s: any, i: number) => {
      if (!s.name) errors.push(`Step ${i + 1}: missing name`);
      if (!s.text) errors.push(`Step ${i + 1}: missing text`);
    });
    info.push(`${steps.length} steps`);
  }
  if (type === 'SoftwareApplication' && item.aggregateRating) {
    if (!item.aggregateRating.ratingValue) errors.push('aggregateRating: missing ratingValue');
    if (!item.aggregateRating.ratingCount) errors.push('aggregateRating: missing ratingCount');
    info.push(`Rating: ${item.aggregateRating.ratingValue}/5 (${item.aggregateRating.ratingCount} reviews)`);
  }
  return { errors, warnings, info };
}

function flattenSchemas(raw: any): any[] {
  if (!raw) return [];
  if (raw['@graph']) return raw['@graph'];
  if (Array.isArray(raw)) return raw.flatMap(flattenSchemas);
  return [raw];
}

type UrlStatus = 'idle' | 'checking' | 'rendering' | 'done' | 'error';
type IndexStatus = 'indexable' | 'noindex' | 'correctly-noindexed' | 'should-noindex' | 'error' | 'unknown';

interface SchemaItem { type: string; raw: any; errors: string[]; warnings: string[]; info: string[]; }

interface SpeedResult { score: number; lcp?: number; fcp?: number; cls?: number; tbt?: number; }

interface UrlResult {
  url: string; status: UrlStatus; httpStatus?: number;
  isIndexable?: boolean; metaRobots?: string | null;
  metaTitle?: string | null; metaDescription?: string | null;
  canonical?: string | null;
  ogTitle?: string | null; ogDescription?: string | null; ogImage?: string | null;
  twitterCard?: string | null;
  hasViewport?: boolean;
  h1Count?: number; h1Text?: string | null; h2Count?: number;
  headings?: { level: number; text: string }[];
  wordCount?: number;
  imgCount?: number; imgMissingAlt?: number;
  responseTime?: number;
  schemas: SchemaItem[]; parseErrors: string[]; fetchError?: string;
  totalErrors: number; totalWarnings: number;
  isSpa?: boolean;
  botProtected?: boolean; botBlockReason?: string; bypassAttempt?: string;
  speed?: SpeedResult; speedChecking?: boolean;
}

function indexStatus(result: UrlResult): IndexStatus {
  if (result.status !== 'done') return 'unknown';
  if (result.httpStatus && result.httpStatus >= 400) return 'error';
  const isUtility = shouldBeNoindex(result.url);
  if (!result.isIndexable) return isUtility ? 'correctly-noindexed' : 'noindex';
  if (isUtility) return 'should-noindex';
  return 'indexable';
}

// ─── Fix Prompt ───────────────────────────────────────────────────────────────

function generateFixPrompt(result: UrlResult): string {
  const issues: { severity: 'critical' | 'warning'; category: string; problem: string; fix: string }[] = [];
  const url = result.url;

  if (result.httpStatus && result.httpStatus >= 400)
    issues.push({ severity: 'critical', category: 'HTTP Status', problem: `Page returns HTTP ${result.httpStatus}`, fix: `Fix the server to return 200 for this URL. If the page was moved, set up a 301 redirect.` });

  const idx = indexStatus(result);
  if (idx === 'noindex')
    issues.push({ severity: 'critical', category: 'Indexability', problem: `Page has noindex — Google will NOT index this page (robots: "${result.metaRobots}")`, fix: `Remove 'noindex' from robots meta. React/Vite:\n<Helmet><meta name="robots" content="index, follow" /></Helmet>\nNext.js: export const metadata = { robots: { index: true, follow: true } }` });
  if (idx === 'should-noindex')
    issues.push({ severity: 'warning', category: 'Indexability', problem: `Utility page is currently indexable. Google may waste crawl budget on it.`, fix: `Consider adding noindex:\n<Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>` });

  if (!result.canonical)
    issues.push({ severity: 'critical', category: 'Canonical URL', problem: `No canonical URL — Google may index duplicate versions of this page`, fix: `React/Vite:\n<Helmet><link rel="canonical" href="${url}" /></Helmet>\nNext.js App Router:\nexport const metadata = { alternates: { canonical: '${url}' } }` });
  else {
    const cleanUrl = url.replace(/\/$/, '');
    const cleanCanonical = result.canonical.replace(/\/$/, '');
    if (cleanCanonical !== cleanUrl)
      issues.push({ severity: 'warning', category: 'Canonical URL', problem: `Canonical mismatch\nPage:      ${url}\nCanonical: ${result.canonical}`, fix: `Update canonical to match page URL:\n<Helmet><link rel="canonical" href="${url}" /></Helmet>` });
  }

  if (!result.metaTitle)
    issues.push({ severity: 'critical', category: 'Meta Title', problem: `Meta title missing`, fix: `Add title (50-60 chars):\n<Helmet><title>Page Title | Brand</title></Helmet>\nNext.js: export const metadata = { title: 'Page Title | Brand' }` });
  else if (result.metaTitle.length < 50)
    issues.push({ severity: 'critical', category: 'Meta Title', problem: `Title too short (${result.metaTitle.length} chars) — must be 50-60 chars\nCurrent: "${result.metaTitle}"`, fix: `Expand to 50-60 chars. Add your primary keyword and brand name.\nExample: "Upwork Proposal Generator — Write Winning Proposals | Brand"` });
  else if (result.metaTitle.length > 60)
    issues.push({ severity: 'critical', category: 'Meta Title', problem: `Title too long (${result.metaTitle.length} chars) — Google truncates at 60 chars\nCurrent: "${result.metaTitle}"`, fix: `Trim to 50-60 chars. Remove filler words. Keep the primary keyword near the start.` });

  if (!result.metaDescription)
    issues.push({ severity: 'critical', category: 'Meta Description', problem: `Meta description missing`, fix: `Add description (150-160 chars):\n<Helmet><meta name="description" content="Your description here." /></Helmet>\nNext.js: export const metadata = { description: 'Your description.' }` });
  else if (result.metaDescription.length < 150)
    issues.push({ severity: 'critical', category: 'Meta Description', problem: `Description too short (${result.metaDescription.length} chars) — ideal is 150-160 chars. Google will auto-generate a worse snippet.`, fix: `Expand to 150-160 chars. Include main keyword and a call to action.\nCurrent: "${result.metaDescription}"` });
  else if (result.metaDescription.length > 160)
    issues.push({ severity: 'critical', category: 'Meta Description', problem: `Description too long (${result.metaDescription.length} chars) — Google truncates after ~160 chars.`, fix: `Trim to 150-160 chars.\nCurrent: "${result.metaDescription}"` });

  if (result.h1Count === 0)
    issues.push({ severity: 'critical', category: 'H1 Heading', problem: `No H1 tag found — critical for SEO relevance signals`, fix: `Add exactly one H1 with your primary keyword:\n<h1>Your Primary Keyword Phrase Here</h1>` });
  else if ((result.h1Count ?? 0) > 1)
    issues.push({ severity: 'warning', category: 'H1 Heading', problem: `Multiple H1 tags found (${result.h1Count}) — page should have exactly one H1`, fix: `Keep only one H1. Convert extra H1s to H2 or H3.` });

  if (result.hasViewport === false)
    issues.push({ severity: 'critical', category: 'Mobile', problem: `Missing viewport meta tag — page will not render correctly on mobile. Google uses mobile-first indexing.`, fix: `Add to <head>:\n<meta name="viewport" content="width=device-width, initial-scale=1" />` });

  if (!result.ogTitle)
    issues.push({ severity: 'warning', category: 'Open Graph', problem: `Missing og:title — social shares will look broken on LinkedIn, Facebook, Slack`, fix: `<Helmet><meta property="og:title" content="Page Title | Brand" /></Helmet>` });

  if (!result.ogDescription)
    issues.push({ severity: 'warning', category: 'Open Graph', problem: `Missing og:description`, fix: `<Helmet><meta property="og:description" content="Your description." /></Helmet>` });

  if (!result.ogImage)
    issues.push({ severity: 'warning', category: 'Open Graph', problem: `Missing og:image — social share cards will have no image`, fix: `<Helmet><meta property="og:image" content="https://yourdomain.com/og-image.png" /></Helmet>\nIdeal size: 1200x630px` });

  if (!result.twitterCard)
    issues.push({ severity: 'warning', category: 'Twitter Card', problem: `Missing twitter:card — Twitter/X shares will not show card preview`, fix: `<Helmet>\n  <meta name="twitter:card" content="summary_large_image" />\n  <meta name="twitter:title" content="Page Title" />\n  <meta name="twitter:description" content="Description." />\n  <meta name="twitter:image" content="https://yourdomain.com/og-image.png" />\n</Helmet>` });

  if ((result.imgMissingAlt ?? 0) > 0)
    issues.push({ severity: 'warning', category: 'Accessibility / SEO', problem: `${result.imgMissingAlt} image${(result.imgMissingAlt ?? 0) > 1 ? 's' : ''} missing alt text — harms accessibility and image SEO`, fix: `Add descriptive alt attributes to all images:\n<img src="..." alt="Descriptive text about the image" />` });

  for (const schema of result.schemas) {
    for (const err of schema.errors)
      issues.push({ severity: 'critical', category: `Schema (${schema.type})`, problem: err, fix: `Add the missing field to your ${schema.type} schema.` });
    for (const warn of schema.warnings)
      issues.push({ severity: 'warning', category: `Schema (${schema.type})`, problem: warn, fix: `Add the recommended field to improve rich snippet eligibility.` });
  }

  if (issues.length === 0) return `No issues found on ${url}\n\nThis page passes all SEO checks.`;

  const criticals = issues.filter(i => i.severity === 'critical');
  const warnings = issues.filter(i => i.severity === 'warning');
  const sep = '='.repeat(60);
  const cBlock = criticals.length > 0
    ? `\nCRITICAL ISSUES (${criticals.length}) — Fix these first:\n\n` + criticals.map((issue, i) => `${i + 1}. [${issue.category}]\n   Problem: ${issue.problem}\n   Fix: ${issue.fix}`).join('\n\n')
    : '';
  const wBlock = warnings.length > 0
    ? `\nWARNINGS (${warnings.length}) — Fix for better rankings:\n\n` + warnings.map((issue, i) => `${i + 1}. [${issue.category}]\n   Problem: ${issue.problem}\n   Fix: ${issue.fix}`).join('\n\n')
    : '';

  const indexNote = idx === 'correctly-noindexed' ? '\nINDEXABILITY: ✓ Legal/utility page correctly set to noindex. No action needed.' :
    idx === 'should-noindex' ? '\nINDEXABILITY NOTE: Utility page (privacy/terms/login/etc.) is currently indexable. Consider adding noindex.' :
    idx === 'noindex' ? '\nINDEXABILITY NOTE: This page is set to noindex — Google will not index it.' :
    idx === 'indexable' ? '\nINDEXABILITY: ✓ Page is configured to be indexed by Google.' : '';

  return `════════════════════════════════════════════════════════════════════
TECHNICAL & ON-PAGE SEO FIX — SINGLE PAGE
Generated by Ultimate Freelancers SEO Audit Tool
════════════════════════════════════════════════════════════════════

Fix every SEO issue listed below for this one page. After applying
all fixes, confirm and I will give you the next page.

PAGE: ${url}
TECH STACK: React/Vite or Next.js app deployed on Vercel
ISSUES: ${criticals.length} critical, ${warnings.length} warnings
${indexNote}

META TITLE RULE: Must be exactly 50-60 characters.
META DESC RULE:  Must be exactly 150-160 characters.

${sep}
${cBlock}
${wBlock}
${sep}

FRAMEWORK REFERENCE:
  React + react-helmet-async  → <Helmet><meta name="..." content="..." /></Helmet>
  Next.js App Router          → export const metadata = { title, description, alternates }
  Next.js Pages Router        → import Head from 'next/head'; <Head>...</Head>
  Canonical (React)           → <Helmet><link rel="canonical" href="${url}" /></Helmet>
  Canonical (Next.js App)     → export const metadata = { alternates: { canonical: '${url}' } }
  JSON-LD (React)             → useEffect schema injection or <Helmet> script tag
  Viewport                    → <meta name="viewport" content="width=device-width, initial-scale=1" />

After fixing this page: git add . && git commit -m "fix: SEO fixes for ${url}" && git push`;
}

// ─── Master Fix Prompt (all pages) ────────────────────────────────────────────

function generateMasterPrompt(results: UrlResult[]): string {
  const done = results.filter(r => r.status === 'done');
  const withIssues = done.filter(r => r.totalErrors > 0 || r.totalWarnings > 0);
  const clean = done.filter(r => r.totalErrors === 0 && r.totalWarnings === 0);

  if (done.length === 0) return 'No audit results yet.';

  const sep = '='.repeat(70);
  const miniSep = '-'.repeat(50);

  let out = `════════════════════════════════════════════════════════════════════
TECHNICAL & ON-PAGE SEO FIX — FULL SITE AUDIT
Generated by Ultimate Freelancers SEO Audit Tool
════════════════════════════════════════════════════════════════════

YOU ARE AN EXPERT SEO ENGINEER. Your job is to fix every SEO issue
listed below across my entire web app, page by page, in order.

HOW TO WORK:
  1. Read PAGE 1 issues below
  2. Open the file for that page in the codebase
  3. Apply EVERY fix listed (critical first, then warnings)
  4. Ask me to confirm the fix before moving to PAGE 2
  5. Repeat for each page
  6. After ALL pages are fixed, remind me to: git commit && git push
     (Vercel will auto-deploy, or run: vercel --prod)

TECH STACK: React/Vite or Next.js app deployed on Vercel
PAGES AUDITED: ${done.length} total — ${withIssues.length} need fixes, ${clean.length} are clean

FRAMEWORK REFERENCE (use the right pattern for each file):
  React + react-helmet-async  → <Helmet><meta name="..." content="..." /></Helmet>
  Next.js App Router          → export const metadata = { title, description, ... }
  Next.js Pages Router        → import Head from 'next/head'; <Head>...</Head>
  JSON-LD schema (React)      → useEffect(() => { const s = document.createElement('script'); ... }, [])
  JSON-LD schema (Next.js)    → export const metadata with alternates, or a <Script> component
  Viewport                    → <meta name="viewport" content="width=device-width, initial-scale=1" />
  Canonical (React)           → <Helmet><link rel="canonical" href="..." /></Helmet>
  Canonical (Next.js App)     → export const metadata = { alternates: { canonical: '...' } }

META TITLE RULE: Must be exactly 50-60 characters. Not less, not more.
META DESC RULE:  Must be exactly 150-160 characters. Not less, not more.

${sep}
PAGES TO FIX (${withIssues.length} pages — work through them in order)
${sep}
`;

  withIssues.forEach((result, pageIdx) => {
    const idx = indexStatus(result);
    const criticals: string[] = [];
    const warnings: string[] = [];

    if (result.httpStatus && result.httpStatus >= 400)
      criticals.push(`[HTTP] Page returns ${result.httpStatus} — fix server or add redirect`);
    if (idx === 'noindex')
      criticals.push(`[INDEXABILITY] noindex set (robots: "${result.metaRobots}") — remove noindex to allow indexing`);
    if (idx === 'correctly-noindexed')
      warnings.push(`[INDEXABILITY] ✓ Legal/utility page correctly set to noindex — no action needed`);
    if (idx === 'should-noindex')
      warnings.push(`[INDEXABILITY] Utility page currently indexable — consider adding noindex`);
    if (!result.canonical)
      criticals.push(`[CANONICAL] Missing — add: <link rel="canonical" href="${result.url}" />`);
    else {
      const cu = result.url.replace(/\/$/, ''); const cc = result.canonical.replace(/\/$/, '');
      if (cu !== cc) warnings.push(`[CANONICAL] Mismatch — page is ${result.url} but canonical is ${result.canonical}`);
    }
    if (!result.metaTitle)
      criticals.push(`[META TITLE] Missing — add a 50-60 char title`);
    else if (result.metaTitle.length < 50)
      criticals.push(`[META TITLE] Too short (${result.metaTitle.length} chars, must be 50-60): "${result.metaTitle}"`);
    else if (result.metaTitle.length > 60)
      criticals.push(`[META TITLE] Too long (${result.metaTitle.length} chars, max 60 — Google truncates): "${result.metaTitle}"`);
    if (!result.metaDescription)
      criticals.push(`[META DESC] Missing — add a 150-160 char description`);
    else if (result.metaDescription.length < 150)
      criticals.push(`[META DESC] Too short (${result.metaDescription.length} chars, need 150-160): "${result.metaDescription.substring(0, 80)}..."`);
    else if (result.metaDescription.length > 160)
      criticals.push(`[META DESC] Too long (${result.metaDescription.length} chars, max 160) — trim it`);
    if (result.h1Count === 0)
      criticals.push(`[H1] Missing — add one H1 with your primary keyword`);
    else if ((result.h1Count ?? 0) > 1)
      warnings.push(`[H1] Multiple H1s (${result.h1Count}) — keep only one`);
    if (result.hasViewport === false)
      criticals.push(`[VIEWPORT] Missing meta viewport — add: <meta name="viewport" content="width=device-width, initial-scale=1" />`);
    if (!result.ogTitle) warnings.push(`[OG] Missing og:title`);
    if (!result.ogImage) warnings.push(`[OG] Missing og:image (1200x630px recommended)`);
    if (!result.twitterCard) warnings.push(`[TWITTER] Missing twitter:card`);
    if ((result.imgMissingAlt ?? 0) > 0) warnings.push(`[ALT TEXT] ${result.imgMissingAlt} image(s) missing alt attribute`);
    for (const s of result.schemas) {
      for (const e of s.errors) criticals.push(`[SCHEMA ${s.type}] ${e}`);
      for (const w of s.warnings) warnings.push(`[SCHEMA ${s.type}] ${w}`);
    }

    out += `\nPAGE ${pageIdx + 1} of ${withIssues.length}\n`;
    out += `URL: ${result.url}\n`;
    out += `STATUS: HTTP ${result.httpStatus ?? '?'} | ${idx === 'indexable' ? 'Indexable' : idx === 'noindex' ? 'NOINDEX (fix needed)' : idx === 'correctly-noindexed' ? 'Noindex ✓ (legal/utility page, correct)' : idx === 'should-noindex' ? 'Should be noindex (recommendation)' : 'Error'}\n`;
    out += `ISSUES: ${criticals.length} critical, ${warnings.length} warnings\n`;
    out += miniSep + '\n';
    if (criticals.length > 0) {
      out += 'CRITICAL:\n';
      criticals.forEach((c, i) => { out += `  ${i + 1}. ${c}\n`; });
    }
    if (warnings.length > 0) {
      out += 'WARNINGS:\n';
      warnings.forEach((w, i) => { out += `  ${i + 1}. ${w}\n`; });
    }
    out += '\n';
  });

  // Duplicate FAQ section
  const dupFAQs = detectDuplicateFAQs(done);
  if (dupFAQs.length > 0) {
    out += `\n${sep}\nDUPLICATE FAQ QUESTIONS (${dupFAQs.length} — fix before pushing)\n${sep}\n`;
    out += `The same FAQ question text appears on multiple pages. Google may treat\n`;
    out += `these as duplicate content and suppress one page in search results.\n\n`;
    out += `HOW TO FIX: On every page EXCEPT the one most relevant to the topic,\n`;
    out += `rephrase the question to be more specific to that page's context.\n`;
    out += `Update both the FAQ schema (name:) AND the visual FAQ array (q:).\n\n`;
    dupFAQs.forEach((d, i) => {
      out += `DUPLICATE ${i + 1}: "${d.question}"\n`;
      out += `Found on ${d.urls.length} pages:\n`;
      d.urls.forEach(u => { out += `  • ${u}\n`; });
      out += '\n';
    });
  }

  if (clean.length > 0) {
    out += `${sep}\nCLEAN PAGES (${clean.length} — no action needed):\n`;
    clean.forEach(r => { out += `  ✓ ${r.url}\n`; });
  }

  out += `\n${sep}
FINAL STEP — AFTER ALL PAGES ARE FIXED:
  git add .
  git commit -m "fix: technical and on-page SEO fixes across all pages"
  git push
  (Vercel auto-deploys on push — or run: vercel --prod)

Then run the SEO audit again at https://ultimatefreelancers.com/schema-audit
to verify all pages are now clean.
${sep}`;
  return out;
}

// ─── Speed helpers ─────────────────────────────────────────────────────────────

async function fetchPageSpeed(url: string): Promise<SpeedResult> {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`PSI returned ${res.status}`);
  const data = await res.json();
  const audits = data.lighthouseResult?.audits;
  return {
    score: Math.round((data.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
    lcp: audits?.['largest-contentful-paint']?.numericValue,
    fcp: audits?.['first-contentful-paint']?.numericValue,
    cls: audits?.['cumulative-layout-shift']?.numericValue,
    tbt: audits?.['total-blocking-time']?.numericValue,
  };
}

function speedBadgeClass(score: number): string {
  if (score >= 90) return 'bg-emerald-900/60 text-emerald-300';
  if (score >= 50) return 'bg-amber-900/60 text-amber-300';
  return 'bg-red-900/60 text-red-300';
}

function speedLabel(score: number): string {
  if (score >= 90) return 'Fast';
  if (score >= 50) return 'Needs Work';
  return 'Slow';
}

function fmtMs(ms?: number): string {
  if (!ms) return '--';
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

// ─── Duplicate FAQ detection ──────────────────────────────────────────────────

function detectDuplicateFAQs(results: UrlResult[]): { question: string; urls: string[] }[] {
  const map = new Map<string, string[]>();
  for (const r of results) {
    for (const s of r.schemas) {
      if (s.type === 'FAQPage') {
        const qs: any[] = s.raw?.mainEntity || [];
        for (const q of qs) {
          const text = (q.name || '').toLowerCase().trim();
          if (!text) continue;
          const existing = map.get(text) || [];
          if (!existing.includes(r.url)) map.set(text, [...existing, r.url]);
        }
      }
    }
  }
  return Array.from(map.entries())
    .filter(([, urls]) => urls.length > 1)
    .map(([question, urls]) => ({ question, urls }));
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportToCSV(results: UrlResult[]) {
  const done = results.filter(r => r.status === 'done');
  if (!done.length) return;
  const BOM = '﻿';
  const headers = ['Page URL', 'Meta Title', 'Title Length', 'Meta Description', 'Desc Length', 'OG Title', 'OG Description', 'HTTP Status', 'Indexable', 'Canonical', 'H1 Count', 'H1 Text', 'Schemas', 'Total Errors', 'Total Warnings'];
  const esc = (v: string | number | null | undefined): string => {
    if (v == null) return '';
    const s = String(v);
    return (s.includes(',') || s.includes('"') || s.includes('\n')) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = done.map(r => [
    esc(r.url), esc(r.metaTitle), esc(r.metaTitle?.length ?? 0),
    esc(r.metaDescription), esc(r.metaDescription?.length ?? 0),
    esc(r.ogTitle), esc(r.ogDescription),
    esc(r.httpStatus), esc(r.isIndexable ? 'Yes' : 'No'), esc(r.canonical),
    esc(r.h1Count), esc(r.h1Text), esc(r.schemas.length),
    esc(r.totalErrors), esc(r.totalWarnings),
  ].join(','));
  const csv = BOM + [headers.map(esc).join(','), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `seo-audit-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function httpBadgeClass(status?: number): string {
  if (!status) return 'bg-gray-800 text-gray-400';
  if (status === 200) return 'bg-emerald-900/60 text-emerald-300';
  if (status === 301 || status === 302) return 'bg-blue-900/60 text-blue-300';
  if (status >= 400) return 'bg-red-900/60 text-red-300';
  return 'bg-gray-800 text-gray-400';
}
function titleBadgeClass(len: number): string {
  if (len >= 50 && len <= 60) return 'bg-emerald-900/60 text-emerald-300';
  return 'bg-red-900/60 text-red-300';
}
function descBadgeClass(len: number): string {
  if (len >= 150 && len <= 160) return 'bg-emerald-900/60 text-emerald-300';
  return 'bg-red-900/60 text-red-300';
}
function descLengthLabel(len: number): string {
  if (len >= 150 && len <= 160) return 'optimal';
  if (len < 150) return 'too short';
  return 'too long';
}
function titleLengthClass(len: number): string {
  if (len >= 50 && len <= 60) return 'text-emerald-400';
  return 'text-red-400';
}
function titleLengthLabel(len: number): string {
  if (len >= 50 && len <= 60) return 'optimal';
  if (len < 50) return 'too short';
  return 'too long';
}
function descLengthClass(len: number): string {
  if (len >= 150 && len <= 160) return 'text-emerald-400';
  return 'text-red-400';
}

// ─── SPA helpers ─────────────────────────────────────────────────────────────

function isSameOrigin(url: string): boolean {
  try { return new URL(url).origin === window.location.origin; }
  catch { return false; }
}

async function renderSpaInIframe(url: string): Promise<{ schemas: any[]; parseErrors: string[]; metaTitle?: string | null; metaDescription?: string | null; canonical?: string | null; h1Count?: number; h1Text?: string | null; headings?: { level: number; text: string }[]; wordCount?: number }> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1440px;height:900px;visibility:hidden;pointer-events:none;';
    document.body.appendChild(iframe);
    const cleanup = () => { try { document.body.removeChild(iframe); } catch {} };
    let settled = false;
    const done = (result: { schemas: any[]; parseErrors: string[]; metaTitle?: string | null; metaDescription?: string | null; canonical?: string | null; h1Count?: number; h1Text?: string | null; headings?: { level: number; text: string }[]; wordCount?: number }) => {
      if (settled) return; settled = true;
      cleanup(); resolve(result);
    };
    const safetyTimer = setTimeout(() => done({ schemas: [], parseErrors: ['Render timeout'] }), 12000);
    const extract = () => {
      clearTimeout(safetyTimer);
      try {
        const doc = iframe.contentDocument;
        if (!doc) { done({ schemas: [], parseErrors: [] }); return; }
        const schemas: any[] = [];
        const parseErrors: string[] = [];
        doc.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
          const raw = el.textContent?.trim() || '';
          try { schemas.push(JSON.parse(raw)); }
          catch { parseErrors.push(`JSON parse error near: ${raw.substring(0, 100)}`); }
        });
        const metaTitle = doc.title || null;
        const descEl = doc.querySelector('meta[name="description"]');
        const metaDescription = descEl?.getAttribute('content') || null;
        const canonEl = doc.querySelector('link[rel="canonical"]');
        const canonical = canonEl?.getAttribute('href') || null;
        const h1Els = doc.querySelectorAll('h1');
        const h1Count = h1Els.length;
        const h1Text = h1Els.length > 0 ? h1Els[0].textContent?.replace(/\s+/g, ' ').trim() || null : null;
        const headings: { level: number; text: string }[] = [];
        doc.querySelectorAll('h1,h2,h3,h4').forEach(el => {
          const level = parseInt(el.tagName[1]);
          const text = el.textContent?.replace(/\s+/g, ' ').trim() || '';
          if (text) headings.push({ level, text });
        });
        const bodyText = (doc.body?.innerText || '').replace(/\s+/g, ' ').trim();
        const wordCount = bodyText ? bodyText.split(' ').filter(w => w.length > 0).length : 0;
        done({ schemas, parseErrors, metaTitle, metaDescription, canonical, h1Count, h1Text, headings, wordCount });
      } catch {
        done({ schemas: [], parseErrors: [] });
      }
    };
    iframe.onload = () => setTimeout(extract, 3000);
    iframe.onerror = () => done({ schemas: [], parseErrors: ['Failed to load page in renderer'] });
    iframe.src = url;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SchemaAudit() {
  const [domain, setDomain] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [crawlSource, setCrawlSource] = useState<string | null>(null);
  const [urlQueue, setUrlQueue] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [results, setResults] = useState<UrlResult[]>([]);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
  const [expandedSchema, setExpandedSchema] = useState<string | null>(null);
  const [expandedHeadings, setExpandedHeadings] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [promptUrl, setPromptUrl] = useState<string | null>(null);
  const [showMasterPrompt, setShowMasterPrompt] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [speedRunning, setSpeedRunning] = useState(false);
  const abortRef = useRef(false);

  const discoverUrls = async () => {
    if (!domain.trim()) return;
    setCrawling(true); setCrawlSource(null);
    try {
      const res = await fetch(CRAWLER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ domain: domain.trim() }),
      });
      const data = await res.json();
      if (data.error) { alert(data.error); return; }
      setUrlQueue((data.urls as string[]).slice(0, 100));
      setResults([]);
      setProgress(0);
      const src = data.source === 'sitemap' ? 'sitemap.xml' : data.source === 'sitemap_index' ? 'sitemap index' : data.source === 'homepage_crawl' ? 'homepage link crawl (no sitemap found)' : data.source;
      setCrawlSource(`Found ${data.count} URLs via ${src}`);
    } catch { alert('Failed to crawl domain. Check the URL and try again.'); }
    finally { setCrawling(false); }
  };

  const addManualUrl = () => {
    const raw = manualInput.trim();
    if (!raw) return;
    const normalized = raw.startsWith('http') ? raw : `https://${raw}`;
    try { new URL(normalized); } catch { alert('Please enter a valid URL'); return; }
    if (!urlQueue.includes(normalized) && urlQueue.length < 100) setUrlQueue(prev => [...prev, normalized]);
    setManualInput('');
  };

  const removeUrl = useCallback((url: string) => { setUrlQueue(prev => prev.filter(u => u !== url)); }, []);

  const runAll = async () => {
    if (!urlQueue.length) return;
    setRunning(true); abortRef.current = false; setProgress(0);
    let pagesWithIssues = 0;
    setResults(urlQueue.map(url => ({ url, status: 'idle' as UrlStatus, schemas: [], parseErrors: [], totalErrors: 0, totalWarnings: 0 })));
    for (let i = 0; i < urlQueue.length; i++) {
      if (abortRef.current) break;
      const url = urlQueue[i];
      setResults(prev => prev.map(r => r.url === url ? { ...r, status: 'checking' as UrlStatus } : r));
      try {
        const res = await fetch(CHECKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (data.error) {
          setResults(prev => prev.map(r => r.url === url ? { ...r, status: 'error' as UrlStatus, fetchError: data.error, totalErrors: 1, totalWarnings: 0 } : r));
        } else if (data.botProtected) {
          setResults(prev => prev.map(r => r.url === url ? {
            ...r, status: 'done' as UrlStatus,
            httpStatus: data.statusCode, botProtected: true,
            botBlockReason: data.botBlockReason, bypassAttempt: data.bypassAttempt,
            schemas: [], parseErrors: [], totalErrors: 1, totalWarnings: 0,
            isIndexable: false, responseTime: data.responseTime,
          } : r));
        } else {
          let rawSchemas = data.schemas || [];
          let parseErrors: string[] = data.parseErrors || [];
          let metaTitle: string | null = data.metaTitle;
          let metaDescription: string | null = data.metaDescription;
          let canonical: string | null = data.canonical;
          let h1Count: number = data.h1Count ?? 0;
          let h1Text: string | null = data.h1Text ?? null;
          let headings: { level: number; text: string }[] = data.headings || [];
          let wordCount: number = data.wordCount ?? 0;

          if (data.isSpa && isSameOrigin(url)) {
            setResults(prev => prev.map(r => r.url === url ? { ...r, status: 'rendering' as UrlStatus } : r));
            const rendered = await renderSpaInIframe(url);
            if (rendered.schemas.length > 0) rawSchemas = rendered.schemas;
            if (rendered.parseErrors.length > 0) parseErrors = [...parseErrors, ...rendered.parseErrors];
            if (rendered.metaTitle) metaTitle = rendered.metaTitle;
            if (rendered.metaDescription) metaDescription = rendered.metaDescription;
            if (rendered.canonical) canonical = rendered.canonical;
            if (rendered.h1Count !== undefined) h1Count = rendered.h1Count;
            if (rendered.h1Text !== undefined) h1Text = rendered.h1Text;
            if (rendered.headings && rendered.headings.length > 0) headings = rendered.headings;
            if (rendered.wordCount !== undefined && rendered.wordCount > 0) wordCount = rendered.wordCount;
          }

          const schemas: SchemaItem[] = [];
          for (const raw of rawSchemas) {
            for (const item of flattenSchemas(raw)) {
              const { errors, warnings, info } = deepValidate(item);
              schemas.push({ type: item['@type'] || 'Unknown', raw: item, errors, warnings, info });
            }
          }
          // Meta desc: <150 or >160 = error
          const descLen = metaDescription?.length ?? 0;
          const descError = metaDescription ? (descLen < 150 || descLen > 160 ? 1 : 0) : 1;
          const titleLen = metaTitle?.length ?? 0;
          const titleError = metaTitle ? (titleLen < 50 || titleLen > 60 ? 1 : 0) : 1;
          const isUtilityPage = shouldBeNoindex(url);
          const totalErrors = schemas.reduce((s, sc) => s + sc.errors.length, 0) + (parseErrors.length || 0)
            + (!data.isIndexable && !isUtilityPage ? 1 : 0) + (!canonical ? 1 : 0)
            + titleError + descError
            + (h1Count === 0 ? 1 : 0) + (data.hasViewport === false ? 1 : 0);
          const totalWarnings = schemas.reduce((s, sc) => s + sc.warnings.length, 0)
            + (!data.ogTitle ? 1 : 0) + (!data.ogImage ? 1 : 0) + (!data.twitterCard ? 1 : 0)
            + ((data.imgMissingAlt ?? 0) > 0 ? 1 : 0) + (h1Count > 1 ? 1 : 0);
          if (totalErrors > 0) pagesWithIssues++;
          setResults(prev => prev.map(r => r.url === url ? {
            ...r, status: 'done' as UrlStatus,
            httpStatus: data.statusCode, isIndexable: data.isIndexable,
            metaTitle, metaDescription, canonical, metaRobots: data.metaRobots,
            ogTitle: data.ogTitle, ogDescription: data.ogDescription, ogImage: data.ogImage,
            twitterCard: data.twitterCard, hasViewport: data.hasViewport,
            h1Count, h1Text, h2Count: data.h2Count,
            headings, wordCount,
            imgCount: data.imgCount, imgMissingAlt: data.imgMissingAlt,
            responseTime: data.responseTime,
            schemas, parseErrors, totalErrors, totalWarnings, isSpa: data.isSpa,
            botProtected: false, bypassAttempt: data.bypassAttempt,
          } : r));
        }
      } catch {
        setResults(prev => prev.map(r => r.url === url ? { ...r, status: 'error' as UrlStatus, fetchError: 'Network error', totalErrors: 1, totalWarnings: 0 } : r));
      }
      setProgress(i + 1);
    }
    setRunning(false);
    if (pagesWithIssues > 0) setShowMasterPrompt(true);
  };

  const checkAllSpeeds = async () => {
    const doneUrls = results.filter(r => r.status === 'done').map(r => r.url);
    if (!doneUrls.length) return;
    setSpeedRunning(true);
    for (const url of doneUrls) {
      if (abortRef.current) break;
      setResults(prev => prev.map(r => r.url === url ? { ...r, speedChecking: true } : r));
      try {
        const speed = await fetchPageSpeed(url);
        setResults(prev => prev.map(r => r.url === url ? { ...r, speed, speedChecking: false } : r));
      } catch {
        setResults(prev => prev.map(r => r.url === url ? { ...r, speedChecking: false } : r));
      }
    }
    setSpeedRunning(false);
  };

  const stopAudit = () => { abortRef.current = true; };

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500); });
  };
  const copyPromptText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedPrompt(true); setTimeout(() => setCopiedPrompt(false), 1500); });
  };

  const doneResults = results.filter(r => r.status === 'done');
  const summary = {
    total: results.length,
    clean: doneResults.filter(r => r.totalErrors === 0 && r.totalWarnings === 0).length,
    warnOnly: doneResults.filter(r => r.totalErrors === 0 && r.totalWarnings > 0).length,
    errors: doneResults.filter(r => r.totalErrors > 0).length,
    noindex: doneResults.filter(r => !r.isIndexable && !shouldBeNoindex(r.url)).length,
    correctlyNoindexed: doneResults.filter(r => !r.isIndexable && shouldBeNoindex(r.url)).length,
    shouldNoindex: doneResults.filter(r => r.isIndexable && shouldBeNoindex(r.url)).length,
  };

  const duplicateFAQs = useMemo(() => detectDuplicateFAQs(doneResults), [doneResults]);

  const promptResult = promptUrl ? results.find(r => r.url === promptUrl) ?? null : null;
  const promptText = promptResult ? generateFixPrompt(promptResult) : '';
  const masterText = useMemo(() => generateMasterPrompt(results), [results]);

  const activePromptText = showMasterPrompt ? masterText : promptText;
  const activePromptTitle = showMasterPrompt ? `Master Fix Prompt (${results.filter(r => r.status === 'done').length} pages)` : 'Fix Prompt';

  return (
    <>
      <Helmet>
        <title>Technical &amp; On-Page SEO Audit for Vibe Coders | Ultimate Freelancers</title>
        <meta name="description" content="Free technical and on-page SEO audit for vibe coders. Scan any site, get AI fix prompts for Claude Code, Gemini, or ChatGPT, and fix every page step by step." />
        <link rel="canonical" href="https://ultimatefreelancers.com/schema-audit" />
        <meta property="og:title" content="Technical &amp; On-Page SEO Audit for Vibe Coders | Ultimate Freelancers" />
        <meta property="og:description" content="Scan any website for technical and on-page SEO issues. Get copy-paste prompts for Claude Code, Gemini, ChatGPT, or Codex — fix every page automatically." />
        <meta property="og:url" content="https://ultimatefreelancers.com/schema-audit" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Technical &amp; On-Page SEO Audit for Vibe Coders" />
        <meta name="twitter:description" content="Free SEO audit tool. Get AI prompts for Claude Code, Gemini, or ChatGPT to fix every issue page by page." />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "@id": "https://ultimatefreelancers.com/schema-audit#tool",
              "name": "Technical & On-Page SEO Audit Tool for Vibe Coders",
              "url": "https://ultimatefreelancers.com/schema-audit",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
              "description": "Free technical and on-page SEO audit tool. Scans any website for indexability, meta tags, canonical, H1, schema, and speed issues. Generates AI fix prompts for Claude Code, Gemini, ChatGPT, and Codex.",
              "publisher": { "@id": "https://ultimatefreelancers.com/#organization" }
            },
            {
              "@type": "WebPage",
              "@id": "https://ultimatefreelancers.com/schema-audit#webpage",
              "url": "https://ultimatefreelancers.com/schema-audit",
              "name": "Technical & On-Page SEO Audit for Vibe Coders | Ultimate Freelancers",
              "isPartOf": { "@type": "WebSite", "url": "https://ultimatefreelancers.com" },
              "publisher": { "@id": "https://ultimatefreelancers.com/#organization" }
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ultimatefreelancers.com" },
                { "@type": "ListItem", "position": 2, "name": "SEO Audit Tool", "item": "https://ultimatefreelancers.com/schema-audit" }
              ]
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is a technical SEO audit for vibe coders?",
                  "acceptedAnswer": { "@type": "Answer", "text": "A technical SEO audit for vibe coders checks your AI-built website for indexability, meta tags, canonical URLs, H1 headings, Open Graph, schema markup, and page speed — then generates ready-to-paste prompts for Claude Code, Gemini, ChatGPT, or Codex to fix every issue automatically." }
                },
                {
                  "@type": "Question",
                  "name": "How do I fix SEO issues found by the audit?",
                  "acceptedAnswer": { "@type": "Answer", "text": "After running the audit, click 'Master Fix Prompt' to get a single AI prompt covering all pages. Paste it into Claude Code, Cursor, Gemini, ChatGPT, or Codex. The AI will fix each page one at a time and tell you when to redeploy." }
                },
                {
                  "@type": "Question",
                  "name": "Does this SEO audit work for Vercel and Next.js apps?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Yes. The audit is optimized for React, Next.js, and Vite apps deployed on Vercel. Fix prompts include framework-specific code using react-helmet-async, Next.js metadata API, and proper JSON-LD schema injection patterns." }
                }
              ]
            }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <main>
          {/* Hero */}
          <section className="relative overflow-hidden bg-[#0f0e0c] py-[100px] px-4">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="relative z-10 max-w-[900px] mx-auto">
              <div className="mb-3 flex items-center gap-1.5 text-xs text-white/40">
                <a href="/" className="hover:text-white/70 transition-colors">Home</a>
                <span>/</span>
                <span className="text-white/60">SEO Audit</span>
              </div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-white/50">
                Free Tool — No Account Required
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-[3.2rem] font-bold text-white mb-5 leading-[1.08] tracking-tight max-w-[760px]">
                Technical &amp; On-Page SEO Audit{' '}
                <em className="not-italic" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                  for Vibe Coders
                </em>
              </h1>
              <p className="text-white/60 text-base sm:text-lg max-w-[580px] leading-relaxed mb-8">
                Scan any website for every technical and on-page SEO issue. Get a single AI prompt — paste it into <strong className="text-white/80">Claude Code, Gemini, ChatGPT, or Codex</strong> — and it fixes every page, one by one, then tells you to redeploy.
              </p>
              {/* AI tool pills */}
              <div className="flex flex-wrap gap-2">
                {['Claude Code', 'Cursor', 'Gemini', 'ChatGPT', 'Codex'].map(tool => (
                  <span key={tool} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50 uppercase tracking-wider">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="bg-[#0f0e0c] border-t border-white/5 px-4 py-10">
            <div className="max-w-[900px] mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
                {[
                  { step: '01', icon: '🔍', title: 'Discover Pages', desc: 'Enter your domain — we crawl your sitemap and find every URL automatically' },
                  { step: '02', icon: '⚡', title: 'Run Full Audit', desc: 'We check 10+ SEO factors per page: title, meta desc, H1, canonical, schema, speed, OG, and more' },
                  { step: '03', icon: '📋', title: 'Copy AI Prompt', desc: 'One click generates a complete fix prompt broken down page by page with exact code fixes' },
                  { step: '04', icon: '🚀', title: 'Fix & Redeploy', desc: 'Paste into Claude Code, Gemini, ChatGPT, or Codex — it fixes each page then tells you to redeploy' },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="bg-[#0f0e0c] px-5 py-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{step}</span>
                      <span className="text-base">{icon}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-white mb-1">{title}</p>
                    <p className="text-[12px] text-white/40 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="bg-amber-950/40 border-t border-b border-amber-800/30 px-4 py-3">
            <p className="max-w-[900px] mx-auto text-xs text-amber-300/70 text-center">
              Tip: This tool reads raw HTML. React/Vue SPAs that inject content via JavaScript may show incomplete results — same-origin SPAs are rendered automatically. Use Google Rich Results Test for cross-origin SPA schema validation.
            </p>
          </div>

          <section className="bg-muted/30 py-16 px-4">
            <div className="max-w-[900px] mx-auto space-y-6">

              {/* Domain Discovery */}
              <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                <div className="px-6 pt-5 pb-4">
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-0.5">
                    <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                    Discover all pages from a domain
                  </h2>
                  <p className="text-xs text-muted-foreground pl-6">Reads sitemap.xml automatically, falls back to homepage link crawl. Up to 100 URLs.</p>
                </div>
                <div className="px-6 pb-5 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Globe className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                      <input
                        type="text"
                        placeholder="https://yourapp.vercel.app"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') discoverUrls(); }}
                        className="w-full rounded-lg border border-input bg-muted/30 pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-colors"
                      />
                    </div>
                    <button
                      onClick={discoverUrls}
                      disabled={crawling || !domain.trim()}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                    >
                      {crawling ? <><Loader2 className="h-4 w-4 animate-spin" />Discovering...</> : <><Search className="h-4 w-4" />Discover URLs</>}
                    </button>
                  </div>
                  {crawlSource && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-4 py-2.5 text-xs text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />{crawlSource}
                    </div>
                  )}
                </div>
              </div>

              {/* URL Queue */}
              {urlQueue.length > 0 && (
                <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                      URL Queue
                      <span className="inline-flex items-center justify-center rounded-full bg-primary/15 text-primary text-[11px] font-bold px-2 py-0.5 min-w-[22px]">{urlQueue.length}</span>
                    </h2>
                    <button onClick={() => { setUrlQueue([]); setCrawlSource(null); }} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />Clear all
                    </button>
                  </div>
                  {/* URL chips */}
                  <div className="px-6 pb-4 max-h-52 overflow-y-auto">
                    <div className="flex flex-wrap gap-1.5">
                      {urlQueue.map(url => (
                        <div key={url} className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 pl-2.5 pr-1.5 py-1 text-[11px] font-mono text-muted-foreground hover:border-muted-foreground/40 transition-colors max-w-[320px]">
                          <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
                          <button onClick={() => removeUrl(url)} className="flex-shrink-0 rounded-full p-0.5 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Add URL manually */}
                  <div className="border-t border-border/60 bg-muted/20 px-6 py-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Plus className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40" />
                        <input
                          type="text"
                          placeholder="Add a URL manually — https://yourapp.vercel.app/about"
                          value={manualInput}
                          onChange={e => setManualInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') addManualUrl(); }}
                          className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                        />
                      </div>
                      <button
                        onClick={addManualUrl}
                        disabled={!manualInput.trim()}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4" />Add URL
                      </button>
                    </div>
                    {running ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Checking {progress} of {urlQueue.length}...</span>
                          <button onClick={stopAudit} className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors font-medium">
                            <X className="h-3.5 w-3.5" />Stop audit
                          </button>
                        </div>
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${urlQueue.length > 0 ? Math.round((progress / urlQueue.length) * 100) : 0}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground/60 text-right">{urlQueue.length > 0 ? Math.round((progress / urlQueue.length) * 100) : 0}% complete</p>
                      </div>
                    ) : (
                      <button
                        onClick={runAll}
                        disabled={!urlQueue.length}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        <Play className="h-4 w-4" />Run Full Audit — {urlQueue.length} URL{urlQueue.length !== 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Results */}
              {results.length > 0 && (
                <div className="space-y-4">

                  {/* Summary bar */}
                  <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/60">
                      <div className="px-5 py-4 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground leading-none">{summary.total}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Pages audited</p>
                        </div>
                      </div>
                      <div className="px-5 py-4 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald-950/40 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-emerald-400 leading-none">{summary.clean}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">All clean</p>
                        </div>
                      </div>
                      <div className="px-5 py-4 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-red-950/40 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-red-400 leading-none">{summary.errors}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Have errors</p>
                        </div>
                      </div>
                      <div className="px-5 py-4 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-amber-950/40 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-amber-400 leading-none">{summary.warnOnly}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Warnings only</p>
                        </div>
                      </div>
                    </div>
                    {!running && doneResults.length > 0 && (
                      <div className="border-t border-border/60 bg-muted/20 px-5 py-3 flex flex-wrap items-center gap-2">
                        {summary.noindex > 0 && <span className="inline-flex items-center gap-1.5 text-xs text-red-400"><EyeOff className="h-3.5 w-3.5" />{summary.noindex} noindex</span>}
                        {summary.correctlyNoindexed > 0 && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400"><CheckCircle2 className="h-3.5 w-3.5" />{summary.correctlyNoindexed} legal pages ✓</span>}
                        {summary.shouldNoindex > 0 && <span className="inline-flex items-center gap-1.5 text-xs text-amber-400"><AlertTriangle className="h-3.5 w-3.5" />{summary.shouldNoindex} should noindex</span>}
                        <div className="ml-auto flex items-center gap-3">
                          <button
                            onClick={checkAllSpeeds}
                            disabled={speedRunning}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                          >
                            {speedRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                            {speedRunning ? 'Checking speeds...' : 'Check Speeds'}
                          </button>
                          <span className="text-muted-foreground/30">|</span>
                          <button
                            onClick={() => exportToCSV(results)}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />Download Excel
                          </button>
                          <span className="text-muted-foreground/30">|</span>
                          <button
                            onClick={() => setShowMasterPrompt(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            <ClipboardList className="h-3.5 w-3.5" />Master Fix Prompt
                          </button>
                          <span className="text-muted-foreground/30">|</span>
                          <button
                            onClick={() => { setResults([]); setProgress(0); }}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />Reset
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duplicate FAQs panel */}
                  {duplicateFAQs.length > 0 && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-5">
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-300 mb-3">
                        <ListChecks className="h-4 w-4" />
                        Duplicate FAQ Questions Detected ({duplicateFAQs.length})
                      </h3>
                      <p className="text-xs text-amber-300/70 mb-3">The same FAQ question appears on multiple pages. This can cause duplicate content issues and schema validation warnings.</p>
                      <div className="space-y-2">
                        {duplicateFAQs.map((d, i) => (
                          <div key={i} className="text-xs border border-amber-500/20 bg-amber-950/20 rounded p-3">
                            <p className="font-medium text-amber-200 mb-1">"{d.question}"</p>
                            <p className="text-amber-400/70">Found on {d.urls.length} pages:</p>
                            {d.urls.map(u => <p key={u} className="font-mono text-amber-300/60 ml-2">• {u}</p>)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Per-URL results */}
                  <div className="space-y-2.5">
                    {results.map(result => {
                      const isExpanded = expandedUrl === result.url;
                      const isBotBlocked = result.status === 'done' && result.botProtected;
                      const si = result.status === 'checking' || result.status === 'rendering' ? 'checking' : result.status === 'error' ? 'error' : result.status === 'idle' ? 'idle' : isBotBlocked ? 'bot' : result.totalErrors > 0 ? 'error' : result.totalWarnings > 0 ? 'warning' : 'clean';
                      const bc = si === 'bot' ? 'border-orange-500/40' : si === 'error' ? 'border-red-500/30' : si === 'warning' ? 'border-amber-400/30' : si === 'clean' ? 'border-emerald-500/30' : 'border-border';
                      const accentColor = si === 'bot' ? 'bg-orange-500/70' : si === 'error' ? 'bg-red-500/70' : si === 'warning' ? 'bg-amber-400/70' : si === 'clean' ? 'bg-emerald-500/70' : 'bg-muted-foreground/20';
                      const idx = indexStatus(result);
                      return (
                        <div key={result.url} className={`rounded-xl border bg-background overflow-hidden ${bc} flex`}>
                          {/* Left accent strip */}
                          <div className={`w-1 flex-shrink-0 ${accentColor}`} />
                          <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 px-4 py-3">
                            <span className="flex-shrink-0 w-5 text-center">
                              {result.status === 'rendering' ? <Loader2 className="h-4 w-4 animate-spin text-violet-400 inline" />
                                : result.status === 'checking' ? <Loader2 className="h-4 w-4 animate-spin text-blue-400 inline" />
                                : result.status === 'idle' ? <span className="inline-block h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                                : si === 'bot' ? <ShieldOff className="h-4 w-4 text-orange-400 inline" />
                                : si === 'error' ? <AlertCircle className="h-4 w-4 text-red-400 inline" />
                                : si === 'warning' ? <AlertTriangle className="h-4 w-4 text-amber-400 inline" />
                                : <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-mono text-foreground truncate">{result.url}</p>
                              {result.status === 'done' && isBotBlocked && (
                                <p className="text-[11px] text-orange-400 mt-0.5">Bot protected — {result.botBlockReason}</p>
                              )}
                              {result.status === 'done' && !isBotBlocked && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {result.schemas.length} schema{result.schemas.length !== 1 ? 's' : ''}
                                  {result.totalErrors > 0 && <span className="text-red-400 ml-1">— {result.totalErrors} error{result.totalErrors !== 1 ? 's' : ''}</span>}
                                  {result.totalWarnings > 0 && <span className="text-amber-400 ml-1">— {result.totalWarnings} warning{result.totalWarnings !== 1 ? 's' : ''}</span>}
                                  {result.totalErrors === 0 && result.totalWarnings === 0 && <span className="text-emerald-400 ml-1">— all good</span>}
                                  {result.responseTime && <span className="text-muted-foreground/50 ml-1">— {result.responseTime}ms server response</span>}
                                  {result.bypassAttempt && result.bypassAttempt !== 'chrome' && <span className="text-muted-foreground/40 ml-1">via {result.bypassAttempt}</span>}
                                </p>
                              )}
                              {result.status === 'checking' && <p className="text-[11px] text-blue-400 mt-0.5">Checking...</p>}
                              {result.status === 'rendering' && <p className="text-[11px] text-violet-400 mt-0.5">Rendering JavaScript (3s)...</p>}
                              {result.status === 'idle' && <p className="text-[11px] text-muted-foreground mt-0.5">Waiting...</p>}
                              {result.status === 'error' && <p className="text-[11px] text-red-400 mt-0.5">{result.fetchError || 'Failed to fetch'}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {result.status === 'done' && (
                                <button onClick={() => setPromptUrl(result.url)}
                                  className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/20 transition-colors">
                                  <Sparkles className="h-3.5 w-3.5" />Fix Prompt
                                </button>
                              )}
                              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" title="Open URL">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                              {result.status === 'done' && (
                                <button onClick={() => setExpandedUrl(isExpanded ? null : result.url)}
                                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  {isExpanded ? 'Collapse' : 'Details'}
                                </button>
                              )}
                            </div>
                          </div>

                          {result.status === 'done' && (
                            <div className="px-4 pb-3 flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${httpBadgeClass(result.httpStatus)}`}>HTTP {result.httpStatus}</span>

                              {/* Bot protection badge */}
                              {isBotBlocked && (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-orange-900/60 text-orange-300">
                                  <ShieldOff className="h-3 w-3" />Bot Protected
                                </span>
                              )}

                              {/* Index status badge */}
                              {idx === 'indexable' && (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-emerald-900/60 text-emerald-300"><Eye className="h-3 w-3" />Indexable</span>
                              )}
                              {idx === 'correctly-noindexed' && (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-emerald-900/60 text-emerald-300"><CheckCircle2 className="h-3 w-3" />Legal page ✓</span>
                              )}
                              {idx === 'noindex' && (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-red-900/60 text-red-300"><EyeOff className="h-3 w-3" />Noindex</span>
                              )}
                              {idx === 'should-noindex' && (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-amber-900/60 text-amber-300"><AlertTriangle className="h-3 w-3" />Should noindex?</span>
                              )}
                              {idx === 'error' && (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-red-900/60 text-red-300"><AlertCircle className="h-3 w-3" />Not accessible</span>
                              )}

                              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${result.canonical ? 'bg-blue-900/60 text-blue-300' : 'bg-red-900/60 text-red-300'}`}>
                                <Link2 className="h-3 w-3" />{result.canonical ? 'Canonical' : 'No canonical'}
                              </span>

                              {result.metaTitle
                                ? <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${titleBadgeClass(result.metaTitle.length)}`}><Tag className="h-3 w-3" />Title {result.metaTitle.length}ch</span>
                                : <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-red-900/60 text-red-300"><Tag className="h-3 w-3" />No title</span>}

                              {result.metaDescription
                                ? <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${descBadgeClass(result.metaDescription.length)}`}><MessageSquare className="h-3 w-3" />Desc {result.metaDescription.length}ch</span>
                                : <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-red-900/60 text-red-300"><MessageSquare className="h-3 w-3" />No desc</span>}

                              {result.h1Count === 0
                                ? <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-red-900/60 text-red-300">No H1</span>
                                : result.h1Count === 1
                                  ? <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-emerald-900/60 text-emerald-300">H1 ✓</span>
                                  : <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-amber-900/60 text-amber-300">{result.h1Count}× H1</span>}

                              {result.wordCount !== undefined && result.wordCount > 0 && (
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${result.wordCount < 300 ? 'bg-amber-900/60 text-amber-300' : result.wordCount > 2500 ? 'bg-blue-900/60 text-blue-300' : 'bg-gray-800 text-gray-300'}`}>
                                  {result.wordCount.toLocaleString()} words
                                </span>
                              )}

                              {result.schemas.length > 0
                                ? <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${result.schemas.some(s => s.errors.length > 0) ? 'bg-red-900/60 text-red-300' : 'bg-emerald-900/60 text-emerald-300'}`}><FileText className="h-3 w-3" />{result.schemas.length} schema{result.schemas.length !== 1 ? 's' : ''}</span>
                                : result.isSpa
                                  ? <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-amber-900/60 text-amber-300"><FileText className="h-3 w-3" />SPA — JS schemas</span>
                                  : <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-gray-800 text-gray-400"><FileText className="h-3 w-3" />No schema</span>}

                              {result.speed && (
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${speedBadgeClass(result.speed.score)}`}>
                                  <Zap className="h-3 w-3" />{result.speed.score} — {speedLabel(result.speed.score)}
                                </span>
                              )}
                              {result.speedChecking && (
                                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-gray-800 text-gray-400">
                                  <Loader2 className="h-3 w-3 animate-spin" />Speed...
                                </span>
                              )}
                            </div>
                          )}

                          {isExpanded && result.status === 'done' && (
                            <div className="border-t border-border">

                              {/* Bot protection explanation */}
                              {isBotBlocked && (
                                <div className="px-4 py-4 space-y-3 border-b border-border/50">
                                  <h3 className="text-xs font-semibold text-orange-300 flex items-center gap-1.5">
                                    <ShieldOff className="h-3.5 w-3.5" />Bot Protection Detected
                                  </h3>
                                  <div className="rounded-lg border border-orange-500/30 bg-orange-950/20 px-4 py-3 space-y-2 text-xs text-orange-200/80">
                                    <p><span className="font-semibold text-orange-300">Reason:</span> {result.botBlockReason}</p>
                                    <p><span className="font-semibold text-orange-300">Bypass tried:</span> Chrome headers → Chrome + Google referer → Googlebot UA — all blocked</p>
                                    <p className="text-orange-200/60 leading-relaxed">
                                      This site uses advanced bot protection (Cloudflare JS challenge, WAF, or IP-based blocking) that checks the TLS fingerprint of the requesting client.
                                      Server-side tools cannot bypass TLS fingerprinting without a real browser or a paid scraping proxy service (e.g. ScrapingBee, BrightData).
                                    </p>
                                  </div>
                                  <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-xs space-y-1.5">
                                    <p className="font-medium text-foreground">What you can do:</p>
                                    <p className="text-muted-foreground">1. <a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(result.url)}`} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">Google Rich Results Test ↗</a> — uses a real Googlebot, always works</p>
                                    <p className="text-muted-foreground">2. <a href={`https://developers.google.com/speed/pagespeed/insights/?url=${encodeURIComponent(result.url)}`} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">PageSpeed Insights ↗</a> — Google's own fetch</p>
                                    <p className="text-muted-foreground">3. View source in your browser (Ctrl+U) and manually check meta tags</p>
                                  </div>
                                </div>
                              )}

                              {/* Indexability */}
                              <div className="px-4 py-3 space-y-2 border-b border-border/50">
                                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-muted-foreground" />Indexability</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                  <div><span className="text-muted-foreground">HTTP Status: </span><span className={result.httpStatus === 200 ? 'text-emerald-400' : 'text-red-400'}>{result.httpStatus}{result.httpStatus === 200 ? ' (OK)' : result.httpStatus === 301 ? ' (Redirect)' : result.httpStatus === 404 ? ' (Not Found)' : ''}</span></div>
                                  <div><span className="text-muted-foreground">Google indexable: </span><span className={result.isIndexable ? 'text-emerald-400' : 'text-red-400'}>{result.isIndexable ? 'Yes' : 'No'}</span></div>
                                  <div><span className="text-muted-foreground">Robots: </span><span className="text-foreground">{result.metaRobots || 'not set (defaults to index)'}</span></div>
                                </div>
                                {idx === 'correctly-noindexed' && (
                                  <p className="text-xs text-emerald-400 flex items-start gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />Legal/utility page correctly set to noindex. Google will not index this page — this is the right configuration.</p>
                                )}
                                {idx === 'should-noindex' && (
                                  <p className="text-xs text-amber-400 flex items-start gap-1.5"><AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />This looks like a utility page (privacy/terms/login/cart). Consider adding noindex to save crawl budget.</p>
                                )}
                              </div>

                              {/* Meta Tags */}
                              <div className="px-4 py-3 space-y-3 border-b border-border/50">
                                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-muted-foreground" />Meta Tags</h3>
                                <div className="space-y-2.5 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-24 flex-shrink-0">Title:</span>
                                    {result.metaTitle
                                      ? <span className="flex-1 min-w-0 flex items-center gap-2"><span className="text-foreground truncate">{result.metaTitle}</span><span className={`flex-shrink-0 font-medium ${titleLengthClass(result.metaTitle.length)}`}>{result.metaTitle.length}ch — {titleLengthLabel(result.metaTitle.length)}</span></span>
                                      : <span className="text-red-400">Missing — critical SEO issue</span>}
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="text-muted-foreground w-24 flex-shrink-0 mt-0.5">Description:</span>
                                    {result.metaDescription
                                      ? <div className="flex-1 min-w-0"><p className="text-foreground line-clamp-2">{result.metaDescription}</p><span className={`font-medium ${descLengthClass(result.metaDescription.length)}`}>{result.metaDescription.length}ch — {descLengthLabel(result.metaDescription.length)} (ideal: 150-160)</span></div>
                                      : <span className="text-red-400">Missing</span>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-24 flex-shrink-0">Canonical:</span>
                                    {result.canonical
                                      ? <span className="text-foreground truncate flex-1 font-mono text-[11px]">{result.canonical}</span>
                                      : <span className="text-red-400">Missing — add a canonical tag</span>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-24 flex-shrink-0">OG Title:</span>
                                    <span className={result.ogTitle ? 'text-foreground truncate flex-1' : 'text-red-400'}>{result.ogTitle || 'Missing'}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <span className="text-muted-foreground w-24 flex-shrink-0 mt-0.5">OG Desc:</span>
                                    <span className={result.ogDescription ? 'text-foreground line-clamp-2 flex-1' : 'text-amber-400'}>{result.ogDescription || 'Missing'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-24 flex-shrink-0">OG Image:</span>
                                    <span className={result.ogImage ? 'text-foreground truncate flex-1 font-mono text-[11px]' : 'text-amber-400'}>{result.ogImage || 'Missing — social shares will have no image'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground w-24 flex-shrink-0">Twitter Card:</span>
                                    <span className={result.twitterCard ? 'text-foreground' : 'text-amber-400'}>{result.twitterCard || 'Missing'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Technical SEO */}
                              <div className="px-4 py-3 space-y-3 border-b border-border/50">
                                <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5 text-muted-foreground" />Technical SEO</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                  <div>
                                    <span className="text-muted-foreground">H1 tags: </span>
                                    <span className={result.h1Count === 1 ? 'text-emerald-400' : result.h1Count === 0 ? 'text-red-400' : 'text-amber-400'}>{result.h1Count ?? '?'}</span>
                                    {result.h1Text && <span className="text-muted-foreground/60 ml-1 italic">"{result.h1Text?.substring(0, 40)}{(result.h1Text?.length ?? 0) > 40 ? '...' : ''}"</span>}
                                  </div>
                                  <div><span className="text-muted-foreground">H2 tags: </span><span className="text-foreground">{result.h2Count ?? '?'}</span></div>
                                  <div>
                                    <span className="text-muted-foreground">Viewport: </span>
                                    <span className={result.hasViewport ? 'text-emerald-400' : 'text-red-400'}>{result.hasViewport ? 'Present' : 'Missing!'}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Images: </span>
                                    <span className="text-foreground">{result.imgCount ?? 0}</span>
                                    {(result.imgMissingAlt ?? 0) > 0 && <span className="text-amber-400 ml-1">({result.imgMissingAlt} missing alt)</span>}
                                  </div>
                                  <div><span className="text-muted-foreground">Server resp: </span><span className="text-foreground">{result.responseTime}ms</span></div>
                                </div>

                                {/* Speed */}
                                {result.speed && (
                                  <div className="mt-2 rounded-md border border-border/60 bg-muted/20 p-3">
                                    <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary" />PageSpeed Insights (Mobile)</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                      <div className="text-center">
                                        <span className={`block text-xl font-bold ${result.speed.score >= 90 ? 'text-emerald-400' : result.speed.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{result.speed.score}</span>
                                        <span className="text-muted-foreground text-[10px]">Performance</span>
                                      </div>
                                      <div className="text-center">
                                        <span className={`block text-sm font-semibold ${(result.speed.lcp ?? 99999) <= 2500 ? 'text-emerald-400' : (result.speed.lcp ?? 99999) <= 4000 ? 'text-amber-400' : 'text-red-400'}`}>{fmtMs(result.speed.lcp)}</span>
                                        <span className="text-muted-foreground text-[10px]">LCP</span>
                                      </div>
                                      <div className="text-center">
                                        <span className={`block text-sm font-semibold ${(result.speed.fcp ?? 99999) <= 1800 ? 'text-emerald-400' : (result.speed.fcp ?? 99999) <= 3000 ? 'text-amber-400' : 'text-red-400'}`}>{fmtMs(result.speed.fcp)}</span>
                                        <span className="text-muted-foreground text-[10px]">FCP</span>
                                      </div>
                                      <div className="text-center">
                                        <span className={`block text-sm font-semibold ${(result.speed.cls ?? 99999) <= 0.1 ? 'text-emerald-400' : (result.speed.cls ?? 99999) <= 0.25 ? 'text-amber-400' : 'text-red-400'}`}>{result.speed.cls?.toFixed(3) ?? '--'}</span>
                                        <span className="text-muted-foreground text-[10px]">CLS</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Headings */}
                              {result.headings && result.headings.length > 0 && (
                                <div className="px-4 py-3 border-b border-border/50">
                                  <button
                                    onClick={() => setExpandedHeadings(expandedHeadings === result.url ? null : result.url)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-foreground w-full text-left hover:text-primary transition-colors"
                                  >
                                    {expandedHeadings === result.url ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                                    Headings ({result.headings.length})
                                    <span className="ml-auto font-normal text-muted-foreground">
                                      {[1,2,3,4].map(l => {
                                        const count = result.headings!.filter(h => h.level === l).length;
                                        return count > 0 ? <span key={l} className="mr-2">H{l}×{count}</span> : null;
                                      })}
                                    </span>
                                  </button>
                                  {expandedHeadings === result.url && (
                                    <div className="mt-2 space-y-0.5">
                                      {result.headings.map((h, i) => (
                                        <div key={i} className="flex items-baseline gap-2 text-xs" style={{ paddingLeft: `${(h.level - 1) * 16}px` }}>
                                          <span className={`flex-shrink-0 font-mono font-semibold text-[10px] ${h.level === 1 ? 'text-blue-400' : h.level === 2 ? 'text-emerald-400' : h.level === 3 ? 'text-amber-400' : 'text-gray-400'}`}>H{h.level}</span>
                                          <span className="text-foreground/80 leading-tight">{h.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* SPA notices */}
                              {result.isSpa && isSameOrigin(result.url) && (
                                <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2.5 text-xs text-emerald-300">
                                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                                  <span><strong>SPA — rendered in-browser.</strong> Schemas extracted after JavaScript hydration. Results reflect the fully rendered page.</span>
                                </div>
                              )}
                              {result.isSpa && !isSameOrigin(result.url) && (
                                <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-950/20 px-3 py-2.5 text-xs text-amber-300">
                                  <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                                  <span><strong>Cross-origin SPA.</strong> Browser security blocks iframe DOM access. Validate schemas with <a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(result.url)}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">Rich Results Test ↗</a></span>
                                </div>
                              )}

                              {/* Schema */}
                              {(result.schemas.length > 0 || result.parseErrors.length > 0) && (
                                <div className="px-4 py-3 space-y-3">
                                  <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-muted-foreground" />JSON-LD Schema</h3>
                                  {result.parseErrors.map((e, i) => (
                                    <div key={i} className="flex items-start gap-1.5 text-xs text-red-400">
                                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /><span className="font-mono">{e}</span>
                                    </div>
                                  ))}
                                  {result.schemas.map((schema, idx2) => {
                                    const sk = `${result.url}::${schema.type}::${idx2}`;
                                    const sse = expandedSchema === sk;
                                    const hi = schema.errors.length > 0 || schema.warnings.length > 0;
                                    return (
                                      <div key={sk} className={`rounded-lg border text-xs ${schema.errors.length > 0 ? 'border-red-500/30 bg-red-950/10' : schema.warnings.length > 0 ? 'border-amber-400/30 bg-amber-950/10' : 'border-emerald-500/20 bg-emerald-950/10'}`}>
                                        <div className="flex items-center justify-between px-3 py-2">
                                          <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold flex-shrink-0 ${schema.errors.length > 0 ? 'bg-red-900/60 text-red-300' : schema.warnings.length > 0 ? 'bg-amber-900/60 text-amber-300' : 'bg-emerald-900/60 text-emerald-300'}`}>{schema.type}</span>
                                            <span className="text-muted-foreground flex items-center gap-2 flex-wrap">
                                              {schema.errors.length > 0 && <span className="text-red-400">{schema.errors.length} error{schema.errors.length !== 1 ? 's' : ''}</span>}
                                              {schema.warnings.length > 0 && <span className="text-amber-400">{schema.warnings.length} warning{schema.warnings.length !== 1 ? 's' : ''}</span>}
                                              {!hi && <span className="text-emerald-400">Valid</span>}
                                              {schema.info.map((inf, ii) => <span key={ii} className="text-blue-400">{inf}</span>)}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 flex-shrink-0">
                                            <button onClick={() => copyText(sk, JSON.stringify(schema.raw, null, 2))} className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors">
                                              {copiedKey === sk ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                              {copiedKey === sk ? 'Copied' : 'Copy'}
                                            </button>
                                            <button onClick={() => setExpandedSchema(sse ? null : sk)} className="text-muted-foreground hover:text-foreground transition-colors">
                                              {sse ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </button>
                                          </div>
                                        </div>
                                        {hi && (
                                          <div className="border-t border-border/50 px-3 py-2 space-y-1">
                                            {schema.errors.map((e, ei) => <div key={`e${ei}`} className="flex items-start gap-1.5 text-red-400"><AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /><span>{e}</span></div>)}
                                            {schema.warnings.map((w, wi) => <div key={`w${wi}`} className="flex items-start gap-1.5 text-amber-400"><AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /><span>{w}</span></div>)}
                                          </div>
                                        )}
                                        {sse && (
                                          <div className="border-t border-border/50">
                                            <pre className="p-3 text-[11px] text-muted-foreground bg-muted/30 overflow-x-auto rounded-b-lg leading-relaxed">{JSON.stringify(schema.raw, null, 2)}</pre>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                          </div>{/* end flex-1 content wrapper */}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </section>
        </main>
        <LandingFooter />
      </div>

      {/* Fix Prompt / Master Prompt Modal */}
      {(promptUrl || showMasterPrompt) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={e => { if (e.target === e.currentTarget) { setPromptUrl(null); setShowMasterPrompt(false); } }}>
          <div className="w-full max-w-2xl rounded-xl border border-border bg-background shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                {showMasterPrompt ? <ClipboardList className="h-4 w-4 text-primary" /> : <Sparkles className="h-4 w-4 text-primary" />}
                <h3 className="text-sm font-semibold text-foreground">{activePromptTitle}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copyPromptText(activePromptText)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  {copiedPrompt ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                </button>
                <button onClick={() => { setPromptUrl(null); setShowMasterPrompt(false); }} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-5 w-5" /></button>
              </div>
            </div>
            {!showMasterPrompt && promptUrl && (
              <div className="px-5 py-2 border-b border-border/50 bg-muted/20 flex-shrink-0">
                <p className="text-[11px] font-mono text-muted-foreground truncate">{promptUrl}</p>
              </div>
            )}
            {showMasterPrompt && (
              <div className="px-5 py-2 border-b border-border/50 bg-muted/20 flex-shrink-0">
                <p className="text-[11px] text-muted-foreground">All {results.filter(r => r.status === 'done').length} audited pages — paste into Claude Code, Cursor, Gemini, ChatGPT, or Codex. It fixes page by page and reminds you to redeploy after each one.</p>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              <pre className="px-5 py-4 text-xs text-foreground font-mono whitespace-pre-wrap leading-relaxed">{activePromptText}</pre>
            </div>
            <div className="px-5 py-3 border-t border-border/50 bg-muted/10 flex-shrink-0">
              <p className="text-[11px] text-muted-foreground">Paste into <strong>Claude Code, Cursor, Gemini, ChatGPT, or Codex</strong> — it will fix each page one by one, then remind you to git push &amp; redeploy.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
