'use client'
import { useEffect } from 'react';
import { Helmet } from '@/lib/helmet-stub';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Key, Globe, FileText, MessageSquare } from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: '3 variants in 60 seconds',
    body: 'Short, medium, and detailed proposals generated in one pass. Compare them, pick the best fit for the job, or blend elements from each.',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Screening question answers',
    body: "Paste the client's screening questions and get specific, personalised answers generated alongside your proposals. No separate step.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: 'QDIPC framework',
    body: 'Every proposal follows the framework top Upwork earners use: Question, Diagnosis, Insight, Proof, CTA. Not a generic template.',
  },
  {
    icon: <Key className="w-5 h-5" />,
    title: 'Bring your own API key',
    body: 'Connect Groq, Gemini, OpenAI, or Claude. Pay the provider directly at cost. No subscription markup. No per-proposal fee.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'No account required',
    body: 'Nothing to sign up for. Your API key and saved projects stay in your browser only. Clear your browser data and everything is gone.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Works on any device',
    body: 'Browser-based. No Chrome extension to install. No desktop app to download. Open it on any device and start bidding.',
  },
];

const providers = [
  { name: 'Groq (Llama 3)', cost: 'Free', speed: 'Fastest', best: 'Daily bidding' },
  { name: 'Gemini Flash', cost: 'Free tier available', speed: 'Fast', best: 'Most jobs' },
  { name: 'GPT-4o (OpenAI)', cost: 'Pay per token', speed: 'Medium', best: 'Complex jobs' },
  { name: 'Claude 3.5 Sonnet', cost: 'Pay per token', speed: 'Medium', best: 'Nuanced writing' },
];

const howItWorks = [
  { n: 1, step: 'Paste the job post', detail: 'Copy the full Upwork job description into the tool. The more detail, the more personalised the output.' },
  { n: 2, step: 'Add your background', detail: 'Tell the tool about your relevant experience, skills, and any past projects. This feeds directly into the proof points in each proposal.' },
  { n: 3, step: 'Add screening questions (optional)', detail: "If the client included screening questions, paste them in. The tool answers them in the same generation pass." },
  { n: 4, step: 'Select your API provider', detail: 'Choose Groq, Gemini, OpenAI, or Claude. Paste your API key (stored in your browser only, never on our servers).' },
  { n: 5, step: 'Get 3 proposal variants', detail: 'Short, medium, and detailed proposals are generated simultaneously. Copy whichever fits the job best.' },
];

const vsTable = [
  { feature: 'Price', ours: 'Free (BYOK)', them: '$29-99/month subscription' },
  { feature: 'Variants per generation', ours: '3 (short, medium, detailed)', them: '1 (regenerate to vary)' },
  { feature: 'Screening question answers', ours: 'Yes, same generation', them: 'Usually separate or manual' },
  { feature: 'Data stored on servers', ours: 'None', them: 'Usually yes' },
  { feature: 'Account required', ours: 'No', them: 'Yes' },
  { feature: 'Chrome extension needed', ours: 'No', them: 'Sometimes' },
  { feature: 'AI model choice', ours: 'Groq, Gemini, OpenAI, Claude', them: 'Fixed (usually GPT-3.5)' },
];

