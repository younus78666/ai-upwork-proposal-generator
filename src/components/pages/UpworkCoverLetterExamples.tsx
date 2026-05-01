'use client'
import { useState } from 'react';
import { Helmet } from '@/lib/helmet-stub';
import { Copy, Check, ArrowRight } from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ── Copy button ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────

const shortExample = {
  jobPost: `Need a React developer to add a reporting dashboard (charts, filters, CSV export) to our existing SaaS product. Recharts or Chart.js required. Budget $600. Timeline 2 weeks.`,
  coverLetter: `Hi [Name],

Quick question before I write a full proposal: is this dashboard going inside your existing app, or as a standalone view? The answer determines whether I'm working within your current auth and routing or building fresh, which changes my timeline estimate by 3-4 days.

I've built 4 reporting dashboards using Recharts in the past year, one of which had a very similar CSV export requirement. Happy to share it if it helps.

[Your Name]`,
  whyItWorked: [
    'Opens with a question that proves they read the post (Recharts, the specific tech)',
    'Short enough the client reads it in full before deciding',
    'The question positions them as a consultant, not just an applicant',
  ],
};

const mediumExample = {
  jobPost: `Content writer needed for 4 long-form SEO articles per month on cybersecurity. B2B audience (IT directors and security managers). $80-120/article. Must have cybersecurity writing experience.`,
  coverLetter: `Hi [Name],

Cybersecurity content sits in a difficult middle ground: it needs to be technical enough to be credible with IT professionals, but structured enough for a decision-maker who is time-poor and skimming for relevance. Getting that balance wrong loses both audiences.

I've been writing in this space for 3 years. In the past 6 months, I delivered 22 long-form pieces for two cybersecurity SaaS companies. Both clients saw their target articles ranking in the top 5 within 90 days of publication.

My standard process for each article includes keyword intent mapping before I write, semantic coverage throughout, and 2-3 internal link suggestions alongside delivery. No extra charge. It is part of how I work.

One question: are these articles primarily driving organic traffic, or are they also used in sales enablement? The answer changes the call-to-action structure, and I would rather get that right from article one than adjust later.

[Your Name]`,
  whyItWorked: [
    "Reframes the client's real problem (the B2B tone balance) before mentioning their own skills",
    'Proof point is specific: 22 articles, 90-day ranking result, not "years of experience"',
    'Ends with a question that shows process understanding, not just interest',
  ],
};

const detailedExample = {
  jobPost: `Project manager needed for WooCommerce to Shopify migration. 250 products, estimated 2-3 months at 15 hours/week. Migration experience required. Budget $3,000-5,000.`,
  coverLetter: `Hi [Name],

WooCommerce-to-Shopify migrations have a consistent failure point that doesn't show up until launch week: edge cases. Products, pages, and 301 redirects usually transfer cleanly. It is the subscription handling, custom checkout flows, and customer loyalty point balances where things break in ways that staging tests miss.

Before I outline my full approach: does your WooCommerce setup have any functionality beyond standard products: subscriptions, bundled products, or region-specific tax rules? The answer determines whether this is a 2-month or 3-month engagement, and I would rather set the right expectation now than revise it after we have started.

My background: I have managed 6 Shopify migrations. The most complex was a $3.2M/year store with subscription products and a custom tax engine. That migration had zero downtime on launch day. I built a 47-point QA checklist for that project and would adapt a version of it for yours.

How I work on projects like this: weekly Loom updates so you always know where things stand without scheduling a call, a shared Notion tracker with every task and its owner, and a clear escalation process for blockers. There will be blockers on any migration of this size. How we handle them determines whether this ends on schedule.

My recommendation for the next step: a 30-minute scoping call where I review your current WooCommerce setup and give you a realistic phased plan. I will not commit to a final price until I have seen the backend. I would rather under-promise and over-deliver than quote a number and walk it back later.

If that works, I have availability Thursday or Friday this week.

[Your Name]`,
  whyItWorked: [
    'Opens by naming a specific failure point, proving expertise before claiming it',
    'Asks a qualifying question that reframes them as a consultant',
    'Specific proof point (the $3.2M migration, zero downtime, 47-point checklist)',
    'Proposes a concrete next step with specific availability',
  ],
};

