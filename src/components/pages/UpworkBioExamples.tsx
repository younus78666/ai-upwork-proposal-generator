import { Helmet } from '@/lib/helmet-stub';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ── Types ──────────────────────────────────────────────────────────────────────

type BioExample = {
  id: string;
  niche: string;
  hook: string;
  fullBio: string;
  whyItWorks: string[];
  avoid: string;
};

// ── Data ───────────────────────────────────────────────────────────────────────

const bioExamples: BioExample[] = [
  {
    id: 'wordpress-developer',
    niche: 'WordPress Developer',
    hook: 'I turn slow, broken WordPress sites into fast, secure, revenue-generating machines — for SaaS companies and agencies that cannot afford downtime.',
    fullBio: `I turn slow, broken WordPress sites into fast, secure, revenue-generating machines — for SaaS companies and agencies that cannot afford downtime.

In the past 5 years I have built or rebuilt 400+ WordPress and WooCommerce sites. My typical client is a SaaS company or digital agency that needs their site to perform, not just exist. I specialise in Core Web Vitals improvements (LCP, CLS, FID), security hardening, and WooCommerce performance tuning.

What sets my work apart: I do not install 20 plugins and call it done. I audit the existing setup, remove bloat, and fix the root cause — whether that is unoptimised images, render-blocking scripts, or a misconfigured hosting environment.

Results clients see: average PageSpeed improvement from sub-40 to 85+, reduced server response time by 60-70%, zero post-launch security incidents on all hardened sites.

Available for project-based or ongoing retainer work. US and EU timezones covered.`,
    whyItWorks: [
      'Specific client type (SaaS companies and agencies) filters out low-budget clients from the first line.',
      'The word "downtime" targets the exact fear driving this buyer — not just aesthetics, but revenue risk.',
      'Numbers are precise: 400+ sites, PageSpeed sub-40 to 85+, 60-70% server improvement.',
    ],
    avoid:
      'Do not list every WordPress plugin you know. Elementor, Divi, WPBakery, Yoast — those belong in your Skills section. Putting them in your bio makes it read like a spec sheet, not a sales argument.',
  },
  {
    id: 'graphic-designer',
    niche: 'Graphic Designer',
    hook: 'Brand identity and UI design for tech startups that need to look funded before they are.',
    fullBio: `Brand identity and UI design for tech startups that need to look funded before they are.

I work with early-stage and Series A tech companies building their first real brand — the kind that holds up on a pitch deck, a Product Hunt launch, and a homepage at the same time. My workflow is Figma-first, handoff-ready, and built around one rule: your brand needs to communicate one thing clearly before it tries to communicate everything.

In 2025 I delivered brand identities for 12 SaaS companies, including 3 logo-to-UI design system projects. My standard for logo concepts: 3 strategically distinct directions delivered within 3 working days. No clip-art variations, no stock icon modifications.

Services: brand identity, logo design, UI design, design systems, pitch deck design.

Not a fit for: personal projects under $500, requests for "something like [competitor]", or projects with no timeline flexibility.`,
    whyItWorks: [
      'The niche (tech startups) and the specific positioning (look funded before you are) is memorable and self-qualifying.',
      '"3 strategically distinct directions within 3 working days" gives the client a concrete expectation before they even message.',
      'The "not a fit for" section is rare and powerful — it pre-filters unqualified clients and signals confidence.',
    ],
    avoid:
      'Do not open with a list of software: "I am proficient in Photoshop, Illustrator, Figma, InDesign, Canva..." Clients hiring a senior designer expect tool fluency. Leading with tools positions you as a junior.',
  },
  {
    id: 'virtual-assistant',
    niche: 'Virtual Assistant',
    hook: 'I free up 15-20 hours a week for US-based founders by owning their inbox, calendar, and CRM — so they can focus on revenue.',
    fullBio: `I free up 15-20 hours a week for US-based founders by owning their inbox, calendar, and CRM — so they can focus on revenue.

I have been working as a full-time virtual assistant for 4 years. My clients are founders and operators, typically running businesses between $500K and $5M/year, who need someone they can hand things to without explaining twice.

My toolkit: Notion, HubSpot, Calendly, Google Workspace, Slack, ClickUp, and Zapier. I build systems, not workarounds. When I take over your inbox, I set up a labelling and routing system in the first week so nothing falls through when I am unavailable.

Timezone: EST. Available Monday to Friday, 8am to 6pm. Fluent in English. I work across US and UK clients.

I do not take on more than 3 clients at a time. If you want consistent, high-quality support rather than whoever is cheapest, that is where I operate.`,
    whyItWorks: [
      '"Own their inbox, calendar, and CRM" is specific and conveys real scope — not vague admin support.',
      'The target client (US-based founders, $500K-$5M businesses) allows the right clients to self-identify immediately.',
      '"I do not take on more than 3 clients at a time" signals high value and creates scarcity without being pushy.',
    ],
    avoid:
      'Do not market yourself as a general VA who does "anything you need." Clients hiring for inbox management, scheduling, or CRM work want a specialist, not a generalist. Vague positioning leads to vague, low-paid work.',
  },
  {
    id: 'content-writer',
    niche: 'Content Writer (SaaS/Tech)',
    hook: 'Long-form content for B2B SaaS companies that ranks on Google and actually gets read.',
    fullBio: `Long-form content for B2B SaaS companies that ranks on Google and actually gets read.

Most SaaS content falls into one of two failure modes: optimised for search but unreadable by humans, or well-written but invisible to Google. I write for both audiences at once — starting with keyword intent and topical authority, then structuring the piece for the actual humans who will skim it at 8am on a Tuesday.

My process: Ahrefs keyword research, SERP analysis, structured outline with semantic headings, draft, one round of revision included. Average piece is 3,200 words. Most of my clients are on monthly retainers — currently 8 SaaS clients.

Recent results: a product comparison article ranking position 1 for a 2,400/month keyword within 90 days, a pillar page that increased organic sessions by 34% in one quarter.

I specialise in: product comparisons, how-to guides, thought leadership, and bottom-of-funnel content that supports sales conversations.`,
    whyItWorks: [
      'The two failure modes paragraph demonstrates genuine content strategy expertise, not just writing ability.',
      'Concrete process (Ahrefs, SERP analysis, structured outline) tells the client what they are buying before they ask.',
      'Real ranking outcomes with specifics (position 1, 2,400/month keyword, 90 days) are far stronger than "proven track record."',
    ],
    avoid:
      'Do not describe yourself as a "passionate storyteller" or "creative wordsmith." Clients hiring for SEO content are making a business investment. Lead with business outcomes, not personality adjectives.',
  },
  {
    id: 'data-entry',
    niche: 'Data Entry Specialist',
    hook: 'Fast, accurate data entry with 99.8% accuracy — for e-commerce brands, real estate agencies, and logistics companies.',
    fullBio: `Fast, accurate data entry with 99.8% accuracy — for e-commerce brands, real estate agencies, and logistics companies.

I handle high-volume, time-sensitive data work: product catalogue uploads, property database management, invoice processing, lead list building, and CRM data cleaning. My capacity is 10,000+ records per week depending on complexity.

Tools I work in daily: Microsoft Excel, Google Sheets, Airtable, Notion, HubSpot, and most major e-commerce backends (Shopify, WooCommerce, BigCommerce). I am comfortable with OCR output cleanup, PDF extraction, and web scraping handoff data.

I take accuracy seriously: every project includes a self-audit before delivery, and I am happy to share the verification process on request. NDA-ready. I have signed NDAs for over 30 clients.

Response time is under 2 hours during business hours (EST). For urgent projects, same-day starts are available.`,
    whyItWorks: [
      '99.8% accuracy is a specific, verifiable claim that stands out among data entry profiles that say "highly accurate."',
      'The capacity figure (10,000+ records per week) immediately answers the client\'s first unspoken question: can you handle my volume?',
      'NDA-ready with a specific count (30+ clients) removes a common friction point for clients with sensitive data.',
    ],
    avoid:
      'Do not use filler phrases like "hard-working," "detail-oriented," or "fast learner" in a data entry bio. Every data entry profile says those things. They mean nothing without evidence. Replace them with numbers.',
  },
  {
    id: 'seo-specialist',
    niche: 'SEO Specialist',
    hook: 'I get B2B service businesses from page 3 to page 1 — using technical SEO, content strategy, and link building that Google actually rewards in 2026.',
    fullBio: `I get B2B service businesses from page 3 to page 1 — using technical SEO, content strategy, and link building that Google actually rewards in 2026.

The SEO landscape in 2026 is not the same as it was two years ago. Tactics that worked in 2023 — thin content, PBN links, keyword stuffing — now actively damage rankings. I specialise in durable SEO: topical authority, Core Web Vitals, and editorially earned links.

My toolstack: Ahrefs for research and monitoring, Screaming Frog for technical audits, Google Search Console for real performance data, and Surfer SEO for content optimisation. I do not use AI to mass-produce content. I use it to accelerate research.

Results I can point to: 400% organic traffic growth for a B2B SaaS client over 14 months, position 1 rankings for 12 commercial-intent keywords in the legal services space, and a complete technical SEO recovery after a Google core update penalty.

I work with clients on a minimum 3-month engagement. SEO is not a sprint. Clients who want 30-day results are not a fit.`,
    whyItWorks: [
      'Acknowledging the 2026 SEO landscape shift (what no longer works) positions the freelancer as current, not outdated.',
      'The toolstack paragraph shows professional process rather than just claiming expertise.',
      'The minimum 3-month policy filters out unrealistic clients and signals that the freelancer operates at a professional level.',
    ],
    avoid:
      'Do not promise guaranteed rankings. Any SEO bio that says "I will get you to position 1" is either lying or setting you up for a dispute. Frame outcomes as results you have achieved, not promises you are making.',
  },
  {
    id: 'flutter-developer',
    niche: 'Mobile App Developer (Flutter)',
    hook: 'Cross-platform mobile apps for startups that need iOS and Android without double the budget.',
    fullBio: `Cross-platform mobile apps for startups that need iOS and Android without double the budget.

Flutter is my primary framework. I chose it because it gives startups a single codebase for iOS and Android without the performance trade-offs that plagued earlier cross-platform solutions. My apps look and feel native because I build them that way — no shortcuts on animations, navigation, or platform-specific behaviour.

I have shipped 11 Flutter applications to the App Store and Google Play. My client apps average a 4.7-star rating across platforms. Services I cover end to end: UI from Figma, state management with Riverpod or Bloc, Firebase or custom REST API integration, and App Store submission.

My typical client: an early-stage startup building their first mobile product, or a business that has an existing web product and needs a mobile companion.

Timeline for a standard MVP: 6-10 weeks depending on feature scope. I do not take rush projects that compromise quality.`,
    whyItWorks: [
      'Explaining why Flutter (not just that it is used) demonstrates informed decision-making clients can trust.',
      '4.7-star average across client apps is a verifiable, third-party validation that generic "high-quality apps" claims cannot match.',
      'The typical client description helps the right people self-identify and reduces wasted messages from mismatched clients.',
    ],
    avoid:
      'Do not list every mobile technology you have ever touched: iOS, Android, React Native, Flutter, Xamarin, Ionic. Clients want to hire a specialist. Pick your primary expertise and own it. A scattered tech list signals a generalist who is not excellent at anything.',
  },
  {
    id: 'email-marketing',
    niche: 'Email Marketing Specialist',
    hook: 'Email sequences for e-commerce brands that recover abandoned carts and turn one-time buyers into repeat customers.',
    fullBio: `Email sequences for e-commerce brands that recover abandoned carts and turn one-time buyers into repeat customers.

I am a Klaviyo-certified email strategist. Most of my clients are direct-to-consumer e-commerce brands doing $200K to $5M/year in revenue who are leaving money on the table because their email program is either non-existent or basic.

My work covers the full lifecycle: welcome series, abandoned cart recovery, post-purchase sequences, win-back campaigns, and broadcast email strategy. I write copy, build flows in Klaviyo, set up segmentation, and manage A/B testing.

My averages across active clients: 35% open rate, 4.2% click-to-open rate, 1.8% conversion on abandoned cart flows. Three of my current e-commerce clients have scaled past $1M in annual revenue with email accounting for 25-35% of their total revenue.

I do not offer one-off "just build the welcome flow" projects. If you want a real email program, I work on a minimum 3-month retainer.`,
    whyItWorks: [
      'The Klaviyo certification is a real, verifiable credential that saves the client the question of platform expertise.',
      'Average metrics (35% open rate, 4.2% CTOR, 1.8% cart recovery) give the client a benchmark to evaluate against their current results.',
      'Three clients scaled to $1M+ with email as 25-35% of revenue is a result that speaks directly to the client\'s financial outcome.',
    ],
    avoid:
      'Do not claim expertise in every email platform: Mailchimp, Klaviyo, ActiveCampaign, HubSpot, Drip, Omnisend. Pick the one where you do your best work and commit to it. Listing all of them signals you are a generalist who will learn the client\'s platform on their budget.',
  },
  {
    id: 'video-editor',
    niche: 'Video Editor',
    hook: 'Fast-turnaround video editing for YouTube channels and course creators — I turn raw footage into content people actually finish watching.',
    fullBio: `Fast-turnaround video editing for YouTube channels and course creators — I turn raw footage into content people actually finish watching.

Retention is the only metric that matters for YouTube and course content. I edit specifically to hold attention: tight pacing, strategic B-roll, chapter markers that match thumbnail promises, and audio that does not drive viewers off with background noise or inconsistent levels.

My tools: Adobe Premiere Pro and After Effects for primary editing, DaVinci Resolve for colour, Audition for audio cleanup. Turnaround: 48 hours for videos under 20 minutes, 72 hours for longer content.

I currently work with 12 YouTube channels across tech, finance, and education niches. Six of those channels have grown past 10,000 subscribers since we started working together. My longest client relationship is 2.5 years.

Deliverables always include: colour-graded final export, SRT caption file, and a short-form cut (Reels/Shorts) at no extra charge.`,
    whyItWorks: [
      '"Content people actually finish watching" ties the service directly to the metric YouTube creators are obsessed with: retention.',
      'Specific turnaround times (48 and 72 hours) answer the client\'s most practical question before they have to ask.',
      '12 channels, 6 past 10K subscribers, 2.5-year longest relationship: a cluster of social proof that covers quality, scale, and longevity.',
    ],
    avoid:
      'Do not lead with your software list. "Expert in Adobe Premiere, After Effects, DaVinci Resolve, Final Cut Pro, CapCut..." tells the client nothing about your results. Clients hire editors for the outcome, not the tool.',
  },
  {
    id: 'data-analyst',
    niche: 'Data Analyst',
    hook: 'I turn messy spreadsheets into clear dashboards and decisions — for ops teams, e-commerce brands, and startups that run on data.',
    fullBio: `I turn messy spreadsheets into clear dashboards and decisions — for ops teams, e-commerce brands, and startups that run on data.

Most data problems are not technical. They are clarity problems: too many numbers, not enough insight, no one sure what to track. I solve that by building dashboards and reports that answer the right questions — and by helping you figure out which questions those are.

My toolstack: Python (pandas, matplotlib), SQL (PostgreSQL, BigQuery), Tableau, Looker Studio, and Google Sheets at advanced level. I am comfortable with messy, real-world data: missing values, inconsistent formatting, multi-source joins.

Typical turnaround: 2-3 days for a well-scoped dashboard, 1 week for a full reporting setup. I include documentation with every deliverable so your team can update it without me.

Recent work: a retention dashboard for a DTC brand that identified a 22% churn rate hidden in their data, reducing monthly churn by 8 points in 90 days after we acted on the insight. An ops reporting build for a logistics company that cut weekly reporting time from 6 hours to 30 minutes.`,
    whyItWorks: [
      'Reframing data problems as clarity problems (not just technical problems) shows strategic thinking clients pay more for.',
      'The documentation promise ("your team can update it without me") directly addresses a common fear: dependency on the freelancer.',
      'Both case study results are specific, outcome-oriented, and tied to business impact rather than technical deliverables.',
    ],
    avoid:
      'Do not write a bio that is just a list of tools and certifications. Python, SQL, Tableau, Power BI, R, SPSS, Excel. That tells a client what you know, not what you can do for them. Lead with the business problem you solve, then back it with tools.',
  },
];

