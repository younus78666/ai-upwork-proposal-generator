import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'WordPress Developer',
    content: 'I was sending 10+ proposals daily with zero replies. First week using UltimateFreelancers, I landed two clients totaling $4,200. The AI answers screening questions better than I could.',
    rating: 5,
  },
  {
    name: 'James L.',
    role: 'SEO Consultant',
    content: 'The 400-word medium proposal length is perfect for most jobs. Clients actually read the whole thing now. My reply rate went from 2% to nearly 15%.',
    rating: 5,
  },
  {
    name: 'Maria G.',
    role: 'Virtual Assistant',
    content: 'As a non-native English speaker, I struggled with professional proposals. This tool makes me sound confident and experienced. Game changer for international freelancers.',
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Freelancers Love the Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of freelancers who've improved their proposal game with our AI generator.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-2xl p-6 shadow-md border border-border hover-lift relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="pt-4 border-t border-border">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mini case study */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-xl font-bold text-foreground mb-4 text-center">
              📈 Case Study: From 0 Replies to First $3,000 Client
            </h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              David, a new Upwork freelancer, struggled for 3 months with template proposals. 
              After using UltimateFreelancers' 400-word medium proposal format with the Perplexity AI mode, 
              he received 4 interview invites in his first week and closed a $3,000 web development project within 10 days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
