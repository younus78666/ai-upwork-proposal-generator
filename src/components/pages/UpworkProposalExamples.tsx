'use client'
import { useState } from 'react';
import { Helmet } from '@/lib/helmet-stub';
import Link from 'next/link';
import { Copy, Check, ArrowRight } from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

const schema = {
  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '10 Upwork Proposal Examples With Breakdowns (What Works & Why)',
    description: 'See 10 real Upwork proposal examples across web dev, writing, VA, design, and more. Each example includes the job post, the proposal, and a breakdown of exactly why it works.',
    url: 'https://ultimatefreelancers.com/upwork-proposal-examples',
    datePublished: '2026-04-27',
    dateModified: '2026-04-27',
    author: { '@type': 'Person', name: 'Muhammad Younus', url: 'https://ultimatefreelancers.com/about' },
    publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
    image: 'https://ultimatefreelancers.com/og-image.png',
    about: [
      { '@type': 'Thing', name: 'Upwork proposal' },
      { '@type': 'Thing', name: 'Upwork cover letter' },
      { '@type': 'Thing', name: 'Freelance proposal writing' },
      { '@type': 'Thing', name: 'Upwork bidding' },
    ],
    mentions: [
      { '@type': 'Thing', name: 'QDIPC framework' },
      { '@type': 'Organization', name: 'Upwork' },
    ],
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the ideal word count for an Upwork proposal?',
        acceptedAnswer: { '@type': 'Answer', text: 'Most winning Upwork proposals are 100 to 250 words. Short proposals (under 150 words) work well for straightforward jobs. Medium proposals (150 to 300 words) suit most mid-range projects. Long proposals (over 400 words) are only justified for complex, high-budget engagements where the client needs to trust your process before they reply.' },
      },
      {
        '@type': 'Question',
        name: 'What is the best opening line for an Upwork proposal?',
        acceptedAnswer: { '@type': 'Answer', text: "The best opening line is either a specific observation about the client's job post or a question that proves you read it carefully. Never open with 'Hi, I am a [skill] expert with X years of experience.' That opener puts the focus on you rather than the client's problem." },
      },
      {
        '@type': 'Question',
        name: 'What is the QDIPC framework for Upwork proposals?',
        acceptedAnswer: { '@type': 'Answer', text: 'QDIPC stands for: Question (open with something specific to prove you read the post), Diagnosis (name the real problem behind the surface request), Insight (explain your approach or process), Proof (reference one relevant project), and CTA (one clear next step). Top Upwork earners follow this structure across most niches.' },
      },
      {
        '@type': 'Question',
        name: 'Should you use a template for Upwork proposals?',
        acceptedAnswer: { '@type': 'Answer', text: 'Templates help with structure but hurt you if you send them without personalisation. Clients read dozens of proposals. The ones that get replies are the ones that reference something specific from the job post. Use a framework as a guide, not as a script to copy word-for-word.' },
      },
      {
        '@type': 'Question',
        name: 'How do you answer Upwork screening questions?',
        acceptedAnswer: { '@type': 'Answer', text: 'Treat each screening question as a mini-proposal. Give a specific, concrete answer that addresses what the client actually wants to know. Avoid generic responses. If the question asks about your experience with a specific tool, name the project, the tool version, and the result.' },
      },
      {
        '@type': 'Question',
        name: 'How many proposals does it take to get a job on Upwork?',
        acceptedAnswer: { '@type': 'Answer', text: 'New freelancers typically send 20 to 40 proposals before landing a first job. Experienced freelancers with strong profiles and personalised proposals convert at 1 in 5 to 1 in 10. The biggest variable is proposal quality, not quantity.' },
      },
    ],
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ultimatefreelancers.com' },
      { '@type': 'ListItem', position: 2, name: 'Upwork Proposal Examples', item: 'https://ultimatefreelancers.com/upwork-proposal-examples' },
    ],
  },
};

type ProposalExample = {
  number: number;
  niche: string;
  length: 'Short' | 'Medium' | 'Detailed';
  jobPost: string;
  proposal: string;
  whyItWorked: string[];
};

