'use client'
import { useState, useEffect } from 'react';
import { Helmet } from '@/lib/helmet-stub';
import { Copy, Check, ArrowRight } from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ── Template data ──────────────────────────────────────────────────────────────

type Template = {
  id: string;
  scenario: string;
  tone: string;
  words: number;
  text: string;
};

type Section = {
  heading: string;
  intro: string;
  templates: Template[];
};

const sections: Section[] = [
  {
    heading: 'First Message to Client on Upwork',
    intro:
      'These templates cover the first time you reach out after submitting a proposal, getting an invite, or being hired.',
    templates: [
      {
        id: 'invited-to-interview',
        scenario: 'After Being Invited to Interview',
        tone: 'Professional, warm',
        words: 65,
        text: `Hi [Client Name],

Thank you for the invite. I've reviewed your job post carefully and I'm interested in the project.

A quick question before we get into the details: is the [specific requirement from their post] already in place, or would that be part of what I'm scoping?

Happy to jump on a call or continue here, whichever works best for you.

[Your Name]`,
      },
      {
        id: 'follow-up-after-proposal',
        scenario: 'Follow-Up After Submitting a Proposal (No Response)',
        tone: 'Brief, non-pushy',
        words: 55,
        text: `Hi [Client Name],

I sent a proposal a few days ago for [Job Title] and wanted to make sure it came through.

If you have any questions about my approach or want to discuss the project in more detail, I'm available this week.

Either way, best of luck with the hire.

[Your Name]`,
      },
      {
        id: 'clarification-before-bidding',
        scenario: 'Asking for Job Post Clarification',
        tone: 'Direct, specific',
        words: 60,
        text: `Hi [Client Name],

I'm putting together a proposal for your [Job Title] post and have one question before I finalise it: [specific question about scope, tech stack, timeline, or deliverable].

The answer will affect how I structure the approach and estimate the timeline. Happy to get into more detail once I hear back.

[Your Name]`,
      },
      {
        id: 'accepting-contract-offer',
        scenario: 'Accepting a Contract Offer',
        tone: 'Confident, forward-looking',
        words: 70,
        text: `Hi [Client Name],

Thank you for the offer. I'm accepting and looking forward to working on this with you.

Before I start, a couple of things that will help me hit the ground running: [2 specific onboarding questions: access, tools, existing materials, or priority].

I'll [specific first deliverable or first action] by [date]. Let me know if there's anything else you'd like to cover before we kick off.

[Your Name]`,
      },
      {
        id: 'intro-after-hire',
        scenario: 'Introducing Yourself After Being Hired',
        tone: 'Professional, organised',
        words: 80,
        text: `Hi [Client Name],

Glad we're working together on this. Here's how I like to start a new project to make sure we're aligned from day one:

1. Confirm the primary goal and what "done" looks like
2. Agree on how we'll communicate (here, email, Slack, or call)
3. Identify any access or materials I'll need from your side

From your post, I understand the main objective is [restate key goal from job post]. Does that match your priority, or is there something more pressing?

[Your Name]`,
      },
    ],
  },
  {
    heading: 'Upwork Follow-Up Message to Client',
    intro:
      'Use these when the conversation has gone quiet: after an interview, after submitting a milestone, or after a proposal that got initial interest.',
    templates: [
      {
        id: 'no-response-48hrs',
        scenario: 'No Response After 48 Hours',
        tone: 'Light, non-desperate',
        words: 50,
        text: `Hi [Client Name],

Just checking in. Did you get a chance to review what I sent?

No pressure at all, I know you're reviewing multiple proposals. If there's any additional information that would help you decide, I'm happy to provide it.

[Your Name]`,
      },
      {
        id: 'after-interview-no-decision',
        scenario: 'After Interview, No Decision Yet',
        tone: 'Confident, respectful',
        words: 65,
        text: `Hi [Client Name],

It was good speaking with you [yesterday / earlier this week]. I wanted to follow up and see if you had any remaining questions after our conversation.

If you're still evaluating options, I'm happy to clarify anything about my approach, timeline, or pricing. Otherwise, I'm ready to start as soon as you give the go-ahead.

[Your Name]`,
      },
      {
        id: 'job-closed-reaching-out',
        scenario: 'Job Post Closed, Reaching Out Directly',
        tone: 'Respectful, brief',
        words: 60,
        text: `Hi [Client Name],

I noticed the post for [Job Title] has closed. I had submitted a proposal and wanted to reach out directly in case you're still in the decision phase or have a similar project coming up.

If the role is filled, no worries at all. I wish you success with it. If there's still an opening, I'd be glad to reconnect.

[Your Name]`,
      },
    ],
  },
  {
    heading: 'Upwork Project Update Message to Client',
    intro:
      'Keep clients informed without over-communicating. These templates cover milestone delivery, delay notification, and requesting mid-project feedback.',
    templates: [
      {
        id: 'milestone-delivery',
        scenario: 'Delivering a Milestone',
        tone: 'Clear, professional',
        words: 75,
        text: `Hi [Client Name],

[Milestone name] is complete. Here's a summary of what's been delivered:

- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

You can review it at [link or attachment]. Please let me know if anything needs adjusting before I move on to [next milestone].

If everything looks good, I'll start on [next step] on [date].

[Your Name]`,
      },
      {
        id: 'delay-notification',
        scenario: 'Delay Notification',
        tone: 'Honest, solution-focused',
        words: 70,
        text: `Hi [Client Name],

I want to flag early that [deliverable] will take [X additional days] longer than originally scoped.

The reason: [specific, honest reason: unexpected complexity, dependency on third-party, scope addition].

To keep the overall project on track, I'll [specific action to mitigate: prioritise this, work additional hours, adjust scope elsewhere]. The revised delivery date is [new date].

Let me know if this creates any issues on your end.

[Your Name]`,
      },
      {
        id: 'requesting-feedback',
        scenario: 'Requesting Feedback Mid-Project',
        tone: 'Collaborative',
        words: 55,
        text: `Hi [Client Name],

We're now [at the halfway point / past milestone 2], and I'd like to get your feedback before I continue.

Specifically: [1–2 targeted questions about what you need their input on].

Even a quick reply will help me make sure the next phase matches what you're expecting.

[Your Name]`,
      },
    ],
  },
  {
    heading: "When You Can't Complete the Job",
    intro:
      'Sometimes you need to exit a contract gracefully. These keep the relationship professional and your JSS intact.',
    templates: [
      {
        id: 'declining-after-hire',
        scenario: 'Politely Withdrawing After Hire (Before Starting)',
        tone: 'Apologetic, professional',
        words: 70,
        text: `Hi [Client Name],

I need to let you know that I won't be able to proceed with this contract. [Brief honest reason: a conflicting commitment came up / the scope has changed beyond what I can deliver in this timeframe / a personal situation].

I'm sorry for any inconvenience. I know timing matters here. I'd recommend [practical suggestion for them: re-posting, specific type of freelancer to look for].

I hope the project goes well.

[Your Name]`,
      },
      {
        id: 'requesting-contract-end',
        scenario: 'Requesting Contract End (Mutual)',
        tone: 'Neutral, diplomatic',
        words: 65,
        text: `Hi [Client Name],

I'd like to discuss closing out this contract. [Specific reason: project scope has shifted significantly / the deliverables no longer align with what I can provide / mutual agreement that it's not the right fit].

I've completed [what you've delivered so far]. I'm happy to hand over all files, documentation, and any notes that would help whoever takes over.

Please let me know how you'd like to proceed.

[Your Name]`,
      },
    ],
  },
  {
    heading: 'Upwork Message After Job Completion',
    intro:
      'The conversation after the contract closes determines whether you get a review and a repeat client. These are short and specific.',
    templates: [
      {
        id: 'requesting-review',
        scenario: 'Requesting a Review',
        tone: 'Warm, non-pushy',
        words: 60,
        text: `Hi [Client Name],

It was great working on [project name] with you. I've submitted my review of the experience from my side.

If you're happy with the outcome, I'd really appreciate a review when you get a moment: it makes a big difference for freelancers on Upwork.

Either way, feel free to reach out if you ever need similar work done.

[Your Name]`,
      },
      {
        id: 'offering-future-work',
        scenario: 'Staying on the Client\'s Radar',
        tone: 'Friendly, brief',
        words: 55,
        text: `Hi [Client Name],

Thanks again for the project. It was a good one to work on. If you have follow-up work, updates, or anything in a similar area down the line, feel free to reach out directly. I keep a short client list so I can give each one proper attention.

Hope things go well on your end.

[Your Name]`,
      },
    ],
  },
];