const nicheExamples = [
  {
    id: 'data-entry',
    niche: 'Data Entry',
    scenario: '500 invoices from PDF to Google Sheets. Budget $50.',
    words: 88,
    tone: 'Precise, efficient',
    coverLetter: `Hi [Name],

500 invoices from PDF to Google Sheets: I have done this type of project 11 times in the past year, most recently for an accounting firm with 1,200 records. Final accuracy was 99.8% after their internal audit.

One question: are the PDFs text-based or scanned images? Scanned PDFs require OCR pre-processing, which adds 1-2 days to the timeline.

I can deliver 100 records per day and am happy to provide a sample batch of 20 records first so you can verify quality before committing.

[Your Name]`,
  },
  {
    id: 'web-developer',
    niche: 'Web Developer',
    scenario: 'Rebuild company website in WordPress, 15 pages, Figma file provided. Budget $1,500-$2,500.',
    words: 133,
    tone: 'Technical, confident',
    coverLetter: `Hi [Name],

Having a Figma file ready is the best possible starting point for this kind of project. Most of the scope ambiguity comes from not having one.

Before I commit to the timeline: is there an existing WordPress site I am rebuilding, or starting from scratch? And is SEO a priority on the new build? Page speed, schema markup, and URL structure are much easier to build in from the beginning than to retrofit after launch.

My recent work: a 12-page portfolio site where I reduced load time from 2.1s to 0.9s, and a 20-page service site with custom post types and ACF integration.

I can build your 15-page site from the Figma design, deliver within 4 weeks, and include a 30-day support window post-launch.

[Your Name]`,
  },
  {
    id: 'virtual-assistant',
    niche: 'Virtual Assistant',
    scenario: 'VA for email management, calendar scheduling, research tasks. 15 hours/week, ongoing.',
    words: 125,
    tone: 'Organised, direct',
    coverLetter: `Hi [Name],

From your post, the core of this role is inbox management and calendar scheduling, with research as the third priority. That breakdown matters because the first two require real-time responsiveness. Research can be done in scheduled blocks. I want to confirm your preferred response time window before we start.

I have worked as a virtual assistant for 4 years. My current client is a real estate investor in the US timezone. I manage two inboxes, three calendars, and weekly deal research. We have worked together for 2 years without a missed deadline.

What tools is your team currently using for email, calendar, and project management? I want to confirm compatibility before we commit.

Available to start Monday.

[Your Name]`,
  },
  {
    id: 'graphic-designer',
    niche: 'Graphic Designer',
    scenario: 'Brand identity project: logo, color palette, typography guide, business card. Budget $400-600.',
    words: 119,
    tone: 'Strategic, creative',
    coverLetter: `Hi [Name],

Before I start on any brand identity project, one question matters more than the brief: who is the end audience? A logo built for a B2B accounting firm and a logo built for a lifestyle brand use completely different visual languages, even if both are described as "professional."

Could you tell me more about who your ideal client is and who your 2-3 main competitors are? That gives me a reference point for where to position your brand visually, which shapes everything that follows: color direction, type choice, mark style.

I work through 3 logo concepts in round one, each taking a different strategic direction, so you can see the range before we refine.

[Your Name]`,
  },
  {
    id: 'copywriting',
    niche: 'Copywriting',
    scenario: 'Landing page copy for a B2B SaaS product (dashboard tool for marketing agencies). Need SaaS copywriting experience.',
    words: 127,
    tone: 'Sharp, analytical',
    coverLetter: `Hi [Name],

Landing page copy for a B2B SaaS product comes down to one sentence: the headline. If it does not immediately tell a target customer what changes for them when they use your product, the rest of the page does not matter.

Before I draft anything: what does conversion look like on this page? Demo bookings, trial starts, or something else? The answer changes whether the copy drives urgency, builds trust through specificity, or does something else entirely.

I have written landing pages for 9 SaaS products in the past 2 years. One page increased trial signups by 34% over the previous version, measured over a 6-week A/B test. Happy to share samples from products similar to yours.

[Your Name]`,
  },
];

const fillInTemplate = `Hi [CLIENT_NAME],

I noticed [SPECIFIC_DETAIL_FROM_THEIR_JOB_POST, something that required actually reading the post, not the job title].

Before I go further: [ONE_SMART_QUESTION_THAT_SHOWS_YOU_UNDERSTOOD_THE_REAL_REQUIREMENT].

In the past [TIMEFRAME], I have [SPECIFIC_RELEVANT_EXPERIENCE]. The most relevant example: [BRIEF_PROOF_POINT_WITH_A_MEASURABLE_RESULT].

I can [FRICTIONLESS_NEXT_STEP: share a sample / send a plan / get on a quick call, whichever removes the most friction for them].

[YOUR_NAME]`;

