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
    headline: 'Freelance Proposal Template: 5 Copy-Paste Formats That Win Clients',
    description: '5 ready-to-use freelance proposal templates for Upwork, Fiverr, email outreach, Statement of Work, and quick pitches. Each template includes a breakdown of what to customise.',
    url: 'https://ultimatefreelancers.com/freelance-proposal-template',
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    author: { '@type': 'Person', name: 'Muhammad Younus', url: 'https://ultimatefreelancers.com/about' },
    publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
    image: 'https://ultimatefreelancers.com/og-image.png',
    about: [
      { '@type': 'Thing', name: 'Freelance proposal template' },
      { '@type': 'Thing', name: 'Freelance proposal writing' },
      { '@type': 'Thing', name: 'Upwork proposal' },
      { '@type': 'Thing', name: 'Freelance cover letter' },
    ],
    mentions: [
      { '@type': 'Organization', name: 'Upwork' },
      { '@type': 'Organization', name: 'Fiverr' },
      { '@type': 'Thing', name: 'Statement of Work' },
    ],
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What should a freelance proposal include?',
        acceptedAnswer: { '@type': 'Answer', text: 'A strong freelance proposal includes: a specific opening that references the client\'s project, a diagnosis of the real problem they are trying to solve, your relevant process or approach, one concrete proof point from a past project, and a clear call to action. The order matters. Most proposals fail because they start with credentials rather than the client\'s situation.' },
      },
      {
        '@type': 'Question',
        name: 'How long should a freelance proposal be?',
        acceptedAnswer: { '@type': 'Answer', text: 'For platform proposals (Upwork, Fiverr): 100 to 250 words. For email pitches: 150 to 300 words. For Statements of Work on larger projects ($5,000+): as long as it needs to be, typically 1 to 3 pages. Length should match the complexity of the project, not your desire to impress.' },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between a freelance proposal and a cover letter?',
        acceptedAnswer: { '@type': 'Answer', text: 'On Upwork, "cover letter" and "proposal" mean the same thing: the text you write when applying to a job post. Outside of Upwork, a proposal is usually a standalone document (sometimes with pricing, scope, and timeline), while a cover letter is the shorter introductory message that accompanies it. For most platform jobs, the "proposal" is what you write in the text field.' },
      },
      {
        '@type': 'Question',
        name: 'Is it bad to use a proposal template?',
        acceptedAnswer: { '@type': 'Answer', text: 'Using a template as a structure is fine. Sending the same template word-for-word to every client is not. The templates on this page are designed to be customised: the placeholders in brackets must be replaced with information specific to each job post. A template that sounds like a template gets ignored.' },
      },
      {
        '@type': 'Question',
        name: 'What is a Statement of Work and when do you need one?',
        acceptedAnswer: { '@type': 'Answer', text: 'A Statement of Work (SOW) is a formal document that defines the scope, deliverables, timeline, and payment terms for a project. You need one when the project is complex, multi-phase, or high-budget (generally $3,000+). For smaller or simpler jobs, a clear proposal message is sufficient. An SOW protects both parties by eliminating ambiguity about what is and is not included.' },
      },
      {
        '@type': 'Question',
        name: 'How do you write a freelance proposal with no experience?',
        acceptedAnswer: { '@type': 'Answer', text: 'Focus on what you can do for the client, not what you have done before. Describe your process in detail, offer a small paid trial task to reduce their risk, and reference any relevant personal or academic projects. Be honest about where you are in your career. Clients hiring entry-level freelancers know they are hiring entry-level. What they want to know is that you are thoughtful, communicative, and will not disappear.' },
      },
    ],
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ultimatefreelancers.com' },
      { '@type': 'ListItem', position: 2, name: 'Freelance Proposal Template', item: 'https://ultimatefreelancers.com/freelance-proposal-template' },
    ],
  },
};

type Template = {
  id: string;
  platform: string;
  badge: string;
  badgeColor: string;
  useWhen: string;
  template: string;
  customise: string[];
};

