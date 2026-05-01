'use client'
import { useEffect } from 'react';
import { Helmet } from '@/lib/helmet-stub';
import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const schema = {
  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Write an Upwork Proposal That Gets Replies (Step-by-Step 2026)',
    description: 'A step-by-step guide to writing Upwork proposals that get replies. Covers the 5-part QDIPC structure, opening lines, screening questions, common mistakes, and real good vs bad examples.',
    url: 'https://ultimatefreelancers.com/how-to-write-upwork-proposal',
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    author: { '@type': 'Person', name: 'Muhammad Younus', url: 'https://ultimatefreelancers.com/about' },
    publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
    about: [
      { '@type': 'Thing', name: 'Upwork proposal writing' },
      { '@type': 'Thing', name: 'Upwork cover letter' },
      { '@type': 'Thing', name: 'Freelance proposal' },
    ],
    mentions: [
      { '@type': 'Organization', name: 'Upwork' },
      { '@type': 'Thing', name: 'QDIPC framework' },
    ],
  },
  howTo: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Write an Upwork Proposal That Gets Replies',
    description: 'Step-by-step guide to writing winning Upwork proposals using the QDIPC framework.',
    step: [
      { '@type': 'HowToStep', name: 'Write a specific opening line', text: 'Prove you read the post by referencing something specific — a phrase they used, a problem they described, or the technology they mentioned.' },
      { '@type': 'HowToStep', name: 'Diagnose the real problem', text: 'Identify the underlying issue behind the surface request. Clients hire the freelancer who names their real problem, not just the stated one.' },
      { '@type': 'HowToStep', name: 'Show your process', text: 'Describe your approach in 2–4 steps. Clients want to see a system, not a list of skills.' },
      { '@type': 'HowToStep', name: 'Reference one relevant project', text: 'Add one past result directly related to this job. Specific numbers beat vague claims every time.' },
      { '@type': 'HowToStep', name: 'End with one clear CTA', text: 'Ask one question or suggest one next step. Never end with "let me know if you have questions."' },
    ],
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Why is my Upwork proposal not getting replies?',
        acceptedAnswer: { '@type': 'Answer', text: 'The most common reasons: (1) The opening line is generic — it could have been written for any job. (2) The proposal leads with your background instead of the client\'s problem. (3) No specific proof point — credentials without results are not convincing. (4) The proposal is too long for the job complexity. (5) You\'re applying to jobs where your profile doesn\'t yet have relevant work. Fix the opening line first — that single change improves reply rates more than any other edit.' },
      },
      {
        '@type': 'Question',
        name: 'How long should an Upwork proposal be?',
        acceptedAnswer: { '@type': 'Answer', text: 'Match length to complexity. Short tasks (data entry, quick fixes): 100–150 words. Standard projects: 200–300 words. Complex or high-budget work: 300–500 words. The most common mistake is writing 400 words for a $50 task. Clients don\'t read past their attention threshold — match your length to their expectation.' },
      },
      {
        '@type': 'Question',
        name: 'What is the QDIPC framework for Upwork proposals?',
        acceptedAnswer: { '@type': 'Answer', text: 'QDIPC stands for: Question (an observation tied to the specific job post), Diagnosis (the real problem behind the stated request), Insight (your approach for this type of work), Package (one specific past result relevant to the job), CTA (one clear next step or question). This structure works because it mirrors how clients read proposals — they want evidence you understood their situation before they care about your qualifications.' },
      },
      {
        '@type': 'Question',
        name: 'How should I answer Upwork screening questions?',
        acceptedAnswer: { '@type': 'Answer', text: 'Answer each screening question directly and specifically. If the client asks "have you done X before?" — give one sentence of yes/no plus one proof point. If they ask for a sample or approach — give a real answer, not "it depends." Clients add screening questions to filter out freelancers who send templated proposals. A specific, thoughtful answer to a screening question often matters more than the proposal body.' },
      },
      {
        '@type': 'Question',
        name: 'Should I include my hourly rate in an Upwork proposal?',
        acceptedAnswer: { '@type': 'Answer', text: 'For fixed-price jobs: mention a range only if you have enough information to be accurate. For hourly jobs: your profile rate is already visible, so you don\'t need to repeat it. For high-budget projects: avoid anchoring with a number before you understand the full scope — ask the clarifying questions first. Including a rate too early shifts the conversation to price before the client sees your value.' },
      },
      {
        '@type': 'Question',
        name: 'What is the best opening line for an Upwork proposal?',
        acceptedAnswer: { '@type': 'Answer', text: 'The best opening line references something specific from the job post that proves you read it. Examples: "You mentioned you\'ve had the site rebuilt twice — that usually means the brief wasn\'t specific enough before build started." Or: "The 6-month timeline you mentioned is tight for a full rebrand, but it\'s doable if visual identity is locked in month one." Generic openings like "I am an experienced developer" are ignored immediately.' },
      },
    ],
  },
};