const templateInstructions = [
  {
    variable: '[CLIENT_NAME]',
    instruction:
      'First name if visible in the post or job page. "Hi there" if not. Never "Dear Hiring Manager."',
  },
  {
    variable: '[SPECIFIC_DETAIL]',
    instruction:
      'Something that required reading the post. A constraint, a specific tool, a detail they mentioned. Not the job title.',
  },
  {
    variable: '[ONE_SMART_QUESTION]',
    instruction:
      'The single question that proves you thought about their actual problem. Save other questions for after they reply.',
  },
  {
    variable: '[PROOF_POINT]',
    instruction:
      '"3 years of experience" is not proof. "Reduced checkout abandonment by 12%" is. Be specific.',
  },
  {
    variable: '[NEXT_STEP]',
    instruction:
      'Make it frictionless. "Let me know if you\'re interested" requires them to do work. "Happy to share my most relevant sample. Just reply and I\'ll send it over" is one click.',
  },
];

const mistakes = [
  {
    id: 'opener',
    title: 'Starting with "I am writing to express my interest"',
    before:
      'I am writing to express my interest in your React developer role. I have 5 years of experience and would love the opportunity to work with your team...',
    after: 'Start with the question. Directly. No opener sentence.',
    why: 'Every client sees 30+ proposals that start with "I am" or "I would like." The first 10 words determine whether they keep reading.',
  },
  {
    id: 'skills-list',
    title: 'Listing skills instead of addressing their specific problem',
    before:
      'I have extensive experience in React, Node.js, TypeScript, AWS, Docker, and Kubernetes and I am skilled in...',
    after:
      'Your authentication flow uses OAuth. I have integrated 3 similar setups with existing SaaS products, including one with your same stack.',
    why: "A list of skills tells clients nothing they can't find on your profile. A specific connection between your experience and their project does.",
  },
  {
    id: 'rate-mention',
    title: 'Making the first message about closing',
    before:
      'I am ready to start immediately and can work at a competitive rate of $25/hr. Please consider me for this position...',
    after:
      'Do not mention rates in the first message unless they ask. Prove fit first. Rate conversations belong in the interview.',
    why: 'Freelancers who mention rates unprompted in proposal openings signal they are competing on price. Clients who are hiring for quality find this immediately disqualifying.',
  },
];

const faqs = [
  {
    q: 'What is a good Upwork cover letter example?',
    a: 'A good Upwork cover letter example does three things in under 150 words: it proves the writer read the actual job post (not just the title), it reframes the client\'s problem in a way that shows real understanding, and it ends with either a specific question or a concrete next step. The best examples on this page all open with a question or a problem reframe, not with "I am writing to express my interest."',
  },
  {
    q: 'What length do winning Upwork cover letter examples use?',
    a: 'For most job posts, 100-200 words is optimal. Short enough that the client reads it in full, long enough to prove fit. Proposals under 200 words get read in full significantly more often than proposals over 400 words. Save the detailed breakdown for your first call or a follow-up message, not the initial cover letter.',
  },
  {
    q: 'What should I write in the first line of my Upwork proposal?',
    a: 'The strongest first lines are either a smart question that proves you read the job post, or a reframe of the client\'s real problem that shows you understand more than the surface request. Avoid: "I am writing to express my interest," "I am a [job title] with X years of experience," and "I am very excited about this opportunity." Every client sees 30+ proposals that start that way.',
  },
  {
    q: 'Is Upwork cover letter the same as a proposal?',
    a: "Yes. Upwork's own interface calls it a 'Cover Letter' -- the field you fill in when applying for a job. Freelancers commonly call it a 'proposal' or 'bid.' The terms are interchangeable. This page uses both, and the examples here work whether you call it a proposal or a cover letter.",
  },
  {
    q: 'Do clients read the full cover letter on Upwork?',
    a: 'The first 2-3 sentences are almost always read. The rest depends on whether those first sentences prove relevance. Clients reviewing 30-50 proposals skim aggressively. They are looking for a reason to keep reading or a reason to move on. A strong opening question or problem reframe keeps them reading. A generic opener ("I am interested in this opportunity") does not.',
  },
];

