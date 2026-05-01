'use client'
import { useEffect } from 'react';
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

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Win Jobs on Upwork — The Complete 2026 Guide',
  description:
    'Complete 2026 guide to winning jobs on Upwork. Profile optimisation, proposal strategy, connects, JSS, niche positioning, and common mistakes to avoid.',
  url: 'https://ultimatefreelancers.com/how-to-win-upwork-jobs',
  datePublished: '2026-04-27',
  dateModified: '2026-04-27',
  author: {
    '@type': 'Person',
    name: 'Muhammad Younus',
    url: 'https://ultimatefreelancers.com/about',
  },
  publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
  about: [
    { '@type': 'Thing', name: 'Upwork freelancing' },
    { '@type': 'Thing', name: 'Upwork profile optimisation' },
    { '@type': 'Thing', name: 'Upwork proposals' },
    { '@type': 'Thing', name: 'Job Success Score' },
  ],
  mentions: [
    { '@type': 'Organization', name: 'Upwork' },
    { '@type': 'Thing', name: 'QDIPC framework' },
    { '@type': 'Thing', name: 'Top Rated badge' },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How long does it take to get the first job on Upwork?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most focused freelancers get their first job within 2-6 weeks. The key variables: niche specificity, proposal quality, bidding on newly posted jobs, and targeting new clients with verified payment.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many proposals should I send per week?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quality over quantity. 5-10 well-targeted proposals per week outperforms 30 generic ones. Track your interview rate — if it is under 5%, rewrite your proposal approach before sending more.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Upwork worth it in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, particularly for specialised skills. The platform generates $3.8B+ in annual freelancer earnings. The barrier to entry is real, but it is not permanent. A focused 90-day effort with the right profile and proposal strategy produces consistent results.',
      },
    },
    {
      '@type': 'Question',
      name: "What's the best category to freelance in on Upwork in 2026?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Highest earnings: AI/ML integration, Web3 development, Conversion rate optimisation, Technical SEO. Easiest entry: Virtual assistance, content writing, data entry. Highest growth: AI prompt engineering, automation (Zapier/Make), no-code development.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need Freelancer Plus to succeed on Upwork?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. The 80 monthly connects are useful if you're applying actively, but the free plan's 10 connects are enough to test your approach. Upgrade only once you have a working proposal strategy.",
      },
    },
  ],
};

const jumpLinks = [
  { href: '#profile-optimisation', label: 'Profile optimisation' },
  { href: '#niche-positioning', label: 'Niche positioning' },
  { href: '#proposal-strategy', label: 'Proposal strategy' },
  { href: '#connects-strategy', label: 'Connects strategy' },
  { href: '#first-job', label: 'Your first job' },
  { href: '#jss', label: 'Job Success Score' },
  { href: '#badges', label: 'Badges' },
  { href: '#common-mistakes', label: 'Common mistakes' },
  { href: '#tools-workflow', label: 'Tools and workflow' },
];

const badges = [
  {
    name: 'Rising Talent',
    requirement: 'New freelancer, strong early metrics',
    unlocks: 'Search boost, client trust signal',
  },
  {
    name: 'Top Rated',
    requirement: '90%+ JSS, $1K+ lifetime, active 90 days',
    unlocks: 'Search priority, dispute protection, invite-only jobs',
  },
  {
    name: 'Top Rated Plus',
    requirement: '$10K+ in 12 months, no contract pauses',
    unlocks: 'Premium positioning, higher-budget job access',
  },
  {
    name: 'Expert-Vetted',
    requirement: 'Top 1%, manual review by Upwork talent managers',
    unlocks: 'Access to Expert-Vetted client roster',
  },
];

