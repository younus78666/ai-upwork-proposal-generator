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

const schema = {
  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Submit a Proposal on Upwork (Step-by-Step Guide)',
    description: 'Complete step-by-step guide to submitting an Upwork proposal. Covers the cover letter field, screening questions, connects cost, boosted proposals, and the most common beginner mistakes.',
    url: 'https://ultimatefreelancers.com/how-to-submit-proposal-upwork',
    datePublished: '2026-04-27',
    dateModified: '2026-04-27',
    author: { '@type': 'Person', name: 'Muhammad Younus', url: 'https://ultimatefreelancers.com/about' },
    publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
    image: 'https://ultimatefreelancers.com/og-image.png',
    about: [
      { '@type': 'Thing', name: 'Upwork proposal' },
      { '@type': 'Thing', name: 'Upwork connects' },
      { '@type': 'Thing', name: 'Freelance bidding' },
    ],
    mentions: [
      { '@type': 'Organization', name: 'Upwork' },
      { '@type': 'Thing', name: 'Upwork cover letter' },
      { '@type': 'Thing', name: 'Upwork screening questions' },
    ],
  },
  howTo: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Submit a Proposal on Upwork',
    description: 'Step-by-step guide to submitting a proposal on Upwork, from finding a job post to clicking submit.',
    totalTime: 'PT10M',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Find a job in the Job Feed', text: 'Log in to Upwork and click "Find Work" in the top navigation. Browse the Job Feed or use the search bar to find a relevant job post. Use filters to narrow by budget, job type (hourly or fixed-price), client history, and experience level.' },
      { '@type': 'HowToStep', position: 2, name: 'Read the full job post', text: 'Click the job title to open the full post. Read every line, including the job description, required skills, screening questions, and any files the client attached. The cover letter you write should reference something specific from this post.' },
      { '@type': 'HowToStep', position: 3, name: 'Click Apply Now', text: 'Click the green "Apply Now" button on the right side of the job post. This opens the proposal form. At this point, no connects have been spent yet.' },
      { '@type': 'HowToStep', position: 4, name: 'Set your bid', text: 'For hourly jobs, enter your hourly rate. For fixed-price jobs, enter the total amount you will charge. Upwork shows you what other freelancers are bidding so you can position your rate. Do not automatically bid the lowest rate.' },
      { '@type': 'HowToStep', position: 5, name: 'Write your cover letter', text: 'Type your cover letter in the cover letter text field. This is the most important part of your proposal. Start with something specific from the job post, diagnose the real problem, show your process, reference one relevant project, and end with a clear next step. Aim for 100 to 250 words for most jobs.' },
      { '@type': 'HowToStep', position: 6, name: 'Answer screening questions', text: 'If the client added screening questions, a separate section appears below the cover letter field. Answer each question specifically. Treat each one as a mini cover letter, not a one-line reply.' },
      { '@type': 'HowToStep', position: 7, name: 'Add an attachment (optional)', text: 'You can upload a portfolio sample, case study, or relevant file. Only attach something that directly relates to the job. Attaching a generic portfolio PDF adds nothing and may never be opened.' },
      { '@type': 'HowToStep', position: 8, name: 'Decide whether to boost', text: 'Upwork offers a "Boost" option that spends extra connects to move your proposal higher in the client\'s list. For most beginners with fewer than 10 completed jobs, do not boost. Spend the connects on submitting to more jobs with better proposals instead.' },
      { '@type': 'HowToStep', position: 9, name: 'Review and submit', text: 'Re-read your cover letter and screening question answers before submitting. Check that you used the client\'s name if you know it, that you did not leave any placeholder text like [Your Name], and that your bid is correct. Then click "Submit Proposal." Connects are spent at this point.' },
    ],
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many connects does it cost to submit an Upwork proposal?',
        acceptedAnswer: { '@type': 'Answer', text: 'Most Upwork jobs cost 6 connects to apply. Some jobs (usually higher-budget or premium listings) cost up to 16 connects. Connects are only spent when you click "Submit Proposal," not when you open the apply form. Boosting a proposal costs additional connects on top of the base submission cost.' },
      },
      {
        '@type': 'Question',
        name: 'Can you edit an Upwork proposal after submitting?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can edit your cover letter, bid, and screening question answers after submitting, as long as the client has not yet reviewed your proposal. Go to your Proposals page, find the submission, and click "Edit Proposal." You cannot edit a proposal after the client has viewed it.' },
      },
      {
        '@type': 'Question',
        name: 'Does Upwork cover letter length affect your reply rate?',
        acceptedAnswer: { '@type': 'Answer', text: 'Most winning cover letters are 100 to 250 words. Short enough that the client reads the whole thing before deciding whether to reply. Longer proposals (400+ words) are only appropriate for complex, high-budget projects where the client needs to see your full process before they engage.' },
      },
      {
        '@type': 'Question',
        name: 'Should you boost your Upwork proposal?',
        acceptedAnswer: { '@type': 'Answer', text: 'Generally no, especially for new freelancers. Boosting moves your proposal higher in the list but does not improve the proposal itself. A weak proposal at the top of the list still gets ignored. Spend connects on sending more proposals with better cover letters instead. Boosting becomes worth it once you have a strong profile, good JSS, and a proven cover letter formula.' },
      },
      {
        '@type': 'Question',
        name: 'What happens to your connects if a job is closed or removed?',
        acceptedAnswer: { '@type': 'Answer', text: 'Upwork refunds your connects if the client closes the job without hiring, removes the post, or if the job was fraudulent. Refunds usually appear in your connects balance within 24 to 48 hours of the job being closed.' },
      },
      {
        '@type': 'Question',
        name: 'How do you get more connects on Upwork?',
        acceptedAnswer: { '@type': 'Answer', text: 'New accounts receive 80 free connects when they join. After that, connects replenish at 10 per month on the free plan. Freelancer Plus ($20/month) gives 80 connects per month plus other benefits. You can also buy connects in bundles of 10, 20, 40, 60, or 80 from your account settings.' },
      },
    ],
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ultimatefreelancers.com' },
      { '@type': 'ListItem', position: 2, name: 'How to Submit a Proposal on Upwork', item: 'https://ultimatefreelancers.com/how-to-submit-proposal-upwork' },
    ],
  },
};

