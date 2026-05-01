'use client'
import { useState, useEffect } from 'react';
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
    headline: 'Upwork Proposal Templates That Win Jobs — Copy, Customise, Send',
    description: '5 copy-paste Upwork proposal templates for every situation: short, medium, detailed, no experience, and high budget. Each template includes a breakdown of what to customise and why.',
    url: 'https://ultimatefreelancers.com/upwork-proposal-template',
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    author: { '@type': 'Person', name: 'Muhammad Younus', url: 'https://ultimatefreelancers.com/about' },
    publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
    about: [
      { '@type': 'Thing', name: 'Upwork proposal template' },
      { '@type': 'Thing', name: 'Upwork cover letter template' },
      { '@type': 'Thing', name: 'Upwork proposal writing' },
    ],
    mentions: [
      { '@type': 'Organization', name: 'Upwork' },
      { '@type': 'Thing', name: 'QDIPC framework' },
    ],
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I customise an Upwork proposal template?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Replace every bracketed placeholder with information from the specific job post. The opening line must reference something unique to that post — the client\'s industry, a phrase they used, a problem they described. The proof point must match the job type. Do not leave generic phrases like "I am a skilled developer" — replace them with specific results: "I built X for Y client, which reduced load time from 6s to 0.9s." A template that sounds like a template gets ignored.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is using a template cheating on Upwork?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Using a structure (template) is not cheating — every experienced freelancer has a mental framework they follow. Sending the identical text to every client is a strategy that fails quickly. Upwork clients read dozens of proposals. The ones that stand out always contain a detail that could only have come from reading their specific post. Use the template as a skeleton, then add the flesh: client-specific details, relevant proof, and a personalised CTA.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best Upwork proposal template?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best Upwork proposal template is one built around the QDIPC framework: Question (an observation tied to the specific job), Diagnosis (the real problem behind the request), Insight (your approach), Package (one relevant past result), CTA (one clear next step). This structure works because it mirrors how clients think — they want to know you understood their problem before they care about your credentials.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long should an Upwork proposal template be?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Short template: 100–150 words for simple one-off tasks (data entry, quick fixes). Medium template: 200–300 words for standard projects. Detailed template: 350–500 words for complex or high-budget work. As a rule: match the effort of the proposal to the complexity of the job. A short task does not need three paragraphs about your background.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use the same Upwork proposal template for every job?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can use the same structure for every job — but the content must change. The opening line, the diagnosis, and the proof point should be specific to each job post. Clients can tell within two sentences whether a proposal was written for them or copied from a template. The structure saves you time. The customisation wins the job.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should I put in the opening line of an Upwork proposal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The opening line should prove you read the post. Reference something specific: the technology they mentioned, the timeline they stated, the problem they described, or even a phrase they used. Examples: "You mentioned you\'ve been through two developers already — that usually means the spec isn\'t clear enough before build starts." Or: "Your site is on WooCommerce 6.2 — the cart abandonment issue you described is almost always a session timeout conflict on shared hosting." Specific beats generic every time.',
        },
      },
    ],
  },
};