const comparisonRows = [
  { aspect: 'Purpose', bio: 'Attract clients searching for your skill type', coverLetter: 'Win a specific job post' },
  { aspect: 'Audience', bio: 'Any client who finds your profile', coverLetter: 'One specific client' },
  { aspect: 'Length', bio: '800-1,200 characters optimal', coverLetter: '100-250 words optimal' },
  { aspect: 'Tone', bio: 'Polished, professional, evergreen', coverLetter: 'Conversational, direct, specific' },
  { aspect: 'Updated how often', bio: 'Every major milestone or niche shift', coverLetter: 'Every single job application' },
  { aspect: 'Job-specific?', bio: 'No — general positioning', coverLetter: 'Yes — references the exact job post' },
];

const mistakes = [
  {
    number: 1,
    title: 'Opening with "I am a passionate/dedicated/results-driven..."',
    explanation:
      'Upwork has 18M+ registered freelancers. The vast majority open their bios with one of those three words. It is the first signal a client uses to decide whether to keep reading or move on. An opener that says nothing about the specific value you deliver loses that decision.',
  },
  {
    number: 2,
    title: 'Listing skills that are already in your Skills section',
    explanation:
      'Your profile has a dedicated Skills section. Using your bio to repeat "Proficient in React, Node.js, TypeScript, AWS, Docker, MongoDB, PostgreSQL..." wastes your 800-1,200 character hook on information the client can already see. Use that space for outcomes, not feature lists.',
  },
  {
    number: 3,
    title: 'Writing in third person',
    explanation:
      '"John is a developer with 5 years of experience who specialises in..." reads as if someone else wrote it — usually because they did, or because the freelancer is trying to sound more professional. It creates distance. First person is warmer, more direct, and universally expected on Upwork.',
  },
  {
    number: 4,
    title: 'No specific numbers or results',
    explanation:
      '"I deliver high-quality work on time" is unfalsifiable and therefore meaningless. "I have reduced client PageSpeed scores from sub-40 to 85+ on 12 WooCommerce sites" is specific, verifiable, and credible. If you do not have client results to cite, use your own: articles you have written, projects you have built, records you have processed.',
  },
  {
    number: 5,
    title: 'Targeting everyone (no niche)',
    explanation:
      '"I can help with web development, content writing, social media, graphic design, and data entry." A client looking for a web developer does not want a generalist. They want the person who has done exactly what they need, exactly for a business like theirs. Broad bios convert at a fraction of the rate of niche bios.',
  },
  {
    number: 6,
    title: 'Bio longer than 2,000 characters with no visual breaks',
    explanation:
      'Upwork allows 5,000 characters. Most clients do not read 5,000 characters. A dense wall of text with no paragraph breaks will be skimmed, not read. Write in short paragraphs (2-4 sentences max), leave white space, and lead each paragraph with the most important sentence. The rest is supporting evidence.',
  },
  {
    number: 7,
    title: 'Not updating after reaching new milestones',
    explanation:
      'Your bio from the day you joined Upwork should not be your bio two years later. If you have reached Top Rated status, earned a major certification, hit a significant result, or shifted your niche, update your bio to reflect it. Stale bios underperform not because they are bad but because they no longer match who you are.',
  },
];