const steps = [
  {
    n: 1,
    title: 'Log in and go to Find Work',
    body: 'Open Upwork and click "Find Work" in the top navigation bar. This opens your Job Feed, which shows jobs matching your profile skills. You can also use the search bar at the top to search for a specific job type, skill, or keyword.',
    tip: 'Refine your Job Feed by going to Settings and updating your profile skills. The more accurate your skills, the more relevant your feed.',
  },
  {
    n: 2,
    title: 'Browse and filter jobs',
    body: 'Use the filters on the left side of the Job Feed to narrow down results. The most useful filters for beginners: Job Type (hourly or fixed-price), Experience Level (Entry, Intermediate, Expert), Client History (clients who have hired before), and Project Length.',
    tip: 'Filter by "Payment Verified" to avoid spending connects on clients who have never paid anyone on Upwork.',
  },
  {
    n: 3,
    title: 'Read the full job post before applying',
    body: 'Click the job title to open the full description. Read everything: the description, required skills, budget, timeline, and any screening questions. The cover letter you write needs to reference something specific from this post. If you cannot find anything specific to mention, that is a sign the job is not a good fit.',
    tip: null,
  },
  {
    n: 4,
    title: 'Click "Apply Now"',
    body: 'Click the green "Apply Now" button on the right side of the job post. This opens the proposal form. At this point, no connects have been spent. You can close the form and come back later without losing anything.',
    tip: 'Check how many connects the job costs before clicking Apply Now. The cost is shown next to the button.',
  },
  {
    n: 5,
    title: 'Set your bid',
    body: 'For hourly jobs, enter your hourly rate in the rate field. For fixed-price jobs, enter the total amount you will charge. Upwork shows a range of what other freelancers are bidding. You do not need to bid the lowest amount. Clients who choose the cheapest bid usually do so because the proposal gave them no other reason to choose differently.',
    tip: 'If you are unsure what to charge, check the "Client\'s Budget" field in the job post. Bidding near the top of their range is fine if your proposal justifies it.',
  },
  {
    n: 6,
    title: 'Write your cover letter',
    body: 'The cover letter text field is the most important part of your proposal. Do not start with "Hi, I am a [skill] expert with X years of experience." Start with something specific to the job: a question that shows you read the post, an observation about the client\'s situation, or a diagnosis of the real problem they are trying to solve. Then show your relevant experience and end with one clear next step.',
    tip: 'Aim for 100 to 250 words on most jobs. Shorter is usually better. The client needs to read the whole thing before they decide to reply.',
  },
  {
    n: 7,
    title: 'Answer screening questions (if present)',
    body: 'If the client added screening questions, a separate section appears below the cover letter field after you click Apply Now. Each question needs a specific, concrete answer. Do not write "I have extensive experience with this." Write what project you worked on, what the result was, and what you would do for this client specifically.',
    tip: 'Screening questions are where most proposals lose. Clients add them to filter out freelancers who send copy-paste proposals. A specific answer signals that you read the job post.',
  },
  {
    n: 8,
    title: 'Add an attachment (optional)',
    body: 'You can upload a portfolio sample, case study, or relevant work file. Only attach something directly related to the job. A PDF of your general portfolio rarely gets opened. A before/after screenshot from a relevant project or a short document demonstrating your process is far more effective.',
    tip: null,
  },
  {
    n: 9,
    title: 'Decide on boosting',
    body: 'Upwork\'s "Boost" feature lets you spend extra connects to push your proposal higher in the client\'s list. This costs 2 to 16 additional connects depending on how high you want to rank. For most beginners, skip this. A weak proposal at position 1 still gets ignored. Once you have a strong profile and a proven cover letter, boosting is worth testing on high-value jobs.',
    tip: null,
  },
  {
    n: 10,
    title: 'Review and submit',
    body: 'Before clicking "Submit Proposal," re-read your cover letter and check three things: (1) you referenced something specific from the job post, (2) you did not leave any placeholder text like [Your Name] or [Client Name], and (3) your bid is the amount you actually mean to charge. Then click Submit. Connects are spent at this point and are not refunded unless the job is closed or removed.',
    tip: 'Set a personal rule: if you would not be proud to show this proposal to a mentor, do not submit it.',
  },
];

