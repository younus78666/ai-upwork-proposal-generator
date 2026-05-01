/**
 * Generates thin App Router page.tsx files for all routes.
 * Each file just imports and renders the matching component from src/components/pages/.
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const APP = join(process.cwd(), 'src/app')

function write(dir, content) {
  mkdirSync(join(APP, dir), { recursive: true })
  writeFileSync(join(APP, dir, 'page.tsx'), content.trim() + '\n', 'utf8')
  console.log(`Created: app/${dir}/page.tsx`)
}

// ─── Static marketing pages ───────────────────────────────────────────────────

write('', `
import IndexPage from '@/components/pages/Index'
export default function Page() { return <IndexPage /> }
`)

const staticPages = [
  ['about',              'About',              null],
  ['privacy',            'Privacy',            null],
  ['terms',              'Terms',              null],
  ['schema-audit',       'SchemaAudit',        null],
  ['upwork-proposal-generator',           'UpworkProposalGenerator',         'Free Upwork Proposal Generator — 3 AI Variants in 60 Seconds'],
  ['upwork-proposal-examples',            'UpworkProposalExamples',           'Upwork Proposal Examples | Ultimate Freelancers'],
  ['upwork-proposal-examples-by-niche',   'UpworkProposalExamplesByNiche',    'Upwork Proposal Examples By Niche | Ultimate Freelancers'],
  ['upwork-cover-letter-examples',        'UpworkCoverLetterExamples',        'Upwork Cover Letter Examples | Ultimate Freelancers'],
  ['how-to-write-upwork-cover-letter',    'HowToWriteUpworkCoverLetter',      'How to Write an Upwork Cover Letter | Ultimate Freelancers'],
  ['how-to-write-upwork-proposal',        'HowToWriteUpworkProposal',         'How to Write an Upwork Proposal | Ultimate Freelancers'],
  ['how-to-submit-proposal-upwork',       'HowToSubmitProposalUpwork',        'How to Submit a Proposal on Upwork | Ultimate Freelancers'],
  ['how-to-win-upwork-jobs',              'HowToWinUpworkJobs',               'How to Win Upwork Jobs | Ultimate Freelancers'],
  ['upwork-screening-questions',          'UpworkScreeningQuestions',         'Upwork Screening Questions Guide | Ultimate Freelancers'],
  ['upwork-bio-examples',                 'UpworkBioExamples',                'Upwork Bio Examples | Ultimate Freelancers'],
  ['upwork-message-to-client-sample',     'UpworkMessageToClient',            'Upwork Message to Client Samples | Ultimate Freelancers'],
  ['upwork-proposal-template',            'UpworkProposalTemplate',           'Upwork Proposal Template | Ultimate Freelancers'],
  ['freelance-proposal-template',         'FreelanceProposalTemplate',        'Freelance Proposal Template | Ultimate Freelancers'],
]

for (const [route, component, title] of staticPages) {
  const meta = title ? `\nexport const metadata = { title: '${title}' }` : ''
  write(route, `
import ${component}Page from '@/components/pages/${component}'
${meta}
export default function Page() { return <${component}Page /> }
`)
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

write('blog', `
import BlogPage from '@/components/pages/Blog'
export const metadata = { title: 'Blog | Ultimate Freelancers' }
export default function Page() { return <BlogPage /> }
`)

write('blog/[slug]', `
import BlogPostPage from '@/components/pages/BlogPost'
import { blogPosts } from '@/data/blogPosts'

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export default function Page() { return <BlogPostPage /> }
`)

// ─── Interactive app pages ─────────────────────────────────────────────────────

const appPages = [
  ['auth',       'Auth'],
  ['api-key',    'ApiKey'],
  ['generate',   'Generate'],
  ['proposals',  'Proposals'],
  ['projects',   'Projects'],
  ['notes',      'Notes'],
  ['resume',     'Resume'],
]

for (const [route, component] of appPages) {
  write(route, `
'use client'
import ${component}Page from '@/components/pages/${component}'
export default function Page() { return <${component}Page /> }
`)
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

write('dashboard', `
'use client'
import DashboardPage from '@/components/pages/Dashboard'
export default function Page() { return <DashboardPage /> }
`)

const dashPages = ['profiles', 'portfolio', 'profile-seo', 'settings', 'templates', 'ai-templates', 'new-job']
for (const tab of dashPages) {
  write(`dashboard/${tab}`, `
'use client'
import DashboardPage from '@/components/pages/Dashboard'
export default function Page() { return <DashboardPage /> }
`)
}

write('dashboard/job/[id]', `
'use client'
import DashboardPage from '@/components/pages/Dashboard'
export default function Page() { return <DashboardPage /> }
`)

write('dashboard/job/[id]/chat', `
'use client'
import DashboardPage from '@/components/pages/Dashboard'
export default function Page() { return <DashboardPage /> }
`)

write('dashboard/job/[id]/generate', `
'use client'
import DashboardPage from '@/components/pages/Dashboard'
export default function Page() { return <DashboardPage /> }
`)

// ─── 404 ─────────────────────────────────────────────────────────────────────

writeFileSync(join(APP, 'not-found.tsx'), `
'use client'
import NotFoundPage from '@/components/pages/NotFound'
export default function NotFound() { return <NotFoundPage /> }
`.trim() + '\n', 'utf8')
console.log('Created: app/not-found.tsx')

console.log('\nAll page files generated.')