const steps = [
  {
    number: '01',
    title: 'The opening line — prove you read the post',
    intro: 'Most proposals open with "Hi, I am a [job title] with X years of experience." Clients have read this sentence thousands of times. They stop reading.',
    body: `The opening line has one job: prove you read their specific post. Not proposals in general — this one, right now.

Reference something unique to their post: a phrase they used, a constraint they mentioned, a problem they described, a technology they named. The more specific, the better.`,
    good: {
      label: 'Good opening',
      text: '"You mentioned the checkout flow breaks on mobile for orders over $200 — that\'s almost always a payment gateway session timeout, not a code issue."',
      note: 'Client thinks: this person understood my problem immediately.',
    },
    bad: {
      label: 'Bad opening',
      text: '"Hello, I am a skilled web developer with 7 years of experience in WordPress, WooCommerce, PHP, and JavaScript. I can help you with your project."',
      note: 'Client thinks: copy-paste. Next.',
    },
  },
  {
    number: '02',
    title: 'Diagnose the real problem',
    intro: 'Clients describe symptoms, not root causes. The job post says "fix my checkout." The real problem might be a hosting config, a plugin conflict, or a UX issue that\'s been misread as a bug.',
    body: `Name the real problem behind the surface request. This is the single highest-leverage sentence in any proposal. Clients don\'t just hire someone to do the task — they hire someone who understood what the task is really about.

You don\'t need to be right. You need to be specific and thoughtful. A diagnosis that turns out to be slightly off is still better than a proposal that doesn\'t attempt one.`,
    good: {
      label: 'Good diagnosis',
      text: '"The real issue here isn\'t the widget — it\'s that your product data isn\'t structured for the filter logic you\'re trying to run. A new widget won\'t fix that. A schema restructure will."',
      note: 'Client thinks: this freelancer is thinking about my actual situation.',
    },
    bad: {
      label: 'Bad diagnosis',
      text: '"I can help you with this project. I have extensive experience with similar tasks and will deliver high-quality results."',
      note: 'No diagnosis attempted. No reason to choose this person over anyone else.',
    },
  },
  {
    number: '03',
    title: 'Show your process, not your CV',
    intro: 'Skills lists are ignored. "I know PHP, WordPress, React, Node.js, AWS, Figma, SEO, and more" tells the client nothing about whether you\'ll solve their problem.',
    body: `Replace the skills list with a 2–4 step process for their specific project. Describe what you\'d do in each phase, what it produces, and why it matters.

A clear process reduces the client\'s perceived risk. They\'re not just buying a result — they\'re buying confidence that someone has a plan. A freelancer with a defined process looks like a professional. A list of skills looks like everyone else.`,
    good: {
      label: 'Good process',
      text: '"Here\'s how I\'d approach this:\n1. Audit: I\'ll map the current data structure and identify the three most likely causes.\n2. Build: Fix in staging first, test across devices.\n3. Deploy: Push to production with a 48h monitoring window.\nTimeline: 3–4 days."',
      note: 'Client can visualise how the work will happen.',
    },
    bad: {
      label: 'Bad process',
      text: '"I am proficient in HTML, CSS, JavaScript, React, Vue, PHP, WordPress, WooCommerce, Shopify, and many more technologies. I always deliver on time."',
      note: 'Skills list. No process. No timeline. Nothing specific.',
    },
  },
  {
    number: '04',
    title: 'Reference one relevant project',
    intro: 'One specific past result beats ten vague claims. "I have extensive experience" is not evidence. "I reduced cart abandonment by 34% for a UK skincare brand by fixing a session timeout on shared hosting" is.',
    body: `Pick one past project that is directly relevant to this job. Describe what it was, what you did, and what the result was — with a number if possible.

If you don\'t have a directly relevant project, pick the closest thing and name the transferable element. If you\'re new to Upwork, use employment work, personal projects, or academic projects.

Keep it to two or three sentences. The goal is credibility, not a case study.`,
    good: {
      label: 'Good proof point',
      text: '"I did this exact migration for a WooCommerce store in Sydney last year — 4,200 SKUs, 3 custom shipping zones. Moved without a single order lost and completed in 6 days. Happy to share the case study."',
      note: 'Specific. Relevant. Numbers. Offer of proof.',
    },
    bad: {
      label: 'Bad proof point',
      text: '"I have worked on many similar projects and my clients are always satisfied with my work. Please check my Upwork profile for reviews."',
      note: 'Vague. Generic. "Check my profile" is lazy — bring the proof to them.',
    },
  },
  {
    number: '05',
    title: 'One clear CTA',
    intro: 'Every proposal needs to end with a next step. "Let me know if you have any questions" is not a CTA — it\'s a shrug.',
    body: `Ask one specific question or suggest one specific next step. The question should be intelligent — something that shows you\'ve thought about their project and need one piece of information to move forward.

Alternatively, propose a concrete action: "Happy to jump on a 15-minute call" or "I can send you a rough scope doc by tomorrow." One thing. Not three options.

The CTA closes the loop. Without it, the client reads to the end and has no signal about what to do next.`,
    good: {
      label: 'Good CTA',
      text: '"One question before I give you a firm timeline: is the site currently on shared hosting or a VPS? That changes my approach. Happy to start as soon as I hear back."',
      note: 'Specific question. Shows you\'re already thinking. Signals readiness.',
    },
    bad: {
      label: 'Bad CTA',
      text: '"I look forward to working with you. Please feel free to reach out if you need any clarification or have any questions. Thank you for your consideration."',
      note: 'Three sentences that say nothing. No question. No action. No reason to reply.',
    },
  },
];

