import { ArrowRight } from 'lucide-react';

const resources = [
  {
    href: '/upwork-cover-letter-examples',
    label: '10 Real Upwork Cover Letter Examples That Win Jobs',
    description:
      'Browse short, medium, and detailed cover letter samples with the job posts they responded to. See the structure, the opening lines, and what makes each one work.',
    cta: 'Browse examples',
  },
  {
    href: '/upwork-message-to-client-sample',
    label: '15 Upwork Message-to-Client Templates',
    description:
      'Copy-ready templates for every client situation: first contact, follow-up, clarification request, project update, and polite decline.',
    cta: 'Get templates',
  },
  {
    href: '/blog/how-to-write-upwork-proposal',
    label: 'How to Write an Upwork Proposal That Gets Responses',
    description:
      'Structure, word count benchmarks, opening line formulas, and 5 mistakes that guarantee your proposal gets skipped.',
    cta: 'Read the guide',
  },
];

export const ResourcesHub = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="section-tag">Resources</span>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em] text-foreground">
            Proposal and cover letter{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              resources
            </em>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
            Real examples, copy-ready templates, and step-by-step guides: everything you need to write and send winning proposals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {resources.map((r, i) => (
            <a
              key={i}
              href={r.href}
              className="group bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col"
            >
              <h3 className="font-semibold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                {r.label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {r.description}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                {r.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