const examples: ProposalExample[] = [
  {
    number: 1,
    niche: 'React Developer',
    length: 'Short',
    jobPost: 'Add filtering and search to existing Next.js e-commerce product catalogue. Budget $800. Timeline 2 weeks.',
    proposal: `Hi [Name],

Before I quote a timeline: does your product catalogue run client-side filtering right now, or does each filter trigger a database query? The answer changes my estimate by 3-4 days and affects whether the filtering feels instant or has a noticeable delay.

I built a very similar feature for a Next.js store last month, filtering 4,000 SKUs with multi-select categories and price range. Happy to share the repo if it helps you evaluate the approach.

[Your Name]`,
    whyItWorked: [
      'The question uses their exact tech stack (Next.js), not a generic "can you tell me more?"',
      'Client-side vs server-side is a real distinction the client likely has not thought through',
      'Proof references a specific scale (4,000 SKUs), not just "similar experience"',
    ],
  },
  {
    number: 2,
    niche: 'SEO Content Writer',
    length: 'Medium',
    jobPost: '4 long-form blog articles per month for B2B cybersecurity SaaS. $100-130/article. IT decision-maker audience.',
    proposal: `Hi [Name],

Cybersecurity content for IT buyers sits in a difficult position: technical enough to be credible, structured enough for a time-poor decision-maker who is skimming. Most content agencies get one right and lose the other.

I have been writing in this space for 3 years. In the past year, I delivered 28 long-form pieces for two cybersecurity SaaS companies. Six of those articles now rank in positions 1-3 for their target keywords.

My process for each piece: keyword intent mapping before I write, semantic coverage throughout, and 2-3 internal link suggestions alongside delivery. Not extra work. It is how I write.

One question: are these articles primarily for organic traffic or also used in sales sequences? It changes the call-to-action structure, and I would rather get that right from article one.

[Your Name]`,
    whyItWorked: [
      "Diagnoses the real problem (the B2B tone balance) before mentioning their own skills",
      'Proof is specific: 28 articles, 6 ranking in positions 1-3',
      'Ends with a question that signals content strategy knowledge, not just writing ability',
    ],
  },
  {
    number: 3,
    niche: 'WordPress Performance',
    length: 'Detailed',
    jobPost: 'WooCommerce store is slow. Google PageSpeed score of 34 on mobile. High bounce rate. Budget $500.',
    proposal: `Hi [Name],

A PageSpeed score of 34 on mobile almost always comes from the same three places: render-blocking third-party scripts, unoptimised product images, and a theme that loads resources it does not use. The fix looks different depending on which one is the primary cause.

Before I outline a plan: can you tell me which page builder and caching plugin you are using, if any? That determines whether I am working within your current setup or recommending a partial stack change.

My approach for a project like this:
Step 1: Full Core Web Vitals audit (Lighthouse, PageSpeed Insights, GTmetrix) to identify the specific bottleneck.
Step 2: Fix the highest-impact items first. For most WooCommerce sites, this is image optimisation and script deferral.
Step 3: Set up caching if not already in place.
Step 4: Re-run all tests and document the before/after scores.

I improved a WooCommerce client's mobile PageSpeed score from 28 to 81 last quarter. Their bounce rate dropped 19% in the first 30 days. I can share the full audit report from that project if it helps.

Timeline: 4-5 days after you answer my question above. Budget fits within your range.

[Your Name]`,
    whyItWorked: [
      'Immediately names the three most common causes, showing deep domain knowledge',
      'The diagnostic question shows they know the answer matters before quoting',
      'Proof is concrete: score went from 28 to 81, bounce rate dropped 19%',
    ],
  },
  {
    number: 4,
    niche: 'Virtual Assistant',
    length: 'Short',
    jobPost: 'Need a VA for inbox management, scheduling, and customer follow-up emails. 15 hours per week. $12-18/hour.',
    proposal: `Hi [Name],

Inbox management tends to collapse when the system relies on the VA's memory rather than a defined process. What I do instead: I set up a labelling and folder system in the first week, so that if I am ever unavailable, nothing gets missed and you can find anything in 30 seconds.

I have handled email management and scheduling for a founder in the SaaS space for 14 months. Current load is about 120 emails per day. Zero missed follow-ups since I started.

Are you open to a 2-hour trial task before committing to the full arrangement?

[Your Name]`,
    whyItWorked: [
      'Diagnoses a common VA failure (relying on memory, no system) before listing skills',
      'The "labelling system" detail is specific and signals professional process',
      'Trial offer reduces client risk and converts hesitant clients',
    ],
  },
  {
    number: 5,
    niche: 'Graphic Designer (Logo)',
    length: 'Short',
    jobPost: 'Need a logo for a new personal fitness coaching brand. Modern, energetic feel. Budget $250.',
    proposal: `Hi [Name],

Before I start sketching: when you say "energetic," are you thinking bold and high-contrast (think Nike, black and sharp), or something lighter and more approachable (pastel tones, rounded forms)? Both are valid for a fitness coaching brand and the answer shapes the entire direction.

I have designed 40+ logos for coaches and fitness brands. Happy to share a portfolio of similar work if you want to see the range.

[Your Name]`,
    whyItWorked: [
      'The question surfaces a real decision the client has not made yet',
      'Two concrete reference points (Nike vs. pastel/approachable) help the client picture the difference',
      'Short and confident. No software lists, no "passionate designer" filler',
    ],
  },
  {
    number: 6,
    niche: 'Data Entry',
    length: 'Short',
    jobPost: 'Enter 2,000 product records from a PDF catalogue into Google Sheets. Budget $150. Timeline 1 week.',
    proposal: `Hi [Name],

Quick note on process: for a 2,000-row data entry job I always complete 50 rows first, share them for your review, and only continue once you confirm the format is correct. This avoids the situation where all 2,000 rows need to be redone because of a field I misunderstood.

I have completed 12 similar catalogue entry projects. My accuracy rate checked against the source documents is 99.6%. I can start today and have the 50-row sample to you within 2 hours.

[Your Name]`,
    whyItWorked: [
      "Addresses the client's biggest fear (redoing everything) before they have to raise it",
      'The 50-row sample process is a specific, de-risking mechanism',
      'Accuracy rate is verifiable (99.6%, not "very accurate")',
    ],
  },
  {
    number: 7,
    niche: 'SEO Specialist',
    length: 'Medium',
    jobPost: 'Improve organic traffic for B2B project management software. Currently 2,000 monthly visitors. Budget $1,200/month.',
    proposal: `Hi [Name],

I looked at your site before applying. A few things stood out: your product pages are not consistently indexed, you have 14 blog posts but most appear to have been written without a keyword or topical map behind them, and your backlink profile is thin relative to the 3 competitors I checked.

The traffic problem is almost certainly fixable, but it is a content architecture issue more than a link-building issue. Buying links before fixing the internal structure tends to leak authority rather than compound it.

Here is how I would approach the first 90 days:
Month 1: Full technical and content audit. Identify which pages to consolidate, which to rewrite, and what topical gaps exist.
Month 2: Rewrite or update the 5-6 highest-potential pages and publish 4 new pieces targeting bottom-of-funnel keywords.
Month 3: Measure ranking movement, adjust content calendar, and build the first outreach list.

I have taken 3 B2B SaaS sites from under 500 visits/month to over 5,000/month in 6-8 months. I can share GSC screenshots from two of them.

One question: do you have a developer available to make minor technical changes, or would all fixes go through a ticket queue?

[Your Name]`,
    whyItWorked: [
      'Shows they did research (indexing issues, backlink profile) before writing a single word',
      'Reframes the problem (content architecture, not links) in a way that shows real expertise',
      'Proof references real outcomes with verifiable data (GSC screenshots)',
    ],
  },
  {
    number: 8,
    niche: 'Video Editor',
    length: 'Short',
    jobPost: 'Edit 2-3 YouTube videos per week for a personal finance channel. 8-15 minutes per video. Budget $80-120/video.',
    proposal: `Hi [Name],

Retention on YouTube finance content usually drops at two places: the 30-second mark if the hook does not deliver on the thumbnail promise, and around the 4-minute mark when the pacing slows. I flag both spots before I touch the timeline.

I edit for two finance channels currently. Average video length is 11 minutes and both channels are above 50% average view duration. Happy to share samples.

[Your Name]`,
    whyItWorked: [
      'Shows platform-specific knowledge (retention drop points) the average editor would not reference',
      '"I flag both spots before I touch the timeline" signals a quality-focused, collaborative process',
      'Proof uses the metric the client cares about most: average view duration',
    ],
  },
  {
    number: 9,
    niche: 'E-commerce Migration',
    length: 'Detailed',
    jobPost: 'Migrate WooCommerce store to Shopify. 400 products. Customer data, order history, and SEO redirects must be preserved. Budget $2,500-4,000.',
    proposal: `Hi [Name],

WooCommerce-to-Shopify migrations have a consistent failure point that does not show up until launch week: edge cases. Standard products, pages, and 301 redirects usually transfer cleanly. Where things break is subscription handling, custom checkout logic, and customer loyalty balances.

Before I outline my full approach: does your WooCommerce setup have anything beyond standard products? Subscriptions, bundled products, or region-specific tax rules? The answer determines whether this is a 3-week or 5-week engagement, and I would rather set the right expectation now.

My migration process has four phases:
Phase 1: Staging environment setup and full data export. Nothing touches your live store.
Phase 2: Product, customer, and order import with validation. I check 10% of records manually.
Phase 3: SEO redirect mapping. Every URL on your current site gets a 301 to the Shopify equivalent.
Phase 4: 47-point UAT checklist before launch. I do not go live until all 47 pass.

I have managed 7 Shopify migrations. The most complex was a store doing $2.8M/year with subscriptions and a custom tax engine. That migration had zero downtime on launch day. I can share the project report.

Timeline: 3-5 weeks depending on your answer above. I can start the staging environment within 48 hours of contract.

[Your Name]`,
    whyItWorked: [
      'Opens with a specific technical insight that signals real migration experience',
      'The diagnostic question is necessary, not filler. It changes the timeline and the scope.',
      'The 47-point checklist is memorable and specific. It is not just "thorough QA".',
    ],
  },
  {
    number: 10,
    niche: 'Mobile App Developer',
    length: 'Medium',
    jobPost: 'Build MVP for a local home cleaning booking app (iOS and Android). Customers book services, cleaners confirm. Budget $5,000-8,000.',
    proposal: `Hi [Name],

Service booking MVPs have one decision that shapes the entire build: do customers book a specific cleaner by name, or do they book a time slot and the system assigns a cleaner? The UI, the backend logic, and the payment flow all differ depending on which you choose.

Which model are you planning?

Either way, here is how I would approach the MVP: React Native for the customer app (one codebase for iOS and Android), a simple admin panel in React with a Node.js backend, and Stripe for payments. This keeps cost within your budget and allows you to add features after launch without a rewrite.

I built a similar booking MVP for a car detailing service last year. The first version launched in 6 weeks with a customer app, a provider app, and an admin dashboard. The client now has 800 active users and has not needed a rewrite.

Happy to share the demo or an architecture breakdown if it helps.

[Your Name]`,
    whyItWorked: [
      'Opens with a product-level question that exposes a decision the client needs to make',
      'Tech stack recommendation is specific and justified with a cost and scalability reason',
      'Proof from a comparable domain (service booking) with real scale (800 users, 6 weeks to launch)',
    ],
  },
];

