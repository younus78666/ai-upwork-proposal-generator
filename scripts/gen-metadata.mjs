// Writes generateMetadata to all app/ page.tsx files that don't already have it.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const APP = join(process.cwd(), 'src/app')

const META = {
  '': {
    title: 'Free Upwork Proposal Generator | Ultimate Freelancers',
    description: 'Generate 3 personalized Upwork proposals from any job post in 60 seconds. Answers screening questions. Free with your own API key. No account required.',
  },
  'about': {
    title: 'Muhammad Younus, Top Rated Freelancer | Ultimate Freelancers',
    description: 'Muhammad Younus, Senior WordPress developer, 7+ years, 400+ Upwork projects, $100K+ earned, Top Rated Plus badge. Creator of the free AI proposal tool.',
  },
  'upwork-proposal-generator': {
    title: 'Free AI Upwork Proposal Generator | Ultimate Freelancers',
    description: 'Free AI Upwork proposal generator. Paste any job post, get 3 personalised variants plus screening question answers in 60 seconds. No account required.',
  },
  'upwork-proposal-examples': {
    title: '10 Upwork Proposal Examples | Ultimate Freelancers',
    description: '10 real Upwork proposal examples with full breakdowns and analysis. Web dev, writing, VA, design, and data. See the job post, the proposal, and why it worked.',
  },
  'upwork-proposal-examples-by-niche': {
    title: 'Upwork Proposal Examples by Niche | Ultimate Freelancers',
    description: 'Real Upwork proposal examples for web developers, designers, VAs, data entry, SEO, WordPress, content writers, and data analysts. Copy and customise.',
  },
  'upwork-cover-letter-examples': {
    title: 'Upwork Cover Letter Examples | Ultimate Freelancers',
    description: 'See 10 real Upwork cover letter examples that got replies and won contracts. Copy, adapt, or generate a personalized version free in under 60 seconds.',
  },
  'how-to-write-upwork-cover-letter': {
    title: 'How to Write an Upwork Cover Letter | Ultimate Freelancers',
    description: 'Step-by-step guide to writing an Upwork cover letter. Structure, opening lines, length rules, and niche examples for web dev, data entry, VA, and beginners.',
  },
  'how-to-write-upwork-proposal': {
    title: 'How to Write an Upwork Proposal | Ultimate Freelancers',
    description: 'Step-by-step guide to writing Upwork proposals. The 5-part QDIPC structure, opening lines, screening questions, and real examples of good vs bad proposals.',
  },
  'how-to-submit-proposal-upwork': {
    title: 'How to Submit an Upwork Proposal | Ultimate Freelancers',
    description: 'Step-by-step guide to submitting an Upwork proposal. Covers the cover letter, screening questions, connects cost, boosted proposals, and beginner mistakes.',
  },
  'how-to-win-upwork-jobs': {
    title: 'How to Win Jobs on Upwork | Ultimate Freelancers',
    description: 'Complete 2026 guide to winning jobs on Upwork. Profile optimisation, proposal strategy, connects, JSS, niche positioning, and common mistakes to avoid.',
  },
  'upwork-screening-questions': {
    title: 'Upwork Screening Questions | Ultimate Freelancers',
    description: 'How to answer Upwork client screening questions with examples. 10 real questions with model answers, strategy tips, and common mistakes to avoid.',
  },
  'upwork-bio-examples': {
    title: 'Upwork Bio Examples | Ultimate Freelancers',
    description: '10 Upwork profile bio examples by niche. Web dev, design, VA, SEO, content writing, and more. See what works and why clients click your profile.',
  },
  'upwork-message-to-client-sample': {
    title: 'Upwork Message to Client Templates | Ultimate Freelancers',
    description: '15 copy-ready Upwork message templates: first contact, follow-up, project updates, milestone delivery, polite decline, and review requests.',
  },
  'upwork-proposal-template': {
    title: 'Free Upwork Proposal Templates | Ultimate Freelancers',
    description: '5 copy-paste Upwork proposal templates: short, medium, detailed, no experience, and high budget. Each with a full breakdown and notes on what to customise.',
  },
  'freelance-proposal-template': {
    title: 'Freelance Proposal Template | Ultimate Freelancers',
    description: '5 freelance proposal templates for Upwork, Fiverr, email outreach, Statement of Work, and quick pitches. Each includes a breakdown of what to customise.',
  },
  'privacy': {
    title: 'Privacy Policy | Ultimate Freelancers',
    description: 'Privacy Policy for Ultimate Freelancers: how we collect, store, and protect your data, API keys, and project information. Your API key is never stored.',
  },
  'terms': {
    title: 'Terms of Service | Ultimate Freelancers',
    description: 'Terms of Service for Ultimate Freelancers. Free to use with your own API key. No account, no signup required. Read our full usage and data handling terms.',
  },
  'blog': {
    title: 'Upwork & Freelancing Blog | Ultimate Freelancers',
    description: 'Practical guides on writing Upwork proposals, winning clients, pricing your services, and building a sustainable freelance business.',
  },
  'schema-audit': {
    title: 'Schema Audit Tool | Ultimate Freelancers',
    description: 'Free schema markup audit tool. Check structured data, fix errors, and validate JSON-LD across your entire site.',
  },
  'generate': {
    title: 'Generate Proposal | Ultimate Freelancers',
    description: 'Generate 3 personalized Upwork proposals from any job post in 60 seconds.',
  },
  'auth': {
    title: 'Sign In | Ultimate Freelancers',
    description: 'Sign in or create an account to save your proposals, projects, and notes.',
  },
}

