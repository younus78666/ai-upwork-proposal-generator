'use client'
import { useState } from 'react';
import { Helmet } from '@/lib/helmet-stub';
import { Copy, Check, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
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

const howToSteps = [
  {
    number: 1,
    title: 'Opening line: prove you read the post',
    body: 'The first sentence determines whether the client reads the second. The strongest openers do one of two things: ask a specific question that proves you understood the real requirement, or name a detail from the job post that only someone who read it would know.',
    good: 'Before I commit to a timeline: is this a rebuild of an existing codebase or a greenfield build? The answer changes my estimate by at least a week.',
    bad: 'I am a skilled developer with 5 years of experience and I am very interested in this opportunity.',
    note: 'The good version takes 12 words to prove competence. The bad version takes 23 words and proves nothing.',
  },
  {
    number: 2,
    title: 'Diagnosis: show you understand what is at stake',
    body: 'After the opening, one or two sentences that reframe the problem. Not a restatement of the job post. A deeper understanding of what is actually at risk.',
    good: 'The issue is not missing data. It is that your team is making decisions from stale reports because the sync runs nightly instead of in real time.',
    bad: 'I understand you need a data pipeline built.',
    note: 'The good version shows you thought about the downstream consequence. The bad version just restates the job post.',
  },
  {
    number: 3,
    title: 'Proof point: one specific result, not a skill list',
    body: 'One example. One number. No lists of tools.',
    good: 'I built a similar integration for a SaaS company in March. It reduced their manual reconciliation time from 4 hours per week to 20 minutes.',
    bad: 'I have experience with React, Node.js, PostgreSQL, AWS, Docker, and Kubernetes.',
    note: 'The list of tools is on your profile. The client has already seen it. The proof point is what the tools produced.',
  },
  {
    number: 4,
    title: 'Process: one sentence on how you work',
    body: 'A short description of how you approach work like this. Not a methodology pitch. One sentence that shows you have done this before and know what comes next.',
    good: 'My standard process is a scoping document before I start and a daily async update so you never have to wonder where things stand.',
    bad: 'I follow agile methodology and have excellent communication skills.',
    note: 'The good version is concrete and operational. The bad version is generic to every freelancer on the platform.',
  },
  {
    number: 5,
    title: 'CTA: one frictionless next step',
    body: 'End with something the client can do in one click. A specific question they can answer in 10 words. An offer to share a sample. A proposed call time.',
    good: 'Happy to share the project I mentioned above. Just reply and I will send it over.',
    bad: 'I look forward to hearing from you and hope we can work together.',
    note: 'The good version creates one specific action. The bad version puts all the effort back on the client.',
  },
];

const nicheExamples = [
  {
    id: 'data-entry',
    title: 'Upwork Cover Letter for Data Entry',
    context: 'Job post: 500 invoice PDFs to Google Sheets. Budget: $50.',
    words: 88,
    letter: `Hi [Name],

500 invoices from PDF to Google Sheets: I have completed this type of project 11 times in the past year, most recently for an accounting firm with 1,200 records. Their internal audit confirmed 99.8% accuracy.

One question before I start: are the PDFs text-based or scanned images? Scanned files require OCR pre-processing, which adds 1 to 2 days to the timeline.

I can deliver 100 records per day and am happy to provide a sample batch of 20 first.

[Your Name]`,
    why: [
      'Opens with a specific past project, not "I have data entry experience"',
      'The 99.8% accuracy number is specific and verifiable',
      'The OCR question shows process knowledge the client may not have considered',
      'The sample batch offer removes the risk of hiring someone new',
    ],
  },
  {
    id: 'web-developer',
    title: 'Upwork Cover Letter for Web Developer',
    context: 'Job post: 15-page WordPress rebuild from a Figma file. Budget: $1,500 to $2,500.',
    words: 133,
    letter: `Hi [Name],

Having a Figma file ready is the best possible starting point for this kind of project. Most scope ambiguity on WordPress rebuilds comes from not having one.

Before I confirm the timeline: is there an existing WordPress installation I am rebuilding, or starting from scratch? And is SEO a priority? Page speed, schema markup, and URL structure are much easier to build in from the start than to retrofit after launch.

Recent work: a 12-page portfolio site where I reduced load time from 2.1s to 0.9s, and a 20-page service site with custom post types and ACF integration.

I can build your 15-page site from the Figma file, deliver within 4 weeks, and include a 30-day support window post-launch.

[Your Name]`,
    why: [
      'Opens with a compliment that doubles as proof of expertise',
      'The SEO question shows the freelancer thinks beyond the listed tasks',
      'Both proof points include specific numbers (load time, page count)',
      'Clear deliverable with a timeline and post-launch support',
    ],
  },
  {
    id: 'virtual-assistant',
    title: 'Upwork Cover Letter for Virtual Assistant',
    context: 'Job post: inbox management, calendar scheduling, research. 15 hours per week, ongoing.',
    words: 125,
    letter: `Hi [Name],

From your post, the core of this role is inbox management and calendar scheduling, with research as a third priority. That distinction matters because the first two require real-time responsiveness. Research can be handled in scheduled blocks. I want to confirm your expected response time window before we start.

I have worked as a VA for 4 years. My current client is a real estate investor in the US timezone. I manage two inboxes, three calendars, and weekly deal research. We have worked together for 2 years without a missed deadline.

What tools does your team use for email, calendar, and project management? I want to confirm compatibility before we commit.

Available to start Monday.

[Your Name]`,
    why: [
      'Reorders the job requirements by priority, showing careful reading',
      'The real-time vs. scheduled distinction shows process thinking',
      'Two years with a current client is a strong trust signal',
      'The tools question is practical and specific',
    ],
  },
];

const neverIncludeItems = [
  {
    title: 'Your rate in the opening paragraph',
    body: 'Unless the client explicitly asked for it in the post, mentioning your rate in the first message signals you are competing on price. Clients who care about quality disqualify you immediately. Prove fit first. Rate discussions belong after the first reply.',
  },
  {
    title: 'A list of skills or tools',
    body: 'Your profile already lists your skills. Repeating them in the cover letter wastes space and adds no information. Every other applicant does the same thing. Replace any skill list with one specific proof point.',
  },
  {
    title: 'Copy-paste openers',
    body: 'Clients see the same openers hundreds of times: "I am writing to apply for...", "I believe I am the perfect candidate...", "I am a highly motivated professional with...". They stop reading immediately. If your first sentence could apply to any job on Upwork, rewrite it.',
  },
  {
    title: 'Your full portfolio or CV summary',
    body: 'The cover letter is not the place to describe your entire career. Link to one relevant sample or mention one relevant project. Save the full background for the interview.',
  },
  {
    title: 'Desperation signals',
    body: 'Phrases like "I really need this job" or "I will work for any budget" reduce your perceived value instantly. Even if you genuinely need the work, the cover letter should read like you have options.',
  },
];

const mistakes = [
  {
    title: 'Writing one cover letter and sending it to every job',
    body: 'Clients see generic proposals in the first sentence. The tell: "I am interested in your project and believe I am a great fit." This sentence applies to every job on Upwork. It proves nothing. Every cover letter must reference something specific to that job post.',
  },
  {
    title: 'Burying the best information',
    body: 'Most freelancers open with their name and background, then put the most impressive information three paragraphs down. Clients do not get that far. Put the strongest proof point in the first 50 words.',
  },
  {
    title: 'Treating the cover letter as a formality',
    body: 'Some freelancers assume the client will check their profile and the cover letter is just a box to tick. This is the wrong mental model. The cover letter is the filter. The profile is the confirmation. Clients shortlist from cover letters, then verify against profiles.',
  },
  {
    title: 'Asking too many questions',
    body: 'One smart question invites a reply. Three questions in the opening message feel like an intake form. Pick the single most important question and save the rest for after they respond.',
  },
];

const noExperienceTips = [
  {
    number: 1,
    title: 'Use transferable work',
    body: 'A student who has completed 5 academic web projects has evidence. A career-changer who spent 3 years managing email inboxes in a corporate job has VA evidence. Find what you have done that mirrors what the client needs.',
  },
  {
    number: 2,
    title: 'Offer a sample or test task',
    body: '"I have not done this on Upwork before, but I have built similar projects independently. I am happy to complete a small paid test so you can see my work before committing." This is honest and removes risk.',
  },
  {
    number: 3,
    title: 'Address it early and move past it',
    body: 'Do not dedicate the whole cover letter to apologising for inexperience. One sentence of acknowledgment, then immediately pivot to what you can do.',
  },
  {
    number: 4,
    title: 'Start with smaller jobs to build a track record',
    body: 'A $25 data entry job that earns a 5-star review is worth more on Upwork than 5 years of unlisted experience. Once you have 3 to 5 reviews, your cover letters work differently.',
  },
];

const faqs = [
  {
    q: 'How do I start an Upwork cover letter?',
    a: 'Start with a specific observation or question that proves you read the actual job post, not just the title. For example: "Before I outline my approach: is this a greenfield build or a rebuild of an existing system? The answer changes the timeline by at least a week." Never open with your name, your title, or "I am writing to express my interest."',
  },
  {
    q: 'Should an Upwork cover letter be formal?',
    a: 'No. The most effective Upwork cover letters are direct and conversational, not formal. Write the way you would speak in a professional meeting: clear, specific, and confident. Formal language signals template use and gets skipped.',
  },
  {
    q: 'How long should an Upwork cover letter be?',
    a: '100 to 200 words for most jobs. Short enough that the client reads every word, long enough to prove fit. Proposals under 200 words are read in full significantly more often than proposals over 400 words. Save the detailed breakdown for your first call.',
  },
  {
    q: 'What is the difference between an Upwork cover letter and a proposal?',
    a: 'Nothing. Upwork labels the text field "Cover Letter" in their interface. Freelancers call the same thing a proposal, a bid, or an application. The terms are interchangeable. This page uses both, and the advice applies to either.',
  },
  {
    q: 'Can I write a good Upwork cover letter with no experience?',
    a: 'Yes, but not by hiding the lack of experience. Address it directly: explain what transferable work you have done, offer a sample or a small paid test, and reduce the perceived risk of hiring you. Clients do not expect a portfolio from every applicant. They expect honesty and evidence of capability.',
  },
  {
    q: 'How many connects does submitting an Upwork proposal cost?',
    a: 'Between 2 and 16 connects per proposal, depending on the job post. Upwork displays the connect cost before you submit. Standard jobs cost 2 to 6 connects. Jobs marked as requiring more screening or with higher budgets cost more. Boosted proposals cost additional connects on top of the base cost.',
  },
];

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://ultimatefreelancers.com/how-to-write-upwork-cover-letter#article',
      headline: 'How to Write an Upwork Cover Letter That Gets Replies (2026)',
      description:
        'Step-by-step guide to writing an Upwork cover letter clients actually read. Structure, opening lines, length rules, niche examples for web dev, data entry, VA, and no-experience freelancers.',
      url: 'https://ultimatefreelancers.com/how-to-write-upwork-cover-letter',
      datePublished: '2026-04-27',
      dateModified: '2026-04-27',
      author: {
        '@type': 'Person',
        '@id': 'https://ultimatefreelancers.com/about#person',
        name: 'Muhammad Younus',
        url: 'https://ultimatefreelancers.com/about',
      },
      publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
      image: 'https://ultimatefreelancers.com/og-image.png',
      inLanguage: 'en-US',
      articleSection: 'Upwork Proposals',
      about: [
        { '@type': 'Thing', name: 'Upwork cover letter', sameAs: 'https://en.wikipedia.org/wiki/Cover_letter' },
        { '@type': 'Organization', name: 'Upwork', sameAs: 'https://en.wikipedia.org/wiki/Upwork' },
      ],
      mentions: [
        { '@type': 'Thing', name: 'freelance proposal' },
        { '@type': 'Thing', name: 'screening questions' },
        { '@type': 'Thing', name: 'Upwork connects' },
        { '@type': 'Occupation', name: 'Freelancer' },
        { '@type': 'Occupation', name: 'Web Developer' },
        { '@type': 'Occupation', name: 'Virtual Assistant' },
        { '@type': 'Occupation', name: 'Data Entry Specialist' },
      ],
    },
    {
      '@type': 'HowTo',
      name: 'How to Write an Upwork Cover Letter',
      description: 'The 5-part structure for writing an Upwork cover letter that gets client replies.',
      totalTime: 'PT15M',
      step: howToSteps.map((s) => ({
        '@type': 'HowToStep',
        position: s.number,
        name: s.title,
        text: s.body,
      })),
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ultimatefreelancers.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'How to Write an Upwork Cover Letter',
          item: 'https://ultimatefreelancers.com/how-to-write-upwork-cover-letter',
        },
      ],
    },
  ],
};