const frameworkRows = [
  { letter: 'Q', label: 'Question / Observation', what: 'Proves you read the post. Specific to their stack, niche, or situation.', example: '"Does your catalogue run client-side filtering or database queries?" (Example 1)' },
  { letter: 'D', label: 'Diagnosis', what: 'Names the real problem behind the request. Shifts the frame from surface to root cause.', example: '"This is a content architecture issue, not a link-building issue." (Example 7)' },
  { letter: 'I', label: 'Insight / Process', what: 'Your approach, step by step. Shows competence before proof.', example: '4-phase migration process (Example 9)' },
  { letter: 'P', label: 'Proof', what: 'One specific project with a measurable result. Not a list of clients.', example: '"PageSpeed 28 to 81, bounce rate down 19%." (Example 3)' },
  { letter: 'C', label: 'Call to Action', what: 'One clear next step. A question or a small, low-risk offer.', example: '"Are you open to a 2-hour trial task?" (Example 4)' },
];

const faqs = [
  {
    q: 'What is the ideal word count for an Upwork proposal?',
    a: 'Most winning Upwork proposals are 100 to 250 words. Short proposals (under 150 words) work well for straightforward jobs. Medium proposals (150 to 300 words) suit most mid-range projects. Long proposals (over 400 words) are only justified for complex, high-budget engagements where the client needs to trust your process before they reply.',
  },
  {
    q: 'What is the best opening line for an Upwork proposal?',
    a: "The best opening line is either a specific observation about the client's job post or a question that proves you read it carefully. Never open with 'Hi, I am a [skill] expert with X years of experience.' That opener puts the focus on you rather than the client's problem.",
  },
  {
    q: 'What is the QDIPC framework for Upwork proposals?',
    a: 'QDIPC stands for: Question (open with something specific to prove you read the post), Diagnosis (name the real problem behind the surface request), Insight (explain your approach or process), Proof (reference one relevant project), and CTA (one clear next step). Top Upwork earners follow this structure across most niches.',
  },
  {
    q: 'Should you use a template for Upwork proposals?',
    a: 'Templates help with structure but hurt you if you send them without personalisation. Clients read dozens of proposals. The ones that get replies are the ones that reference something specific from the job post. Use a framework as a guide, not as a script to copy word-for-word.',
  },
  {
    q: 'How do you answer Upwork screening questions?',
    a: 'Treat each screening question as a mini-proposal. Give a specific, concrete answer that addresses what the client actually wants to know. Avoid generic responses. If the question asks about your experience with a specific tool, name the project, the tool version, and the result.',
  },
  {
    q: 'How many proposals does it take to get a job on Upwork?',
    a: 'New freelancers typically send 20 to 40 proposals before landing a first job. Experienced freelancers with strong profiles and personalised proposals convert at 1 in 5 to 1 in 10. The biggest variable is proposal quality, not quantity.',
  },
];