const mistakes = [
  {
    title: 'Applying to every job without filtering by client quality',
    detail:
      'Connects are a limited resource. Spending them on jobs with unverified payment, no reviews, or 50+ proposals already submitted is burning budget on near-zero-probability outcomes.',
  },
  {
    title: 'Setting your rate too low',
    detail:
      'A rate below market sends two signals: inexperience and desperation. Both attract difficult clients. Set at market rate from day one and negotiate after trust is built.',
  },
  {
    title: 'Ignoring screening questions or giving one-line answers',
    detail:
      'Clients add screening questions specifically to filter lazy proposals. A well-considered answer to one screening question often outweighs the entire proposal body.',
  },
  {
    title: 'Not updating your profile after early wins',
    detail:
      'Your first 2-3 jobs give you real results. If you do not update your overview, title, and portfolio to reflect them, you are leaving your best proof points off the page.',
  },
  {
    title: 'Taking every job offered just to build reviews',
    detail:
      'Bad clients give bad feedback. One dispute or low private rating can damage your JSS more than months of good work repairs. Be selective even at the start.',
  },
  {
    title: 'Submitting proposals without reading the full post',
    detail:
      'Clients can tell within the first sentence. If your opening line could apply to any post, you have not read theirs. Specific opening lines are the single highest-leverage change you can make.',
  },
  {
    title: 'Abandoning Upwork after the first 10 rejections',
    detail:
      "The algorithm rewards consistency. Freelancers who log in daily, respond quickly, and keep bidding are ranked higher than those who disappear and return. The first 30 days are the hardest. They are not representative of what comes after.",
  },
];

const tools = [
  {
    label: 'Job alerts',
    detail:
      'Set up keyword alerts in your Upwork job feed for your niche. You want to be among the first 5 applicants on relevant posts.',
  },
  {
    label: 'Proposal tool',
    detail:
      'ultimatefreelancers.com — paste the job post, get 3 QDIPC-structured proposals plus screening question answers in 60 seconds.',
    isLink: true,
    linkTo: '/',
  },
  {
    label: 'Time tracking',
    detail:
      "Upwork's built-in time tracker is required for hourly contracts with payment protection. Do not use external tools for tracked hours.",
  },
  {
    label: 'Portfolio hosting',
    detail:
      'Behance (design), GitHub (dev), Google Drive (documents). Link directly from your Upwork profile — do not make clients hunt for your work.',
  },
  {
    label: 'Contract management',
    detail:
      "Upwork's built-in milestones for fixed-price projects, time log for hourly. Use milestones to break large projects into reviewable phases.",
  },
  {
    label: 'Communication',
    detail:
      'Stay in Upwork messages until after the first payment clears. Payment protection only applies to on-platform communication. No WhatsApp, no email for project discussion in early contracts.',
  },
];

const faqs = [
  {
    q: 'How long does it take to get the first job on Upwork?',
    a: 'Most focused freelancers get their first job within 2-6 weeks. The key variables: niche specificity, proposal quality, bidding on newly posted jobs, and targeting new clients with verified payment. Specialists in high-demand categories typically see results faster than generalists.',
  },
  {
    q: 'How many proposals should I send per week?',
    a: 'Quality over quantity. 5-10 well-targeted proposals per week outperforms 30 generic ones. Track your submit-to-interview rate. Under 5% means your proposal needs work. Under 1% means your profile is the bottleneck. Fix the problem at the right layer before sending more.',
  },
  {
    q: 'Is Upwork worth it in 2026?',
    a: 'Yes, particularly for specialised skills. The platform generates $3.8B+ in annual freelancer earnings across 800,000 active client companies. The barrier to entry is real, but it is not permanent. A focused 90-day effort with the right profile and proposal strategy produces consistent results for freelancers who are willing to treat it as a system rather than a lottery.',
  },
  {
    q: "What's the best category to freelance in on Upwork in 2026?",
    a: 'Highest earnings per hour: AI/ML integration ($80-200/hr), Web3 development, Conversion rate optimisation, Technical SEO. Easiest entry for new freelancers: Virtual assistance, content writing, data entry. Highest growth rate: AI prompt engineering, automation (Zapier/Make), no-code development (Webflow, Bubble). Pick based on your existing skills first, then optimize toward a higher-paying adjacent niche.',
  },
  {
    q: 'Do I need Freelancer Plus to succeed on Upwork?',
    a: "No. The 80 monthly connects are useful if you are applying actively, but the free plan's 10 connects are enough to test your approach. The upgrade makes sense once you have a proven proposal strategy and are ready to apply consistently. Do not upgrade before you can convert proposals to interviews.",
  },
];