const templates = [
  {
    id: 'short',
    label: 'Short Template',
    badge: '100–150 words',
    badgeColor: 'bg-blue-500/10 text-blue-600',
    useCase: 'Best for: simple tasks, data entry, quick fixes, small budgets',
    text: `Hi [Client Name],

[One sentence that references something specific in their job post — a phrase they used, a problem they described, or the technology they mentioned.]

I've handled this before: [one-sentence result from a past project directly relevant to their request — e.g. "I migrated 3 WooCommerce stores to the same stack last month, each in under 48 hours."]

Here's how I'd approach yours:
• [Step 1 — what you'd do first]
• [Step 2 — main work]
• [Step 3 — delivery/QA]

Timeline: [X days]. Happy to start immediately.

[Your Name]`,
    breakdown: [
      { label: 'Opening', note: 'Must reference something unique to this job — not a generic greeting.' },
      { label: 'Proof point', note: 'One specific past result. Numbers if possible. No credential lists.' },
      { label: 'Process', note: 'Three bullets max. Show you have a system, not that you\'re figuring it out.' },
      { label: 'CTA', note: 'State timeline and availability. End the proposal — do not trail off.' },
    ],
  },
  {
    id: 'medium',
    label: 'Medium Template',
    badge: '200–300 words',
    badgeColor: 'bg-emerald-500/10 text-emerald-600',
    useCase: 'Best for: standard projects, web development, design, writing, VA work',
    text: `Hi [Client Name],

[Opening: one sentence referencing something specific in their post — the problem, the tech stack, a phrase they used.]

The real challenge here isn't just [the surface request] — it's [the underlying problem that causes it]. I've seen this pattern with [type of project/client], and it usually comes from [root cause].

What I'd do:
1. [Phase 1 — Discovery or audit]: [what you'd do and what it produces]
2. [Phase 2 — Core work]: [main deliverable and approach]
3. [Phase 3 — Review and delivery]: [how you'd hand it off cleanly]

Relevant proof: [One project directly related to this job]. [Specific result — e.g., "cut page load from 7s to 0.8s" or "tripled organic traffic in 90 days"]. Portfolio: [link or "happy to share on request"].

Before I give you a firm quote, two quick questions:
• [Question that shows you're thinking about their specific situation]
• [Question about scope or timeline that affects your approach]

Timeline: [X days/weeks from kickoff]. Rate: [your rate or "happy to discuss based on your answers"].

[Your Name]`,
    breakdown: [
      { label: 'Opening', note: 'Show you read the post. One sentence.' },
      { label: 'Diagnosis', note: 'The most powerful line in any proposal. Name the real problem. Clients forward proposals that show this.' },
      { label: 'Process', note: 'Numbered phases show structure and reduce the client\'s perceived risk.' },
      { label: 'Proof', note: 'One result. Specific. Directly relevant to their job.' },
      { label: 'Questions', note: 'Two questions max. They signal expertise and start a conversation.' },
    ],
  },
  {
    id: 'detailed',
    label: 'Detailed Template',
    badge: '350–500 words',
    badgeColor: 'bg-purple-500/10 text-purple-600',
    useCase: 'Best for: complex projects, long-term contracts, technical builds, $1,000+ budgets',
    text: `Hi [Client Name],

[Opening: a specific observation about their project that shows deep reading — mention their industry, their stated goal, or a technical detail from the post.]

I've reviewed the requirements carefully. A few things stand out:

[Observation 1: a specific challenge or constraint from their post]
[Observation 2: something they may not have considered but that will affect the outcome]
[Observation 3: a quick win you can offer upfront]

This tells me the core issue is [specific diagnosis]. The solution isn't just [surface deliverable] — it's [deeper approach that addresses root cause].

My approach for this project:

Phase 1 — [Name] ([X days]):
[What you'd do, why it matters, what it produces]

Phase 2 — [Name] ([X days]):
[Main implementation work — specific enough that they understand the scope]

Phase 3 — [Name] ([X days]):
[Quality assurance, revisions, handoff, documentation]

Why this works: [One sentence on the underlying principle of your approach — not credentials, but reasoning.]

Relevant work:
• [Project 1]: [client type] — [specific result with number]
• [Project 2]: [client type] — [specific result with number]
[Portfolio link or offer to share case studies]

Investment: [range or fixed price]. I work milestone-based: [Milestone 1 — X%, Milestone 2 — X%, Final delivery — X%]. No full payment upfront.

Three questions before I confirm scope:
1. [Question about business context or success metric]
2. [Question about timeline or launch deadline]
3. [Question about existing assets — code, designs, content — that affect scope]

Happy to jump on a 15-minute call if that's easier.

[Your Name]`,
    breakdown: [
      { label: 'Observations', note: 'Three specific things from their post. This alone separates you from 90% of proposals.' },
      { label: 'Diagnosis', note: 'Name the root problem. This is the pivot point of the whole proposal.' },
      { label: 'Phased approach', note: 'Phases with time estimates reduce client anxiety about scope and timeline.' },
      { label: 'Dual proof points', note: 'Two results for complex projects. Different client types if possible.' },
      { label: 'Milestone payment', note: 'Stating milestone structure signals professionalism and reduces client risk.' },
      { label: 'Questions', note: 'Three questions for complex projects. Frame them around their outcome, not your convenience.' },
    ],
  },
  {
    id: 'no-experience',
    label: 'No Experience Template',
    badge: 'New to Upwork',
    badgeColor: 'bg-amber-500/10 text-amber-600',
    useCase: 'Best for: first 0–5 jobs on Upwork, building a track record',
    text: `Hi [Client Name],

[One sentence that references something specific in their post — show you actually read it.]

I don't have 50 Upwork reviews yet — but I do have [3 years working at a [type] company / a degree in X / a portfolio project that matches this exactly].

Here's what I built recently that's directly relevant:
[Brief description of a personal, freelance, or employment project that matches their job — include what it was, what you did, and what it produced. Link if possible.]

For your project, I'd approach it like this:
1. [Step 1]
2. [Step 2]
3. [Step 3]

I'm offering a lower rate while I build my Upwork profile — but the output is the same. [One honest sentence on why you're good at this specific thing.]

If you'd like to test me on a small paid task before committing to the full scope, I'm completely open to that.

[Your Name]`,
    breakdown: [
      { label: 'Acknowledge the gap honestly', note: 'Don\'t pretend you have experience you don\'t. Clients notice.' },
      { label: 'Redirect to real evidence', note: 'Employment, education, personal projects, or open source work. Anything concrete.' },
      { label: 'Offer a trial task', note: 'This converts better than any amount of promises. It removes all risk for the client.' },
      { label: 'Rate transparency', note: 'Stating you\'re building your profile is not weakness — it\'s honesty, and clients respect it.' },
    ],
  },
  {
    id: 'high-budget',
    label: 'High Budget Template',
    badge: '$3,000+ projects',
    badgeColor: 'bg-rose-500/10 text-rose-600',
    useCase: 'Best for: large builds, long-term contracts, agency-level work',
    text: `[Client Name],

[One specific observation about their project that demonstrates you understood the business context — not just the deliverable.]

Before I put together a full proposal, I want to make sure I understand the full scope. Three quick questions:

1. [Business context question — what does success look like in 90 days?]
2. [Timeline question — is there a hard launch deadline driving this?]
3. [Assets question — what's already built, designed, or documented that we'd be working from?]

What I bring to projects of this scale:
• [Result 1 — specific, with number, relevant to this job]
• [Result 2 — different angle of proof]
• [Result 3 — process or team capability if relevant]

My process:
— Week 1: [Discovery — what you'd audit, map, or specify]
— Week 2–3: [Core build or Phase 1 implementation]
— Week 4: [Review, iteration, client feedback cycle]
— Week 5: [Final delivery, documentation, handoff]

Investment range: [$X,XXX–$Y,YYY] depending on your answers above. I work milestone-based with clear deliverables at each stage. I'll send a formal Scope of Work before any work begins.

References and case studies available on request.

[Your Name]`,
    breakdown: [
      { label: 'Skip the greeting', note: 'High-budget clients are busy. Get to the point.' },
      { label: 'Lead with questions', note: 'For large projects, questions before pitch signals senior thinking. It\'s how consultants open.' },
      { label: 'Proof in bullets', note: 'Three results. Each one earns its place — if a bullet doesn\'t impress, cut it.' },
      { label: 'Formal process language', note: '"Scope of Work", "milestone-based", "documentation" — language that matches how clients think at this budget.' },
      { label: 'Open-ended investment range', note: 'Give a range, not a fixed price. It opens the door to discussion without anchoring too low.' },
    ],
  },
];

