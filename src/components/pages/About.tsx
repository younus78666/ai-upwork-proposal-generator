import Link from 'next/link';
import { Helmet } from '@/lib/helmet-stub';
import {
  Globe, ArrowRight, Download, ExternalLink, CheckCircle2,
  Briefcase, Code2, ShieldCheck, Zap, Users, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
;
import { LandingFooter } from "@/components/landing/LandingFooter";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://ultimatefreelancers.com/about#person",
      "name": "Muhammad Younus",
      "jobTitle": "Senior WordPress Developer & Technical SEO Specialist",
      "description": "Senior WordPress Developer with 7+ years of experience, 400+ completed Upwork projects, 99% Job Success Score, and $100K+ earned. Creator of Ultimate Freelancers.",
      "url": "https://ultimatefreelancers.com/about",
      "image": "https://ultimatefreelancers.com/og-image.png",
      "email": "muhammadddyounus@gmail.com",
      "telephone": "+92-332-0315840",
      "address": { "@type": "PostalAddress", "addressLocality": "Karachi", "addressCountry": "PK" },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "University of Karachi",
        "sameAs": "https://uok.edu.pk"
      },
      "worksFor": {
        "@type": "Organization",
        "name": "West Coast Integrated",
        "address": { "@type": "PostalAddress", "addressCountry": "CA" }
      },
      "hasOccupation": [
        { "@type": "Occupation", "name": "Senior WordPress Developer" },
        { "@type": "Occupation", "name": "Technical SEO Specialist" },
        { "@type": "Occupation", "name": "Team Leader" }
      ],
      "knowsAbout": [
        "WordPress Development", "Semantic SEO", "Technical SEO", "WooCommerce",
        "Core Web Vitals", "Koray Framework", "Topical Authority", "Entity-Based SEO",
        "Performance Optimization", "Upwork Proposals", "AI-Powered Development",
        "PHP", "JavaScript", "React", "Elementor", "Bricks Builder", "Schema Markup"
      ],
      "award": [
        "Upwork Top Rated Badge",
        "99% Job Success Score",
        "$100K+ Earned on Upwork"
      ],
      "sameAs": [
        "https://muhammadyounus.com",
        "https://www.linkedin.com/in/wordpress-website-manager/",
        "https://www.upwork.com/freelancers/~01e794e1660cad4a68"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://ultimatefreelancers.com/about#webpage",
      "url": "https://ultimatefreelancers.com/about",
      "name": "About Muhammad Younus | Senior WordPress Developer & Creator of Ultimate Freelancers",
      "description": "Muhammad Younus — Senior WordPress Developer, Technical SEO Specialist. 7+ years experience, 400+ Upwork projects, 99% JSS, $100K+ earned. Creator of Ultimate Freelancers AI proposal generator.",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ultimatefreelancers.com" },
          { "@type": "ListItem", "position": 2, "name": "About", "item": "https://ultimatefreelancers.com/about" }
        ]
      },
      "about": { "@id": "https://ultimatefreelancers.com/about#person" },
      "isPartOf": { "@type": "WebSite", "url": "https://ultimatefreelancers.com" },
      "author": { "@type": "Person", "name": "Muhammad Younus", "@id": "https://ultimatefreelancers.com/about#person" }
    }
  ]
};

const experience = [
  {
    role: "Senior WordPress Developer",
    company: "West Coast Integrated",
    location: "Canada (Remote)",
    period: "Jan 2024 – Present",
    type: "Full-Time Contract",
    points: [
      "Manage entire portfolio of client WordPress websites for Canada-based digital agency",
      "Implement Semantic SEO using Koray framework, building topical maps and entity-based content architecture",
      "Convert AI-generated Vibe Coding projects (Lovable, AI Gravity) to production-ready WordPress sites",
      "Achieve 90+ PageSpeed scores through comprehensive Core Web Vitals optimization",
      "Leverage Claude AI and ChatGPT to accelerate development and problem-solving",
    ],
  },
  {
    role: "WordPress Developer & Team Lead",
    company: "Web Works Digital Marketing",
    location: "United States (Remote)",
    period: "Jan 2019 – Dec 2023",
    type: "5 Years",
    points: [
      "Led 3 simultaneous teams: WordPress developers, SEO specialists, and content writers",
      "Delivered 3-week projects in 1 week through parallel workstream coordination",
      "Developed and maintained 100+ WordPress websites for agency clients",
      "Built WooCommerce stores with 2,000–5,000+ products; configured Stripe, PayPal, Square",
      "Achieved 90+ PageSpeed scores across all projects with Core Web Vitals compliance",
      "Applied Koray Semantic SEO framework; created topical maps and content clusters",
    ],
  },
  {
    role: "WordPress Developer",
    company: "Bataes.io",
    location: "Austria (Remote)",
    period: "Jan 2022 – Dec 2024",
    type: "Part-Time",
    points: [
      "Managed and maintained multiple client WordPress websites for Austrian digital agency",
      "Developed custom themes and plugins for European client requirements",
      "Implemented performance tuning and technical SEO optimization",
    ],
  },
];