export default function HowToWriteUpworkCoverLetter() {
  return (
    <>
      <Helmet>
        <title>How to Write an Upwork Cover Letter | Ultimate Freelancers</title>
        <meta
          name="description"
          content="Step-by-step guide to writing an Upwork cover letter. Structure, opening lines, length rules, and niche examples for web dev, data entry, VA, and beginners."
        />
        <link rel="canonical" href="https://ultimatefreelancers.com/how-to-write-upwork-cover-letter" />
        <meta property="og:title" content="How to Write an Upwork Cover Letter | Ultimate Freelancers" />
        <meta
          property="og:description"
          content="Step-by-step guide to writing an Upwork cover letter. Structure, opening lines, length rules, and niche examples for web dev, data entry, VA, and beginners."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ultimatefreelancers.com/how-to-write-upwork-cover-letter" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="og:site_name" content="Ultimate Freelancers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Write an Upwork Cover Letter | Ultimate Freelancers" />
        <meta
          name="twitter:description"
          content="Step-by-step guide to writing an Upwork cover letter. Structure, opening lines, length rules, and niche examples for web dev, data entry, VA, and beginners."
        />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="article:published_time" content="2026-04-27" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">

        <main>
          {/* Hero */}
          <section className="py-14 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  How to Write an Upwork Cover Letter
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight">
                  How to Write an Upwork Cover Letter{' '}
                  <span className="text-gradient">That Clients Actually Read</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Most freelancers spend more time writing their Upwork cover letter than clients spend
                  reading it. The average client reviews 30 to 50 proposals per job. They spend 10 to
                  15 seconds on each one before deciding to read further or move on. The cover letter
                  is where that decision happens.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  This guide covers the exact structure, what to include, what to cut, how long it
                  should be, and how to adapt for specific niches including web development, data
                  entry, and virtual assistance. If you want to see the finished product first, the{' '}
                  <Link href="/upwork-cover-letter-examples" className="text-primary hover:underline font-medium">
                    real Upwork cover letter examples
                  </Link>{' '}
                  page has 10 copy-ready samples with the job posts they responded to.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Stat: </span>
                  Proposals under 200 words are read in full 3x more often than proposals over 400
                  words.
                </div>
              </div>
            </div>
          </section>

          {/* Section 1: Cover letter vs proposal */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Upwork Cover Letter vs Proposal: What Is the Difference?
                </h2>
                <p className="text-muted-foreground mb-3">Nothing. The words are interchangeable.</p>
                <p className="text-muted-foreground mb-3">
                  Upwork labels the text field "Cover Letter" in their interface when you submit a bid.
                  Freelancers call the same thing a proposal, a bid, or an application. Clients call it
                  whatever they want. The content, the structure, and the strategy are identical
                  regardless of what you call it.
                </p>
                <p className="text-muted-foreground">
                  On this page, both terms refer to the text you write when applying for an Upwork job.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: 5-Part Structure */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  The 5-Part Structure of a Winning Upwork Cover Letter
                </h2>
                <p className="text-muted-foreground mb-8">
                  There is no single template that wins every job. But there is a structure that the
                  best-performing proposals share. It has five parts.
                </p>

                <div className="space-y-6">
                  {howToSteps.map((step) => (
                    <div key={step.number} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-primary-foreground">{step.number}</span>
                        </div>
                        <h3 className="font-bold text-foreground text-base">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.body}</p>
                      <div className="grid sm:grid-cols-2 gap-3 mb-3">
                        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                          <div className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Good</div>
                          <p className="text-sm text-foreground leading-relaxed italic">"{step.good}"</p>
                        </div>
                        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                          <div className="text-xs font-semibold text-destructive mb-2 uppercase tracking-wide">Bad</div>
                          <p className="text-sm text-muted-foreground leading-relaxed line-through decoration-destructive/40 italic">
                            "{step.bad}"
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground bg-secondary/60 rounded-lg px-3 py-2 leading-relaxed">
                        {step.note}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-5 bg-primary/5 border border-primary/20 rounded-xl text-sm text-muted-foreground">
                  Want to see this structure applied across 10 real job posts?{' '}
                  <Link href="/upwork-cover-letter-examples" className="text-primary font-medium hover:underline">
                    Browse the cover letter examples
                  </Link>{' '}
                  with full job post context and breakdowns.
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: What to include */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  What to Include in Your Upwork Cover Letter
                </h2>
                <p className="text-muted-foreground mb-6">Use this as a checklist before you submit.</p>

                <div className="bg-card rounded-2xl border border-border p-6 mb-4">
                  <div className="text-sm font-semibold text-foreground mb-4">Required</div>
                  <div className="space-y-3">
                    {[
                      'One detail that proves you read the actual job post (not just the title)',
                      "A reframe of the client's real problem or goal",
                      'One specific proof point with a measurable result',
                      'A brief description of how you work (one or two sentences)',
                      'One question or frictionless next step',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border-2 border-primary/40 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="text-sm font-semibold text-foreground mb-4">Optional but effective</div>
                  <div className="space-y-3">
                    {[
                      'A specific observation about something in their post most applicants would miss',
                      'A risk-reduction offer (sample, test task, staged payment milestone)',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border-2 border-border flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: What never to include */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  What to Never Include in Your Upwork Cover Letter
                </h2>
                <p className="text-muted-foreground mb-8">
                  These five things are in the majority of proposals that go unanswered.
                </p>

                <div className="space-y-4">
                  {neverIncludeItems.map((item, i) => (
                    <div key={item.title} className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-destructive">{i + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm mb-1">{item.title}</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">{item.body}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  For a deeper breakdown of what causes proposals to go unanswered, see{' '}
                  <Link href="/blog/upwork-proposal-not-getting-replies" className="text-primary hover:underline font-medium">
                    why your proposals are not getting replies
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Length */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Upwork Cover Letter Length: How Short Is Too Short?
                </h2>
                <p className="text-muted-foreground mb-6">
                  The right length depends on the job. Here is the decision framework.
                </p>

                <div className="overflow-x-auto rounded-xl border border-border bg-card mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Length</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">Word count</th>
                        <th className="text-left px-4 py-3 font-semibold text-foreground">When to use</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { length: 'Short', range: '50-100 words', use: 'High-competition posts, leading with a question' },
                        { length: 'Medium', range: '100-200 words', use: 'Most job posts (recommended default)' },
                        { length: 'Detailed', range: '200-400 words', use: 'Complex projects, high-budget engagements, invitations' },
                        { length: 'Long', range: '400+ words', use: 'Almost never' },
                      ].map((row, i) => (
                        <tr key={row.length} className={`border-b border-border last:border-0 ${i === 3 ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-3 font-medium text-foreground">{row.length}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.range}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-muted-foreground mb-3">
                  The medium range (100 to 200 words) is the right default for most jobs. Short enough
                  that the client reads every word. Long enough to demonstrate real understanding and
                  include one proof point.
                </p>
                <p className="text-muted-foreground mb-3">
                  Short proposals (under 100 words) work well when the opening question is strong enough
                  to earn a reply on its own. They fail when they are short because the freelancer ran
                  out of things to say, not because they chose brevity strategically.
                </p>
                <p className="text-muted-foreground">
                  Long proposals (over 400 words) are almost always a mistake. They signal insecurity:
                  the freelancer tries to win by exhausting the reader with information. For the full
                  breakdown on length by job type, see the{' '}
                  <Link href="/blog/upwork-proposal-length-guide" className="text-primary hover:underline font-medium">
                    Upwork proposal length guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Section 6-8: Niche examples */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Upwork Cover Letter Examples by Niche
                </h2>
                <p className="text-muted-foreground mb-10">
                  The same 5-part structure adapts to any niche. These three examples show it applied
                  to data entry, web development, and virtual assistance.
                </p>

                <div className="space-y-10">
                  {nicheExamples.map((ex) => (
                    <div key={ex.id}>
                      <h3 className="text-xl font-bold text-foreground mb-2">{ex.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        <span className="font-medium text-foreground">Context:</span> {ex.context}
                      </p>
                      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
                        <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40 border-b border-border">
                          <span className="text-sm font-semibold text-foreground">
                            Cover Letter{' '}
                            <span className="text-xs font-normal text-muted-foreground ml-2">
                              {ex.words} words
                            </span>
                          </span>
                          <CopyButton text={ex.letter} />
                        </div>
                        <pre className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                          {ex.letter}
                        </pre>
                      </div>
                      <div className="bg-green-500/5 border border-green-500/20 rounded-xl px-5 py-4">
                        <div className="text-sm font-semibold text-foreground mb-3">Why It Works</div>
                        <ul className="space-y-2">
                          {ex.why.map((point) => (
                            <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: No experience */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Upwork Cover Letter With No Experience: How to Handle It
                </h2>
                <p className="text-muted-foreground mb-8">
                  No experience does not mean no case. It means the evidence is in a different place.
                </p>

                <div className="space-y-4 mb-8">
                  {noExperienceTips.map((tip) => (
                    <div key={tip.number} className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-primary">{tip.number}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm mb-1">{tip.title}</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">{tip.body}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">Example opening for a no-experience applicant</span>
                    <CopyButton text={`Hi [Name],\n\nI have not yet completed paid projects on Upwork, but I have built 4 React applications independently, including one with a very similar dashboard structure to what you described. I am happy to share the code and a short video walkthrough.\n\nOne question before I write a full proposal...`} />
                  </div>
                  <pre className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">{`Hi [Name],

I have not yet completed paid projects on Upwork, but I have built 4 React applications independently, including one with a very similar dashboard structure to what you described. I am happy to share the code and a short video walkthrough.

One question before I write a full proposal...`}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Section 10: Screening questions */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  How to Answer Upwork Screening Questions
                </h2>
                <p className="text-muted-foreground mb-4">
                  Many job posts include screening questions alongside the cover letter field. These are
                  separate from the cover letter and should be treated separately.
                </p>
                <p className="text-muted-foreground mb-4">Common screening questions:</p>
                <ul className="space-y-2 mb-6">
                  {[
                    '"What experience do you have with [specific tool]?"',
                    '"What is your availability?"',
                    '"Describe your approach to [specific task]."',
                    '"What is your hourly rate?"',
                  ].map((q) => (
                    <li key={q} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                      {q}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mb-3">
                  The same principles apply: be specific, cite proof, avoid generic answers. "I have
                  extensive experience with X" is the worst possible answer. "I integrated X into 3
                  production applications, most recently [brief description]" is the correct format.
                </p>
                <p className="text-muted-foreground">
                  For a full breakdown with 10 example questions and model answers, see{' '}
                  <Link href="/blog/how-to-answer-upwork-screening-questions"
                    className="text-primary hover:underline font-medium"
                  >
                    how to answer Upwork screening questions
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Section 11: Mistakes */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Common Upwork Cover Letter Mistakes That Cost Replies
                </h2>
                <p className="text-muted-foreground mb-8">
                  These four patterns appear in the majority of proposals that go unanswered.
                </p>

                <div className="space-y-4">
                  {mistakes.map((m, i) => (
                    <div key={m.title} className="bg-card rounded-xl border border-border p-5">
                      <div className="font-semibold text-foreground text-sm mb-2">
                        Mistake {i + 1}: {m.title}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.body}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  The{' '}
                  <Link href="/blog/upwork-proposal-not-getting-replies"
                    className="text-primary hover:underline font-medium"
                  >
                    Upwork proposal mistakes guide
                  </Link>{' '}
                  covers 6 specific patterns with a fix for each one.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12: Tool CTA */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Generate a Personalised Upwork Cover Letter in 60 Seconds
                </h2>
                <p className="text-muted-foreground mb-6">
                  Paste your job post. Get 3 personalised variants (Short, Medium, and Detailed) in
                  under a minute. Each uses the 5-part structure on this page. Free, no account
                  required. Bring your own API key (OpenAI, Claude, Gemini, or Groq, all with free
                  tiers).
                </p>
                <Link href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Generate My Cover Letter Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Section 13: Related resources */}
          <section className="py-10 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">Related Guides</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      href: '/upwork-cover-letter-examples',
                      title: '10 Real Upwork Cover Letter Examples',
                      desc: 'Copy-ready samples across 5 niches with job post context and breakdowns',
                    },
                    {
                      href: '/blog/how-to-write-upwork-proposal',
                      title: 'How to Write an Upwork Proposal',
                      desc: 'The full 5-part framework with examples of what works and why',
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
                    <Link
                      key={r.href}
                      href={r.href}
                      className="group p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                        {r.title} →
                      </div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 14: FAQ */}
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
