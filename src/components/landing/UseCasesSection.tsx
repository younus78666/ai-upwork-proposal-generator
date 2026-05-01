import { Code, Search, Headphones, Palette } from 'lucide-react';

const useCases = [
  {
    icon: Code,
    title: 'Upwork Proposal Generator for WordPress Developers',
    description: 'Highlight your theme customization, plugin development, and WooCommerce expertise. The AI understands technical requirements and positions you as the expert.',
  },
  {
    icon: Search,
    title: 'Proposal Generator for SEO & PPC Freelancers',
    description: 'Showcase your keyword research, Google Ads management, and analytics skills. Generate proposals that speak the language of ROI-focused clients.',
  },
  {
    icon: Headphones,
    title: 'Cover Letter Generator for Virtual Assistants',
    description: 'Emphasize your organizational skills, communication abilities, and tool proficiency. Perfect for admin, data entry, and customer support roles.',
  },
  {
    icon: Palette,
    title: 'Design & Branding Proposal Generator',
    description: 'Present your creative process, portfolio highlights, and brand strategy experience. Win logo, UI/UX, and visual identity projects.',
  },
];

export const UseCasesSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="section-tag">Use Cases</span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em] text-foreground">
            Works for every{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              freelance niche
            </em>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
            Whether you're a developer, marketer, designer, or virtual assistant, our AI proposal writer for Upwork adapts to your specialty and speaks your client's language.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="flex gap-4 p-6 bg-card rounded-xl border border-border hover-lift"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <useCase.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {useCase.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