const projects = [
  { name: "calgarywindowrepair.ca", desc: "Built custom WordPress site from Figma. Generated 39 calls in 2 months for local glass repair company.", href: "https://calgarywindowrepair.ca" },
  { name: "scrapavehicle.co.uk", desc: "500+ location pages via WordPress, Elementor, and LPagery with Google Sheets automation for UK vehicle scrapping.", href: "https://scrapavehicle.co.uk" },
  { name: "floridaaesthetics.com", desc: "Conversion-focused landing page for medical spa that increased bookings by 25% from Google Ads and organic.", href: "https://floridaaesthetics.com/wellness/weight-loss/" },
  { name: "alkosafe.com", desc: "Multilingual WooCommerce store (English/Turkish) with dual currency support for alcohol detector manufacturer.", href: "https://alkosafe.com" },
  { name: "cortechs.ai", desc: "FDA-cleared medical imaging company. Strict healthcare compliance, performance, and accessibility requirements.", href: "https://cortechs.ai" },
  { name: "outilbox.fr", desc: "5,000+ product e-commerce store with scalability optimization for French market.", href: "https://outilbox.fr" },
  { name: "dslinc.com", desc: "2,000+ product WooCommerce store for commercial kitchen equipment supplier in Canada.", href: "https://dslinc.com" },
  { name: "federalprocessingregistry.com", desc: "200+ page government services website with complex SEO architecture and topical authority.", href: "https://federalprocessingregistry.com" },
  { name: "arecahomes.com", desc: "Redesigned Jamaica vacation rental site. Fixed technical SEO, mobile optimization, and content structure.", href: "https://arecahomes.com" },
];

const skills: { category: string; icon: React.ComponentType<{ className?: string }>; items: string[] }[] = [
  {
    category: "WordPress & CMS",
    icon: Code2,
    items: ["Custom Themes & Plugins", "Gutenberg Blocks", "WooCommerce", "Elementor Pro", "Divi", "Bricks Builder", "Oxygen", "ACF Pro", "Custom Post Types"],
  },
  {
    category: "Languages",
    icon: Code2,
    items: ["PHP 8+", "JavaScript", "jQuery", "HTML5 / CSS3 / SASS", "MySQL", "JSON / XML", "Basic React"],
  },
  {
    category: "Semantic SEO",
    icon: Globe,
    items: ["Koray Framework", "Topical Maps", "Topical Authority", "Entity-Based SEO", "Schema Markup / JSON-LD", "NLP Keyword Extraction", "Content Clusters", "N-Gram Analysis"],
  },
  {
    category: "Performance & Security",
    icon: Zap,
    items: ["Core Web Vitals", "WP Rocket", "LiteSpeed Cache", "Redis / Memcached", "Cloudflare CDN", "Wordfence / Sucuri", "WAF", "Malware Removal", "SSL / 2FA"],
  },
  {
    category: "Hosting & DevOps",
    icon: ShieldCheck,
    items: ["Cloudways", "Kinsta", "WP Engine", "DigitalOcean", "AWS Lightsail", "cPanel / WHM", "Git / GitHub"],
  },
  {
    category: "AI & Automation",
    icon: Briefcase,
    items: ["Claude AI", "ChatGPT", "Google AI Studio", "Notebook LLM", "Lovable", "React-to-WordPress", "Make.com / Zapier"],
  },
  {
    category: "SEO Tools",
    icon: Star,
    items: ["SEMrush", "Ahrefs", "Screaming Frog", "Google Search Console", "GA4", "RankMath", "Yoast"],
  },
  {
    category: "Team & Project Management",
    icon: Users,
    items: ["Monday.com", "ClickUp", "Asana", "Jira", "Agile / Scrum", "Sprint Planning", "Cross-functional Teams"],
  },
];