const mistakes = [
  {
    title: 'Starting with "I"',
    detail: 'Proposals that begin with "I am..." are self-focused from the first word. Start with the client\'s situation, not your background.',
  },
  {
    title: 'Copying the job title back verbatim',
    detail: '"I saw your post for a WordPress developer and I am a WordPress developer." The client knows what they posted. Use that sentence to say something useful instead.',
  },
  {
    title: 'Skills lists instead of results',
    detail: '"I know PHP, MySQL, React, Vue, Node..." — everyone applying to this job has a similar list. Replace it with one specific result.',
  },
  {
    title: 'Proposals longer than the job deserves',
    detail: 'A 500-word proposal for a $30 task signals poor judgement about scope. Match your length to the project complexity.',
  },
  {
    title: 'Ending without a CTA',
    detail: '"Looking forward to hearing from you" is not an invitation to respond. Ask a question or propose a next step.',
  },
  {
    title: 'Ignoring screening questions',
    detail: 'Clients add screening questions specifically to filter lazy proposals. A thoughtful answer to a screening question often matters more than the proposal body.',
  },
  {
    title: 'Attaching a CV or portfolio PDF unprompted',
    detail: 'If they didn\'t ask, don\'t attach. It reads as "I didn\'t customise this." Link to a portfolio URL instead and let them choose to look.',
  },
];