const faqs = [
  { q: 'Is this Upwork proposal generator free?', a: 'Yes. The tool itself is completely free. It uses a BYOK model (Bring Your Own Key): you connect your own API key from Groq, Gemini, OpenAI, or Claude. Most providers offer free tiers that are more than sufficient for generating proposals daily. You are never charged by this site.' },
  { q: 'Which AI model gives the best Upwork proposals?', a: 'Groq (Llama 3) and Gemini Flash are the fastest and effectively free. GPT-4o and Claude 3.5 Sonnet produce the most nuanced proposals for complex, high-budget jobs. For most everyday bidding, Groq or Gemini Flash is the right choice: fast, free, and more than capable.' },
  { q: 'Will using an AI proposal generator get me banned from Upwork?', a: 'No. Upwork does not ban accounts for using AI writing tools. The platform explicitly acknowledges that AI is used in the industry. What matters is that your proposal is relevant, personalised, and accurate. If you submit AI-generated proposals that misrepresent your experience or copy-paste them without customisation, that is a problem. The tool generates a starting point: you review it and send what is true.' },
  { q: 'Is my data stored or shared?', a: "No. Your API key is stored only in your browser's local storage. Your job description and freelancer background are sent directly to the AI provider you select (Groq, Gemini, OpenAI, or Anthropic). Nothing is stored on our servers. When you clear your browser data, everything is gone." },
  { q: 'What is BYOK (Bring Your Own Key)?', a: 'BYOK means you connect your own API key from an AI provider rather than paying for a subscription to a proposal tool that marks up that API cost. You get the same AI quality at a fraction of the price. Most AI providers offer free tiers (Groq is free, Gemini has a generous free tier, OpenAI and Claude charge by token at very low rates for text generation).' },
  { q: 'Does it generate screening question answers?', a: "Yes. Paste the client's screening questions into the tool and it generates specific, personalised answers based on the job context and your background. Screening questions are where most proposals lose. This feature handles them in the same 60-second generation." },
];