// ── Schema ─────────────────────────────────────────────────────────────────────

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://ultimatefreelancers.com/upwork-cover-letter-examples#article',
      headline: 'Upwork Cover Letter Examples: 10 Real Samples That Win Jobs',
      description:
        '10 real Upwork cover letter examples across 5 niches with job post context, analysis, and a fill-in template.',
      url: 'https://ultimatefreelancers.com/upwork-cover-letter-examples',
      datePublished: '2026-04-27',
      dateModified: '2026-04-27',
      author: {
        '@type': 'Person',
        '@id': 'https://ultimatefreelancers.com/about#person',
        name: 'Muhammad Younus',
      },
      publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
      image: 'https://ultimatefreelancers.com/og-image.png',
      inLanguage: 'en-US',
      articleSection: 'Upwork Proposals',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://ultimatefreelancers.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Upwork Cover Letter Examples',
          item: 'https://ultimatefreelancers.com/upwork-cover-letter-examples',
        },
      ],
    },
  ],
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UpworkCoverLetterExamples() {
  return (
    <>
      <Helmet>
        <title>Upwork Cover Letter Examples | Ultimate Freelancers</title>
        <meta name="description" content="See 10 real Upwork cover letter examples that got replies and won contracts. Copy, adapt, or generate a personalized version free in under 60 seconds." />
        <link rel="canonical" href="https://ultimatefreelancers.com/upwork-cover-letter-examples" />
        <meta property="og:title" content="Upwork Cover Letter Examples | Ultimate Freelancers" />
        <meta property="og:description" content="See 10 real Upwork cover letter examples that got replies and won contracts. Copy, adapt, or generate a personalized version free in under 60 seconds." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ultimatefreelancers.com/upwork-cover-letter-examples" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="og:site_name" content="Ultimate Freelancers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upwork Cover Letter Examples | Ultimate Freelancers" />
        <meta name="twitter:description" content="See 10 real Upwork cover letter examples that got replies and won contracts. Copy, adapt, or generate a personalized version free in under 60 seconds." />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">

        <main>
          {/* ── Section 1: Hero ── */}
          <section className="py-14 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
                  Upwork Cover Letter Examples
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight">
                  Upwork Cover Letter Examples:{' '}
                  <span className="text-gradient">10 Real Samples That Win Jobs</span> [2026]
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Every example on this page came from a real job post. Short, medium, and detailed
                  formats across five niches, with the job post context and a breakdown of exactly
                  why each one worked. Copy any of them in one click.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">10 real examples</span>
                  <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">5 niches covered</span>
                  <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">Copy in one click</span>
                  <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">2,640/mo combined search volume</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 2: What Makes an Upwork Cover Letter Example Worth Copying? ── */}
          <section className="py-14 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  What Makes an Upwork Cover Letter Example Worth Copying?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Most cover letter examples online are generic templates written by people who have
                  never actually won a contract. The examples on this page are different. A cover letter
                  worth copying does three specific things:
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    {
                      label: 'Personalization',
                      desc: 'It references something that required actually reading the post: a specific tool, constraint, or detail the client mentioned. Not the job title.',
                    },
                    {
                      label: 'Relevance signal',
                      desc: "It connects the freelancer's experience directly to the client's specific problem, not through a list of skills, but through a proof point that mirrors what the client needs.",
                    },
                    {
                      label: 'Specific CTA',
                      desc: "It ends with a question or a frictionless next step that moves the conversation forward. Not 'I look forward to hearing from you.'",
                    },
                  ].map(({ label, desc }) => (
                    <div key={label} className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                      <div className="w-1.5 bg-primary rounded-full flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-foreground text-sm mb-1">{label}</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3">Cover Letter Length Guide</h3>
                <div className="overflow-x-auto rounded-xl border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Length</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Word Range</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Best For</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Include</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          length: 'Short',
                          range: '50-100 words',
                          bestFor: 'High-competition posts; leading with a question',
                          include: 'One specific question + one proof point',
                        },
                        {
                          length: 'Medium',
                          range: '100-200 words',
                          bestFor: 'Most job posts',
                          include: 'Problem reframe + proof + question or CTA',
                        },
                        {
                          length: 'Detailed',
                          range: '200-400 words',
                          bestFor: 'Complex projects; invitations',
                          include: 'Full approach + case study + next step',
                        },
                        {
                          length: 'Long',
                          range: '400+ words',
                          bestFor: 'Avoid',
                          include: 'Rarely read; signals insecurity',
                        },
                      ].map((row, i) => (
                        <tr
                          key={row.length}
                          className={`border-b border-border last:border-0 ${i === 3 ? 'opacity-60' : ''}`}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">{row.length}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.range}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.bestFor}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.include}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm text-muted-foreground italic">
                  Proposals under 200 words get read in full 3x more often than proposals over 400 words.
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 3: Short Example ── */}
          <section className="py-14 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Short Upwork Cover Letter Example (under 100 words)
                </h2>
                <p className="text-muted-foreground mb-8">
                  Short proposals work best on high-volume, high-competition posts where the client is
                  scanning quickly. The goal is not to win with volume of information. It is to earn a
                  reply by proving relevance in the fewest possible words.
                </p>

                {/* Job post card */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
                  <div className="px-5 py-3.5 bg-secondary/40 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">The Job Post</span>
                  </div>
                  <p className="px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                    {shortExample.jobPost}
                  </p>
                </div>

                {/* Cover letter card */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40 border-b border-border">
                    <div>
                      <span className="text-sm font-semibold text-foreground">Cover Letter</span>
                      <span className="ml-3 text-xs text-muted-foreground">87 words · Direct, consultative</span>
                    </div>
                    <CopyButton text={shortExample.coverLetter} />
                  </div>
                  <pre className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {shortExample.coverLetter}
                  </pre>
                </div>

                {/* Why it worked */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl px-5 py-4">
                  <div className="text-sm font-semibold text-foreground mb-3">Why It Worked</div>
                  <ul className="space-y-2">
                    {shortExample.whyItWorked.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 4: Medium Example ── */}
          <section className="py-14 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Medium Upwork Cover Letter Sample (150-200 words)
                </h2>
                <p className="text-muted-foreground mb-8">
                  Medium-length proposals are the right call for most job posts. Long enough to
                  demonstrate genuine understanding, short enough to get read in full. The structure
                  follows a consistent pattern: problem reframe, proof point, process detail, qualifying
                  question.
                </p>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
                  <div className="px-5 py-3.5 bg-secondary/40 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">The Job Post</span>
                  </div>
                  <p className="px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                    {mediumExample.jobPost}
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40 border-b border-border">
                    <div>
                      <span className="text-sm font-semibold text-foreground">Cover Letter</span>
                      <span className="ml-3 text-xs text-muted-foreground">178 words · Strategic, credible</span>
                    </div>
                    <CopyButton text={mediumExample.coverLetter} />
                  </div>
                  <pre className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {mediumExample.coverLetter}
                  </pre>
                </div>

                <div className="bg-green-500/5 border border-green-500/20 rounded-xl px-5 py-4">
                  <div className="text-sm font-semibold text-foreground mb-3">Why It Worked</div>
                  <ul className="space-y-2">
                    {mediumExample.whyItWorked.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 5: Detailed Example ── */}
          <section className="py-14 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Detailed Upwork Proposal Example (300-400 words)
                </h2>
                <p className="text-muted-foreground mb-8">
                  Detailed proposals belong on complex, high-budget projects where the client expects to
                  see process, not just proof. Project management, technical migrations, and
                  enterprise-level engagements often reward a thorough proposal, but only if it is
                  structured well enough to still feel easy to read.
                </p>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
                  <div className="px-5 py-3.5 bg-secondary/40 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">The Job Post</span>
                  </div>
                  <p className="px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                    {detailedExample.jobPost}
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40 border-b border-border">
                    <div>
                      <span className="text-sm font-semibold text-foreground">Cover Letter</span>
                      <span className="ml-3 text-xs text-muted-foreground">318 words · Expert, process-driven</span>
                    </div>
                    <CopyButton text={detailedExample.coverLetter} />
                  </div>
                  <pre className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {detailedExample.coverLetter}
                  </pre>
                </div>

                <div className="bg-green-500/5 border border-green-500/20 rounded-xl px-5 py-4">
                  <div className="text-sm font-semibold text-foreground mb-3">Why It Worked</div>
                  <ul className="space-y-2">
                    {detailedExample.whyItWorked.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 6: Examples by Niche ── */}
          <section className="py-14 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Upwork Cover Letter Examples by Niche
                </h2>
                <p className="text-muted-foreground mb-10">
                  The same structure adapts to any freelance niche. These five examples cover data entry,
                  web development, virtual assistance, graphic design, and copywriting, each with a
                  different tone, but the same core approach: read the post, prove fit, ask one smart
                  question.
                </p>

                <div className="space-y-10">
                  {nicheExamples.map((example) => (
                    <div key={example.id}>
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xl font-bold text-foreground">
                          {example.niche} Cover Letter Sample
                        </h3>
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {example.niche}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        <span className="font-medium text-foreground">Scenario:</span> {example.scenario}
                      </p>
                      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40 border-b border-border">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{example.niche} Cover Letter</span>
                            <span className="ml-3 text-xs text-muted-foreground">
                              {example.words} words · {example.tone}
                            </span>
                          </div>
                          <CopyButton text={example.coverLetter} />
                        </div>
                        <pre className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                          {example.coverLetter}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 7: Fill-in Template ── */}
          <section className="py-14 border-b border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Upwork Cover Letter Template (Fill in 5 Fields)
                </h2>
                <p className="text-muted-foreground mb-8">
                  This template works across every niche because it does not depend on the niche. It
                  depends on reading the post. Fill in the five bracketed variables and you will have a
                  cover letter that reads like it was written specifically for that job. Because it was.
                </p>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40 border-b border-border">
                    <div>
                      <span className="text-sm font-semibold text-foreground">Universal Fill-in Template</span>
                      <span className="ml-3 text-xs text-muted-foreground">5 variables to replace</span>
                    </div>
                    <CopyButton text={fillInTemplate} />
                  </div>
                  <pre className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                    {fillInTemplate}
                  </pre>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-4">How to use it</h3>
                <div className="space-y-3">
                  {templateInstructions.map(({ variable, instruction }) => (
                    <div key={variable} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                      <code className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded flex-shrink-0 self-start mt-0.5">
                        {variable}
                      </code>
                      <p className="text-sm text-muted-foreground leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 8: Mistakes to Avoid ── */}
          <section className="py-14 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  What NOT to Write in an Upwork Cover Letter (3 Mistakes With Examples)
                </h2>
                <p className="text-muted-foreground mb-8">
                  The wrong opening costs you the reply before the client even reaches your credentials.
                  These are the three patterns that appear in proposals that do not get responses, with
                  the before and after for each.
                </p>

                <div className="space-y-8">
                  {mistakes.map((mistake, i) => (
                    <div key={mistake.id}>
                      <div className="text-sm font-bold text-foreground mb-3">
                        Mistake {i + 1}: {mistake.title}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3 mb-3">
                        <div className="bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-4">
                          <div className="text-xs font-semibold text-destructive mb-2 uppercase tracking-wide">Before</div>
                          <p className="text-sm text-muted-foreground leading-relaxed line-through decoration-destructive/50">
                            {mistake.before}
                          </p>
                        </div>
                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-4">
                          <div className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">After</div>
                          <p className="text-sm text-foreground leading-relaxed">{mistake.after}</p>
                        </div>
                      </div>
                      <div className="flex gap-2.5 px-4 py-3 bg-card rounded-xl border border-border">
                        <span className="text-xs font-semibold text-muted-foreground flex-shrink-0">Why:</span>
                        <p className="text-sm text-muted-foreground leading-relaxed">{mistake.why}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 9: Tool CTA ── */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Generate a Personalized Version of Any of These Examples
                </h2>
                <p className="text-muted-foreground mb-6">
                  Paste your job post. Get 3 tailored cover letter variants in 60 seconds: Short,
                  Medium, and Detailed. Each with a different hook. Free, no account, no Chrome
                  extension.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Generate My Cover Letter Free
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="mt-4 text-xs text-muted-foreground">
                  Bring your own API key (OpenAI, Claude, Gemini, Groq, free tiers available)
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 10: Internal Links ── */}
          <section className="py-10 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">Related Upwork Resources</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      href: '/blog/how-to-write-upwork-proposal',
                      title: 'How to Write an Upwork Proposal',
                      desc: 'Structure, word count benchmarks, opening line formulas, and 5 mistakes',
                    },
                    {
                      href: '/upwork-message-to-client-sample',
                      title: 'Upwork Message to Client',
                      desc: '15 copy-ready templates for every stage of client communication',
                    },
                    {
                      href: '/blog/upwork-proposal-not-getting-replies',
                      title: 'Why Your Proposals Get No Replies',
                      desc: '6 specific reasons most proposals fail and the fix for each one',
                    },
                  ].map((r) => (
                    <a
                      key={r.href}
                      href={r.href}
                      className="group p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                        {r.title} →
                      </div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 11: FAQ ── */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="bg-card rounded-xl border border-border px-5 data-[state=open]:shadow-sm transition-shadow"
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4 text-sm">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed text-sm">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