const faqs = [
  {
    q: 'Why is my Upwork proposal not getting replies?',
    a: 'The most common reasons: (1) The opening line is generic — it could have been written for any job. (2) The proposal leads with your background instead of the client\'s problem. (3) No specific proof point — credentials without results aren\'t convincing. (4) The proposal is too long for the job complexity. (5) You\'re applying to jobs where your profile doesn\'t yet have relevant work. Fix the opening line first — that single change improves reply rates more than any other edit.',
  },
  {
    q: 'How long should an Upwork proposal be?',
    a: 'Match length to complexity. Short tasks (data entry, quick fixes): 100–150 words. Standard projects: 200–300 words. Complex or high-budget work: 300–500 words. The most common mistake is writing 400 words for a $50 task.',
  },
  {
    q: 'What is the QDIPC framework for Upwork proposals?',
    a: 'QDIPC: Question (an observation tied to the specific job post), Diagnosis (the real problem behind the stated request), Insight (your approach), Package (one specific past result), CTA (one clear next step). This structure works because it mirrors how clients read proposals — they want evidence you understood their situation before they care about your credentials.',
  },
  {
    q: 'How should I answer Upwork screening questions?',
    a: 'Answer each screening question directly and specifically. Clients add screening questions to filter out templated proposals. A specific, thoughtful answer to a screening question often matters more than the proposal body.',
  },
  {
    q: 'Should I include my rate in an Upwork proposal?',
    a: 'For fixed-price jobs: only mention a range if you have enough information to be accurate. For hourly jobs: your profile rate is already visible. For high-budget projects: avoid anchoring with a number before you understand the full scope — ask clarifying questions first.',
  },
  {
    q: 'What is the best opening line for an Upwork proposal?',
    a: 'The best opening line references something specific from the job post. Examples: "You mentioned you\'ve had the site rebuilt twice — that usually means the brief wasn\'t specific enough before build started." Generic openings like "I am an experienced developer" are ignored immediately.',
  },
];

