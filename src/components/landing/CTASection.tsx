import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const onGetStarted = () => {
    document.getElementById('job-title')?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Background decoration */}
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            </div>
            
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.04em] text-foreground mb-6">
              Ready to win more{' '}
              <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                Upwork clients?
              </em>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Stop spending hours writing proposals that get ignored. 
              Generate personalized, client-focused proposals in 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="px-10 py-6 text-base font-bold"
              >
                Try the Upwork Proposal Generator
                <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base font-medium"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch 2-Minute Demo
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              No account required. Use your own API key. Start generating in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
