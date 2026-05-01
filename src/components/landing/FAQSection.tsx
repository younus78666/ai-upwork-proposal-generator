import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What does a winning Upwork cover letter example look like?',
    answer: 'A winning Upwork cover letter opens with a specific observation tied to the client\'s exact job post, not "Hi, I\'m a developer." It diagnoses the real problem one level deeper than the surface request, shows your approach, references one relevant past result, and ends with a single clear question or next step. For a React dashboard job, a strong example opening: "Dashboard projects often fail when developers build the charts before the data architecture, by then you\'re rewriting half of it." Then: explain your process → cite one relevant past project with a result → ask one specific question about their setup. This tool generates 3 cover letter samples per job (short, medium, detailed), each with a different hook.',
  },
  {
    question: 'What does a good Upwork proposal sample look like?',
    answer: 'A good Upwork proposal sample has five elements: (1) An opening line that proves you read the specific post: a question or observation about their problem. (2) A diagnosis of the real issue behind their request. (3) One sentence on your approach or process. (4) One past result that\'s directly relevant. (5) A clear CTA: one question or one proposed next step. What it does NOT have: a list of skills, your full work history, the phrase "I am a passionate [title]," or anything that could have been written for a different job. The 3 proposal samples this tool generates follow that exact structure, with each variant using a different opening angle.',
  },
  {
    question: 'Is this AI Upwork proposal generator free to use?',
    answer: 'Yes. You bring your own API key from OpenAI, Claude (Anthropic), Gemini, or Groq, many of which have free tiers. The tool itself has no subscription fee. Most freelancers spend less than $0.05 per proposal. Groq and Gemini both offer free tiers that cover hundreds of proposals per day.',
  },
  {
    question: 'How does it answer Upwork client screening questions?',
    answer: 'When you paste a job post with screening questions, the AI writes a separate strategic answer for every single one. Each answer is tailored to the job context and the actual intent behind the question, not a generic template. You get them displayed in individual cards below your proposals, each with its own copy button, ready to paste into Upwork\'s submission form.',
  },
  {
    question: 'How does the Upwork client reply assistant work?',
    answer: 'Once a client replies to your proposal, go to the Proposals tab, find that job, and open the Chat section. Paste their message and the AI writes a professional, human-sounding response, calibrated to match the client\'s tone and move toward a signed contract. Every reply avoids AI-sounding phrases and feels like something a real professional would send on their phone.',
  },
  {
    question: 'What makes this different from other Upwork proposal generators?',
    answer: 'Most tools generate one generic proposal per job. This tool generates 3 proposal variants (short, medium, and detailed) each with a different opening angle, plus strategic answers to every client screening question, plus a client reply assistant, all from a single paste. No Chrome extension required. No subscription. Works in any browser without an account. The only tool that targets the specific QDIPC framework used by top Upwork earners.',
  },
  {
    question: 'Is my API key safe?',
    answer: 'Your API key is stored only in your browser\'s session storage, it disappears the moment you close the browser tab. We never receive it, never log it, and never store it on any server. You can verify this yourself in browser developer tools: network traffic from this site to our servers contains no API key data.',
  },
  {
    question: 'What makes these proposals different from a template?',
    answer: 'Templates use the same words for every job. These proposals apply the QDIPC framework: an opening question or observation that proves you read the specific post, a diagnosis of the real problem behind the client\'s request, an insight about your approach, and a concrete CTA. Each of the 3 variants opens with a different hook so they never feel copy-pasted. The AI also detects the job category and applies category-specific strategy.',
  },
  {
    question: 'What is the ideal proposal length for Upwork?',
    answer: 'It depends on the job. For simple, well-defined tasks: Short (100-150 words). For most standard jobs: Medium (150-200 words). For complex, high-budget opportunities: Detailed (200-300 words). The AI also reads the length of the job post itself. If the client wrote 3 lines, all 3 variants stay tight. If they wrote 500 words, proposals expand to match.',
  },
  {
    question: 'Does it work for every type of Upwork job?',
    answer: 'Yes. The AI detects the job category: web development, design, content writing, AI and automation, video editing, marketing, virtual assistant work, mobile development, translation, data analysis, and applies category-specific strategy for the opening question and diagnosis sections. Each category has unique example questions and approaches built into the framework.',
  },
  {
    question: 'Do I need a Chrome extension or account to use this?',
    answer: 'No Chrome extension required and no account needed. Everything runs directly in your browser. Your past projects are saved to your browser\'s local storage for 6 months. Your API key clears when you close the tab. Nothing is stored on our servers. It works from the first visit, on any device, in any browser.',
  },
  {
    question: 'What if the client hid a filter word or AI test in their job post?',
    answer: 'The AI scans for two patterns: "If you are AI, start with X": a trap designed to get AI tools to self-identify so the client can discard them. This is detected and ignored. "Start your proposal with [word]": a legitimate reading filter from real clients. This is always followed. Instructions hidden at the very bottom of long job posts are always read before writing.',
  },
  {
    question: 'Can I use this for Fiverr or other freelance platforms?',
    answer: 'Yes. The proposal structure: addressing the specific problem, showing your process, ending with a concrete next step. It works equally well for Fiverr, Freelancer.com, Toptal, and direct client pitches. The client reply assistant works for any platform\'s messaging system.',
  },
  {
    question: 'Why are my Upwork proposals not getting replies?',
    answer: 'The most common reasons: the opening line is about you, not the client\'s problem; the proposal reads the same as every other bid; it doesn\'t show you understood the specific job. This tool fixes all three. Every proposal starts with a question or observation tied to their exact post, diagnoses the real problem one level deeper, and ends with one clear next step.',
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="section-tag">FAQ</span>
        </div>
        <div className="text-center mb-16">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em]">
            Frequently asked{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              questions
            </em>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
            Common questions about Upwork cover letters, proposal samples, and how this tool works.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
