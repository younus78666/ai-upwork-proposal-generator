import { Helmet } from '@/lib/helmet-stub';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ── Types ──────────────────────────────────────────────────────────────────────

interface ScreeningQuestion {
  id: number;
  question: string;
  answer: string;
  tip: string;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const questionTypes = [
  {
    id: 'experience',
    label: 'Experience / Proof',
    example: '"Tell me about a similar project you\'ve worked on"',
    strategy:
      'Answer with a specific project, measurable result, and direct relevance to this job. One example beats a list of past clients.',
    color: 'bg-blue-50 border-blue-200',
    labelColor: 'text-blue-700',
  },
  {
    id: 'process',
    label: 'Process',
    example: '"How would you approach this project?"',
    strategy:
      'Describe your actual workflow with a timeline. Show communication style and how you handle blockers. Vague philosophies signal inexperience.',
    color: 'bg-purple-50 border-purple-200',
    labelColor: 'text-purple-700',
  },
  {
    id: 'availability',
    label: 'Availability',
    example: '"Can you start this week / work PST hours / be available for daily calls?"',
    strategy:
      'Answer directly with dates and hours. If you cannot fully match, say so and offer an honest alternative. "I\'m flexible" is not an answer.',
    color: 'bg-green-50 border-green-200',
    labelColor: 'text-green-700',
  },
  {
    id: 'redflag',
    label: 'Red-Flag Detection',
    example: '"Have you read the full job description?" / "What\'s the keyword in this post?"',
    strategy:
      'Answer the literal question first, directly and calmly. Then add one sentence of relevant context. Clients who ask these have been burned by mass-applicants.',
    color: 'bg-orange-50 border-orange-200',
    labelColor: 'text-orange-700',
  },
];

const strategyRules = [
  {
    number: '01',
    title: 'Treat each question as a mini cover letter',
    detail:
      'Minimum 3 to 4 sentences per answer. A client who invested time writing a screening question expects more than a sentence back. One-line answers are the single biggest signal of a mass-applicant.',
  },
  {
    number: '02',
    title: 'Answer the specific question asked, then add one supporting detail',
    detail:
      'Do not rephrase the question, do not qualify your answer, do not begin with "Great question." Answer it, then add one specific proof point or process note that strengthens your answer.',
  },
  {
    number: '03',
    title: 'Never copy your cover letter text into a screening answer',
    detail:
      'Clients read both. If they are identical, it signals you treated the screening questions as an afterthought. The screening answers and cover letter should complement each other, not repeat.',
  },
  {
    number: '04',
    title: 'If asked for a portfolio sample, link to the most relevant one specifically',
    detail:
      'Not your general portfolio page. Not a list of 5 links. The single most relevant project with a sentence explaining why it is relevant. More links does not signal more confidence.',
  },
];

const screeningQuestions: ScreeningQuestion[] = [
  {
    id: 1,
    question: 'Please share a link to similar work you\'ve done.',
    answer:
      'Here is a project most similar to what you described: [link]. It was a [type] project for a [client type]. The specific challenge was [X], and we solved it by [Y]. The result was [Z]. Happy to share more samples if this direction resonates.',
    tip: 'Link to ONE relevant project, not your entire portfolio. A single contextualised example lands better than a folder of 12 links.',
  },
  {
    id: 2,
    question: 'How would you approach this project?',
    answer:
      'My approach for this type of work typically looks like this: Week 1 -- discovery and briefing. Weeks 2 to 3 -- core delivery. Week 4 -- revisions and handoff. I start every project with a 30-minute kickoff call to align on goals, then send a brief summary of what I understood so we catch any misalignment early. For your specific project, I would [specific step based on their job description].',
    tip: 'Show a timeline, not just a philosophy. Clients want to know what happens when, not a general statement about your work ethic.',
  },
  {
    id: 3,
    question: 'What is your availability? Can you start immediately?',
    answer:
      'I am available to start [day/week]. My current workload allows [X hours per week] dedicated to your project. I work [timezone] hours but can accommodate [their timezone] for calls with advance notice.',
    tip: '"ASAP" is not an answer. Give a specific date and hour commitment. Clients asking this question need certainty, not flexibility.',
  },
  {
    id: 4,
    question: 'Have you worked with [specific tool or platform] before?',
    answer:
      'Yes, I have used [tool] on [number] projects. The most recent was [brief description]. If you need evidence, I can share a sample or walk you through my process on a quick call.\n\nIf you have not used it: "I have not used [tool] specifically, but I have extensive experience with [similar tool], and my research shows the workflow is comparable. I would need [X days] to get fully up to speed."',
    tip: 'Honesty about a gap beats false confidence. Clients who discover you overstated your experience mid-project will not rehire you or leave a positive review.',
  },
  {
    id: 5,
    question: 'Why should I hire you over other applicants?',
    answer:
      'Three things. First, I\'ve worked on [specific relevant experience] which means I understand the [specific challenge] you\'re describing, not just the general category. Second, my process includes [specific differentiator]. Third, I can start [date] and commit [X hours/week], which matches your timeline.',
    tip: 'Never write "I am hardworking and dedicated." Every applicant says this. Specifics only: a project, a result, a date, a number.',
  },
  {
    id: 6,
    question: 'What\'s your experience with [technology or niche]?',
    answer:
      '[X years / X projects] of hands-on experience with [tech]. My most relevant work: [one project]. Key things I have learned that apply here: [two specific points relevant to their job description].',
    tip: 'One project example with context beats a list of buzzwords. "I have used React on 14 production apps" beats "I am proficient in React, JavaScript, TypeScript, and modern frontend technologies."',
  },
  {
    id: 7,
    question: 'Can you work within our budget of $X?',
    answer:
      'Yes. Based on what you have described, $X is workable for [scope]. If the project expands beyond [defined scope], I would flag it before proceeding and agree on a revised scope. I do not do surprise invoices.',
    tip: 'Confirm the budget, define the scope, and eliminate their risk concern in one move. Clients asking this question are worried about scope creep, not just cost.',
  },
  {
    id: 8,
    question: 'How do you handle revisions and feedback?',
    answer:
      'My standard process includes [X rounds of revisions] within the agreed scope. I send work in stages rather than all at once, so feedback happens early and does not require starting over. I use [tool such as Loom, Google Docs, or Figma comments] so feedback is asynchronous and documented.',
    tip: 'Show a process, not a promise. "I am happy to revise until you are satisfied" is a red flag to experienced clients because it has no boundaries.',
  },
  {
    id: 9,
    question: 'What questions do you have about this project?',
    answer:
      'A few: [1. Specific technical question about their stack or tools]. [2. Question about timeline or deadline flexibility]. [3. Question about who the end user is or who you will be collaborating with]. I want to make sure my approach matches what you actually need.',
    tip: 'This is a disguised test of whether you read the post. Generic questions such as "What is your budget?" or "What is the deadline?" when that information is in the post signal you did not read it.',
  },
  {
    id: 10,
    question: 'This post contains a test. Mention [specific word] in your answer.',
    answer:
      '[Word]. I noticed the test in the description -- it is a smart filter for attention to detail. [Then continue with relevant answer about the project itself].',
    tip: 'Always acknowledge the test directly and calmly. Clients who embed tests specifically reward people who acknowledge them without making it awkward. Do not ignore it or pretend it was not there.',
  },
];

const commonMistakes = [
  {
    id: 'copy-paste',
    text: 'Copying your cover letter text as the screening answer',
  },
  {
    id: 'one-line',
    text: 'One-sentence answers such as "Yes I can do this" or "I have experience in this area"',
  },
  {
    id: 'availability',
    text: 'Ignoring availability questions with vague phrases like "I\'m flexible" or "ASAP"',
  },
  {
    id: 'irrelevant-portfolio',
    text: 'Linking to an irrelevant portfolio piece or pasting your general portfolio URL',
  },
  {
    id: 'missed-test',
    text: 'Missing the embedded test instruction entirely -- the most disqualifying mistake of all',
  },
];

const faqs = [
  {
    q: 'Are Upwork screening questions mandatory?',
    a: 'You cannot submit the proposal without filling in the screening question fields. You can give short answers, but clients will see that immediately and it signals low effort. Technically optional in the sense that you can type one word, but practically they are not optional if you want to be considered.',
  },
  {
    q: 'How long should my screening question answers be?',
    a: '3 to 5 sentences minimum per question. Treat each one as a short cover letter. One-line answers are the most common reason good proposals get ignored. The client spent time writing the question -- a one-line answer tells them you did not spend time answering it.',
  },
  {
    q: 'Do clients actually read screening question answers?',
    a: 'Yes. Clients who bothered to add screening questions specifically read the answers first, before the cover letter. They added the questions precisely to filter people out, and they use the answers as the primary filter. A weak screening answer will get you eliminated before the client even reads your cover letter.',
  },
  {
    q: 'Can I reuse the same screening question answers across jobs?',
    a: 'For availability and timeline questions, yes -- those answers do not change much between jobs. For experience, process, and tool-specific questions, always customise to the specific job. A generic process answer is nearly as bad as a one-line answer.',
  },
  {
    q: 'What if I don\'t know the answer to a screening question?',
    a: 'Be honest and specific about the gap: "I have not done X specifically, but I have [related experience] and would need [X time] to bridge it." Clients respect honesty far more than fake confidence. If they hire you based on inflated claims, the project will fail and both sides lose.',
  },
];

// ── Schema ─────────────────────────────────────────────────────────────────────

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://ultimatefreelancers.com/upwork-screening-questions#article',
      headline: 'How to Answer Upwork Screening Questions (With Examples)',
      description:
        'How to answer Upwork client screening questions with examples. 10 real questions with model answers, strategy tips, and common mistakes to avoid.',
      url: 'https://ultimatefreelancers.com/upwork-screening-questions',
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
      '@type': 'HowTo',
      name: 'How to Answer Upwork Screening Questions',
      description:
        'Step-by-step strategy for answering every type of Upwork client screening question, with model answers for 10 real questions.',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Identify the question type',
          text: 'Classify the question as experience/proof, process, availability, or red-flag detection. Each type requires a different answer structure.',
        },
        {
          '@type': 'HowToStep',
          name: 'Write a minimum 3 to 4 sentence answer',
          text: 'Treat each screening question as a mini cover letter. One-line answers signal a mass-applicant and are the most common reason proposals are eliminated.',
        },
        {
          '@type': 'HowToStep',
          name: 'Answer the specific question, then add one supporting detail',
          text: 'Answer what was asked directly, then add one specific proof point or process note. Never start with a restatement of the question.',
        },
        {
          '@type': 'HowToStep',
          name: 'Never copy your cover letter into the screening answer',
          text: 'Clients read both. Identical text signals the screening questions were an afterthought. The answers and cover letter should complement, not repeat each other.',
        },
        {
          '@type': 'HowToStep',
          name: 'For portfolio requests, link to the single most relevant project',
          text: 'One contextualised link beats five generic ones. Include a sentence explaining why that specific project is relevant to their job.',
        },
      ],
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
          name: 'Upwork Screening Questions',
          item: 'https://ultimatefreelancers.com/upwork-screening-questions',
        },
      ],
    },
  ],
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UpworkScreeningQuestions() {
  return (
    <>
      <Helmet>
        <title>Upwork Screening Questions | Ultimate Freelancers</title>
        <meta
          name="description"
          content="How to answer Upwork client screening questions with examples. 10 real questions with model answers, strategy tips, and common mistakes to avoid."
        />
        <link rel="canonical" href="https://ultimatefreelancers.com/upwork-screening-questions" />
        <meta property="og:title" content="Upwork Screening Questions | Ultimate Freelancers" />
        <meta
          property="og:description"
          content="How to answer Upwork client screening questions with examples. 10 real questions with model answers, strategy tips, and common mistakes to avoid."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ultimatefreelancers.com/upwork-screening-questions" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="og:site_name" content="Ultimate Freelancers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upwork Screening Questions | Ultimate Freelancers" />
        <meta
          name="twitter:description"
          content="How to answer Upwork client screening questions with examples. 10 real questions with model answers, strategy tips, and common mistakes to avoid."
        />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">

        <main>
          {/* ── Hero ── */}
          <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-muted/30 to-background">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
                Upwork Proposal Strategy
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight">
                How to Answer Upwork Screening Questions (With Examples)
              </h1>
              <p className="text-xl text-muted-foreground mb-3 max-w-2xl mx-auto font-medium">
                10 real screening questions. Model answers. The strategy behind each one.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground mt-6">
                <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">10 model answers</span>
                <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">4 question types covered</span>
                <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">5 common mistakes</span>
                <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">Updated April 2026</span>
              </div>
            </div>
          </section>

          {/* ── Intro ── */}
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-base max-w-none text-muted-foreground space-y-4">
                <p className="text-base leading-relaxed">
                  Screening questions are the part of an Upwork proposal most freelancers get wrong. A
                  one-line answer to a question the client spent time writing signals you are applying to
                  100 jobs without reading any of them. Clients who add screening questions read the
                  answers before they read the cover letter. They are filtering immediately, and thin
                  answers get proposals eliminated before the cover letter is even opened.
                </p>
                <p className="text-base leading-relaxed">
                  This page covers what clients are actually testing with each question type, the strategy
                  behind strong answers, and 10 real questions with model answers you can adapt to your
                  niche. The goal is not to copy these answers verbatim -- it is to understand the
                  structure behind each one so you can write answers that are specific to the job in front
                  of you.
                </p>
              </div>
            </div>
          </section>

          {/* ── What Are Screening Questions ── */}
          <section className="py-12 px-4 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                What are Upwork client screening questions?
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Upwork clients can add up to 10 custom questions to any job post. These questions appear
                in the proposal form below the cover letter field, and every freelancer applying to that
                post must fill them in before submitting. Most clients add 1 to 3 questions. Rarely more
                than 5. Upwork's own AI feature, Uma, now suggests relevant questions to clients when
                they post a job, which means screening questions are becoming more common across all
                budget levels.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    label: 'They filter out mass-applicants',
                    detail:
                      'A client who adds a specific process question cannot be answered with a copy-paste template. That is the point.',
                  },
                  {
                    label: 'They appear after the cover letter field',
                    detail:
                      'Screening questions are NOT optional. Skipping them or giving thin answers directly hurts your proposal, regardless of how strong your cover letter is.',
                  },
                  {
                    label: 'Upwork data supports thoroughness',
                    detail:
                      'Proposals that answer screening questions thoroughly correlate with higher interview rates. The bar is low because most freelancers give one-line answers.',
                  },
                  {
                    label: 'They test communication quality early',
                    detail:
                      'How you answer a screening question is evidence of how you will communicate during the project. Clients read the answers as a preview of working with you.',
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">{item.label}</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">{item.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">The 4 types of screening questions:</span> experience
                  and proof questions, process questions, availability questions, and red-flag detection
                  questions. Each type requires a different answer structure. The sections below cover
                  each one.
                </p>
              </div>
            </div>
          </section>

          {/* ── Why Clients Add Them ── */}
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Why clients add screening questions to Upwork job posts
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Understanding the reason behind a screening question changes how you answer it. Clients
                do not add these questions because they enjoy creating extra work for freelancers. They
                add them because they have been burned.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  {
                    number: '1',
                    reason: 'To find people who actually read the post',
                    explanation:
                      'Most Upwork applicants do not read the full job description. A specific question -- about the tools mentioned, the project scope, or a detail buried in paragraph three -- instantly separates readers from copy-pasters.',
                  },
                  {
                    number: '2',
                    reason: 'To test communication quality before hiring',
                    explanation:
                      'The way a freelancer answers a short question is direct evidence of how they will communicate during a project. Grammar, specificity, structure, tone -- all of it is visible in a screening answer. Clients use this as a proxy for working style.',
                  },
                  {
                    number: '3',
                    reason: 'To get specific information not covered in the cover letter',
                    explanation:
                      'Availability windows, specific tool experience, portfolio samples from a particular niche, budget acceptance -- these are things clients need to know that freelancers rarely address unprompted. Screening questions are the mechanism for getting that information efficiently.',
                  },
                ].map((item) => (
                  <div key={item.number} className="flex gap-5 p-5 bg-card border border-border rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {item.number}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">{item.reason}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {item.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">The implication:</span> if a client added screening
                  questions and you skip them or give generic answers, you lose -- regardless of how good
                  your cover letter is. The screening answers are evaluated first. A strong cover letter
                  does not recover a weak screening answer.
                </p>
              </div>
            </div>
          </section>

          {/* ── 4 Question Types ── */}
          <section className="py-12 px-4 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                The 4 types of Upwork screening questions
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Every screening question falls into one of four categories. The category determines the
                answer structure. Knowing which type you are dealing with before you write saves time and
                produces better answers.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                {questionTypes.map((type) => (
                  <div key={type.id} className={`border rounded-xl p-5 ${type.color}`}>
                    <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${type.labelColor}`}>
                      {type.label}
                    </div>
                    <div className="text-sm font-semibold text-foreground mb-3 italic">
                      {type.example}
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">{type.strategy}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Strategy Rules ── */}
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                How to answer Upwork screening questions strategically
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Four rules apply to every type of screening question. Apply them consistently and your
                answers will outperform the majority of proposals at every budget level.
              </p>

              <div className="space-y-5">
                {strategyRules.map((rule) => (
                  <div key={rule.number} className="flex gap-5 p-5 bg-card border border-border rounded-xl">
                    <div className="text-3xl font-black text-muted-foreground/20 flex-shrink-0 leading-none pt-1">
                      {rule.number}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-2">{rule.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{rule.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 10 Questions With Model Answers ── */}
          <section className="py-12 px-4 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                10 Upwork screening questions with model answers
              </h2>
              <p className="text-muted-foreground mb-10 leading-relaxed">
                These are real questions clients add to Upwork job posts. Each model answer follows the
                strategy rules above. Use them as structural templates, not word-for-word copies --
                replace the bracketed placeholders with specifics from your own experience and the job
                you are applying for.
              </p>

              <div className="space-y-8">
                {screeningQuestions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-border rounded-xl p-5 mb-6 shadow-sm"
                  >
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                      Question {item.id} of 10
                    </div>
                    <div className="text-base font-semibold text-foreground mb-4">
                      "{item.question}"
                    </div>

                    <div className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Model Answer
                    </div>
                    <div className="bg-muted/40 rounded-lg p-4 text-sm leading-relaxed border-l-4 border-primary mb-4 whitespace-pre-line">
                      {item.answer}
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-green-900 leading-relaxed">
                        <span className="font-semibold">Tip:</span> {item.tip}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Common Mistakes ── */}
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                5 screening question mistakes that kill proposals
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                These are not theoretical mistakes. They appear in the majority of Upwork proposals
                every day. Each one signals to the client that the applicant did not put in the effort --
                and effort is what the screening question is designed to measure.
              </p>

              <div className="space-y-3">
                {commonMistakes.map((mistake, index) => (
                  <div
                    key={mistake.id}
                    className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl"
                  >
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-bold text-muted-foreground w-4">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{mistake.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Auto-Answer CTA ── */}
          <section className="py-12 px-4 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Answer Upwork screening questions automatically with AI
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  The AI proposal generator at Ultimate Freelancers automatically detects screening
                  questions in the job post and generates a model answer for each one -- alongside 3
                  cover letter variants. Paste the full job post (including screening questions) and get
                  answers in 60 seconds. No Chrome extension, no account required.
                </p>
                <Link href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Generate Screening Answers Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-4 text-xs text-muted-foreground">
                  Bring your own API key (OpenAI, Claude, Gemini, Groq -- free tiers available)
                </p>
              </div>
            </div>
          </section>

          {/* ── Related Resources ── */}
          <section className="py-10 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Related Upwork proposal resources
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    to: '/how-to-write-upwork-proposal',
                    title: 'How to Write an Upwork Proposal',
                    desc: 'The full 5-part QDIPC structure, opening line formulas, and word count benchmarks.',
                  },
                  {
                    to: '/upwork-proposal-examples',
                    title: 'Upwork Proposal Examples',
                    desc: 'Real proposal examples across 5 niches with job post context and analysis.',
                  },
                  {
                    to: '/upwork-cover-letter-examples',
                    title: 'Upwork Cover Letter Examples',
                    desc: '10 real cover letter examples that won contracts -- copy in one click.',
                  },
                  {
                    to: '/how-to-submit-proposal-upwork',
                    title: 'How to Submit a Proposal on Upwork',
                    desc: 'Step-by-step walkthrough of the Upwork proposal form, including connects and screening fields.',
                  },
                ].map((resource) => (
                  <Link
                    key={resource.to}
                    href={resource.to}
                    className="group p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all"
                  >
                    <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                      {resource.title} &rarr;
                    </div>
                    <div className="text-xs text-muted-foreground">{resource.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="py-12 px-4 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Upwork screening questions -- frequently asked questions
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
          </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