export default function UpworkProposalGenerator() {
  useEffect(() => {
    const id = 'schema-upwork-proposal-generator';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://ultimatefreelancers.com/upwork-proposal-generator#tool',
          name: 'Upwork Proposal Generator',
          applicationCategory: 'ProductivityApplication',
          applicationSubCategory: 'Writing',
          operatingSystem: 'Web browser',
          browserRequirements: 'Requires JavaScript. Works in any modern browser.',
          description: 'Free AI Upwork proposal generator. Paste a job post, get 3 personalised cover letter variants plus screening question answers in 60 seconds. No account. Bring your own API key.',
          url: 'https://ultimatefreelancers.com/upwork-proposal-generator',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author: { '@type': 'Person', name: 'Muhammad Younus', url: 'https://ultimatefreelancers.com/about' },
          publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
          featureList: [
            '3 proposal variants (short, medium, detailed)',
            'Screening question answers',
            'QDIPC framework',
            'No account required',
            'Browser-only storage',
            'Bring your own API key',
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5',
            ratingCount: '3',
            bestRating: '5',
            worstRating: '1',
          },
          review: [
            {
              '@type': 'Review',
              author: { '@type': 'Person', name: 'Sarah M.' },
              reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
              reviewBody: 'I was sending 10+ proposals daily with zero replies. First week using UltimateFreelancers, I landed two clients totaling $4,200. The AI answers screening questions better than I could.',
            },
            {
              '@type': 'Review',
              author: { '@type': 'Person', name: 'James L.' },
              reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
              reviewBody: 'The 400-word medium proposal length is perfect for most jobs. Clients actually read the whole thing now. My reply rate went from 2% to nearly 15%.',
            },
            {
              '@type': 'Review',
              author: { '@type': 'Person', name: 'Maria G.' },
              reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
              reviewBody: 'As a non-native English speaker, I struggled with professional proposals. This tool makes me sound confident and experienced. Game changer for international freelancers.',
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is this Upwork proposal generator free?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes. The tool itself is completely free. It uses a BYOK model (Bring Your Own Key): you connect your own API key from Groq, Gemini, OpenAI, or Claude. Most providers offer free tiers that are more than sufficient for generating proposals daily. You are never charged by this site.' },
            },
            {
              '@type': 'Question',
              name: 'Which AI model gives the best Upwork proposals?',
              acceptedAnswer: { '@type': 'Answer', text: 'Groq (Llama 3) and Gemini Flash are the fastest and effectively free. GPT-4o and Claude 3.5 Sonnet produce the most nuanced proposals for complex, high-budget jobs. For most everyday bidding, Groq or Gemini Flash is the right choice: fast, free, and more than capable.' },
            },
            {
              '@type': 'Question',
              name: 'Will using an AI proposal generator get me banned from Upwork?',
              acceptedAnswer: { '@type': 'Answer', text: "No. Upwork does not ban accounts for using AI writing tools. The platform explicitly acknowledges that AI is used in the industry. What matters is that your proposal is relevant, personalised, and accurate. If you submit AI-generated proposals that misrepresent your experience or copy-paste them without customisation, that is a problem. The tool generates a starting point: you review it and send what is true." },
            },
            {
              '@type': 'Question',
              name: 'Is my data stored or shared?',
              acceptedAnswer: { '@type': 'Answer', text: "No. Your API key is stored only in your browser's local storage. Your job description and freelancer background are sent directly to the AI provider you select (Groq, Gemini, OpenAI, or Anthropic). Nothing is stored on our servers. When you clear your browser data, everything is gone." },
            },
            {
              '@type': 'Question',
              name: 'What is BYOK (Bring Your Own Key)?',
              acceptedAnswer: { '@type': 'Answer', text: 'BYOK means you connect your own API key from an AI provider rather than paying for a subscription to a proposal tool that marks up that API cost. You get the same AI quality at a fraction of the price. Most AI providers offer free tiers (Groq is free, Gemini has a generous free tier, OpenAI and Claude charge by token at very low rates for text generation).' },
            },
            {
              '@type': 'Question',
              name: 'Does it generate screening question answers?',
              acceptedAnswer: { '@type': 'Answer', text: "Yes. Paste the client's screening questions into the tool and it generates specific, personalised answers based on the job context and your background. Screening questions are where most proposals lose. This feature handles them in the same 60-second generation." },
            },
          ],
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ultimatefreelancers.com' },
            { '@type': 'ListItem', position: 2, name: 'Upwork Proposal Generator', item: 'https://ultimatefreelancers.com/upwork-proposal-generator' },
          ],
        },
        {
          '@type': 'WebPage',
          '@id': 'https://ultimatefreelancers.com/upwork-proposal-generator#webpage',
          url: 'https://ultimatefreelancers.com/upwork-proposal-generator',
          name: 'Free AI Upwork Proposal Generator | Ultimate Freelancers',
          isPartOf: { '@id': 'https://ultimatefreelancers.com/#website' },
          about: { '@id': 'https://ultimatefreelancers.com/upwork-proposal-generator#tool' },
          author: { '@type': 'Person', name: 'Muhammad Younus', '@id': 'https://ultimatefreelancers.com/about#person' },
        },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <>
      <Helmet>
        <title>Free AI Upwork Proposal Generator | Ultimate Freelancers</title>
        <meta name="description" content="Free AI Upwork proposal generator. Paste any job post, get 3 personalised variants plus screening question answers in 60 seconds. No account required." />
        <link rel="canonical" href="https://ultimatefreelancers.com/upwork-proposal-generator" />
        <meta property="og:title" content="Free AI Upwork Proposal Generator | Ultimate Freelancers" />
        <meta property="og:description" content="Free AI Upwork proposal generator. Paste any job post, get 3 personalised variants plus screening question answers in 60 seconds. No account required." />
        <meta property="og:url" content="https://ultimatefreelancers.com/upwork-proposal-generator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Free AI Upwork Proposal Generator | Ultimate Freelancers" />
        <meta name="twitter:description" content="Free AI Upwork proposal generator. Paste any job post, get 3 personalised variants plus screening question answers in 60 seconds. No account required." />
      </Helmet>


      <main className="bg-[#F5F3EE] min-h-screen">

        {/* Hero */}
        <section className="container mx-auto px-4 pt-16 pb-10 max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>Upwork Proposal Generator</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Zap className="w-3.5 h-3.5" />
            Free. No account. Bring your own API key.
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
            Free AI Upwork Proposal Generator
            <span className="block text-primary mt-1">3 Personalised Variants in 60 Seconds</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Paste a job post. Get three Upwork cover letter variants (short, medium, detailed) plus answers to the client's screening questions. Powered by your own API key from Groq, Gemini, OpenAI, or Claude. Nothing stored on our servers. No subscription. No extension.
          </p>

          <Link href="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors text-base"
          >
            Try the Generator Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">What the Tool Does</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-border rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <p className="font-semibold text-foreground text-sm mb-1.5">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
          <div className="space-y-4">
            {howItWorks.map((step) => (
              <div key={step.n} className="bg-white border border-border rounded-xl p-5 flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                  {step.n}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-0.5">{step.step}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Start Generating
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* API providers */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Which API Provider Should You Use?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              The tool works with four providers. All four produce strong proposals. The difference is cost and speed.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Provider</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Cost</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Speed</th>
                    <th className="text-left py-2 font-semibold text-foreground">Best for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {providers.map((row) => (
                    <tr key={row.name}>
                      <td className="py-3 pr-4 font-medium text-foreground">{row.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{row.cost}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{row.speed}</td>
                      <td className="py-3 text-muted-foreground">{row.best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Not sure how to get an API key? See the{' '}
              <Link href="/api-key" className="text-primary hover:underline">API key setup guide</Link>.
            </p>
          </div>
        </section>

        {/* Comparison vs competitors */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Upwork Proposal Generator vs. Paid Tools</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Most paid proposal generators charge $29 to $99 per month and use GPT-3.5 under the hood. This tool is free because you supply the API key directly.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-6 font-semibold text-foreground">Feature</th>
                    <th className="text-left py-2 pr-6 font-semibold text-primary">This tool</th>
                    <th className="text-left py-2 font-semibold text-muted-foreground">Other generators</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {vsTable.map((row) => (
                    <tr key={row.feature}>
                      <td className="py-3 pr-6 font-medium text-foreground">{row.feature}</td>
                      <td className="py-3 pr-6 text-primary font-medium">{row.ours}</td>
                      <td className="py-3 text-muted-foreground">{row.them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why AI generators fail section */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">Why Most AI Proposal Generators Fail (and How This One Avoids It)</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Generic AI generators produce generic proposals. They take the job description and produce a cover letter that any freelancer could have sent. Clients can tell in two sentences.
            </p>
            <div className="space-y-4">
              {[
                {
                  problem: 'Generic openers',
                  solution: 'This tool requires your background and past projects as input. The opening line is derived from the job post and your experience together, not from a template.',
                },
                {
                  problem: 'No proof points',
                  solution: 'The QDIPC framework requires a specific past project to be referenced. The tool pulls from your saved projects to find the most relevant one for each job.',
                },
                {
                  problem: 'Ignored screening questions',
                  solution: 'Screening questions are handled in the same generation pass as the proposal, not as an afterthought. Each answer is contextualised to the job.',
                },
              ].map((item) => (
                <div key={item.problem} className="grid sm:grid-cols-2 gap-3 border border-border rounded-xl p-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">Problem</p>
                    <p className="text-sm font-medium text-foreground">{item.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">How we solve it</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related reading */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-5">Related Reading</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Upwork proposal examples', href: '/upwork-proposal-examples', desc: '10 real proposals with breakdowns of what made each one work.' },
              { label: 'Upwork cover letter examples', href: '/upwork-cover-letter-examples', desc: 'Cover letter samples across 5 niches, each with annotated breakdowns.' },
              { label: 'Freelance proposal templates', href: '/freelance-proposal-template', desc: '5 copy-paste templates for Upwork, Fiverr, email, SOW, and quick pitches.' },
              { label: 'How to submit a proposal on Upwork', href: '/how-to-submit-proposal-upwork', desc: '10-step walkthrough: bid, cover letter, screening questions, and connects.' },
              { label: 'Best API keys for proposals', href: '/blog/best-upwork-api-for-proposals', desc: 'Groq vs Gemini vs OpenAI vs Claude: tested on 50 real Upwork jobs.' },
              { label: 'How to write an Upwork proposal', href: '/blog/how-to-write-upwork-proposal', desc: 'The 5-part QDIPC framework top earners use on every bid.' },
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