export default function HowToWriteUpworkProposal() {
  useEffect(() => {
    const id = 'schema-how-to-write-upwork-proposal';
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
            { '@type': 'ListItem', position: 2, name: 'How to Write an Upwork Proposal', item: 'https://ultimatefreelancers.com/how-to-write-upwork-proposal' },
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
        <title>How to Write an Upwork Proposal | Ultimate Freelancers</title>
        <meta name="description" content="Step-by-step guide to writing Upwork proposals. The 5-part QDIPC structure, opening lines, screening questions, and real examples of good vs bad proposals." />
        <link rel="canonical" href="https://ultimatefreelancers.com/how-to-write-upwork-proposal" />
        <meta property="og:title" content="How to Write an Upwork Proposal | Ultimate Freelancers" />
        <meta property="og:description" content="The 5-part QDIPC structure for writing Upwork proposals that get replies. Real good vs bad examples, screening question tips, and common mistakes to avoid." />
        <meta property="og:url" content="https://ultimatefreelancers.com/how-to-write-upwork-proposal" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema.article)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.howTo)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.faq)}</script>
      </Helmet>


      <main className="min-h-screen bg-background">

        {/* Hero */}
        <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              Step-by-Step Guide — 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How to Write an Upwork Proposal That Gets Replies
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mb-6">
              Most Upwork proposals fail in the first sentence. This guide covers the 5-part structure used by top-rated freelancers — with real good vs bad examples at every step.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {['5-step QDIPC structure', 'Good vs bad examples', 'Screening question tips', 'Common mistakes'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                  <Check className="w-3.5 h-3.5 text-green-500" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* QDIPC overview */}
        <section className="py-10 px-4 border-b">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-2">The 5-part structure of every winning Upwork proposal</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Every proposal that gets a reply has five elements — in this order. Skip one and the whole thing weakens.
            </p>
            <div className="grid sm:grid-cols-5 gap-3">
              {[
                { letter: 'Q', label: 'Question', desc: 'An observation tied to their specific post' },
                { letter: 'D', label: 'Diagnosis', desc: 'The real problem behind the request' },
                { letter: 'I', label: 'Insight', desc: 'Your approach for this type of work' },
                { letter: 'P', label: 'Package', desc: 'One specific past result' },
                { letter: 'C', label: 'CTA', desc: 'One clear next step' },
              ].map(item => (
                <div key={item.letter} className="text-center p-4 border rounded-xl bg-muted/20">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-2">
                    {item.letter}
                  </div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto space-y-16">
            {steps.map((step) => (
              <article key={step.number} className="scroll-mt-20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0">
                    {step.number}
                  </span>
                  <h2 className="text-xl font-bold">{step.title}</h2>
                </div>

                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{step.intro}</p>
                <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed mb-6">
                  {step.body.split('\n\n').map((para, i) => (
                    <p key={i} className="text-muted-foreground mb-3">{para}</p>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Good */}
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">{step.good.label}</span>
                    </div>
                    <p className="text-sm font-medium italic text-foreground/80 mb-3 leading-relaxed whitespace-pre-line">
                      {step.good.text}
                    </p>
                    <p className="text-xs text-muted-foreground border-t border-green-500/20 pt-2">{step.good.note}</p>
                  </div>
                  {/* Bad */}
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">{step.bad.label}</span>
                    </div>
                    <p className="text-sm font-medium italic text-foreground/80 mb-3 leading-relaxed">
                      {step.bad.text}
                    </p>
                    <p className="text-xs text-muted-foreground border-t border-red-500/20 pt-2">{step.bad.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Screening questions */}
        <section className="py-12 px-4 bg-muted/20 border-y">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">How to answer Upwork screening questions</h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Clients add screening questions to filter out freelancers who send the same proposal to every job. A thoughtful, specific answer to a screening question often carries more weight than the entire proposal body.
            </p>
            <div className="space-y-5">
              {[
                {
                  q: '"Do you have experience with [specific tool/technology]?"',
                  a: 'Answer directly: yes or no, then one proof point. Do not say "I am familiar with" — either you\'ve used it on a real project or you haven\'t. "Yes — I\'ve used [tool] for [X type of project]. Most recently for [brief example]." If the answer is no: "Not with [tool] specifically, but I\'ve used [comparable tool] to achieve the same outcome. Here\'s how: [brief example]."',
                },
                {
                  q: '"Please share a sample of relevant work."',
                  a: 'Link to one specific example — not your full portfolio. Choose the project most similar to their job. Include one sentence on what it was and what result it produced. A targeted example beats a portfolio link every time.',
                },
                {
                  q: '"What is your approach to [specific challenge]?"',
                  a: 'Give a real answer. Not "it depends" and not a generic methodology paragraph. Describe how you would actually approach their specific situation. Use information from their post. This is where most freelancers fail — they give a textbook answer instead of one tailored to the job.',
                },
                {
                  q: '"What is your availability / timeline?"',
                  a: 'Be specific. "I can start Monday and estimate completion by [date] based on the scope described." Avoid vague answers like "I am available immediately" with no timeline — they signal that you haven\'t thought about the scope.',
                },
              ].map((item, i) => (
                <div key={i} className="border rounded-xl p-5 bg-background">
                  <p className="font-semibold text-sm mb-2 text-foreground">{item.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mistakes */}
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Common Upwork proposal mistakes to avoid</h2>
            <p className="text-muted-foreground text-sm mb-6">Every one of these reduces your reply rate. Most proposals make at least three of them.</p>
            <div className="space-y-3">
              {mistakes.map((m, i) => (
                <div key={i} className="flex gap-3 p-4 border rounded-xl">
                  <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tool CTA */}
        <section className="py-14 px-4 bg-muted/20 border-t">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-3">Apply this framework without writing from scratch</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Paste the job post. The AI reads it, applies the QDIPC framework, matches your saved projects, and generates three proposal variants — each one customised to that specific client and job.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
                >
                  Generate My Proposal Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/upwork-proposal-template"
                  className="inline-flex items-center justify-center gap-2 border font-semibold px-6 py-3 rounded-xl hover:bg-muted/50 transition-colors text-sm"
                >
                  Copy a Proposal Template
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-4">No account. No Chrome extension. Free with your own API key.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4 border-t">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Upwork proposal writing — frequently asked questions</h2>
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
            <h2 className="text-lg font-bold mb-5">Related Upwork proposal resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { to: '/upwork-cover-letter-examples', title: 'Upwork Cover Letter Examples', desc: '10 real samples with breakdowns — web dev, design, writing, VA, and data.' },
                { to: '/upwork-proposal-examples', title: 'Upwork Proposal Examples', desc: '10 real proposals annotated with exactly what works and why.' },
                { to: '/upwork-proposal-template', title: 'Upwork Proposal Templates', desc: '5 copy-paste templates with line-by-line customisation guides.' },
                { to: '/how-to-submit-proposal-upwork', title: 'How to Submit a Proposal on Upwork', desc: 'Step-by-step walkthrough of the submission process, connects, and boosting.' },
              ].map(link => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="group flex items-start gap-3 p-4 border rounded-xl hover:bg-background hover:border-primary/30 transition-all"
                >
                  <div>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{link.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