const achievements = [
  { stat: "400+", label: "Upwork Projects", sub: "12 countries" },
  { stat: "99%", label: "Job Success Score", sub: "Top Rated badge" },
  { stat: "$100K+", label: "Earned on Upwork", sub: "7+ years" },
  { stat: "68%", label: "Load Time Reduction", sub: "32% conversion lift" },
  { stat: "90+", label: "PageSpeed Score", sub: "Guaranteed" },
  { stat: "5,000+", label: "Product WooCommerce", sub: "Sub-3s load times" },
];

const About = () => {
  return (
    <>
      <Helmet>
        <title>Muhammad Younus, Top Rated Freelancer | Ultimate Freelancers</title>
        <meta name="description" content="Muhammad Younus, Senior WordPress developer, 7+ years, 400+ Upwork projects, $100K+ earned, Top Rated Plus badge. Creator of the free AI proposal tool." />
        <link rel="canonical" href="https://ultimatefreelancers.com/about" />
        <meta property="og:title" content="Muhammad Younus, Top Rated Freelancer | Ultimate Freelancers" />
        <meta property="og:description" content="7+ years of WordPress development. 400+ Upwork projects. 99% JSS. Top Rated Plus. Creator of the free AI proposal generator at ultimatefreelancers.com." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://ultimatefreelancers.com/about" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Muhammad Younus, Top Rated Freelancer | Ultimate Freelancers" />
        <meta name="twitter:description" content="Senior WordPress developer, 400+ Upwork projects, 99% JSS, $100K+ earned. Creator of Ultimate Freelancers." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>


      <main className="min-h-screen bg-background">

        {/* ── Hero ── */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[500px] w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/[0.06] to-transparent blur-3xl" />
          </div>
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row items-start gap-10 md:gap-14">

              {/* Avatar */}
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-[0_8px_40px_rgba(99,102,241,0.25)] text-5xl font-extrabold text-white select-none">
                  MY
                </div>
              </div>

              {/* Bio */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 uppercase tracking-wide">
                  Creator of Ultimate Freelancers
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-1 leading-tight tracking-tight">
                  Muhammad Younus
                </h1>
                <p className="text-base text-muted-foreground font-medium mb-4">
                  Senior WordPress Developer · Technical SEO Specialist · Team Leader · Karachi, Pakistan
                </p>
                <p className="text-base leading-relaxed text-muted-foreground mb-6 max-w-2xl">
                  Why take a chance when you can check the receipts? 400+ completed projects on Upwork. 99% Job Success Score. $100K+ earned. Top Rated badge. 7+ years of WordPress development with real client feedback you can read right now. I've delivered for startups, agencies, and established businesses across 12 countries.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://muhammadyounus.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 h-10 text-sm">
                      <Globe className="w-4 h-4" />
                      muhammadyounus.com
                    </Button>
                  </a>
                  <a href="https://www.linkedin.com/in/wordpress-website-manager/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2 h-10 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      LinkedIn
                    </Button>
                  </a>
                  <Link href="/resume">
                    <Button variant="outline" className="gap-2 h-10 text-sm">
                      <Download className="w-4 h-4" />
                      View Resume
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button className="bg-primary text-white hover:bg-primary/90 gap-2 h-10 text-sm">
                      Try the Tool Free
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Key Stats ── */}
        <section className="py-10 border-y border-border bg-secondary/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-border rounded-2xl overflow-hidden">
              {achievements.map(({ stat, label, sub }) => (
                <div key={label} className="bg-background px-4 py-5 text-center">
                  <div className="text-2xl font-extrabold text-primary mb-0.5">{stat}</div>
                  <div className="text-xs font-semibold text-foreground leading-tight mb-0.5">{label}</div>
                  <div className="text-[11px] text-muted-foreground">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why I Built This ── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Why I Built Ultimate Freelancers</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base">
              <p>
                After years on Upwork, I noticed something: the freelancers winning the best jobs weren't always the most skilled. They were the ones who could communicate clearly, show they understood the client's problem, and give the client a reason to reply.
              </p>
              <p>
                I started studying proposals that converted — not just my own, but patterns across hundreds of jobs I won and lost. What worked wasn't a template. It was a structure: ask the right question first, diagnose the real problem (not the surface request), show your specific approach, then make it easy to say yes.
              </p>
              <p>
                I turned that structure into the QDIPC framework, built a prompt system around it, and wired it to the AI providers I trusted. The result is a tool that generates proposals I'd actually send — not AI-sounding fluff, but direct, human-sounding pitches that prove you read the post.
              </p>
              <p>
                Ultimate Freelancers is free to use. You bring your own API key (a few cents per proposal). I built it because I wanted it to exist, not to charge for it.
              </p>
            </div>
          </div>
        </section>

        {/* ── Key Achievements ── */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Key Achievements</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Users, title: "3X Faster Delivery", desc: "Transformed 3-week projects into 1-week deliveries by leading and coordinating 3 teams simultaneously." },
                { icon: Zap, title: "Performance Expert", desc: "Guaranteed 90+ PageSpeed scores with Core Web Vitals compliance. Achieved 68% load time reduction resulting in 32% conversion increase." },
                { icon: ShieldCheck, title: "E-Commerce Scale", desc: "Built and optimized WooCommerce stores with 5,000+ products achieving sub-3-second load times." },
                { icon: ShieldCheck, title: "Security Excellence", desc: "Zero security breaches since 2024 for a news site previously targeted by daily bot attacks." },
                { icon: Star, title: "Global Track Record", desc: "400+ projects delivered across 12 countries with 99% client satisfaction rate on Upwork." },
                { icon: Briefcase, title: "Team Leadership", desc: "Led developers, SEO specialists, and content writers across 5 years at a US digital marketing agency." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Experience ── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Professional Experience</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border hidden sm:block" />

              <div className="space-y-8">
                {experience.map((job, i) => (
                  <div key={i} className="sm:pl-12 relative">
                    {/* Dot */}
                    <div className="hidden sm:flex absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/30 items-center justify-center">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-foreground text-base">{job.role}</h3>
                          <p className="text-sm text-primary font-medium">{job.company} <span className="text-muted-foreground font-normal">— {job.location}</span></p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-medium text-foreground bg-secondary px-2.5 py-1 rounded-full">{job.period}</span>
                          <p className="text-[11px] text-muted-foreground mt-1">{job.type}</p>
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {job.points.map((point, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                {/* Earlier experience */}
                <div className="sm:pl-12 relative">
                  <div className="hidden sm:flex absolute left-0 top-1 w-8 h-8 rounded-full bg-secondary border-2 border-border items-center justify-center">
                    <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="bg-secondary/50 border border-border rounded-2xl p-5">
                    <h3 className="font-semibold text-foreground text-sm mb-1">Earlier Experience</h3>
                    <p className="text-xs text-muted-foreground">EDLINKS Educational Services (US) · Website Digital Marketing LTD (Australia) · Rakistan (Pakistan)</p>
                    <p className="text-xs text-muted-foreground mt-1">WordPress development, on-page SEO, PSD-to-WordPress conversion, cross-functional collaboration.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Technical Skills ── */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Technical Skills</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {skills.map(({ category, items }) => (
                <div key={category} className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(item => (
                      <span key={item} className="text-[11px] bg-secondary border border-border text-muted-foreground px-2 py-0.5 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Notable Projects ── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Notable Projects</h2>
            <p className="text-muted-foreground text-sm mb-8">Selected work from 400+ delivered projects. All links are live.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(({ name, desc, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-primary truncate">{name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0 ml-2 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Education ── */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Education</h2>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-foreground">Bachelor of Science in Computer Science</h3>
                  <p className="text-sm text-primary font-medium mt-0.5">University of Karachi, Pakistan</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Relevant Coursework: Web Development, Database Management (MySQL), PHP, JavaScript, Software Engineering, Agile Methodologies
                  </p>
                </div>
                <span className="text-xs font-medium bg-secondary border border-border px-3 py-1.5 rounded-full text-muted-foreground shrink-0">2019 – 2023</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Upwork Profile ── */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Upwork Track Record</h2>
            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                {[
                  { val: "Top Rated", sub: "Badge" },
                  { val: "$100K+", sub: "Earned" },
                  { val: "400+", sub: "Jobs Completed" },
                  { val: "99%", sub: "Job Success Score" },
                ].map(({ val, sub }) => (
                  <div key={sub} className="text-center">
                    <div className="text-xl font-extrabold text-primary">{val}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex flex-wrap gap-3">
                <span className="text-xs text-muted-foreground">12 countries served</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">WordPress Development · Technical SEO · WooCommerce · Performance</span>
              </div>
            </div>
            <a
              href="https://www.upwork.com/freelancers/~01e794e1660cad4a68"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
            >
              View Upwork Profile <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Ready to Write Better Proposals?</h2>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              Use the tool free. No account. No subscription. Just bring your API key and paste a job description.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-semibold px-8 gap-2">
                  Generate a Proposal Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="mailto:muhammadddyounus@gmail.com">
                <Button size="lg" variant="outline" className="px-8 gap-2">
                  Get in Touch
                </Button>
              </a>
            </div>
          </div>
        </section>

      </main>
      <LandingFooter />
    </>
  );
};

export default About;
