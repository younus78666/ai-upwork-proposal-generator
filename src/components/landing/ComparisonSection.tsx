export const ComparisonSection = () => {
  return (
    <section className="border-y border-border py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="section-tag">The Problem</span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em]">
            Why most proposals get{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              ignored
            </em>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
            Clients receive 20–50 proposals per job. Most sound identical. Here's what separates winners from noise.
          </p>
        </div>

        <div className="reveal mx-auto grid max-w-[880px] gap-6 md:grid-cols-2">
          {/* Bad */}
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-9">
            <span className="mb-5 block text-3xl">😩</span>
            <h3 className="mb-5 text-[19px] font-bold">Generic Proposals</h3>
            <ul className="space-y-3.5">
              {[
                '"I am a skilled professional with 5+ years…"',
                'Copy-paste the same template every time',
                'List skills without linking to client needs',
                'No diagnosis of the actual problem',
                '"Looking forward to hearing from you"',
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 text-[14.5px] text-muted-foreground">
                  <span className="mt-0.5 text-red-500 flex-shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Good */}
          <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-9">
            <span className="mb-5 block text-3xl">🎯</span>
            <h3 className="mb-5 text-[19px] font-bold">Ultimate Freelancers Proposals</h3>
            <ul className="space-y-3.5">
              {[
                'Open with a specific project observation',
                "Diagnose problems the client didn't mention",
                'Reference relevant past work with proof',
                'Ask smart questions that show expertise',
                'Close with a no-pressure next step',
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 text-[14.5px] text-muted-foreground">
                  <span className="mt-0.5 text-primary flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