const coverLetterDos = [
  'Start with a specific observation or question tied to the job post',
  'Name the real problem behind the surface request',
  'Show your process or approach in 2-3 sentences',
  'Reference one relevant project with a concrete result',
  'End with one clear next step (a question, a trial task offer, or a simple CTA)',
];

const coverLetterDonts = [
  'Open with "Hi, I am a [skill] with X years of experience"',
  'List every skill or tool you know',
  'Copy the same cover letter to multiple jobs',
  'Use phrases like "passionate," "hardworking," or "detail-oriented" without evidence',
  'Write more than 300 words unless the job complexity justifies it',
];

const connectsCosts = [
  { type: 'Standard job post', connects: '6 connects' },
  { type: 'Premium or featured job post', connects: 'Up to 16 connects' },
  { type: 'Boosted proposal (minimum)', connects: '2 extra connects' },
  { type: 'Boosted proposal (maximum)', connects: '16 extra connects' },
  { type: 'New account (free starter)', connects: '80 free connects' },
  { type: 'Free plan monthly replenishment', connects: '10 connects/month' },
  { type: 'Freelancer Plus ($20/mo)', connects: '80 connects/month' },
];

const mistakes = [
  {
    mistake: 'Sending the same cover letter to every job',
    fix: 'Write at least one sentence that could only apply to this specific job post. Reference the tech stack, the budget, the timeline, or a detail from the description.',
  },
  {
    mistake: 'Bidding without reading the full post',
    fix: 'Read every line including any attached files. Clients can tell within two sentences whether you read their post.',
  },
  {
    mistake: 'Treating screening questions as optional',
    fix: 'Clients add screening questions to filter out lazy applicants. One-line answers confirm you are one of them. Write 2-3 sentences minimum per question.',
  },
  {
    mistake: 'Submitting immediately without reviewing',
    fix: 'Re-read your cover letter once before submitting. Placeholder text, typos, or a mismatched bid lose jobs that your skills would have won.',
  },
  {
    mistake: 'Boosting proposals before having a strong profile',
    fix: 'Boosting puts a weak proposal in front of more eyes, which does not help. Build your profile first: get 3 to 5 completed jobs, earn strong reviews, then consider boosting.',
  },
];

const faqs = [
  { q: 'How many connects does it cost to submit an Upwork proposal?', a: 'Most Upwork jobs cost 6 connects to apply. Some jobs (usually higher-budget or premium listings) cost up to 16 connects. Connects are only spent when you click "Submit Proposal," not when you open the apply form. Boosting a proposal costs additional connects on top of the base submission cost.' },
  { q: 'Can you edit an Upwork proposal after submitting?', a: 'Yes. You can edit your cover letter, bid, and screening question answers after submitting, as long as the client has not yet reviewed your proposal. Go to your Proposals page, find the submission, and click "Edit Proposal." You cannot edit a proposal after the client has viewed it.' },
  { q: 'Does Upwork cover letter length affect your reply rate?', a: 'Most winning cover letters are 100 to 250 words. Short enough that the client reads the whole thing before deciding whether to reply. Longer proposals (400+ words) are only appropriate for complex, high-budget projects where the client needs to see your full process before they engage.' },
  { q: 'Should you boost your Upwork proposal?', a: 'Generally no, especially for new freelancers. Boosting moves your proposal higher in the list but does not improve the proposal itself. A weak proposal at the top of the list still gets ignored. Spend connects on sending more proposals with better cover letters instead. Boosting becomes worth it once you have a strong profile, good JSS, and a proven cover letter formula.' },
  { q: 'What happens to your connects if a job is closed or removed?', a: 'Upwork refunds your connects if the client closes the job without hiring, removes the post, or if the job was fraudulent. Refunds usually appear in your connects balance within 24 to 48 hours of the job being closed.' },
  { q: 'How do you get more connects on Upwork?', a: 'New accounts receive 80 free connects when they join. After that, connects replenish at 10 per month on the free plan. Freelancer Plus ($20/month) gives 80 connects per month plus other benefits. You can also buy connects in bundles of 10, 20, 40, 60, or 80 from your account settings.' },
];