const faqs = [
  {
    q: 'How long should an Upwork profile overview be?',
    a: '800 to 1,200 characters is the optimal range for most freelancers. The first 200-250 characters are visible without clicking "more" — this is your hook and your most important real estate. Beyond 2,000 characters, most clients stop reading. The 5,000 character limit exists, but clients reading 30+ profiles will not reach 5,000 characters unless the first 200 compel them to keep going.',
  },
  {
    q: 'Should I use first or third person in my Upwork bio?',
    a: 'First person, always. Third person ("Sarah is a designer who...") reads as if someone else wrote it and creates a formal distance that feels out of place on a client-facing profile. First person is warmer, more direct, and is the standard expectation across every professional platform, Upwork included.',
  },
  {
    q: 'How often should I update my Upwork profile overview?',
    a: 'Update your bio every time you hit a meaningful milestone: a new major client, a new certification, an improved Job Success Score, a new niche you are targeting, or a significant result you can now cite. At minimum, review your bio every 3-6 months. A bio written when you had 2 projects should not still be live when you have 40.',
  },
  {
    q: 'Does my Upwork bio affect my search ranking?',
    a: 'Yes. Upwork\'s algorithm considers keyword relevance in your profile overview when matching freelancers to client searches. Use your primary skill term naturally in the first 2-3 sentences — not stuffed, but present. "I build WordPress sites for SaaS companies" is more searchable than "I help businesses succeed online" even though both are about the same work.',
  },
  {
    q: 'Can I have different bios for different services on Upwork?',
    a: 'Yes. Upwork\'s Specialised Profiles feature, available since 2022, lets you create separate profile pages targeting different service types from the same account. Each specialised profile has its own overview, hourly rate, and portfolio section. If you offer services that serve genuinely different audiences, a specialised profile per service typically outperforms one general profile trying to cover everything.',
  },
];