const templates: Template[] = [
  {
    id: 'upwork',
    platform: 'Upwork Proposal Template',
    badge: 'Most used',
    badgeColor: 'bg-primary/10 text-primary',
    useWhen: 'Applying to any Upwork job post. Works for hourly and fixed-price projects across all skill categories.',
    template: `Hi [Client Name],

[One sentence that references something specific from their job post: a detail, a tech stack, a constraint, or a problem they described.]

Before I give a full proposal, I want to confirm one thing: [short clarifying question that shows you understand the deeper problem, not just the surface request].

My relevant background: [1-2 sentences on a specific project you completed that is directly comparable. Include a measurable result if possible.]

My approach for this project:
[Step 1: what you would do first]
[Step 2: what comes next]
[Step 3: how you would deliver]

[One sentence on timeline or budget fit.]

[Your Name]`,
    customise: [
      'Replace [Client Name] with their actual name if visible in the job post',
      'The specific opening sentence is the most important part. It must reference something only someone who read the post would know.',
      'The clarifying question should surface a decision the client needs to make, not just ask for more information',
      'The measurable result in your proof point is optional but significantly increases reply rate',
    ],
  },
  {
    id: 'fiverr',
    platform: 'Fiverr Buyer Request Template',
    badge: 'Platform-specific',
    badgeColor: 'bg-blue-100 text-blue-700',
    useWhen: 'Responding to Buyer Requests on Fiverr. These are short and competitive. You have seconds before the client moves on.',
    template: `Hi [Client Name],

I saw your request for [specific thing they asked for] and I can deliver exactly that.

Here is what I would do: [2-3 sentences on your specific approach for their project, not generic capabilities].

Recent example: [One sentence on a comparable project: what you delivered and what the result was].

I can start [today / within 24 hours] and deliver [specific deliverable] within [your timeline].

[Your Name]`,
    customise: [
      'Fiverr buyer requests are shorter than Upwork proposals. Keep it under 150 words.',
      'Lead with what you would deliver, not who you are',
      'Mentioning you can start quickly is a conversion lever on Fiverr, where speed matters to most buyers',
      'If you have a Gig that directly matches their request, mention it in one line at the end',
    ],
  },
  {
    id: 'email',
    platform: 'Cold Email Pitch Template',
    badge: 'Direct outreach',
    badgeColor: 'bg-orange-100 text-orange-700',
    useWhen: 'Reaching out to a potential client directly by email, without a platform intermediary. Works for agency outreach, LinkedIn follow-ups, or inbound leads.',
    template: `Subject: [Specific thing you noticed] on [their company/website/project]

Hi [Name],

[One sentence on something specific you noticed about their business: a gap, an opportunity, or something they are already doing well that you could extend. Be specific enough that they know you are not sending this to 100 people.]

I help [type of client] with [type of problem]. Most recently I [specific result for a comparable client].

[2-3 sentences on what you would do for them specifically. Describe an outcome, not a list of services.]

Worth a 15-minute call this week?

[Your Name]
[One-line title or link to portfolio]`,
    customise: [
      'The subject line determines whether this gets opened. Make it specific, not clever.',
      'The first sentence must reference something about them, not about you',
      'Never list your services. Describe the outcome they would get.',
      'The call ask at the end should be low-commitment: 15 minutes, not "a discovery call" or "a Zoom"',
      'Remove any line that could apply to a company you have never researched',
    ],
  },
  {
    id: 'sow',
    platform: 'Statement of Work (SOW) Template',
    badge: 'High-budget projects',
    badgeColor: 'bg-purple-100 text-purple-700',
    useWhen: 'Projects over $3,000 or any multi-phase engagement where scope clarity matters. Protects both parties by defining what is and is not included.',
    template: `PROJECT PROPOSAL
[Your Name / Company Name]
Prepared for: [Client Name / Company]
Date: [Date]

─────────────────────────────

PROJECT OVERVIEW
[2-3 sentences describing the project in plain language. What it is, what it will achieve, and why now.]

SCOPE OF WORK
The following deliverables are included in this engagement:

Deliverable 1: [Clear description]
Deliverable 2: [Clear description]
Deliverable 3: [Clear description]

The following are NOT included in this engagement:
- [Out-of-scope item 1]
- [Out-of-scope item 2]

─────────────────────────────

TIMELINE
Phase 1: [Name], [Start date] to [End date]
Phase 2: [Name], [Start date] to [End date]
Phase 3: [Name], [Start date] to [End date]

Total estimated duration: [X weeks/months]

─────────────────────────────

INVESTMENT
[Option A: Fixed price]
Total project fee: $[Amount]
Payment schedule:
  50% on contract signing: $[Amount]
  50% on final delivery: $[Amount]

[Option B: Milestone-based]
Phase 1: $[Amount], due on [date/trigger]
Phase 2: $[Amount], due on [date/trigger]
Phase 3: $[Amount], due on [date/trigger]

─────────────────────────────

ASSUMPTIONS AND DEPENDENCIES
This proposal assumes:
- [Assumption 1, e.g., client provides access to X within Y days]
- [Assumption 2]
- [Assumption 3]

Changes to these assumptions may affect timeline or cost.

─────────────────────────────

NEXT STEPS
To proceed: [reply to confirm / sign attached contract / complete deposit].

[Your Name]
[Contact details]`,
    customise: [
      'The "NOT included" section prevents 90% of scope creep disputes. Never skip it.',
      'Assumptions and Dependencies protects your timeline: if the client is late on their end, you are not in breach',
      'Milestone-based payments are usually safer than 50/50 for longer projects',
      'For Upwork projects, this can be sent as an attachment alongside your cover letter for high-budget jobs',
    ],
  },
  {
    id: 'quick',
    platform: 'Quick Pitch Template',
    badge: 'Small jobs',
    badgeColor: 'bg-green-100 text-green-700',
    useWhen: 'Simple, well-defined jobs where the client needs confidence and speed, not a detailed proposal. Data entry, simple fixes, short content pieces.',
    template: `Hi [Name],

[One sentence that shows you understood exactly what they need.]

I have done this [X times / for similar clients] and can deliver [specific output] within [timeline].

[One sentence on your process or quality check: something that removes their biggest concern.]

[Your Name]`,
    customise: [
      'Three to five sentences maximum. Any longer and you are over-engineering a simple job.',
      'The specific output should mirror the language in the job post exactly',
      'Address the most likely concern directly: for data entry, it is accuracy; for quick content, it is tone match',
      'No need for a portfolio link or credentials on simple jobs. Your directness is the signal.',
    ],
  },
];