export default function HowToSubmitProposalUpwork() {
  return (
    <>
      <Helmet>
        <title>How to Submit an Upwork Proposal | Ultimate Freelancers</title>
        <meta name="description" content="Step-by-step guide to submitting an Upwork proposal. Covers the cover letter, screening questions, connects cost, boosted proposals, and beginner mistakes." />
        <link rel="canonical" href="https://ultimatefreelancers.com/how-to-submit-proposal-upwork" />
        <meta property="og:title" content="How to Submit an Upwork Proposal | Ultimate Freelancers" />
        <meta property="og:description" content="Step-by-step guide to submitting an Upwork proposal. Covers the cover letter, screening questions, connects cost, boosted proposals, and beginner mistakes." />
        <meta property="og:url" content="https://ultimatefreelancers.com/how-to-submit-proposal-upwork" />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content="2026-04-27" />
        <meta name="twitter:title" content="How to Submit an Upwork Proposal | Ultimate Freelancers" />
        <meta name="twitter:description" content="Step-by-step guide to submitting an Upwork proposal. Covers the cover letter, screening questions, connects cost, boosted proposals, and beginner mistakes." />
        <script type="application/ld+json">{JSON.stringify(schema.article)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.howTo)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.faq)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.breadcrumb)}</script>
      </Helmet>


      <main className="bg-[#F5F3EE] min-h-screen">

        {/* Hero */}
        <section className="container mx-auto px-4 pt-16 pb-10 max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>How to Submit a Proposal on Upwork</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
            How to Submit a Proposal on Upwork
            <span className="block text-primary mt-1">(Step-by-Step Guide)</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Submitting a proposal on Upwork takes about 10 minutes when you know what you are doing. This guide walks through every step: finding the job, setting your bid, writing the cover letter, answering screening questions, deciding on boosts, and clicking submit.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            If you are completely new to Upwork, start at Step 1. If you know the mechanics but your proposals are not getting replies, skip to the cover letter and screening question sections below.
          </p>
        </section>

        {/* Quick summary bar */}
        <section className="container mx-auto px-4 pb-10 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-5 sm:p-6 grid sm:grid-cols-3 gap-5">
            {[
              { label: 'Time to submit', value: '5 to 10 minutes' },
              { label: 'Connects cost', value: '6 connects (most jobs)' },
              { label: 'Best cover letter length', value: '100 to 250 words' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                <p className="font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-8">10 Steps to Submit an Upwork Proposal</h2>
          <div className="space-y-5">
            {steps.map((step) => (
              <div key={step.n} className="bg-white rounded-2xl border border-border p-6 flex gap-5">
                <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                  {step.n}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  {step.tip && (
                    <div className="mt-3 flex gap-2 text-xs text-primary bg-primary/5 rounded-lg px-3 py-2">
                      <span className="font-bold shrink-0">Tip:</span>
                      <span>{step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What to write in the cover letter */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">What to Write in the Cover Letter Field</h2>
            <p className="text-muted-foreground text-sm mb-6">
              The cover letter field is the only part of your proposal where you can differentiate yourself. Your rate and profile are visible to every client. The cover letter is where you win or lose the job.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Do this
                </p>
                <ul className="space-y-2.5">
                  {coverLetterDos.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Avoid this
                </p>
                <ul className="space-y-2.5">
                  {coverLetterDonts.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Need real examples? See{' '}
                <Link href="/upwork-proposal-examples" className="text-primary hover:underline">10 Upwork proposal examples with annotated breakdowns</Link>
                {' '}or{' '}
                <Link href="/upwork-cover-letter-examples" className="text-primary hover:underline">Upwork cover letter examples by niche</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Screening questions */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">How to Answer Upwork Screening Questions</h2>
            <p className="text-muted-foreground text-sm mb-5">
              Screening questions appear below the cover letter field when the client has added them. Most freelancers treat them as a checkbox. Clients use them to filter out everyone who does.
            </p>
            <div className="space-y-5">
              {[
                {
                  heading: 'Be specific, not general',
                  body: 'If the question asks "Have you worked with Shopify before?", do not answer "Yes, I have extensive Shopify experience." Answer with the project: what the store sold, what you built or fixed, and what the outcome was. Two sentences is enough.',
                },
                {
                  heading: 'Answer what the question is actually asking',
                  body: 'Read the question twice. Clients sometimes phrase questions in a way that asks for an outcome, not a credential. "What would your first week on this project look like?" is asking for a plan, not a list of your skills.',
                },
                {
                  heading: 'Keep answers short but complete',
                  body: 'Two to four sentences per question is the target. Long answers signal that you cannot communicate concisely. One-word or one-line answers signal that you did not take the question seriously.',
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
            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-sm text-muted-foreground">
                For a full guide with example answers, read{' '}
                <Link href="/blog/how-to-answer-upwork-screening-questions" className="text-primary hover:underline">how to answer Upwork screening questions</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Connects cost */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">How Many Connects Does Submitting a Proposal Cost?</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Connects are Upwork's bidding currency. You spend them when you submit a proposal. The cost depends on the job type and whether you boost.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-6 font-semibold text-foreground">Situation</th>
                    <th className="text-left py-2 font-semibold text-foreground">Connects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {connectsCosts.map((row) => (
                    <tr key={row.type}>
                      <td className="py-3 pr-6 text-muted-foreground">{row.type}</td>
                      <td className="py-3 font-medium text-foreground">{row.connects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-5">
              Connects are only spent when you click "Submit Proposal." Opening the apply form, writing your cover letter, and closing the tab without submitting costs nothing. If a job is closed or removed after you submit, Upwork refunds your connects within 24 to 48 hours.
            </p>
          </div>
        </section>

        {/* Boosted proposals */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Should You Boost Your Upwork Proposal?</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5">
              Boosting moves your proposal higher in the client's proposal list, above non-boosted submissions. It costs extra connects on top of the standard submission fee.
            </p>
            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="font-semibold text-green-800 text-sm mb-1">When boosting is worth it</p>
                <p className="text-sm text-green-700 leading-relaxed">You have more than 10 completed jobs on Upwork, a strong JSS (90%+), a portfolio with relevant work, and a cover letter you know converts. The job is high-budget and you have reason to believe your proposal is strong enough to win if more clients see it.</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-red-800 text-sm mb-1">When to skip boosting</p>
                <p className="text-sm text-red-700 leading-relaxed">You are new to Upwork, have fewer than 5 completed jobs, or are not confident in your cover letter. Boosting puts a weak proposal in front of more eyes. It does not fix the proposal. Spend the connects on submitting more jobs with better cover letters instead.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The short version: boosting is a distribution tool, not a quality tool. It only returns value when the underlying proposal is already strong.
            </p>
          </div>
        </section>

        {/* Common mistakes */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">5 Common Upwork Proposal Mistakes (and How to Fix Them)</h2>
          <div className="space-y-4">
            {mistakes.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1.5">Mistake</p>
                  <p className="text-sm font-medium text-foreground">{item.mistake}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1.5">Fix</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.fix}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-5">
            For a deeper look at why proposals stop getting replies, read{' '}
            <Link href="/blog/upwork-proposal-not-getting-replies" className="text-primary hover:underline">the full breakdown</Link>.
          </p>
        </section>

        {/* Tool CTA */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Write Your Cover Letter While You Follow These Steps</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Paste the job post into the tool below. It generates 3 personalised cover letter variants using the QDIPC framework in under 60 seconds. No account. No extension. Bring your own API key.
            </p>
            <Link href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Generate My Cover Letter Free
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
              { label: 'How to write an Upwork proposal', href: '/blog/how-to-write-upwork-proposal', desc: 'The 5-part QDIPC framework that top earners use on every bid.' },
              { label: 'Upwork proposal examples', href: '/upwork-proposal-examples', desc: '10 real proposals with breakdowns of exactly what made each one work.' },
              { label: 'Upwork cover letter examples', href: '/upwork-cover-letter-examples', desc: 'Cover letter samples across 5 niches, each with annotated breakdowns.' },
              { label: 'How to write an Upwork cover letter', href: '/how-to-write-upwork-cover-letter', desc: 'Step-by-step guide with niche examples for dev, data entry, VA, and more.' },
              { label: 'How to answer screening questions', href: '/blog/how-to-answer-upwork-screening-questions', desc: 'Turn screening questions from a hurdle into a competitive advantage.' },
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
