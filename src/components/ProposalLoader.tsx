'use client'
import { useEffect, useState, useRef } from 'react';

// Each phase activates when pct crosses its `from` value
const PHASES = [
  { from: 0,  label: 'Reading your job description…'   },
  { from: 12, label: 'Analysing client requirements…'  },
  { from: 25, label: 'Matching your past projects…'    },
  { from: 38, label: 'Crafting your opening hook…'     },
  { from: 52, label: 'Writing 3 proposal variants…'    },
  { from: 64, label: 'Adding why-me bullets…'          },
  { from: 76, label: 'Scoring win chances…'            },
  { from: 85, label: 'Polishing tone and voice…'       },
  { from: 93, label: 'Almost ready…'                   },
];

function getLabel(pct: number): string {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (pct >= PHASES[i].from) return PHASES[i].label;
  }
  return PHASES[0].label;
}

interface Props {
  visible: boolean;
}

export function ProposalLoader({ visible }: Props) {
  const [pct, setPct]     = useState(0);
  const rafRef            = useRef<number | null>(null);
  const startRef          = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) {
      setPct(0);
      startRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    // 35 s to reach 99 — ensures the counter never stops before the real call finishes.
    // If the call finishes sooner the parent sets visible=false and we reset.
    const TOTAL_MS = 35_000;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed  = now - startRef.current;
      const progress = Math.min(elapsed / TOTAL_MS, 1);
      // ease-out cubic so it slows near 99 and never quite reaches it
      const eased = 1 - Math.pow(1 - progress, 2.4);
      const next  = Math.min(Math.floor(eased * 99), 99);
      setPct(next);
      if (next < 99) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/96 backdrop-blur-md">

      {/* Giant percentage */}
      <div
        className="font-display font-bold leading-none tabular-nums select-none"
        style={{
          fontSize: 'clamp(7rem, 22vw, 11rem)',
          letterSpacing: '-0.05em',
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.6) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {pct}
        <span style={{ fontSize: '0.38em', opacity: 0.5 }}>%</span>
      </div>

      {/* Thin progress bar */}
      <div className="mt-7 w-56 sm:w-72 h-[3px] rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: `${pct}%`,
            transition: 'width 0.25s ease-out',
          }}
        />
      </div>

      {/* Phase label */}
      <p
        key={getLabel(pct)}
        className="mt-6 text-sm font-medium text-muted-foreground tracking-wide text-center px-8 animate-fade-in"
        style={{ minHeight: '1.4rem' }}
      >
        {getLabel(pct)}
      </p>

      {/* Static hint */}
      <p className="mt-2 text-xs text-muted-foreground/40 tracking-wider uppercase">
        Writing 3 personalised proposals
      </p>
    </div>
  );
}