const faqs = [
  {
    q: 'How do I customise an Upwork proposal template?',
    a: 'Replace every bracketed placeholder with information from the specific job post. The opening line must reference something unique to that post — the client\'s industry, a phrase they used, a problem they described. The proof point must match the job type. Do not leave generic phrases like "I am a skilled developer" — replace them with specific results: "I built X for Y client, which reduced load time from 6s to 0.9s." A template that sounds like a template gets ignored.',
  },
  {
    q: 'Is using a template cheating on Upwork?',
    a: 'Using a structure is not cheating — every experienced freelancer has a mental framework they follow. Sending the identical text to every client is a strategy that fails quickly. Upwork clients read dozens of proposals. The ones that stand out always contain a detail that could only have come from reading their specific post. Use the template as a skeleton, then add the flesh: client-specific details, relevant proof, and a personalised CTA.',
  },
  {
    q: 'What is the best Upwork proposal template?',
    a: 'The best Upwork proposal template is built around the QDIPC framework: Question (an observation tied to the specific job), Diagnosis (the real problem behind the request), Insight (your approach), Package (one relevant past result), CTA (one clear next step). This structure works because it mirrors how clients think — they want to know you understood their problem before they care about your credentials.',
  },
  {
    q: 'Which Upwork proposal template length should I use for my job type?',
    a: 'Short: 100–150 words for simple one-off tasks. Medium: 200–300 words for standard projects. Detailed: 350–500 words for complex or high-budget work. Match the effort of the proposal to the complexity of the job. A data entry task does not need three paragraphs about your background.',
  },
  {
    q: 'Can I use the same Upwork proposal template for every job?',
    a: 'You can use the same structure for every job — but the content must change. The opening line, the diagnosis, and the proof point should be specific to each job post. Clients can tell within two sentences whether a proposal was written for them or copied from a template. The structure saves you time. The customisation wins the job.',
  },
  {
    q: 'What should I put in the opening line of an Upwork proposal?',
    a: 'The opening line should prove you read the post. Reference something specific: the technology they mentioned, the timeline they stated, the problem they described, or a phrase they used. Example: "You mentioned you\'ve been through two developers already — that usually means the spec wasn\'t clear before build started." Specific beats generic every time.',
  },
];