const lengthBadge: Record<ProposalExample['length'], string> = {
  Short: 'bg-green-100 text-green-700',
  Medium: 'bg-blue-100 text-blue-700',
  Detailed: 'bg-purple-100 text-purple-700',
};

export default function UpworkProposalExamples() {
  return (
    <>
      <Helmet>
        <title>10 Upwork Proposal Examples | Ultimate Freelancers</title>
        <meta name="description" content="10 real Upwork proposal examples with full breakdowns and analysis. Web dev, writing, VA, design, and data. See the job post, the proposal, and why it worked." />
        <link rel="canonical" href="https://ultimatefreelancers.com/upwork-proposal-examples" />
        <meta property="og:title" content="10 Upwork Proposal Examples | Ultimate Freelancers" />
        <meta property="og:description" content="10 real Upwork proposal examples with full breakdowns and analysis. Web dev, writing, VA, design, and data. See the job post, the proposal, and why it worked." />
        <meta property="og:url" content="https://ultimatefreelancers.com/upwork-proposal-examples" />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content="2026-04-27" />
        <meta name="twitter:title" content="10 Upwork Proposal Examples | Ultimate Freelancers" />
        <meta name="twitter:description" content="10 real Upwork proposal examples with full breakdowns and analysis. Web dev, writing, VA, design, and data. See the job post, the proposal, and why it worked." />
        <script type="application/ld+json">{JSON.stringify(schema.article)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.faq)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.breadcrumb)}</script>
      </Helmet>


      <main className="bg-[#F5F3EE] min-h-screen">

        {/* Hero */}
        <section className="container mx-auto px-4 pt-16 pb-10 max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>Upwork Proposal Examples</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
            10 Upwork Proposal Examples With Breakdowns
            <span className="block text-primary mt-1">(What Works and Why)</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Most proposal guides show you frameworks. This page shows you real proposals, real job posts, and a breakdown of exactly what made each one work. Ten examples across web development, content writing, design, virtual assistance, data entry, SEO, WordPress, video editing, e-commerce, and mobile development.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            Every proposal here follows a version of the QDIPC framework explained below. None of them open with "Hi, I am a [skill] expert with X years of experience." Read the breakdowns to understand why that matters.
          </p>
        </section>

        {/* QDIPC Framework */}
        <section className="container mx-auto px-4 pb-12 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-2">The QDIPC Framework</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Every winning proposal follows some version of this structure. Short proposals combine 2-3 elements. Detailed proposals use all five. The framework is a guide, not a script.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground w-8">Letter</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Element</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground hidden sm:table-cell">What it does</th>
                    <th className="text-left py-2 font-semibold text-foreground hidden md:table-cell">Example from below</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {frameworkRows.map((row) => (
                    <tr key={row.letter}>
                      <td className="py-3 pr-4 font-bold text-primary text-lg">{row.letter}</td>
                      <td className="py-3 pr-4 font-medium text-foreground whitespace-nowrap">{row.label}</td>
                      <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">{row.what}</td>
                      <td className="py-3 text-muted-foreground hidden md:table-cell text-xs">{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Proposal Examples */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-8">10 Real Upwork Proposal Examples</h2>

          <div className="space-y-10">
            {examples.map((ex) => (
              <div key={ex.number} className="bg-white rounded-2xl border border-border overflow-hidden">

                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-border flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Example {ex.number}</span>
                    <h3 className="text-lg font-bold text-foreground mt-0.5">{ex.niche}</h3>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${lengthBadge[ex.length]}`}>
                    {ex.length}
                  </span>
                </div>

                <div className="p-6 space-y-5">
                  {/* Job post */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Job post</p>
                    <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-4 leading-relaxed">{ex.jobPost}</p>
                  </div>

                  {/* Proposal */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Proposal</p>
                      <CopyButton text={ex.proposal} />
                    </div>
                    <pre className="text-sm text-foreground bg-muted/20 border border-border rounded-lg p-4 whitespace-pre-wrap font-sans leading-relaxed">{ex.proposal}</pre>
                  </div>

                  {/* Why it worked */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Why it worked</p>
                    <ul className="space-y-2">
                      {ex.whyItWorked.map((point, i) => (
                        <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="text-primary font-bold mt-0.5 shrink-0">{i + 1}.</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What separates winners */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">What Separates Proposals That Get Replies From Ones That Do Not</h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              After reading those 10 examples, the pattern is obvious. Winning proposals do three things that losing proposals do not.
            </p>
            <div className="space-y-5">
              {[
                {
                  title: 'They reference something specific from the job post',
                  body: 'Not "I read your job post carefully." Something specific. The tech stack. The budget. A detail only someone who read the post would notice. This is the single highest-signal move in any proposal.',
                },
                {
                  title: 'They name the real problem, not the surface request',
                  body: 'The client asked for a logo. The real problem is they do not know what "energetic" means in visual terms. The client asked for a VA. The real problem is their current system relies on memory and will collapse when the VA is unavailable. Naming that earns trust instantly.',
                },
                {
                  title: 'They give one specific proof point, not a list of credentials',
                  body: 'Not "I have 5 years of experience and have worked with 50+ clients." One project. One result. One number. "PageSpeed 28 to 81. Bounce rate down 19%." That sentence does more than a paragraph of credentials.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-primary text-lg font-bold mt-0.5 shrink-0">*</span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground mt-6 leading-relaxed text-sm">
              If your proposals are not getting replies, the fix is usually one of these three. Read <Link href="/blog/upwork-proposal-not-getting-replies" className="text-primary hover:underline">the full breakdown of why proposals stop getting replies</Link> for more specific diagnostics.
            </p>
          </div>
        </section>

        {/* Generate CTA */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Generate Your Own Personalised Proposal</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Paste the job post. The tool writes 3 proposal variants using the QDIPC framework, personalised to your background. No account. No extension. Bring your own API key.
            </p>
            <Link href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Generate My Proposal Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-muted-foreground mt-3">Free. BYOK. No account required.</p>
          </div>
        </section>

        {/* Related reading */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-5">Related Reading</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Upwork cover letter examples', href: '/upwork-cover-letter-examples', desc: 'Cover letter samples across 5 niches with annotated breakdowns.' },
              { label: 'How to write an Upwork proposal', href: '/blog/how-to-write-upwork-proposal', desc: 'The 5-part framework top earners use to turn cold bids into contracts.' },
              { label: 'Why proposals stop getting replies', href: '/blog/upwork-proposal-not-getting-replies', desc: '6 specific reasons most proposals fail, and the fix for each one.' },
              { label: 'How to answer screening questions', href: '/blog/how-to-answer-upwork-screening-questions', desc: 'Turn screening questions from a hurdle into a competitive advantage.' },
              { label: 'Proposal length guide', href: '/blog/upwork-proposal-length-guide', desc: 'Short, medium, or detailed: the exact guide for each job type.' },
              { label: 'How to write an Upwork cover letter', href: '/how-to-write-upwork-cover-letter', desc: 'Step-by-step guide with niche examples for dev, data entry, and VA.' },
            ].map(({ label, href, desc }) => (
              <Link
                key={href}
                href={href}
                className="bg-white border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
              >
                <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors mb-1 capitalize">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 pb-20 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white border border-border rounded-xl px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

      </main>

      <LandingFooter />
    </>
  );
}
