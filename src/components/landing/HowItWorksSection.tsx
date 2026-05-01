export const HowItWorksSection = () => {
  const steps = [
    {
      num: '01',
      title: 'Paste the Job Post',
      desc: 'Copy any Upwork job listing: title, body, and screening questions. The AI reads every line, including hidden instructions at the bottom that most freelancers miss.',
      tag: '5 seconds',
    },
    {
      num: '02',
      title: 'Add Your Projects (Once)',
      desc: 'Save up to 20 past projects with descriptions and outcomes. The AI picks the single most relevant one and weaves it naturally into each proposal.',
      tag: 'One time',
    },
    {
      num: '03',
      title: 'Get 3 Variants + Answers',
      desc: 'Within 60 seconds: Short, Medium, and Detailed proposals, each with a unique hook, plus strategic answers to every screening question. Copy, paste, send.',
      tag: 'Ready to send',
    },
  ];

  return (
    <section id="how-it-works" className="border-y border-border bg-[#F5F3EE] py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="section-tag">How It Works</span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em] text-foreground">
            Three steps to your next{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              interview
            </em>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
            No blank screen. No templates. The AI reads the job, understands the client, and writes like you would on your best day.
          </p>
        </div>

        <div className="reveal grid gap-px md:grid-cols-3 bg-border rounded-2xl overflow-hidden border border-border">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group bg-card p-10 transition-colors hover:bg-primary/[0.03]"
            >
              <div
                className="mb-5 text-[3.5rem] leading-none text-primary opacity-30"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}
              >
                {step.num}
              </div>
              <h3 className="mb-3 text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{step.desc}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
                ⏱ {step.tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
