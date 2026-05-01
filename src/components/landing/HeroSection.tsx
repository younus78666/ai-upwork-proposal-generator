'use client'
import { InputForm } from '@/components/InputForm';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

function useProposalCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.rpc as any)('get_total_proposals_count').then(({ data }: any) => {
      if (data != null) setCount(Number(data));
    });
  }, []);

  if (count === null) return null;
  // format with commas and round to nearest 10 so it feels like a live stat
  const display = Math.max(count, 1);
  return display.toLocaleString();
}

export const HeroSection = () => {
  const proposalCount = useProposalCount();

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-16 text-center">
      {/* Radial wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[140%] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/[0.06] to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Eyebrow */}
        <div className="mb-8 inline-flex animate-fade-in items-center gap-2.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-sm">
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">Free</span>
          No account · No subscription · BYOK
        </div>

        {/* H1 */}
        <h1 className="mx-auto mb-5 max-w-3xl animate-slide-up text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.08] tracking-[-0.04em] text-foreground">
          Stop Guessing. Start{' '}
          <em className="font-serif-italic not-italic text-primary" style={{ fontStyle: 'italic', fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400 }}>
            Winning
          </em>{' '}
          on Upwork.
        </h1>

        <p className="mx-auto mb-8 max-w-[520px] animate-slide-up text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: '100ms' }}>
          Paste any job post. Get 3 tailored proposals in 60 seconds: Short, Medium, and Detailed, each with a different hook. Plus strategic answers to every screening question.
        </p>

        {/* Trust row */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '150ms' }}>
          <span>✓ No Chrome extension</span>
          <span className="w-px h-3.5 bg-border" />
          <span>✓ No account required</span>
          <span className="w-px h-3.5 bg-border" />
          <span>✓ Free (BYOK)</span>
          {proposalCount && (
            <>
              <span className="w-px h-3.5 bg-border" />
              <span className="font-medium text-foreground">
                {proposalCount} proposals generated
              </span>
            </>
          )}
        </div>

        {/* Browser-chrome product frame */}
        <div className="reveal relative mx-auto max-w-[900px]">

          {/* Chrome frame — no overflow-hidden so absolute dropdowns inside InputForm can escape */}
          <div className="rounded-2xl border border-border bg-card shadow-[0_24px_80px_rgba(26,26,46,0.12)]">
            {/* Chrome bar */}
            <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-4 py-3.5 rounded-t-2xl">
              <div className="h-3 w-3 rounded-full bg-[#FF6058]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBF2F]" />
              <div className="h-3 w-3 rounded-full bg-[#27CA41]" />
              <div className="mx-auto rounded border border-border/60 bg-background px-4 py-1 font-mono text-[11px] text-muted-foreground">
                ultimatefreelancers.com
              </div>
            </div>
            {/* App content */}
            <div className="p-4 md:p-6">
              <InputForm embedded />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
