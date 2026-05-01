'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProposal } from '@/context/ProposalContext';

// Landing page components
;
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsBar } from '@/components/landing/StatsBar';
import { ExamplesSection } from '@/components/landing/ExamplesSection';
import { WhatMakesSection } from '@/components/landing/WhatMakesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { SemanticSection } from '@/components/landing/SemanticSection';
import { ResourcesHub } from '@/components/landing/ResourcesHub';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

const Index = () => {
  const { currentPage } = useProposal();
  const router = useRouter();

  useEffect(() => {
    if (currentPage === 'api-selection' || currentPage === 'output') {
      router.push('/generate');
    }
  }, [currentPage]);

  useEffect(() => {
    const id = 'schema-homepage';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://ultimatefreelancers.com/#organization',
          name: 'Ultimate Freelancers',
          url: 'https://ultimatefreelancers.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://ultimatefreelancers.com/Logo---Ultimate-Freelancers.png',
            width: 200,
            height: 60,
          },
          email: 'support@ultimatefreelancer.com',
          description: 'Free AI-powered Upwork proposal and cover letter generator. No account required, bring your own API key.',
          foundingDate: '2024',
          sameAs: [
            'https://twitter.com/UltimateFreelancers',
            'https://www.linkedin.com/company/ultimate-freelancers',
          ],
        },
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://ultimatefreelancers.com/#software',
          name: 'Ultimate Freelancers — Free AI Upwork Proposal Generator',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          url: 'https://ultimatefreelancers.com/',
          image: 'https://ultimatefreelancers.com/og-image.png',
          description: 'Free AI-powered Upwork proposal and cover letter generator. Paste any job post and get 3 personalized variants with screening question answers in under 60 seconds. No account required.',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/OnlineOnly' },
          publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
          featureList: [
            'Generate 3 Upwork proposal variants simultaneously',
            'Answer Upwork screening questions automatically',
            'QDIPC proposal structure framework',
            'Supports OpenAI, Claude, Gemini, Groq, DeepSeek, Perplexity',
            'No account or sign-up required',
            'Free tier available with Groq and Gemini API keys',
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
            { '@type': 'Question', name: 'Is the Upwork proposal generator free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The tool has no subscription fee. You bring your own API key from OpenAI, Claude, Gemini, Groq, DeepSeek, or Perplexity. Groq and Gemini offer free tiers covering hundreds of proposals per day. On paid tiers, most proposals cost under $0.05.' } },
            { '@type': 'Question', name: 'Does an AI proposal generator produce proposals clients can detect?', acceptedAnswer: { '@type': 'Answer', text: 'Not with QDIPC structure. The tool opens every proposal with an observation or question tied specifically to the client job post. Clients see a proposal that sounds like someone who understood their problem, not a generic template.' } },
            { '@type': 'Question', name: 'How is this different from using ChatGPT directly?', acceptedAnswer: { '@type': 'Answer', text: 'ChatGPT produces one proposal and requires you to write the prompt yourself. Ultimate Freelancers generates three variants simultaneously, answers every screening question, matches your past projects, and provides a reply assistant.' } },
            { '@type': 'Question', name: 'How long should an Upwork proposal be?', acceptedAnswer: { '@type': 'Answer', text: 'Short (100-150 words) for simple tasks. Medium (150-200 words) for standard projects. Detailed (200-300 words) for complex or high-budget work.' } },
            { '@type': 'Question', name: 'Do I need a Chrome extension or account to use the generator?', acceptedAnswer: { '@type': 'Answer', text: 'No. No Chrome extension, no account, no sign-up required. The tool works in any browser on any device from the first visit.' } },
            { '@type': 'Question', name: 'Is my API key stored on your servers?', acceptedAnswer: { '@type': 'Answer', text: 'No. Your API key is stored only in your browser session storage and disappears when you close the tab. We never receive, log, or store it.' } },
            { '@type': 'Question', name: 'What is the QDIPC framework?', acceptedAnswer: { '@type': 'Answer', text: 'QDIPC stands for Question, Diagnosis, Insight, Package, CTA. Every generated proposal follows this structure to sound specific to each job post.' } },
          ],
        },
        {
          '@type': 'SiteNavigationElement',
          '@id': 'https://ultimatefreelancers.com/#nav',
          url: 'https://ultimatefreelancers.com',
          name: 'Main Navigation',
          hasPart: [
            { '@type': 'SiteNavigationElement', name: 'Examples', url: 'https://ultimatefreelancers.com/#examples' },
            { '@type': 'SiteNavigationElement', name: 'How It Works', url: 'https://ultimatefreelancers.com/#how-it-works' },
            { '@type': 'SiteNavigationElement', name: 'Features', url: 'https://ultimatefreelancers.com/#features' },
            { '@type': 'SiteNavigationElement', name: 'Blog', url: 'https://ultimatefreelancers.com/blog' },
            { '@type': 'SiteNavigationElement', name: 'About', url: 'https://ultimatefreelancers.com/about' },
            { '@type': 'SiteNavigationElement', name: 'FAQ', url: 'https://ultimatefreelancers.com/#faq' },
          ],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://ultimatefreelancers.com/#website',
          url: 'https://ultimatefreelancers.com',
          name: 'Ultimate Freelancers',
          description: 'Free AI Upwork proposal and cover letter generator',
          publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: 'https://ultimatefreelancers.com/?q={search_term_string}' },
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'WebPage',
          '@id': 'https://ultimatefreelancers.com/#webpage',
          url: 'https://ultimatefreelancers.com',
          name: 'Free Upwork Proposal Generator | Ultimate Freelancers',
          isPartOf: { '@id': 'https://ultimatefreelancers.com/#website' },
          about: { '@id': 'https://ultimatefreelancers.com/#software' },
          author: { '@id': 'https://ultimatefreelancers.com/#organization' },
        },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <StatsBar />
        <ExamplesSection />
        <WhatMakesSection />
        <HowItWorksSection />
        <ComparisonSection />
        <FeaturesSection />
        <UseCasesSection />
        <SemanticSection />
        <ResourcesHub />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