const differences = [
  {
    dimension: 'Purpose',
    platform: 'Sent to get a reply or a call. The goal is a conversation, not a contract.',
    sow: 'Sent to define and agree on the project. The goal is a signed agreement.',
  },
  {
    dimension: 'Length',
    platform: '100 to 300 words for most platform or email proposals',
    sow: '1 to 3 pages depending on project complexity',
  },
  {
    dimension: 'When to send',
    platform: 'At the start of any job application or outreach',
    sow: 'After an initial conversation, when both parties want to move forward',
  },
  {
    dimension: 'What it covers',
    platform: 'Why you are the right person for the job',
    sow: 'What exactly will and will not be delivered, by when, and for how much',
  },
];

const faqs = [
  { q: 'What should a freelance proposal include?', a: "A strong freelance proposal includes: a specific opening that references the client's project, a diagnosis of the real problem they are trying to solve, your relevant process or approach, one concrete proof point from a past project, and a clear call to action. The order matters. Most proposals fail because they start with credentials rather than the client's situation." },
  { q: 'How long should a freelance proposal be?', a: 'For platform proposals (Upwork, Fiverr): 100 to 250 words. For email pitches: 150 to 300 words. For Statements of Work on larger projects ($5,000+): as long as it needs to be, typically 1 to 3 pages. Length should match the complexity of the project, not your desire to impress.' },
  { q: 'What is the difference between a freelance proposal and a cover letter?', a: 'On Upwork, "cover letter" and "proposal" mean the same thing: the text you write when applying to a job post. Outside of Upwork, a proposal is usually a standalone document (sometimes with pricing, scope, and timeline), while a cover letter is the shorter introductory message that accompanies it. For most platform jobs, the "proposal" is what you write in the text field.' },
  { q: 'Is it bad to use a proposal template?', a: 'Using a template as a structure is fine. Sending the same template word-for-word to every client is not. The templates on this page are designed to be customised: the placeholders in brackets must be replaced with information specific to each job post. A template that sounds like a template gets ignored.' },
  { q: 'What is a Statement of Work and when do you need one?', a: 'A Statement of Work (SOW) is a formal document that defines the scope, deliverables, timeline, and payment terms for a project. You need one when the project is complex, multi-phase, or high-budget (generally $3,000+). For smaller or simpler jobs, a clear proposal message is sufficient. An SOW protects both parties by eliminating ambiguity about what is and is not included.' },
  { q: 'How do you write a freelance proposal with no experience?', a: 'Focus on what you can do for the client, not what you have done before. Describe your process in detail, offer a small paid trial task to reduce their risk, and reference any relevant personal or academic projects. Be honest about where you are in your career. Clients hiring entry-level freelancers know they are hiring entry-level. What they want to know is that you are thoughtful, communicative, and will not disappear.' },
];

