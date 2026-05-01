'use client'
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JOB_POST = `Looking for a React developer to build a customer dashboard for our SaaS product. We need real-time data visualization, user authentication, and a clean, responsive design. Our current backend is Node.js with a REST API. Budget: $2,000–$4,000. Timeline: 4–6 weeks. Please include examples of dashboards you've built.`;

const proposals = {
  short: {
    label: 'Short',
    words: '~130 words',
    text: `Dashboard projects usually fail when developers build the charts before the data architecture, by then you're rewriting half of it.

I'd start with your API contracts and data model so every visualization knows exactly what it's rendering. Then a clean React component layer your team can extend long after handoff. Real-time updates via WebSocket or polling depending on how fresh your data needs to be.

I've built 6 SaaS dashboards in React including a live analytics view handling 40k+ events/day for a logistics company.

One question before scoping: is auth handled by an existing service (Supabase, Auth0) or built from scratch? That's the variable that shifts your timeline between 4 and 6 weeks.`,
  },
  medium: {
    label: 'Medium',
    words: '~190 words',
    text: `Most dashboard projects hit the same wall: the UI looks great in the demo and breaks in production when real users hit it with incomplete data and slow connections. The reason is almost always that the component layer and the data layer were designed separately.

My process for SaaS dashboards: define the API contracts first, build a typed data layer second, then wire up components that degrade gracefully when data is delayed or missing. Your Node.js REST API makes this straightforward. I'd add a lightweight caching layer so the UI doesn't flash on every refresh.

For your project: 4 weeks is achievable if auth is handled by an existing service. If auth needs to be built from scratch, 6 weeks is the honest number. I'll give you both a fixed-price quote and a milestone-based breakdown so you can decide what works for your budget.

I've built 6 SaaS dashboards in React, one for a logistics company handling 40k+ real-time events per day. Happy to share the case study.

What data sources is the dashboard pulling from: just your own API, or third-party integrations too?`,
  },
  detailed: {
    label: 'Detailed',
    words: '~260 words',
    text: `Dashboard projects fail at the data architecture stage more often than the UI stage. Developers build the charts first, then discover the API doesn't return data in the shape the components expect, and by then, refactoring costs more than starting clean. I've seen this pattern across 6 SaaS dashboard builds.

My approach for your project:

Week 1: Audit your Node.js API and define the exact data contracts each view needs. Agree on real-time strategy (WebSocket for live feeds, polling for near-real-time). Set up the React project with a typed API layer that handles loading, error, and empty states from day one.

Weeks 2–3: Build the core dashboard views with real data. Auth integration (Auth0, Supabase, or custom JWT) and role-based access control if needed. Mobile-responsive layout that actually works on tablets, not just desktop.

Week 4: Edge cases, performance optimization, and handoff documentation your team can maintain without me.

The 4-week estimate holds if auth is handled by an existing provider. Custom auth from scratch adds 1–2 weeks. I'll be upfront about that before we start.

Past work: a real-time logistics dashboard in React handling 40k+ events per day, a SaaS billing analytics view with Stripe data, and a multi-tenant admin panel for a B2B tool. I can share whichever is most relevant to your stack.

Two questions: what's your auth setup, and are you pulling data from your own API only or third-party services too?`,
  },
};

export const ExamplesSection = () => {
  const [active, setActive] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(proposals[active].text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="examples" className="py-20 md:py-28 bg-[#F5F3EE]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="section-tag">Examples</span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em] text-foreground">
            Real Upwork{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              proposal examples
            </em>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
            Three cover letter samples generated from one job post: short, medium, and detailed. Each opens with a different angle. This is what the AI produces for your jobs.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Job post */}
          <div className="bg-secondary/50 rounded-2xl border border-border p-6 mb-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Example Job Post
            </p>
            <p className="text-foreground leading-relaxed text-sm">{JOB_POST}</p>
          </div>

          {/* Variant tabs */}
          <div className="flex gap-2 mb-4">
            {(['short', 'medium', 'detailed'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setActive(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active === v
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {proposals[v].label}
                <span className="ml-2 text-xs opacity-70">{proposals[v].words}</span>
              </button>
            ))}
          </div>

          {/* Proposal content */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {proposals[active].label} Upwork Cover Letter Example
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">
              {proposals[active].text}
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Paste your own job post above to generate 3 personalized examples like this for any Upwork job.
          </p>
        </div>
      </div>
    </section>
  );
};