// ── Copy button ────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── FAQ data ───────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'How do you message a client on Upwork before getting hired?',
    a: 'You can message a client directly after submitting a proposal by using the message thread attached to your application. Alternatively, if you receive an invite to interview, Upwork opens a message thread automatically. Keep the first message short: one specific question or a clear statement of availability. Clients are reviewing 20-50 proposals; a long first message is rarely read in full.',
  },
  {
    q: 'What is the best first message to send a client on Upwork?',
    a: "The best first message is short, specific, and proves you read their job post. Ask one question directly related to a detail in the post, something that shows you understood the real requirement. Avoid restating your skills or saying 'I am very interested in this opportunity.' Those phrases appear in every message the client receives.",
  },
  {
    q: 'How do you follow up on Upwork without being annoying?',
    a: "Follow up once after 48 hours of silence, no more than that before they respond. Keep it to 2-3 sentences. Don't apologise for following up. A good follow-up acknowledges they're busy, offers one specific piece of value or clarification, and closes without pressure. If they don't respond to a follow-up, move on.",
  },
  {
    q: 'Can you message a client on Upwork after the job closes?',
    a: "Yes. If you submitted a proposal before the job closed, you can message the client through Upwork's messaging system. Many freelancers skip this step, which means reaching out thoughtfully after a post closes can actually stand out. Keep the message brief and acknowledge the post is closed; don't pretend you don't know.",
  },
  {
    q: 'How do you ask for a review on Upwork without sounding desperate?',
    a: "Mention the review once, briefly, after submitting your own review of the client. One sentence is enough: 'If you're happy with how it went, a review would mean a lot.' Don't follow up asking for the review a second time. That crosses into pressure territory and can hurt the relationship.",
  },
  {
    q: "What should you include in an Upwork message when you can't complete a job?",
    a: "Be specific about the reason. Vague excuses read as unprofessional. State what you've completed so far and offer a clean handover: files, documentation, notes. Suggest what type of freelancer or next step would help them continue. Keep it short. Long explanations don't reduce inconvenience. They add to it.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UpworkMessageToClient() {
  useEffect(() => {
    const id = 'schema-upwork-message-to-client';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: 'Upwork Message to Client: 15 Sample Templates for Every Situation',
          description: '15 copy-ready Upwork message templates for first contact, follow-up, project updates, milestone delivery, and review requests.',
          url: 'https://ultimatefreelancers.com/upwork-message-to-client-sample',
          author: { '@type': 'Person', name: 'Muhammad Younus' },
          publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
          image: 'https://ultimatefreelancers.com/og-image.png',
          datePublished: '2026-04-27',
          dateModified: '2026-04-27',
        },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ultimatefreelancers.com' },
            { '@type': 'ListItem', position: 2, name: 'Upwork Message to Client Templates', item: 'https://ultimatefreelancers.com/upwork-message-to-client-sample' },
          ],
        },
      ],
    });
    document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return (
    <>
      <Helmet>
        <title>Upwork Message to Client Templates | Ultimate Freelancers</title>
        <meta name="description" content="15 copy-ready Upwork message templates: first contact, follow-up, project updates, milestone delivery, polite decline, and review requests. No account needed." />
        <link rel="canonical" href="https://ultimatefreelancers.com/upwork-message-to-client-sample" />
        <meta property="og:title" content="Upwork Message to Client Templates | Ultimate Freelancers" />
        <meta property="og:description" content="15 copy-ready Upwork message templates: first contact, follow-up, project updates, milestone delivery, polite decline, and review requests." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ultimatefreelancers.com/upwork-message-to-client-sample" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="og:site_name" content="Ultimate Freelancers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upwork Message to Client Templates | Ultimate Freelancers" />
        <meta name="twitter:description" content="15 copy-ready Upwork message templates for every client situation." />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
      </Helmet>

      <div className="min-h-screen bg-background">

        <main>
          {/* ── Hero ── */}
          <section className="py-14 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
                  Client Communication Templates
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-tight">
                  Upwork Message to Client:{' '}
                  <span className="text-gradient">15 Sample Templates</span> for Every Situation
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Copy-ready templates for every stage of the client conversation: first contact,
                  follow-up, milestone delivery, project updates, and post-contract messages.
                  Each template is under 80 words and written to sound like a professional, not a script.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">15 templates</span>
                  <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">5 scenarios</span>
                  <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">Copy in one click</span>
                  <span className="px-3 py-1.5 rounded-full bg-secondary border border-border">0.00 competition keyword</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── When do you need to message ── */}
          <section className="py-10 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  When Do You Need to Message a Client on Upwork?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Client communication on Upwork happens at six distinct stages. Each stage has a different
                  goal, and a different way to fail. The wrong message at the wrong stage can cost you the
                  contract, the review, or the repeat hire.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    ['1. Initial contact', 'After submitting a proposal or receiving an invite'],
                    ['2. Follow-up', 'When the conversation goes quiet after 48 hours'],
                    ['3. Clarification', 'Before starting: when scope, access, or tools need confirming'],
                    ['4. Project update', 'During the project: milestone delivery or delay notification'],
                    ['5. Exiting a contract', "When you can't or shouldn't continue"],
                    ['6. Post-completion', 'Requesting a review or staying on the client\'s radar'],
                  ].map(([stage, desc]) => (
                    <div key={stage} className="flex gap-3 p-4 bg-card rounded-xl border border-border">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-sm">{stage}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Templates by section ── */}
          {sections.map((section) => (
            <section key={section.heading} className="py-14 border-b border-border last:border-0">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {section.heading}
                  </h2>
                  <p className="text-muted-foreground mb-8">{section.intro}</p>

                  <div className="space-y-6">
                    {section.templates.map((t) => (
                      <div
                        key={t.id}
                        className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
                      >
                        {/* Card header */}
                        <div className="flex items-center justify-between px-5 py-3.5 bg-secondary/40 border-b border-border">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{t.scenario}</span>
                            <span className="ml-3 text-xs text-muted-foreground">
                              ~{t.words} words · {t.tone}
                            </span>
                          </div>
                          <CopyButton text={t.text} />
                        </div>
                        {/* Template body */}
                        <pre className="px-5 py-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap font-sans">
                          {t.text}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* ── Tips section ── */}
          <section className="py-14 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  5 Tips for Writing Any Upwork Message to a Client
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      tip: 'Reply within 4 hours when possible',
                      detail:
                        'Response speed signals reliability. Clients making a hire decision often go with whoever replies fastest, all else being equal.',
                    },
                    {
                      tip: 'Match the client\'s communication style',
                      detail:
                        'If they write in bullet points, you can too. If they write casually, ease up on formality. If they write one sentence, don\'t reply with five paragraphs.',
                    },
                    {
                      tip: 'One question per message, maximum',
                      detail:
                        'Multiple questions in a single message often get partial answers. Ask the most important one. Ask the next question after they reply.',
                    },
                    {
                      tip: 'Avoid phrases that flag spam filters',
                      detail:
                        'Upwork\'s spam detection is aggressive. Avoid: links in first messages to unknown clients, excessive exclamation marks, and mass-template patterns that repeat identical text across many messages.',
                    },
                    {
                      tip: 'Your first message after hire sets the contract tone',
                      detail:
                        'The message you send after a contract starts tells the client what kind of freelancer they hired. Be organised, ask two specific onboarding questions, and state your first deliverable and when it will be ready.',
                    },
                  ].map(({ tip, detail }) => (
                    <div key={tip} className="flex gap-4 p-5 bg-card rounded-xl border border-border">
                      <div className="w-1.5 bg-primary rounded-full flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-foreground text-sm mb-1">{tip}</div>
                        <div className="text-sm text-muted-foreground leading-relaxed">{detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Tool CTA ── */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Need a Proposal Before the Client Message?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Paste any Upwork job post and get 3 personalized cover letter variants plus strategic
                  screening question answers in under 60 seconds. Free, no account, no Chrome extension.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Generate My Upwork Proposal Free
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="mt-4 text-xs text-muted-foreground">
                  Bring your own API key (OpenAI, Claude, Gemini, Groq, free tiers available)
                </p>
              </div>
            </div>
          </section>

          {/* ── Internal links ── */}
          <section className="py-10 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">Related Upwork Resources</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    {
                      href: '/upwork-cover-letter-examples',
                      title: 'Upwork Cover Letter Examples',
                      desc: '10 real samples with the job posts they responded to',
                    },
                    {
                      href: '/how-to-write-upwork-proposal',
                      title: 'How to Write an Upwork Proposal',
                      desc: 'Structure, length, opening lines, and 5 mistakes to avoid',
                    },
                    {
                      href: '/upwork-proposal-examples',
                      title: 'Upwork Proposal Examples',
                      desc: 'Short, medium, and detailed samples across niches',
                    },
                  ].map((r) => (
                    <a
                      key={r.href}
                      href={r.href}
                      className="group p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors mb-1">
                        {r.title} →
                      </div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section className="py-14">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="bg-card rounded-xl border border-border px-5 data-[state=open]:shadow-sm transition-shadow"
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4 text-sm">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed text-sm">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