export default function FreelanceProposalTemplate() {
  return (
    <>
      <Helmet>
        <title>Freelance Proposal Template | Ultimate Freelancers</title>
        <meta name="description" content="5 freelance proposal templates for Upwork, Fiverr, email outreach, Statement of Work, and quick pitches. Each includes a breakdown of what to customise." />
        <link rel="canonical" href="https://ultimatefreelancers.com/freelance-proposal-template" />
        <meta property="og:title" content="Freelance Proposal Template | Ultimate Freelancers" />
        <meta property="og:description" content="5 freelance proposal templates for Upwork, Fiverr, email outreach, Statement of Work, and quick pitches. Each includes a breakdown of what to customise." />
        <meta property="og:url" content="https://ultimatefreelancers.com/freelance-proposal-template" />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content="2026-04-28" />
        <meta name="twitter:title" content="Freelance Proposal Template | Ultimate Freelancers" />
        <meta name="twitter:description" content="5 freelance proposal templates for Upwork, Fiverr, email outreach, Statement of Work, and quick pitches. Each includes a breakdown of what to customise." />
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
            <span>Freelance Proposal Template</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
            Freelance Proposal Template
            <span className="block text-primary mt-1">5 Copy-Paste Formats That Win Clients</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Five templates for every situation: Upwork proposals, Fiverr buyer requests, cold email pitches, Statements of Work for larger projects, and quick pitches for simple jobs. Each one is copy-ready with placeholders, plus a breakdown of what to customise so it does not read like a template.
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            The rule with all of them: the words inside [brackets] are the only parts that make a proposal work. The structure is the scaffold. The specifics are what win the job.
          </p>
        </section>

        {/* Jump links */}
        <section className="container mx-auto px-4 pb-10 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Jump to template</p>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="text-sm text-primary hover:underline border border-primary/20 rounded-full px-3 py-1 hover:bg-primary/5 transition-colors"
                >
                  {t.platform.replace(' Template', '').replace(' (SOW) Template', '')}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl space-y-8">
          {templates.map((t, i) => (
            <div key={t.id} id={t.id} className="bg-white rounded-2xl border border-border overflow-hidden scroll-mt-20">
              <div className="px-6 pt-6 pb-4 border-b border-border flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${t.badgeColor}`}>{t.badge}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{t.platform}</h2>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Use when</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.useWhen}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Template</p>
                    <CopyButton text={t.template} />
                  </div>
                  <pre className="text-sm text-foreground bg-muted/20 border border-border rounded-lg p-4 whitespace-pre-wrap font-sans leading-relaxed overflow-x-auto">{t.template}</pre>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">What to customise</p>
                  <ul className="space-y-2">
                    {t.customise.map((point, j) => (
                      <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-primary font-bold shrink-0 mt-0.5">{j + 1}.</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Proposal vs SOW */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Freelance Proposal vs. Statement of Work</h2>
            <p className="text-sm text-muted-foreground mb-6">These are two different documents used at two different stages of winning a client.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-6 font-semibold text-foreground">Dimension</th>
                    <th className="text-left py-2 pr-6 font-semibold text-foreground">Proposal / Cover Letter</th>
                    <th className="text-left py-2 font-semibold text-foreground">Statement of Work</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {differences.map((row) => (
                    <tr key={row.dimension}>
                      <td className="py-3 pr-6 font-medium text-foreground whitespace-nowrap">{row.dimension}</td>
                      <td className="py-3 pr-6 text-muted-foreground">{row.platform}</td>
                      <td className="py-3 text-muted-foreground">{row.sow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why templates alone fail */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">Why Templates Alone Will Not Get You Hired</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Every client reading proposals has already seen the same five templates recycled by dozens of freelancers. Templates become a signal of a copy-paste approach the moment the client recognises the structure.
            </p>
            <div className="space-y-4">
              {[
                {
                  heading: 'The opening line must be job-specific',
                  body: 'No template opening works across more than one job. "I noticed you are looking for a React developer" applies to everyone who applied. "Before I quote a timeline: does your filtering run client-side or server-side?" applies only to this job post. That is the difference.',
                },
                {
                  heading: 'The proof point must be specific to their domain',
                  body: 'Saying "I have 5 years of experience" means nothing to a client who has already read 20 proposals saying the same thing. One project with one result in a comparable domain ("PageSpeed 28 to 81 for a WooCommerce store") earns more trust than a page of credentials.',
                },
                {
                  heading: 'The question at the end signals expertise',
                  body: 'The best proposals end with a question that only someone who understood the job deeply would think to ask. It turns a one-way pitch into the start of a conversation, which is exactly what you want.',
                },
              ].map((item) => (
                <div key={item.heading} className="flex gap-4">
                  <span className="text-primary font-bold text-lg shrink-0 mt-0.5">*</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">{item.heading}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              For real proposals with full breakdowns, see{' '}
              <Link href="/upwork-proposal-examples" className="text-primary hover:underline">10 Upwork proposal examples that explain what made each one work</Link>.
            </p>
          </div>
        </section>

        {/* Customisation by platform */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Customise Your Proposal for Each Platform</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                platform: 'Upwork',
                notes: [
                  'Use the client\'s name if visible in the job post',
                  'Reference their exact tech stack, budget, or a detail from the job description',
                  'Keep it under 250 words on most jobs',
                  'End with a question, not "I look forward to hearing from you"',
                ],
              },
              {
                platform: 'Fiverr',
                notes: [
                  'Buyer requests are read quickly: front-load your specific offer',
                  'Mirror the language in their request exactly',
                  'Mention your turnaround time if speed matters for their job type',
                  'Keep it under 150 words',
                ],
              },
              {
                platform: 'Cold Email',
                notes: [
                  'Research the company before writing a single word',
                  'The subject line is the proposal: if it does not get opened, nothing else matters',
                  'Remove any sentence that could apply to a different company',
                  'One ask, one action: book a call, not "let me know if you are interested"',
                ],
              },
              {
                platform: 'Direct Client (SOW)',
                notes: [
                  'Send after the initial conversation, not before',
                  'Use the client\'s own words from your discussion when describing the project',
                  'The "not included" section is non-negotiable for complex projects',
                  'Attach to an email with a 3-sentence cover note summarising the key terms',
                ],
              },
            ].map((item) => (
              <div key={item.platform} className="bg-white border border-border rounded-xl p-5">
                <p className="font-semibold text-foreground mb-3">{item.platform}</p>
                <ul className="space-y-2">
                  {item.notes.map((note, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="text-primary font-bold shrink-0">*</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Tool CTA */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Generate a Personalised Proposal Instead of Filling a Template</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Paste the job post. The tool writes 3 proposal variants personalised to the job and your background. No placeholders to fill. No template polish required. No account. Bring your own API key.
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
              { label: 'Upwork proposal examples', href: '/upwork-proposal-examples', desc: '10 real proposals with annotated breakdowns of what made each one work.' },
              { label: 'Upwork cover letter examples', href: '/upwork-cover-letter-examples', desc: 'Cover letter samples across 5 niches with a breakdown of every element.' },
              { label: 'How to write an Upwork proposal', href: '/blog/how-to-write-upwork-proposal', desc: 'The 5-part QDIPC framework top earners use on every bid.' },
              { label: 'How to write an Upwork cover letter', href: '/how-to-write-upwork-cover-letter', desc: 'Step-by-step guide with niche examples for dev, data entry, VA, and more.' },
              { label: 'How to submit a proposal on Upwork', href: '/how-to-submit-proposal-upwork', desc: '10-step walkthrough: bid, cover letter, screening questions, connects, and boost.' },
              { label: 'Proposal length guide', href: '/blog/upwork-proposal-length-guide', desc: 'Short, medium, or detailed: the exact guide for each job type.' },
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
