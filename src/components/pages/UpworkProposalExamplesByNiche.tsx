'use client'
import { useState } from 'react';
import { Helmet } from '@/lib/helmet-stub';
import Link from 'next/link';
import { Copy, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
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

// ── Schema ─────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Should I use a different proposal for every niche?',
    a: 'Yes, and also for every individual job within the same niche. Two React developer roles can have completely different requirements, stack preferences, and communication styles. The niche shapes your vocabulary and the examples you reach for. The job post shapes everything else. A niche-specific framework is the skeleton. Reading the actual post is what makes it work.',
  },
  {
    q: 'How long should a niche Upwork proposal be?',
    a: 'For most niches, 100 to 200 words is the right range. Data entry proposals can be as short as 80 words because the work is transactional and clients want efficiency, not personality. Web development and SEO proposals can run to 200 to 250 words because clients are evaluating your thinking process, not just your skills. The rule: match proposal length to the complexity and budget of the job, not to how much you want to say.',
  },
  {
    q: 'What rate should I bid as a beginner?',
    a: 'Bid at the mid-range of what the client listed, not the lowest. If a job posts $15 to $25 per hour, bidding $12 signals that you are competing on price rather than quality. Clients posting with a budget range have already decided they are willing to pay that range. Bidding lower often reads as a red flag, not a bargain. If you are new, compensate with a strong opening line and a specific proof point, even if that proof is from a personal project or freelance work outside Upwork.',
  },
  {
    q: 'How do I get my first job in a new niche?',
    a: 'Three things work together: a relevant portfolio sample (even one project built specifically for the application is better than none), a rate at the lower end of the range without being below the floor, and a niche-specific opening line that proves you understand the vocabulary and the problems of that space. Do not announce that you are new to the niche. Apply to your first few jobs as if you belong there, with the evidence to back it up.',
  },
  {
    q: 'Can I use the same QDIPC structure in every niche?',
    a: 'Yes. QDIPC is the skeleton and niche details are the flesh. The Question in a data entry proposal is about file format and data source. The Question in an SEO proposal is about current rankings or which tools the client uses. The Proof in a VA proposal is about a specific workflow you built. The Proof in a web developer proposal is a Core Web Vitals score. The structure is constant. What fills each element is what makes it niche-specific.',
  },
];

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://ultimatefreelancers.com/upwork-proposal-examples-by-niche#article',
      headline: 'Upwork Proposal Examples by Niche',
      description:
        'Real Upwork proposal examples for web developers, designers, VAs, data entry, SEO, WordPress, content writers, and data analysts. Copy and customise.',
      url: 'https://ultimatefreelancers.com/upwork-proposal-examples-by-niche',
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
          name: 'Upwork Proposal Examples by Niche',
          item: 'https://ultimatefreelancers.com/upwork-proposal-examples-by-niche',
        },
      ],
    },
  ],
};

// ── Niche data ─────────────────────────────────────────────────────────────────

type NicheSection = {
  id: string;
  h2: string;
  rateNote: string;
  jobPost: string;
  proposal: string;
  tips: string[];
};