function buildMetadataBlock(route) {
  const m = META[route]
  if (!m) return null
  const canonical = route === ''
    ? 'https://ultimatefreelancers.com/'
    : `https://ultimatefreelancers.com/${route}`
  return `export const metadata = {
  title: ${JSON.stringify(m.title)},
  description: ${JSON.stringify(m.description)},
  alternates: { canonical: ${JSON.stringify(canonical)} },
  openGraph: {
    title: ${JSON.stringify(m.title)},
    description: ${JSON.stringify(m.description)},
    url: ${JSON.stringify(canonical)},
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: ${JSON.stringify(m.title)},
    description: ${JSON.stringify(m.description)},
  },
}`
}

function walkDir(dir) {
  const results = []
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) results.push(...walkDir(full))
      else if (full.endsWith('page.tsx')) results.push(full)
    }
  } catch {}
  return results
}

const pages = walkDir(APP)
let updated = 0

for (const pagePath of pages) {
  // Determine route key from path
  const rel = pagePath.replace(APP, '').replace(/[/\\]page\.tsx$/, '').replace(/^[/\\]/, '').replace(/\\/g, '/')
  // Skip dynamic routes — handled separately with generateMetadata fn
  if (rel.includes('[')) continue

  const metaBlock = buildMetadataBlock(rel)
  if (!metaBlock) continue

  let src = readFileSync(pagePath, 'utf8')
  // Skip if already has FULL metadata (multi-line block with description)
  if (src.includes('description:') && src.includes('export const metadata')) continue
  // Skip dynamic generateMetadata functions (blog slug etc)
  if (src.includes('export async function generateMetadata')) continue

  // Remove any old title-only stub so we can replace it with full block
  src = src.replace(/export const metadata = \{ title: '[^']+' \}\n?/, '')

  // Add metadata block after imports (after last import line)
  const lines = src.split('\n')
  let lastImportIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') || lines[i].startsWith("'use client'")) lastImportIdx = i
  }

  const insertIdx = lastImportIdx + 1
  lines.splice(insertIdx, 0, '', metaBlock, '')
  writeFileSync(pagePath, lines.join('\n'), 'utf8')
  updated++
  console.log(`Updated metadata: app/${rel}/page.tsx`)
}

console.log(`\nDone — ${updated} pages updated.`)
