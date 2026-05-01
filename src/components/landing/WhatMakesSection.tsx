const qdipcRows = [
  {
    element: 'Q: Question / Observation',
    does: 'Proves you read their post specifically',
    words: '1–2 sentences',
  },
  {
    element: 'D: Diagnosis',
    does: 'Names the real problem one level deeper',
    words: '2–3 sentences',
  },
  {
    element: 'I: Insight',
    does: 'Your approach or process for this project type',
    words: '2–3 sentences',
  },
  {
    element: 'P: Package',
    does: 'One relevant past result, named specifically',
    words: '1–2 sentences',
  },
  {
    element: 'C: CTA',
    does: 'One question or one proposed next step',
    words: '1 sentence',
  },
];

export const WhatMakesSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-4">
            <span className="section-tag">The Framework</span>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em] text-foreground">
              What makes a proposal get a{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                reply?
              </em>
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
              Most proposals don't get replies because of the first line. If your opening is "Hi, I'm an experienced developer with 5 years of experience," the client has already moved on. They received 30 versions of that sentence from 30 different people.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm mb-8">
            <p className="text-foreground font-medium mb-2">
              A proposal that gets a reply opens with something that proves you read the specific post.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Not your background: their problem. The best opening lines are either a sharp observation about the project ("Dashboard projects usually fail at the data architecture stage, not the UI") or a direct question that shows you understood the real challenge.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-4">
            The QDIPC Structure, Applied to Every Variant
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Element</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">What it does</th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">Length</th>
                </tr>
              </thead>
              <tbody>
                {qdipcRows.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}
                  >
                    <td className="px-5 py-3 font-medium text-primary whitespace-nowrap">
                      {row.element}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{row.does}</td>
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                      {row.words}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-muted-foreground mt-5 text-center">
            The generator applies this structure to every variant and changes the opening angle between short, medium, and detailed so they never read as the same template scaled up.
          </p>
        </div>
      </div>
    </section>
  );
};