// ── Schema ─────────────────────────────────────────────────────────────────────

const schema = {
  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Upwork Bio Examples That Get Clients to Click Your Profile',
    description:
      '10 Upwork profile bio examples by niche. Web dev, design, VA, SEO, content writing, and more. See what works and why clients click your profile.',
    url: 'https://ultimatefreelancers.com/upwork-bio-examples',
    datePublished: '2026-04-27',
    dateModified: '2026-04-27',
    author: {
      '@type': 'Person',
      name: 'Muhammad Younus',
      url: 'https://ultimatefreelancers.com/about',
    },
    publisher: { '@id': 'https://ultimatefreelancers.com/#organization' },
    image: 'https://ultimatefreelancers.com/og-image.png',
    inLanguage: 'en-US',
    articleSection: 'Upwork Profile',
    about: [
      { '@type': 'Thing', name: 'Upwork profile overview' },
      { '@type': 'Thing', name: 'Upwork bio' },
      { '@type': 'Thing', name: 'Freelance profile writing' },
    ],
  },
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ultimatefreelancers.com' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Upwork Bio Examples',
        item: 'https://ultimatefreelancers.com/upwork-bio-examples',
      },
    ],
  },
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function UpworkBioExamples() {
  return (
    <>
      <Helmet>
        <title>Upwork Bio Examples | Ultimate Freelancers</title>
        <meta
          name="description"
          content="10 Upwork profile bio examples by niche. Web dev, design, VA, SEO, content writing, and more. See what works and why clients click your profile."
        />
        <link rel="canonical" href="https://ultimatefreelancers.com/upwork-bio-examples" />
        <meta property="og:title" content="Upwork Bio Examples | Ultimate Freelancers" />
        <meta
          property="og:description"
          content="10 Upwork profile bio examples by niche. Web dev, design, VA, SEO, content writing, and more. See what works and why clients click your profile."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://ultimatefreelancers.com/upwork-bio-examples" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="og:site_name" content="Ultimate Freelancers" />
        <meta property="article:published_time" content="2026-04-27" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upwork Bio Examples | Ultimate Freelancers" />
        <meta
          name="twitter:description"
          content="10 Upwork profile bio examples by niche. Web dev, design, VA, SEO, content writing, and more. See what works and why clients click your profile."
        />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(schema.article)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.faq)}</script>
        <script type="application/ld+json">{JSON.stringify(schema.breadcrumb)}</script>
      </Helmet>


      <main className="bg-[#F5F3EE] min-h-screen">

        {/* ── Hero ── */}
        <section className="container mx-auto px-4 pt-16 pb-10 max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span>Upwork Bio Examples</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
            10 Real Profile Overviews by Niche
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
            Upwork Bio Examples That Get Clients to Click Your Profile
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Your Upwork profile overview is not a CV. It is a sales page for one reader: the client
            who just searched for your skill and is now deciding whether to message you or the next
            person on the list. A CV lists what you have done. A great Upwork bio answers one
            question: "Why should I hire this specific person for my specific problem?"
          </p>

          <p className="text-base text-muted-foreground leading-relaxed">
            The first 200-250 characters of your bio are visible without the client clicking "more."
            That is your hook. Everything else is supporting evidence. The 10 examples below are
            structured around that reality — each one written for a different niche, each one
            opening with a hook that earns the click.
          </p>
        </section>

        {/* ── What Makes a Great Upwork Bio ── */}
        <section className="container mx-auto px-4 pb-14 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              What makes a great Upwork profile overview
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With 18M+ registered freelancers on Upwork in 2026, clients do not spend time on
              profiles that do not immediately signal fit. Research from Upwork suggests clients take
              7-30 seconds to decide whether to contact a freelancer. Your bio needs to earn that
              decision in the first sentence.
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  rule: 'The first line must answer: "What do you do and who do you do it for?" in under 15 words',
                  detail:
                    'Not "I am a developer with 5 years of experience." Try: "I build Shopify stores for US fashion brands that want to scale past $1M."',
                },
                {
                  rule: 'Specificity beats length every time',
                  detail:
                    '"I have built 40+ Shopify stores for US fashion brands" is more persuasive than three paragraphs of general e-commerce experience. One specific claim does more work than 500 words of vague credentials.',
                },
                {
                  rule: 'Include four elements: niche, specific result, years of experience, one differentiator',
                  detail:
                    'Niche: B2B SaaS content. Result: articles ranking in top 3 within 90 days. Experience: 3 years. Differentiator: SEO-first process, not just writing.',
                },
                {
                  rule: 'Optimal length: 200-400 characters for the hook, 800-1,200 total',
                  detail:
                    'The 5,000 character limit is a ceiling, not a target. Most clients stop reading after 1,200 characters. A tight, well-structured 900-character bio outperforms a rambling 3,000-character one.',
                },
                {
                  rule: 'Avoid: skill lists, vague superlatives, and first-person overload',
                  detail:
                    'Your Skills section already lists your tools. Your bio should make a business case. "I am a passionate, results-driven, creative professional" is on 40% of Upwork profiles. It means nothing.',
                },
              ].map(({ rule, detail }) => (
                <div key={rule} className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">{rule}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-sm text-foreground font-medium mb-1">The stat that changes how you write your bio</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upwork internal data shows that a profile photo alone increases hire rate by over 70%.
                Your bio is the second-highest-impact element. These two levers combined — a strong
                photo and a specific, niche-targeted bio — are the fastest ways to improve your
                conversion rate without changing your pricing or skill set.
              </p>
            </div>
          </div>
        </section>

        {/* ── 10 Bio Examples ── */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            10 Upwork profile overview examples by niche
          </h2>

          <div className="space-y-10">
            {bioExamples.map((example, index) => (
              <div key={example.id} className="bg-white border border-border rounded-xl p-6">

                {/* Header */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1 shrink-0">
                    Example {index + 1}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground">{example.niche}</h3>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                      {example.niche}
                    </span>
                  </div>
                </div>

                {/* Hook callout */}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Opening hook (first ~200 chars)
                  </p>
                  <p className="text-sm font-semibold text-foreground bg-primary/5 border-l-4 border-primary rounded-r-lg px-4 py-3 leading-relaxed">
                    {example.hook}
                  </p>
                </div>

                {/* Full bio */}
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Full profile overview
                  </p>
                  <div className="bg-muted/40 rounded-lg p-4 text-sm leading-relaxed font-mono border-l-4 border-primary whitespace-pre-line">
                    {example.fullBio}
                  </div>
                </div>

                {/* Why it works */}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Why it works
                  </p>
                  <ul className="space-y-2">
                    {example.whyItWorks.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Avoid warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Avoid: </span>
                    <span className="text-sm text-amber-800 leading-relaxed">{example.avoid}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bio vs Cover Letter Comparison ── */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Upwork bio vs. cover letter — key differences
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Freelancers often treat their profile bio and their proposal cover letter as the same
              type of writing. They are not. Understanding the difference changes how you write both.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Aspect</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Profile Bio</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Cover Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.aspect}
                      className={`border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-muted/10'}`}
                    >
                      <td className="py-3 px-4 font-medium text-foreground">{row.aspect}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.bio}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.coverLetter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
              Your bio gets clients to your profile. Your cover letter wins the specific job. Both
              matter, but they are different instruments. A bio written in a conversational,
              job-specific tone will underperform. A cover letter written in the polished, evergreen
              tone of a bio will feel generic.
            </p>
          </div>
        </section>

        {/* ── 7 Mistakes ── */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              7 Upwork profile overview mistakes that lose clients
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Most Upwork bios do not lose clients because they are badly written. They lose clients
              because they make one of seven predictable mistakes — each of which signals to a client
              that this freelancer is not the right fit.
            </p>

            <div className="space-y-6">
              {mistakes.map((mistake) => (
                <div key={mistake.number} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {mistake.number}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">{mistake.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{mistake.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Your bio gets them to your profile. Your proposal wins the job.
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
              Once a client reads your bio and clicks your profile, the next hurdle is the proposal.
              If you are spending time crafting proposals from scratch for every job, use the AI
              generator below — paste the job post, get 3 QDIPC-structured variants in 60 seconds.
            </p>
            <Link href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Generate My Proposal Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-muted-foreground mt-3">Free. BYOK. No account required.</p>
          </div>
        </section>

        {/* ── Related Resources ── */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <h2 className="text-xl font-bold text-foreground mb-5">Related Upwork resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                href: '/upwork-cover-letter-examples',
                label: 'Upwork cover letter examples',
                desc: '10 real cover letter samples across 5 niches with annotated breakdowns.',
              },
              {
                href: '/how-to-write-upwork-proposal',
                label: 'How to write an Upwork proposal',
                desc: 'The 5-part QDIPC framework top earners use to turn cold bids into contracts.',
              },
              {
                href: '/upwork-proposal-examples',
                label: 'Upwork proposal examples',
                desc: '10 proposal examples with job post context and full breakdown of what worked.',
              },
              {
                href: '/how-to-win-upwork-jobs',
                label: 'How to win Upwork jobs',
                desc: 'End-to-end guide: profile, proposals, pricing, and what separates top earners.',
              },
            ].map(({ href, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="bg-white border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
              >
                <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors mb-1">
                  {label} →
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="container mx-auto px-4 pb-20 max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Upwork bio — frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white border border-border rounded-xl px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

      </main>

      <LandingFooter />
    </>
  );
}