export default function HowToWinUpworkJobs() {
  useEffect(() => {
    const id = 'schema-how-to-win-upwork-jobs';
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
            { '@type': 'ListItem', position: 2, name: 'How to Win Upwork Jobs', item: 'https://ultimatefreelancers.com/how-to-win-upwork-jobs' },
          ],
        },
        {
          '@type': 'HowTo',
          name: 'How to Win Jobs on Upwork',
          description: 'A complete step-by-step guide to winning your first and subsequent jobs on Upwork in 2026.',
          step: [
            { '@type': 'HowToStep', position: 1, name: 'Optimise Your Profile', text: 'Complete every profile field, use a professional photo, write a keyword-rich title and bio.' },
            { '@type': 'HowToStep', position: 2, name: 'Choose Your Niche', text: 'Pick one specific service you can deliver better than generalists. Specialists win more at higher rates.' },
            { '@type': 'HowToStep', position: 3, name: 'Write Targeted Proposals', text: 'Use the QDIPC framework: open with a specific observation, diagnose the real problem, show your process.' },
            { '@type': 'HowToStep', position: 4, name: 'Manage Your Connects', text: 'Spend connects only on jobs posted within 24 hours with fewer than 10 applicants.' },
            { '@type': 'HowToStep', position: 5, name: 'Land Your First Job', text: 'Apply to smaller fixed-price jobs first to build JSS and reviews before targeting high-budget clients.' },
            { '@type': 'HowToStep', position: 6, name: 'Maintain Your JSS', text: 'Deliver on time, communicate proactively, and close contracts with 5-star reviews.' },
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
        <title>How to Win Jobs on Upwork | Ultimate Freelancers</title>
        <meta
          name="description"
          content="Complete 2026 guide to winning jobs on Upwork. Profile optimisation, proposal strategy, connects, JSS, niche positioning, and common mistakes to avoid."
        />
        <link rel="canonical" href="https://ultimatefreelancers.com/how-to-win-upwork-jobs" />
        <meta property="og:title" content="How to Win Jobs on Upwork | Ultimate Freelancers" />
        <meta
          property="og:description"
          content="Complete 2026 guide to winning jobs on Upwork. Profile optimisation, proposal strategy, connects, JSS, niche positioning, and common mistakes to avoid."
        />
        <meta property="og:url" content="https://ultimatefreelancers.com/how-to-win-upwork-jobs" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How to Win Jobs on Upwork | Ultimate Freelancers" />
        <meta
          name="twitter:description"
          content="Complete 2026 guide to winning jobs on Upwork. Profile optimisation, proposal strategy, connects, JSS, niche positioning, and common mistakes to avoid."
        />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>


      <main className="min-h-screen bg-background">

        {/* Hero */}
        <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              Complete Guide — April 2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How to Win Jobs on Upwork — The Complete 2026 Guide
            </h1>
            <p className="text-lg text-muted-foreground font-medium mb-2">
              Profile. Proposal. Connects. JSS. Niche. All of it.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-4">
              18 million freelancers are registered on Upwork. Fewer than 20% are active. Of those, maybe 5% have
              a profile and proposal strategy that actually converts. The platform is not saturated — it is
              stratified. At the top, a small group of freelancers wins most of the work. Below them, most
              people repeat the same mistakes and wonder why their proposals go unanswered.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl mb-8">
              This guide covers every variable that determines whether you win jobs on Upwork — from how your
              profile ranks in Upwork search to what your cover letter does in the first 10 seconds a client
              reads it. Whether you are starting from zero or trying to break through a plateau, the lever that
              moves your results is almost always one of the nine areas below.
            </p>

            {/* Jump links */}
            <div className="flex flex-wrap gap-2">
              {jumpLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="bg-muted rounded-full px-3 py-1 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section 1 — Profile optimisation */}
        <section id="profile-optimisation" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                1
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Profile optimisation — what Upwork's algorithm actually ranks
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Upwork search is a ranking system, not a directory. It weighs keyword match against your profile, your
              completeness score, your JSS, and your recent activity. Understanding what the algorithm rewards
              lets you optimise for visibility before you submit a single proposal.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: 'Profile photo',
                  body: 'Clear headshot, professional or neutral background, face forward. Research consistently shows that profiles with quality photos get 70%+ more clicks than those without. This is the lowest-effort, highest-impact change most new freelancers skip.',
                },
                {
                  title: 'Title',
                  body: '"WordPress Developer for SaaS Companies" outperforms "WordPress Developer | Full Stack | PHP | MySQL | React." The first tells a specific client exactly who you serve. The second is a keyword list that tells no one anything. Write for one reader, not a search engine.',
                },
                {
                  title: 'Overview (first 200 characters)',
                  body: 'Upwork shows only the first 200 characters of your overview without clicking. Lead with: niche + result + client type. "I help B2B SaaS companies reduce churn through redesigned onboarding flows. In the last 18 months I have..." Everything else is secondary.',
                },
                {
                  title: 'Skills',
                  body: "Choose 10-15 skills that match the jobs you actually want. Upwork's algorithm matches your skill tags to job post keywords. Adding irrelevant skills dilutes your relevance signal. Remove skills from categories you no longer target.",
                },
                {
                  title: 'Hourly rate',
                  body: "Set at market rate, not your aspiration rate. Your rate affects where you appear in filtered searches. Being competitive at market rate gets you seen. You negotiate up after the first successful contract, not before.",
                },
                {
                  title: 'Portfolio',
                  body: "Three to six strong samples in your niche outperforms twenty generic ones. Each portfolio item should have a clear title, a one-sentence context description, and the outcome. If you don't have Upwork-specific work yet, use employment projects, personal projects, or a spec piece built for this purpose.",
                },
                {
                  title: 'Upwork Skill Certifications',
                  body: 'Completing Upwork Skill Certifications in your category improves your search rank for certified skills. They take 15-30 minutes each. Any certification in a high-search category is worth the time investment.',
                },
                {
                  title: 'Activity score',
                  body: 'Logging in daily, responding to messages quickly, and submitting proposals regularly all contribute to your profile activity score. Upwork rewards freelancers who use the platform consistently. Dormant profiles drop in search rank within days.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-border rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2 — Niche positioning */}
        <section id="niche-positioning" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                2
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Niche positioning — why specialists win more jobs at higher rates
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Generalists compete on price. Specialists compete on expertise. When a client searches "Shopify
              developer for fashion brand" and sees one profile that reads exactly that versus ten profiles that
              say "e-commerce developer," the specialist wins the interview before the proposal is even read.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              The mechanism is not psychological — it is algorithmic. Upwork matches keyword specificity. A
              narrowly positioned profile ranks higher for precise searches and converts better because the client
              feels less risk.
            </p>

            <h3 className="font-bold text-base mb-4">How to pick your niche</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              The right niche sits at the intersection of three factors: skills you already have, genuine market
              demand on Upwork, and clients willing to pay well. If your niche scores low on any one of these,
              either the work will be poor quality, there will be no jobs to bid on, or the rates will not justify
              the effort.
            </p>

            <h3 className="font-bold text-base mb-3">Top niches by earnings potential in 2026</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {[
                { niche: 'AI / ML integration', rate: '$80-200/hr', note: 'Highest demand growth category' },
                { niche: 'No-code development (Webflow, Bubble)', rate: '$60-140/hr', note: 'Fast-growing, lower competition' },
                { niche: 'Conversion rate optimisation', rate: '$70-150/hr', note: 'Direct revenue tie, high willingness to pay' },
                { niche: 'Technical SEO', rate: '$60-120/hr', note: 'Measurable outcomes, specialist shortage' },
                { niche: 'Video production (YouTube/LinkedIn)', rate: '$50-100/hr', note: 'B2B content budgets growing fast' },
                { niche: 'Web development (SaaS / B2B)', rate: '$50-120/hr', note: 'Stable, high-volume, wide rate range' },
              ].map((item) => (
                <div key={item.niche} className="bg-white border border-border rounded-xl p-4">
                  <p className="font-semibold text-sm">{item.niche}</p>
                  <p className="text-primary text-sm font-medium">{item.rate}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-base mb-3">How to reposition your profile</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Repositioning is faster than most freelancers expect. Update your title, rewrite the first paragraph
              of your overview, update your skills section to match the new niche, and replace portfolio samples
              with niche-relevant work. Upwork re-indexes profiles within 24-48 hours. Freelancers who have done
              this report doubling their interview rate within two weeks.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upwork also lets you create up to three Specialised Profiles — separate profile pages targeting
              different services. This lets you maintain a general profile while having two niche-specific profiles
              that rank for precise searches. Use them if your skills span genuinely different markets.
            </p>
          </div>
        </section>

        {/* Section 3 — Proposal strategy */}
        <section id="proposal-strategy" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                3
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Proposal strategy — the variable that beats everything else
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Most freelancers lose jobs at the proposal stage, not the profile stage. A well-optimised profile
              gets you seen. The proposal determines whether you get an interview. It is the highest-leverage
              variable in your entire Upwork system and the one most freelancers put the least thought into.
            </p>

            <h3 className="font-bold text-base mb-4 mt-6">The QDIPC structure</h3>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Every proposal that converts has five components, in order. The structure is called QDIPC. Skip any
              one element and the proposal weakens significantly.
            </p>

            <div className="grid sm:grid-cols-5 gap-3 mb-8">
              {[
                { letter: 'Q', label: 'Question', desc: 'An observation tied to their specific post — prove you read it' },
                { letter: 'D', label: 'Diagnosis', desc: 'Name the real problem behind the stated request' },
                { letter: 'I', label: 'Insight', desc: 'Your approach for this type of work — show a process' },
                { letter: 'P', label: 'Package', desc: 'One specific past result relevant to this job' },
                { letter: 'C', label: 'CTA', desc: 'One clear next step — a question or a concrete action' },
              ].map((item) => (
                <div key={item.letter} className="text-center p-4 border rounded-xl bg-muted/20">
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-2">
                    {item.letter}
                  </div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-base mb-3">Proposal length</h3>
            <div className="space-y-2 mb-8">
              {[
                { type: 'Simple task (data entry, quick fixes)', length: '100-150 words' },
                { type: 'Standard project (most jobs)', length: '150-250 words' },
                { type: 'Complex or high-budget work', length: '250-350 words' },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-sm text-muted-foreground flex-1">{item.type}</span>
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">{item.length}</span>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-base mb-3">The opening line</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The biggest mistake in any proposal is opening with "Hi, I am a [skill] expert with X years of
              experience." Every client has read this sentence 200 times. They stop reading after the second word.
            </p>
            <div className="bg-white border border-border rounded-xl p-5 mb-4">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Opening that works</p>
              <p className="text-sm italic text-foreground/80 leading-relaxed">
                "Your note about needing the site to handle 10,000 concurrent users caught my attention — I solved
                that exact problem for a SaaS client last quarter. The answer was not a server upgrade."
              </p>
              <p className="text-xs text-muted-foreground mt-3 border-t pt-2">
                Client reads this and thinks: this person read my post and already has a relevant answer.
              </p>
            </div>

            <h3 className="font-bold text-base mb-3">Screening questions</h3>
            <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
              Treat each screening question as a mini cover letter. Write a minimum of 3-4 sentences. Never copy
              and paste your proposal body into the screening answer field — clients will notice immediately and
              interpret it as a signal that you did not read the question.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              For the complete QDIPC framework with worked examples, see the{' '}
              <Link href="/how-to-write-upwork-proposal" className="text-primary hover:underline font-medium">
                full Upwork proposal guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Section 4 — Connects strategy */}
        <section id="connects-strategy" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                4
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Connects strategy — how to spend them without burning through your budget
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Connects cost $0.15 each and are sold in bundles. Proposals cost 6-12 connects depending on the
              job's estimated budget. The free account gives you 10 connects per month. Freelancer Plus gives
              you 80 per month for $20 (roughly $0.25 per connect). The maths only work if you are selective.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white border border-border rounded-xl p-5">
                <h3 className="font-bold text-sm mb-3 text-green-700">Jobs worth bidding on</h3>
                <ul className="space-y-2">
                  {[
                    'Client has 90%+ hire rate (shown on the post)',
                    'Payment method verified',
                    '3+ reviews from previous freelancers',
                    'Budget matches your stated rate',
                    'Posted less than 24 hours ago',
                    'Fewer than 10 proposals already submitted',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-border rounded-xl p-5">
                <h3 className="font-bold text-sm mb-3 text-red-700">Jobs to skip</h3>
                <ul className="space-y-2">
                  {[
                    '"Looking for a rockstar / ninja / guru"',
                    'No budget listed or suspiciously low',
                    'Payment method not verified',
                    '50+ proposals already submitted',
                    'No client history, no reviews',
                    'Description is one sentence with no details',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-xl p-5">
              <p className="text-sm font-semibold mb-1">Track your submit-to-interview rate</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Under 5%: your proposal has a problem. Rewrite your approach before spending more connects.
                Under 1%: your profile is the bottleneck. The proposal is not being read because the profile
                is not credible enough. Fix the profile layer first.
              </p>
            </div>

            <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
              Boosted proposals let you spend extra connects to rank higher in a client's proposal list. Use them
              sparingly — only when your profile is strong, the job is an ideal fit, and you have already written
              a quality proposal. Boosting a weak proposal wastes connects.
            </p>
          </div>
        </section>

        {/* Section 5 — First job */}
        <section id="first-job" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                5
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Getting your first job on Upwork — a realistic path
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              The cold start problem on Upwork is real. You have no reviews, no JSS, and you are competing with
              freelancers who have both. The platform does not make this easy. What it does offer is a set of
              tactics that meaningfully reduce the barrier for new accounts — but only if you use them
              deliberately.
            </p>

            <h3 className="font-bold text-base mb-4 mt-6">4 strategies that actually work in 2026</h3>
            <div className="space-y-4 mb-8">
              {[
                {
                  num: '1',
                  title: 'Take 1-2 fixed-price jobs slightly below your target rate',
                  body: 'Not free — never work for free. But a $200 job at $150 to get a first review is a rational exchange. You are buying social proof, not giving away labour. Two strong reviews change how every subsequent proposal lands.',
                },
                {
                  num: '2',
                  title: 'Target newly posted jobs (under 5 proposals)',
                  body: 'A job posted 10 minutes ago with 3 proposals gives you a real shot. The same job at 50+ proposals means you are competing on algorithm ranking alone. Set job alerts for your exact keywords and apply within the first hour whenever possible.',
                },
                {
                  num: '3',
                  title: 'Apply to new clients posting their first job',
                  body: 'New clients on Upwork have not been burned by bad freelancers yet. They are more open, more communicative, and less likely to demand five-star credentials from day one. Filter by "new to Upwork" clients with verified payment.',
                },
                {
                  num: '4',
                  title: 'Offer a paid test project in your cover letter',
                  body: 'A limited-scope, fixed-price trial project removes the client\'s perceived risk. "I can deliver the first section at a fixed price by Friday — if it meets your standard, we continue" is far easier to say yes to than a large open-ended engagement.',
                },
              ].map((item) => (
                <div key={item.num} className="bg-white border border-border rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                      {item.num}
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <p className="text-sm font-semibold mb-1">Rising Talent badge</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Rising Talent badge is achievable in 4-8 weeks with 2-3 completed contracts and strong client
                feedback. It boosts your search visibility and is a meaningful trust signal to clients who are
                filtering by badge. Once you have it, your conversion rate from view to interview improves
                substantially.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 — JSS */}
        <section id="jss" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                6
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Job Success Score (JSS) — how it works and how to protect it
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Your Job Success Score is recalculated every two weeks. It looks back at the last 12 months of
              contract activity (or 24 months for accounts newer than 24 months old). It is the single most
              important number on your profile because it gates access to Top Rated status, higher-value job
              invitations, and dispute resolution support.
            </p>

            <h3 className="font-bold text-base mb-4">What goes into JSS</h3>
            <div className="space-y-2 mb-8">
              {[
                { label: 'Completed contracts', impact: 'Positive', color: 'text-green-600' },
                { label: 'Strong client feedback (public and private)', impact: 'Strongly positive', color: 'text-green-600' },
                { label: 'Paused contracts', impact: 'Neutral to negative', color: 'text-yellow-600' },
                { label: 'Refunded contracts', impact: 'Negative', color: 'text-red-600' },
                { label: 'Abandoned contracts (no feedback)', impact: 'Neutral to negative', color: 'text-yellow-600' },
                { label: 'Cancellations with poor feedback', impact: 'Major negative', color: 'text-red-600' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-xs font-semibold ${item.color}`}>{item.impact}</span>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-base mb-3">Private feedback</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Upwork collects private feedback from clients — ratings that are not shown publicly but are used in
              your JSS calculation. This means a client who gives you five stars publicly can still submit a
              lower private rating if their actual experience did not match the stated feedback. Treat every client
              interaction as if you are being evaluated by someone who will be entirely honest when no one is
              watching — because they will be.
            </p>

            <div className="bg-muted/30 border border-border rounded-xl p-5">
              <p className="text-sm font-semibold mb-2">How to protect your JSS</p>
              <ul className="space-y-2">
                {[
                  'Only take jobs you can deliver to a high standard',
                  'Decline work that is outside your core scope',
                  'End contracts cleanly — never abandon without communication',
                  'Never leave a client waiting more than 24 hours for a response',
                  'Communicate scope changes before delivering, not after',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7 — Badges */}
        <section id="badges" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                7
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Upwork badges — what they unlock and how to get them
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Upwork badges are not cosmetic. Each badge level changes how the algorithm treats your profile, what
              jobs you appear in, and what protections you have in disputes. The progression from Rising Talent
              to Expert-Vetted represents a meaningful step-change in earnings potential at each level.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-border rounded-xl overflow-hidden text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold">Badge</th>
                    <th className="text-left px-4 py-3 font-semibold">Requirement</th>
                    <th className="text-left px-4 py-3 font-semibold">What it unlocks</th>
                  </tr>
                </thead>
                <tbody>
                  {badges.map((badge, i) => (
                    <tr
                      key={badge.name}
                      className={`border-b border-border last:border-0 ${i % 2 === 1 ? 'bg-muted/20' : 'bg-white'}`}
                    >
                      <td className="px-4 py-3 font-medium">{badge.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{badge.requirement}</td>
                      <td className="px-4 py-3 text-muted-foreground">{badge.unlocks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
              Expert-Vetted status requires a manual review by Upwork's talent team and is awarded to the top 1%
              of freelancers by category. It cannot be applied for — it is invitation-based. The path to it runs
              through consistent Top Rated Plus performance over 12-24 months.
            </p>
          </div>
        </section>

        {/* Section 8 — Common mistakes */}
        <section id="common-mistakes" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                8
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Common Upwork mistakes that stall your growth
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Most of these mistakes are invisible from the inside. The freelancer making them does not know they
              are patterns — they just see proposals going unanswered and assume the platform is against them.
              These seven mistakes account for the majority of Upwork stalls.
            </p>

            <div className="space-y-3">
              {mistakes.map((m, i) => (
                <div key={i} className="flex gap-3 p-4 border rounded-xl bg-white">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 9 — Tools and workflow */}
        <section id="tools-workflow" className="py-12 px-4 border-b scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <span className="absolute -top-4 -left-2 text-6xl font-bold text-primary/20 select-none leading-none">
                9
              </span>
              <h2 className="text-2xl font-bold relative z-10 pt-4">
                Tools and workflow for serious Upwork freelancers
              </h2>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Freelancers who treat Upwork as a system rather than a job board consistently outperform those who
              treat it as a lottery. The difference is usually in the tooling and habits they maintain around the
              platform.
            </p>

            <div className="space-y-3">
              {tools.map((tool) => (
                <div key={tool.label} className="bg-white border border-border rounded-xl p-5">
                  <p className="font-semibold text-sm mb-1">{tool.label}</p>
                  {tool.isLink ? (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <Link href={tool.linkTo!} className="text-primary hover:underline font-medium">
                        ultimatefreelancers.com
                      </Link>{' '}
                      — paste the job post, get 3 QDIPC-structured proposals plus screening question answers in
                      60 seconds.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.detail}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-14 px-4 border-b">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-3">Your next proposal is one step away</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                The fastest lever you have right now is your proposal quality. Most freelancers who struggle on
                Upwork have decent profiles but weak proposals. Use the free AI generator to see what a
                QDIPC-structured proposal looks like for your next job — paste the post, get three full variants
                in 60 seconds.
              </p>
              <Link href="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
              >
                Generate my Upwork proposal free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Related resources */}
        <section className="py-12 px-4 border-b">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-5">Related Upwork guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  to: '/how-to-write-upwork-proposal',
                  title: 'How to Write an Upwork Proposal',
                  desc: 'The complete QDIPC framework with good vs bad examples at every step.',
                },
                {
                  to: '/upwork-proposal-examples',
                  title: 'Upwork Proposal Examples',
                  desc: '10 real proposals annotated with exactly what works and why.',
                },
                {
                  to: '/upwork-bio-examples',
                  title: 'Upwork Bio Examples',
                  desc: 'Real overview examples across dev, design, writing, and VA niches.',
                },
                {
                  to: '/upwork-cover-letter-examples',
                  title: 'Upwork Cover Letter Examples',
                  desc: '10 niche-specific samples with line-by-line breakdowns.',
                },
                {
                  to: '/upwork-screening-questions',
                  title: 'Upwork Screening Questions',
                  desc: 'How to answer every type of screening question with specific examples.',
                },
              ].map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="group flex items-start gap-3 p-4 border rounded-xl hover:bg-background hover:border-primary/30 transition-all bg-white"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">{link.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border rounded-xl px-5"
                >
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
      </main>

      <LandingFooter />
    </>
  );
}