export default function UpworkProposalTemplate() {
  useEffect(() => {
    const id = 'schema-upwork-proposal-template';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ultimatefreelancers.com' },
            { '@type': 'ListItem', position: 2, name: 'Free Upwork Proposal Templates', item: 'https://ultimatefreelancers.com/upwork-proposal-template' },
          ],
        },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <>
      <Helmet>
        <title>Free Upwork Proposal Templates | Ultimate Freelancers</title>
        <meta name="description" content="5 copy-paste Upwork proposal templates: short, medium, detailed, no experience, and high budget. Each with a full breakdown and notes on what to customise." />
        <link rel="canonical" href="https://ultimatefreelancers.com/upwork-proposal-template" />
        <meta property="og:title" content="Free Upwork Proposal Templates | Ultimate Freelancers" />
        <meta property="og:description" content="5 copy-paste Upwork proposal templates: short, medium, detailed, no experience, and high budget. Each with a full breakdown and notes on what to customise." />
        <meta property="og:url" content="https://ultimatefreelancers.com/upwork-proposal-template" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema.article)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.faq)}</script>
      </Helmet>


      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              5 Templates — All Free
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Upwork Proposal Templates That Win Jobs
              <span className="block text-primary mt-1">Copy, Customise, Send</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Five ready-to-use Upwork proposal templates — short, medium, detailed, no-experience, and high-budget. Every template includes a line-by-line breakdown of what to customise and why it works.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                <Check className="w-3.5 h-3.5 text-green-500" /> Copy with one click
              </span>
              <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                <Check className="w-3.5 h-3.5 text-green-500" /> QDIPC framework
              </span>
              <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                <Check className="w-3.5 h-3.5 text-green-500" /> Line-by-line breakdown
              </span>
            </div>
          </div>
        </section>

        {/* Quick nav */}
        <section className="py-6 px-4 border-b">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Jump to template</p>
            <div className="flex flex-wrap gap-2">
              {templates.map(t => (
                <a
                  key={t.id}
                  href={`#template-${t.id}`}
                  className="text-sm px-3 py-1.5 rounded-full border hover:bg-muted/50 transition-colors"
                >
                  {t.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Templates */}
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto space-y-16">
            {templates.map((t, idx) => (
              <article key={t.id} id={`template-${t.id}`} className="scroll-mt-20">
                <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">Template {idx + 1}</span>
                    <h2 className="text-xl font-bold mt-0.5">{t.label}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{t.useCase}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                </div>

                {/* Template text */}
                <div className="border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b">
                    <span className="text-xs font-medium text-muted-foreground">Upwork Proposal Template — {t.label}</span>
                    <CopyButton text={t.text} />
                  </div>
                  <pre className="p-5 text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground/90 bg-background">
                    {t.text}
                  </pre>
                </div>

                {/* Breakdown */}
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">What each section does</p>
                  <div className="space-y-2.5">
                    {t.breakdown.map((b, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="font-semibold text-foreground min-w-[110px] shrink-0">{b.label}</span>
                        <span className="text-muted-foreground">{b.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Why templates alone won't work */}
        <section className="py-12 px-4 bg-muted/20 border-y">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Why templates alone won't get you hired</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
              <p>
                Every freelancer on Upwork has access to the same templates. The ones published here, the ones on Reddit, the ones from YouTube videos — clients have seen them all. A proposal that follows the structure but keeps the generic language is still a generic proposal.
              </p>
              <p>
                What separates proposals that get replies is specificity. Not length. Not credentials. Not politeness. Specificity. The opening line that names something from their post. The diagnosis that identifies the real problem, not just the stated one. The proof point that matches their exact situation, not your best project from five years ago.
              </p>
              <p>
                Templates solve the structural problem. They give you a framework so you don't stare at a blank page for 20 minutes per job. But they can't write the specific details for you — those come from reading the post carefully and drawing on your own experience.
              </p>
              <p>
                That's the gap the AI proposal generator below fills. It reads the job post, applies the QDIPC framework, pulls your relevant past projects, and generates three personalised variants — not generic text with placeholders.
              </p>
            </div>
          </div>
        </section>

        {/* Tool CTA */}
        <section className="py-14 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-3">
                Skip the placeholders — generate a personalised proposal in 60 seconds
              </h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Paste the job post. The AI reads it, applies the QDIPC framework, matches your saved projects to the job, and writes three proposal variants — short, medium, and detailed — all customised to that specific client.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
                >
                  Generate My Proposal Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/upwork-proposal-examples"
                  className="inline-flex items-center justify-center gap-2 border font-semibold px-6 py-3 rounded-xl hover:bg-muted/50 transition-colors text-sm"
                >
                  See Real Proposal Examples
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4">No account. No Chrome extension. Bring your own API key (free tier available).</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4 border-t">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Upwork proposal template — frequently asked questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border rounded-xl px-5">
                  <AccordionTrigger className="text-sm font-semibold text-left py-4 hover:no-underline">
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

        {/* Internal links */}
        <section className="py-12 px-4 bg-muted/20 border-t">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-bold mb-5">More Upwork proposal resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/upwork-cover-letter-examples"
                className="group flex items-start gap-3 p-4 border rounded-xl hover:bg-background hover:border-primary/30 transition-all"
              >
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    Upwork Cover Letter Examples
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    10 real samples across web dev, design, writing, VA, and data — with breakdowns.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </Link>
              <Link href="/upwork-proposal-examples"
                className="group flex items-start gap-3 p-4 border rounded-xl hover:bg-background hover:border-primary/30 transition-all"
              >
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    Upwork Proposal Examples
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    10 real proposals with annotated breakdowns — what works and why.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </Link>
              <Link href="/how-to-write-upwork-cover-letter"
                className="group flex items-start gap-3 p-4 border rounded-xl hover:bg-background hover:border-primary/30 transition-all"
              >
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    How to Write an Upwork Cover Letter
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Step-by-step guide: structure, opening lines, length, niche examples.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </Link>
              <Link href="/freelance-proposal-template"
                className="group flex items-start gap-3 p-4 border rounded-xl hover:bg-background hover:border-primary/30 transition-all"
              >
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    Freelance Proposal Template
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Templates for Upwork, Fiverr, email pitches, and Statements of Work.
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