const nicheSections: NicheSection[] = [
  {
    id: 'web-developer',
    h2: 'Web Developer Upwork Proposal Example',
    rateNote: 'Typical April 2026 rates: $50-$120/hr or $500-$5,000 fixed',
    jobPost:
      'We are building a React and Next.js e-commerce storefront for a fashion brand. The project includes product listing pages, a cart, and Stripe checkout. Budget $3,000-$5,000 fixed. Looking for clean code, fast load times, and a developer who can hit an 8-week deadline without hand-holding. Figma file is ready.',
    proposal: `Hi [Name],

Looking at your brief: you have a Figma file ready and a clear stack (React, Next.js, Stripe), which cuts the usual back-and-forth in half. One question before I map the timeline: are the product images hosted on Shopify or a separate CDN? That determines whether image optimisation sits inside my scope or needs a separate task.

My approach for a build like this: Next.js App Router for the storefront, route-level code splitting for fast initial loads, and Stripe Elements for the checkout. I build with Core Web Vitals targets from the start, not as a post-launch fix.

Last comparable project: a Next.js fashion storefront, 400 SKUs, Lighthouse performance score of 94 on mobile at launch. I can share the repo on request.

Timeline fits your 8-week window. Budget sits within your range.

[Your Name]`,
    tips: [
      'Reference Core Web Vitals or a Lighthouse score number. Clients who care about "fast load times" respond to specific benchmarks.',
      'Name the exact framework they listed (Next.js, not just "React"). Generic tech references signal you copy-paste proposals.',
      'Never bid below the floor of the posted budget. If the client says $3,000-$5,000, bidding $2,800 reads as insecurity, not value.',
    ],
  },
  {
    id: 'graphic-designer',
    h2: 'Graphic Designer Upwork Proposal Example',
    rateNote: 'Typical April 2026 rates: $30-$80/hr',
    jobPost:
      'New B2B SaaS startup needs a logo and brand identity package. We want something modern and trustworthy, not startup-cliche. Budget $500-$800. Deliverables: 3 initial concepts, vector source files, brand guidelines document, and a light/dark version of the final mark.',
    proposal: `Hi [Name],

"Modern and trustworthy, not startup-cliche" is a useful brief. Before I start sketching, one question: when you picture your two or three closest competitors, what do their logos look like? Knowing where you want to stand out visually is more useful than a mood board at this stage.

For a B2B SaaS brand, I typically build three concepts in round one: each takes a genuinely different strategic direction rather than three versions of the same idea. Round two refines the chosen direction based on your feedback.

Deliverables included at your budget: primary mark, brandmark version, light and dark modes, SVG and PDF vector files, and a 6-8 page brand guidelines PDF covering colour codes, typography, and spacing rules.

One thing to confirm: do you need any favicon or app icon versions alongside the logo? Better to size those correctly from the source files rather than adapt them later.

[Your Name]`,
    tips: [
      'Ask about competitors in your screening question. It signals brand strategy thinking, not just design execution.',
      'List file formats explicitly (SVG, PDF, PNG) before the client has to ask. Clients who have been burned by designers not delivering source files notice this.',
      'Reference any brand values or tone words they used ("trustworthy," "not startup-cliche") verbatim in your response.',
    ],
  },
  {
    id: 'virtual-assistant',
    h2: 'Virtual Assistant Upwork Proposal Example',
    rateNote: 'Typical April 2026 rates: $10-$30/hr',
    jobPost:
      'Looking for a reliable executive VA for a US-based CEO. Approximately 20 hours per week, ongoing. Core responsibilities: inbox triage and management in Gmail, calendar scheduling across three time zones, CRM data entry in HubSpot, and ad-hoc research tasks. Rate $15-$25/hr. Needs to be available 9am-1pm EST weekdays.',
    proposal: `Hi [Name],

Three time zones and a HubSpot CRM alongside Gmail and calendar management: that is a heavier coordination load than most VA postings describe. Worth confirming up front: I am available 9am to 1pm EST Monday to Friday, so that requirement is met without workarounds.

My current setup: I work with a SaaS founder managing two Gmail inboxes, a Calendly-linked Google Calendar, and Notion for project tracking. I have been in that role for 14 months, zero missed scheduling commitments.

For a role like yours, my first week would focus on building a shared SOP document: every recurring task documented with the exact process, so nothing lives only in my memory. HubSpot data entry I can pick up from your existing field structure with a 30-minute walkthrough.

Would a 2-hour paid trial task help you evaluate fit before committing to a weekly arrangement?

[Your Name]`,
    tips: [
      'State your timezone availability explicitly and early. A client posting "9am-1pm EST" will eliminate any VA who does not confirm it in the proposal.',
      'List specific tools by name (HubSpot, Notion, Asana, Calendly). Generic phrases like "familiar with CRM tools" do not differentiate you.',
      'Show you understand the difference between task types. Inbox triage requires real-time availability; research tasks can be batched. Demonstrating that distinction signals experience over raw hours.',
    ],
  },
  {
    id: 'data-entry',
    h2: 'Data Entry Upwork Proposal Example',
    rateNote: 'Typical April 2026 rates: $8-$20/hr',
    jobPost:
      'Need 500 product SKUs entered into our Shopify store. Each SKU includes product title, description, price, weight, and 3-4 images. Source data is in an Excel file with one row per product. Budget $200 fixed, 5-day turnaround.',
    proposal: `Hi [Name],

500 SKUs from a structured Excel file into Shopify: straightforward scope, and your 5-day window is comfortable. Before I start, one quick question: are the product images already uploaded somewhere (Google Drive, Dropbox), or do they need to be downloaded from URLs listed in the file? The answer affects whether this is a 2-day job or a 3-day job.

My process: I complete the first 20 SKUs and send them for your review before continuing. This avoids the scenario where a field interpretation error gets replicated across all 500 rows.

On accuracy: my last comparable project was 750 product records for a home goods store. The client ran a spot-check audit on 15% of records after delivery. Zero errors on checked rows.

At your $200 budget, my rate works out to $0.40 per SKU, which I am comfortable with given the structured source data.

[Your Name]`,
    tips: [
      'Quote a per-item rate (e.g., $0.40 per SKU) alongside your total. It signals professional pricing awareness and makes your rate transparent.',
      'Mention your accuracy rate or invite a post-delivery audit. Clients hiring for data entry are primarily afraid of errors. Address that fear directly.',
      'Ask about the data source format. Scanned PDFs, structured Excel files, and web scrape outputs all have different complexity levels.',
    ],
  },
  {
    id: 'seo',
    h2: 'SEO Upwork Proposal Example',
    rateNote: 'Typical April 2026 rates: $40-$90/hr',
    jobPost:
      'B2B SaaS company with a blog of 40 articles needs on-page and technical SEO optimisation. Articles were written without keyword research. We also have crawl errors flagged in Google Search Console and Core Web Vitals issues on mobile. Budget $1,500-$2,000.',
    proposal: `Hi [Name],

Forty articles written without keyword research and active crawl errors in GSC: the good news is that fixing these two things in the right order can produce visible ranking movement within 60 to 90 days without new content spend.

The order matters. Technical issues (crawl errors, Core Web Vitals) should be resolved before on-page work, otherwise you are optimising pages that Google is partially ignoring. I would run a Screaming Frog crawl in the first week to map the full technical picture before touching a single article.

On-page process for each article: search intent alignment, title and H1 rewrite where needed, internal link additions from and to each page, and schema markup where it applies. I use Ahrefs for keyword data and GSC for baseline tracking.

One offer to reduce your risk: I can run a free 10-page audit sample and share it before we sign a contract. You see exactly how I work before committing the full budget.

[Your Name]`,
    tips: [
      'Name a specific tool (Ahrefs, Screaming Frog, Semrush) and what you use it for. Generic "SEO tool experience" is meaningless differentiation.',
      'Reference a specific metric from their post (Core Web Vitals, crawl errors). It proves you read past the job title.',
      'Offer a free audit snippet for a defined scope (10 pages, one section). It reduces client risk and separates you from freelancers who only offer a call.',
    ],
  },
  {
    id: 'wordpress',
    h2: 'WordPress Developer Upwork Proposal Example',
    rateNote: 'Typical April 2026 rates: $35-$80/hr',
    jobPost:
      'WooCommerce store on an existing Astra theme needs a custom checkout flow. Currently using the default WooCommerce checkout. We want a multi-step checkout with a progress bar, custom fields for delivery instructions, and a summary sidebar. Budget $800-$1,500.',
    proposal: `Hi [Name],

Multi-step WooCommerce checkout with custom fields and a progress bar: this is buildable within your budget, and Astra is a clean base to work from. One question before I scope it precisely: are you using Elementor for any of the existing page designs, or is the site built with the Astra Customizer and standard blocks? That determines whether I build the custom checkout with a page builder or custom PHP templates, which affects both the approach and the maintenance complexity after I hand it over.

My process: I work on a full staging environment before touching the live site. Any code pushed to production has been tested across Chrome, Safari, and mobile first. For a custom checkout build, I document the field structure and the conditional logic in a brief handoff note so your team can manage changes without a developer for routine edits.

I have built three custom WooCommerce checkout flows in the past year, including one with a conditional upsell step before the payment screen. Happy to share that build as a reference.

[Your Name]`,
    tips: [
      'Ask about their current theme and page builder (Elementor, Divi, Bricks) before quoting. The same feature can take 4 hours or 12 hours depending on the existing stack.',
      'Mention your staging environment workflow. Clients who have had live-site edits break their store remember it. Showing you work on staging is a strong trust signal.',
      'Reference Elementor or ACF explicitly if they mentioned either in the post. Those specifics signal hands-on experience, not generic WordPress skills.',
    ],
  },
  {
    id: 'content-writer',
    h2: 'Content Writer Upwork Proposal Example',
    rateNote: 'Typical April 2026 rates: $20-$60/hr',
    jobPost:
      'SaaS company needs 8 long-form blog posts per month in the project management and productivity space. Posts should be 1,500 to 2,500 words, SEO-optimised, with clear structure and a practical tone. $80-$120 per post. Writers with SaaS or tech niche experience preferred.',
    proposal: `Hi [Name],

Project management and productivity content for a SaaS audience sits in a competitive search space: the top-ranking articles are usually comprehensive, well-structured, and written by people who understand the product category. Generic "top 10 tips" content does not rank in this niche in 2026.

My background: I write exclusively in the SaaS and B2B tech space. In the past year, I delivered 72 long-form posts for three SaaS clients. I use Ahrefs for keyword intent and Clearscope for semantic coverage on every article before I write a word.

On process: I deliver a structured outline for your approval before drafting, internal link suggestions alongside each article, and a meta title and description with every post. No extras at an hourly rate. It is how I work.

One question: do you have existing content I can reference for tone? If there are 3 to 4 articles you consider the best examples of your current voice, that brief is more useful than a style guide.

[Your Name]`,
    tips: [
      'Mention specific SEO tools by name (Ahrefs, Clearscope, Surfer SEO) and what role they play in your process. This differentiates you from writers who claim "SEO experience" without a defined workflow.',
      'Offer a paid test article rather than a free sample. Free samples undervalue your work and attract clients who want free content. A paid test article shows confidence and filters serious clients.',
      'Reference the client\'s existing content if you can find it before applying. Even a one-line observation about their current content style shows you did the work.',
    ],
  },
  {
    id: 'data-analyst',
    h2: 'Data Analyst Upwork Proposal Example',
    rateNote: 'Typical April 2026 rates: $40-$100/hr',
    jobPost:
      'Need a data analyst to analyse 12 months of sales data currently in Google Sheets. Approximately 15,000 rows. We want a dashboard showing monthly revenue trends, top products by margin, and customer cohort behaviour. Budget $500-$800.',
    proposal: `Hi [Name],

Twelve months of sales data in Google Sheets, 15,000 rows: the dashboard is straightforward to build, but the analysis quality depends heavily on how the data is currently structured. Revenue trend and product margin views are clean if the data is consistent. Cohort analysis requires a reliable customer ID field and consistent date formatting across the full dataset.

Before I scope the build: can you tell me whether the data has been entered manually or exported from another system? Manual entry often has formatting inconsistencies that need one cleanup pass before analysis is reliable.

My approach: I run a data audit in the first 2 hours and flag any issues before building anything. Clients who have had dashboards built on dirty data understand why this step matters. The dashboard itself I build in Google Sheets using pivot tables, QUERY functions, and conditional formatting, keeping it editable without a developer after handoff.

The cohort analysis will give you your 30, 60, and 90-day retention rates by acquisition month. That is usually the most actionable output from a dataset like yours.

[Your Name]`,
    tips: [
      'Name the specific tool they listed (Google Sheets, Looker, Tableau, Power BI) and demonstrate fluency with it. Do not say "I am familiar with various data tools."',
      'Offer a data audit as a first step before the build. Clients with messy data (which is most of them) appreciate the professional caution, and it protects you from scope creep.',
      'Reference a specific insight type they will get from the analysis (cohort retention rates, margin by SKU). It shows you have already thought about their actual business question.',
    ],
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UpworkProposalExamplesByNiche() {
  return (
    <>
      <Helmet>
        <title>Upwork Proposal Examples by Niche | Ultimate Freelancers</title>
        <meta
          name="description"
          content="Real Upwork proposal examples for web developers, designers, VAs, data entry, SEO, WordPress, content writers, and data analysts. Copy and customise."
        />
        <link rel="canonical" href="https://ultimatefreelancers.com/upwork-proposal-examples-by-niche" />
        <meta property="og:title" content="Upwork Proposal Examples by Niche | Ultimate Freelancers" />
        <meta
          property="og:description"
          content="Real Upwork proposal examples for web developers, designers, VAs, data entry, SEO, WordPress, content writers, and data analysts. Copy and customise."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ultimatefreelancers.com/upwork-proposal-examples-by-niche" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="og:site_name" content="Ultimate Freelancers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upwork Proposal Examples by Niche | Ultimate Freelancers" />
        <meta
          name="twitter:description"
          content="Real Upwork proposal examples for web developers, designers, VAs, data entry, SEO, WordPress, content writers, and data analysts. Copy and customise."
        />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">

        <main>

          {/* ── Hero ── */}
          <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-muted/30 to-background">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <span>/</span>
                <span>Upwork Proposal Examples by Niche</span>
              </nav>

              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
                Upwork Proposal Examples by Niche
              </h1>

              <p className="text-base font-medium text-primary mb-5">
                Web Dev · Design · VA · Data Entry · SEO · WordPress · Content · Data Analysis
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                One page covers 8 niches. Each section has a real 2026 job post snippet, a 150-200 word proposal written with the QDIPC structure (Question, Diagnosis, Insight, Proof, CTA), and 3 niche-specific tips you will not find in a generic proposal guide. Copy any example and customise it for the job in front of you, or use it as the benchmark for generating a personalised version with your own background.
              </p>
            </div>
          </section>

          {/* ── Niche sections ── */}
          {nicheSections.map((niche, index) => (
            <section
              key={niche.id}
              id={niche.id}
              className={`py-12 px-4 ${index % 2 === 1 ? 'bg-muted/20' : 'bg-background'}`}
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-1">{niche.h2}</h2>
                <p className="text-xs text-muted-foreground mb-6 font-medium">{niche.rateNote}</p>

                {/* Job post */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Job Post</p>
                  <p className="text-amber-900 leading-relaxed">{niche.jobPost}</p>
                </div>

                {/* Proposal */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Proposal</p>
                    <CopyButton text={niche.proposal} />
                  </div>
                  <blockquote className="bg-muted/50 rounded-xl p-5 text-sm leading-relaxed border-l-4 border-primary whitespace-pre-wrap font-sans text-foreground">
                    {niche.proposal}
                  </blockquote>
                </div>

                {/* Tips */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Niche-specific tips
                  </p>
                  <ul className="space-y-2.5">
                    {niche.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}

          {/* ── Why niche-specific proposals win ── */}
          <section className="py-12 px-4 bg-muted/20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Why niche-specific proposals win more jobs
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Generic proposals fail not because they are badly written, but because they are invisible. A client posting for an SEO specialist reads fifty proposals that open with "I am a skilled SEO professional with 5 years of experience." Every single one of them blurs into the same grey noise. Three things make niche-specific proposals structurally different.
              </p>

              <div className="space-y-5 mb-8">
                {[
                  {
                    title: 'Clients search for specialists, not generalists',
                    body: 'An e-commerce business posting for a WooCommerce developer wants to hire someone who has seen their exact problem before, not someone who can learn it. A niche-specific proposal demonstrates prior exposure through vocabulary, tool references, and the questions you ask. That signals specialist experience more reliably than a list of credentials.',
                  },
                  {
                    title: 'Niche vocabulary signals genuine expertise',
                    body: 'Mentioning Core Web Vitals by name in a web development proposal, or citing Screaming Frog in an SEO proposal, or referencing HubSpot field structure in a VA proposal costs you nothing to write and tells the client you live in their world. Generic proposals use generic language. Niche proposals use the exact terms the client is already thinking in.',
                  },
                  {
                    title: 'Specific references prove you read their post',
                    body: "The single highest-value move in any proposal is referencing something specific from the job post. Not the job title. A specific detail: the tool they listed, the metric they mentioned, the constraint they described. Clients can tell the difference between a freelancer who read their post and one who fired a template. That difference, in most niches, is the difference between a reply and silence.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                    <div className="w-1.5 bg-primary rounded-full flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA box */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Generate a niche-specific proposal in 60 seconds
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  Paste the job post. Get 3 proposal variants personalised to your niche and background. Free, no account required.
                </p>
                <Link href="/"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  Generate My Proposal Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-muted-foreground mt-3">BYOK. No account. Works in under 60 seconds.</p>
              </div>
            </div>
          </section>

          {/* ── Related resources ── */}
          <section className="py-12 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-5">
                Related Upwork proposal resources
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    label: 'Upwork proposal examples',
                    href: '/upwork-proposal-examples',
                    desc: '10 real proposals with job post context and annotated breakdowns of exactly why each one worked.',
                  },
                  {
                    label: 'Upwork cover letter examples',
                    href: '/upwork-cover-letter-examples',
                    desc: 'Short, medium, and detailed cover letter samples across 5 niches with copy-in-one-click functionality.',
                  },
                  {
                    label: 'How to write an Upwork proposal',
                    href: '/how-to-write-upwork-proposal',
                    desc: 'The 5-part QDIPC framework that top earners use to turn cold bids into contracts, with before and after examples.',
                  },
                  {
                    label: 'Upwork proposal template',
                    href: '/upwork-proposal-template',
                    desc: 'A fill-in-the-blanks template with instructions for each variable, built for every niche and budget level.',
                  },
                ].map(({ label, href, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                  >
                    <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors mb-1">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="py-12 px-4 bg-muted/20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-sm"
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
            </div>
          </section>

        </main>

        <LandingFooter />
      </div>
    </>
  );
}
