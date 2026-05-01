import { Brain, TrendingUp, MessageSquareText, Layout } from 'lucide-react';

const approaches = [
  {
    icon: Brain,
    title: 'Contextualization',
    description: 'Our AI reads the entire job description and identifies the client\'s real problem, not just the surface request. Your proposal addresses their specific pain points, timeline concerns, and desired outcomes.',
  },
  {
    icon: TrendingUp,
    title: 'Commercialization',
    description: 'Every proposal focuses on results, ROI, and deliverables. Instead of generic promises, you offer concrete outcomes: "increase conversions by 30%" or "deliver 5 landing pages in 2 weeks."',
  },
  {
    icon: MessageSquareText,
    title: 'Verbalization',
    description: 'We use varied phrase patterns, natural language, and conversational tone. No robotic templates or repetitive structures. Each proposal sounds uniquely human and professionally confident.',
  },
  {
    icon: Layout,
    title: 'Visualization',
    description: 'Proposals are structured with clear sections, scannable formatting, and strategic emphasis. Clients can quickly find your qualifications, approach, and pricing without walls of text.',
  },
];

export const SemanticSection = () => {
  return (
    <section className="py-20 md:py-28 bg-[#F5F3EE]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <span className="section-tag">Methodology</span>
          </div>
          <div className="text-center mb-16">
            <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em] text-foreground">
              The science behind higher{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                reply rates
              </em>
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
              Ultimate Freelancers doesn't just generate text. It applies proven persuasion frameworks
              to maximize your chances of getting hired.
            </p>
          </div>

          <div className="space-y-6">
            {approaches.map((approach, index) => (
              <div 
                key={index}
                className="flex flex-col md:flex-row gap-6 p-6 bg-card rounded-2xl border border-border hover-lift"
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <approach.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {approach.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {approach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/20 text-center">
            <p className="text-foreground font-medium">
              Result: Freelancers using these four principles report{' '}
              <span className="text-primary font-bold">3x higher response rates</span>{' '}
              compared to generic template users.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
