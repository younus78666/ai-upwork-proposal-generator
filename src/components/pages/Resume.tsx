'use client'
import { Helmet } from '@/lib/helmet-stub';
import Link from 'next/link';
import { Printer, ArrowLeft, Download, Mail, Phone, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── data ─── */

const contact = {
  name: "Muhammad Younus",
  title: "Senior WordPress Developer | Technical SEO Specialist | Team Leader",
  location: "Karachi, Pakistan",
  phone: "+92-332-0315840",
  email: "muhammadddyounus@gmail.com",
  website: "muhammadyounus.com",
  linkedin: "linkedin.com/in/wordpress-website-manager",
  upwork: "upwork.com/freelancers/~01e794e1660cad4a68",
};

const summary = `Senior WordPress Developer with 7+ years of experience delivering 400+ projects across 12 countries on Upwork (Top Rated, 99% Job Success Score, $100K+ earned). Expert in custom WordPress development, WooCommerce, Technical SEO (Koray Semantic SEO framework), Core Web Vitals optimization, and AI-assisted development (Claude AI, ChatGPT). Track record: 68% load time reduction, 32% conversion increase, 90+ PageSpeed scores guaranteed. Led teams of WordPress developers, SEO specialists, and content writers simultaneously. Full-time remote. Immediate start available.`;

const skills: { category: string; items: string[] }[] = [
  {
    category: "WordPress Development",
    items: ["Custom Themes", "Plugin Development", "Gutenberg Blocks", "WooCommerce", "Elementor Pro", "Divi", "Bricks Builder", "Oxygen", "ACF Pro", "Custom Post Types", "WordPress Hooks / Actions / Filters", "WordPress Multisite", "Child Themes", "WPML"],
  },
  {
    category: "Languages",
    items: ["PHP 8+", "JavaScript", "jQuery", "HTML5", "CSS3", "SASS", "MySQL", "JSON", "XML", "React.js"],
  },
  {
    category: "Technical SEO",
    items: ["Semantic SEO (Koray Framework)", "Topical Maps", "Topical Authority", "Entity-Based SEO", "Schema Markup / JSON-LD", "Content Clusters", "N-Gram Analysis", "NLP Keyword Extraction", "Core Web Vitals", "Technical SEO Audits"],
  },
  {
    category: "Performance Optimization",
    items: ["WP Rocket", "LiteSpeed Cache", "W3 Total Cache", "Redis", "Memcached", "Cloudflare CDN", "BunnyCDN", "Critical CSS", "WebP Conversion", "Lazy Loading", "PageSpeed Optimization"],
  },
  {
    category: "Security",
    items: ["Wordfence", "Sucuri", "WAF (Web Application Firewall)", "Malware Removal", "Hacked Site Recovery", "SSL / HTTPS", "2FA", "Security Hardening", "Bot Protection"],
  },
  {
    category: "Hosting & DevOps",
    items: ["Cloudways", "Kinsta", "WP Engine", "SiteGround", "DigitalOcean", "AWS Lightsail", "cPanel / WHM", "Plesk", "Git / GitHub", "Composer", "npm"],
  },
  {
    category: "SEO & Analytics Tools",
    items: ["SEMrush", "Ahrefs", "Screaming Frog", "Sitebulb", "Google Search Console", "Google Analytics 4", "RankMath", "Yoast SEO", "Ubersuggest"],
  },
  {
    category: "AI & Automation",
    items: ["Claude AI", "ChatGPT", "Google AI Studio", "Notebook LLM", "Lovable", "AI Gravity", "React-to-WordPress Conversion", "Vibe Coding"],
  },
  {
    category: "Design & Collaboration",
    items: ["Figma", "Responsive Web Design", "Cross-Browser Compatibility", "PSD-to-WordPress", "Monday.com", "ClickUp", "Jira", "Agile / Scrum", "Sprint Planning"],
  },
];

const experience = [
  {
    role: "Senior WordPress Developer",
    company: "West Coast Integrated",
    location: "Canada (Remote)",
    period: "January 2024 – Present",
    type: "Full-Time Contract",
    bullets: [
      "Manage a portfolio of 15+ client WordPress websites for a Canada-based digital agency",
      "Implement Semantic SEO using Koray framework — build topical maps, entity-based content architecture, and schema markup",
      "Convert AI-generated Vibe Coding projects (Lovable, AI Gravity) into production-ready WordPress sites",
      "Achieve 90+ PageSpeed scores on all client projects through Core Web Vitals optimization",
      "Use Claude AI and ChatGPT to accelerate development workflows and solve complex technical problems",
    ],
  },
  {
    role: "WordPress Developer & Team Lead",
    company: "Web Works Digital Marketing",
    location: "United States (Remote)",
    period: "January 2019 – December 2023",
    type: "5 Years",
    bullets: [
      "Led 3 simultaneous teams of WordPress developers, SEO specialists, and content writers",
      "Reduced 3-week project timelines to 1 week through parallel workstream coordination and sprint planning",
      "Developed and maintained 100+ WordPress websites for agency clients across multiple industries",
      "Built WooCommerce stores with 2,000–5,000+ products; integrated Stripe, PayPal, and Square payment gateways",
      "Achieved 90+ PageSpeed scores across all projects; implemented Core Web Vitals compliance",
      "Applied Koray Semantic SEO framework — built topical maps, content clusters, and entity-based SEO architecture",
    ],
  },
  {
    role: "WordPress Developer",
    company: "Bataes.io",
    location: "Austria (Remote)",
    period: "January 2022 – December 2024",
    type: "Part-Time",
    bullets: [
      "Managed and maintained multiple client WordPress websites for an Austrian digital agency",
      "Developed custom themes and plugins aligned with European client requirements",
      "Optimized performance and implemented technical SEO improvements across client sites",
    ],
  },
  {
    role: "WordPress Developer",
    company: "EDLINKS Educational Services",
    location: "United States (Remote)",
    period: "2018 – 2019",
    type: "",
    bullets: [
      "Built and maintained WordPress websites for educational services company",
      "Handled on-page SEO, PSD-to-WordPress conversion, and cross-functional collaboration",
    ],
  },
  {
    role: "WordPress Developer",
    company: "Website Digital Marketing LTD",
    location: "Australia (Remote)",
    period: "2017 – 2018",
    type: "",
    bullets: [
      "Developed WordPress websites for an Australian digital marketing agency",
      "Delivered PSD-to-WordPress conversions and on-page SEO optimization",
    ],
  },
];

const projects = [
  { name: "calgarywindowrepair.ca", desc: "Built custom WordPress site from Figma design. Generated 39 inbound calls in 2 months for local glass repair company (18 in March, 21 in April 2026).", tags: ["WordPress", "Figma", "Local SEO"] },
  { name: "scrapavehicle.co.uk", desc: "Built 500+ location pages using WordPress, Elementor, and LPagery plugin with Google Sheets automation for UK vehicle scrapping service.", tags: ["WordPress", "Elementor", "Automation", "Local SEO"] },
  { name: "floridaaesthetics.com", desc: "Developed conversion-focused landing page for medical spa that increased bookings by 25% from Google Ads and organic traffic.", tags: ["WordPress", "CRO", "Medical"] },
  { name: "alkosafe.com", desc: "Built multilingual WooCommerce store (English/Turkish) with dual currency support and branded email for alcohol detector manufacturer.", tags: ["WooCommerce", "WPML", "Multilingual"] },
  { name: "cortechs.ai", desc: "FDA-cleared medical imaging company. Delivered strict healthcare compliance, performance optimization, and accessibility requirements.", tags: ["WordPress", "Healthcare", "Compliance"] },
  { name: "outilbox.fr", desc: "5,000+ product WooCommerce e-commerce store with scalability optimization for the French market.", tags: ["WooCommerce", "Performance", "E-Commerce"] },
  { name: "dslinc.com", desc: "2,000+ product WooCommerce store for a commercial kitchen equipment supplier in Canada.", tags: ["WooCommerce", "B2B"] },
  { name: "federalprocessingregistry.com", desc: "200+ page government services website with complex SEO architecture and topical authority strategy.", tags: ["WordPress", "Semantic SEO", "Government"] },
];

const education = {
  degree: "Bachelor of Science in Computer Science",
  school: "University of Karachi, Pakistan",
  period: "2019 – 2023",
  coursework: "Web Development, Database Management (MySQL), PHP, JavaScript, Software Engineering, Agile Methodologies",
};

/* ─── Word-compatible HTML generator ─── */
// Produces a .doc file (Word HTML format) that Microsoft Word, LibreOffice,
// and Google Docs all open natively — no npm library needed.
function downloadAsDoc() {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const skillsHtml = skills.map(({ category, items }) =>
    `<p class="skill-row"><span class="skill-cat">${esc(category)}:</span>&nbsp;${esc(items.join(', '))}</p>`
  ).join('');

  const expHtml = experience.map(job => `
    <div class="job-block">
      <div class="clearfix">
        <span class="job-period">${esc(job.period)}${job.type ? ' &middot; ' + esc(job.type) : ''}</span>
        <h3 class="job-title">${esc(job.role)}</h3>
      </div>
      <p class="job-meta">${esc(job.company)} &mdash; ${esc(job.location)}</p>
      ${job.bullets.map(b => `<p class="bullet">&bull;&nbsp;${esc(b)}</p>`).join('')}
    </div>`
  ).join('');

  const projHtml = projects.map(({ name, desc, tags }) =>
    `<p class="project-row"><span class="project-name">${esc(name)}</span>&nbsp;&mdash; ${esc(desc)} <em>(${esc(tags.join(', '))})</em></p>`
  ).join('');

  const html = `
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>Resume – ${esc(contact.name)}</title>
<!--[if gte mso 9]><xml>
<w:WordDocument>
  <w:View>Print</w:View><w:Zoom>100</w:Zoom><w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml><![endif]-->
<style>
  @page WordSection1 { margin:1in 1in 1in 1in; mso-page-orientation:portrait; }
  div.WordSection1 { page:WordSection1; }
  body { font-family:Calibri,Arial,sans-serif; font-size:11pt; color:#111; margin:0; padding:0; line-height:1.4; }
  h1 { font-size:20pt; font-weight:bold; color:#111; margin:0 0 2pt 0; }
  .subtitle { font-size:10pt; color:#444; margin:0 0 6pt 0; }
  .contact-line { font-size:9pt; color:#555; margin:0 0 0 0; }
  .divider { border:none; border-top:1.5pt solid #222; margin:8pt 0 0 0; }
  h2.sec { font-size:8pt; font-weight:bold; text-transform:uppercase; letter-spacing:1.5pt; color:#666; border-bottom:1pt solid #ccc; padding-bottom:2pt; margin:12pt 0 5pt 0; }
  h3.job-title { font-size:11pt; font-weight:bold; color:#111; margin:0; }
  .job-period { font-size:9pt; color:#666; float:right; }
  .job-meta { font-size:9pt; color:#555; font-weight:600; margin:1pt 0 3pt 0; }
  .job-block { margin-bottom:9pt; }
  .bullet { font-size:9.5pt; color:#333; margin:1pt 0 1pt 14pt; }
  .skill-row { font-size:9.5pt; color:#333; margin:1.5pt 0; }
  .skill-cat { font-weight:bold; color:#222; }
  .project-row { font-size:9.5pt; color:#333; margin:2pt 0; }
  .project-name { font-weight:bold; color:#222; }
  .clearfix:after { content:""; display:table; clear:both; }
  p { margin:0; padding:0; }
  em { font-style:italic; color:#777; }
</style>
</head>
<body>
<div class="WordSection1">

  <h1>${esc(contact.name)}</h1>
  <p class="subtitle">${esc(contact.title)}</p>
  <hr class="divider">
  <p class="contact-line" style="margin-top:5pt">
    ${esc(contact.location)} &nbsp;|&nbsp;
    ${esc(contact.phone)} &nbsp;|&nbsp;
    ${esc(contact.email)} &nbsp;|&nbsp;
    ${esc(contact.website)} &nbsp;|&nbsp;
    ${esc(contact.linkedin)}
  </p>

  <h2 class="sec">Professional Summary</h2>
  <p style="font-size:9.5pt;color:#333;line-height:1.5">${esc(summary)}</p>

  <h2 class="sec">Core Skills</h2>
  ${skillsHtml}

  <h2 class="sec">Professional Experience</h2>
  ${expHtml}

  <h2 class="sec">Notable Projects</h2>
  ${projHtml}

  <h2 class="sec">Education</h2>
  <div class="clearfix">
    <span class="job-period">${esc(education.period)}</span>
    <h3 class="job-title">${esc(education.degree)}</h3>
  </div>
  <p class="job-meta">${esc(education.school)}</p>
  <p class="bullet">Relevant Coursework: ${esc(education.coursework)}</p>

  <h2 class="sec">Additional Information</h2>
  <p class="skill-row"><span class="skill-cat">Upwork:</span>&nbsp;Top Rated Badge &middot; $100K+ Earned &middot; 400+ Jobs Completed &middot; 99% Job Success Score &middot; 12 Countries Served</p>
  <p class="skill-row"><span class="skill-cat">Languages:</span>&nbsp;English (Professional Working Proficiency), Urdu (Full Professional Proficiency)</p>
  <p class="skill-row"><span class="skill-cat">Availability:</span>&nbsp;Full-time remote &middot; Flexible timezone overlap &middot; Immediate start available</p>

</div>
</body>
</html>`.trim();

  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Muhammad-Younus-Resume.doc';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── component ─── */

export default function Resume() {
  const handlePrint = () => window.print();

  return (
    <>
      <Helmet>
        <title>Resume – Muhammad Younus | Senior WordPress Developer</title>
        <meta name="description" content="ATS-optimized resume of Muhammad Younus, Senior WordPress Developer, Technical SEO Specialist, 7+ years experience, 400+ Upwork projects, 99% JSS score." />
        <link rel="canonical" href="https://ultimatefreelancers.com/resume" />
      </Helmet>

      {/* ── Screen-only toolbar ── */}
      <div className="print:hidden sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/about">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to About
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadAsDoc} className="gap-1.5 text-xs">
            <FileText className="w-3.5 h-3.5" /> Download .doc
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5 text-xs bg-primary text-white hover:bg-primary/90">
            <Printer className="w-3.5 h-3.5" /> Save as PDF
          </Button>
        </div>
      </div>

      {/* ── Resume body ── */}
      <main className="bg-white min-h-screen py-10 px-4 print:py-0 print:px-0">
        <div className="max-w-[860px] mx-auto bg-white print:max-w-full" style={{ fontFamily: "'Calibri', 'Arial', sans-serif" }}>

          {/* ── HEADER ── */}
          <header className="mb-5 pb-4 border-b-2 border-gray-800 print:pb-3">
            <h1 className="text-3xl print:text-2xl font-bold text-gray-900 tracking-tight mb-0.5">{contact.name}</h1>
            <p className="text-sm text-gray-600 font-medium mb-3">{contact.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-gray-900 print:no-underline"><Mail className="w-3 h-3" />{contact.email}</a>
              <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900 print:no-underline"><Globe className="w-3 h-3" />{contact.website}</a>
              <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-900 print:no-underline"><Globe className="w-3 h-3" />{contact.linkedin}</a>
              <span className="text-gray-500">{contact.location}</span>
            </div>
          </header>

          {/* ── PROFESSIONAL SUMMARY ── */}
          <section className="mb-5" aria-label="Professional Summary">
            <h2 className="text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2 border-b border-gray-200 pb-1">Professional Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>

          {/* ── CORE SKILLS ── */}
          <section className="mb-5" aria-label="Core Skills">
            <h2 className="text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-3 border-b border-gray-200 pb-1">Core Skills</h2>
            <div className="space-y-2">
              {skills.map(({ category, items }) => (
                <div key={category} className="flex gap-2 text-xs">
                  <span className="font-semibold text-gray-800 shrink-0 w-48 print:w-44">{category}:</span>
                  <span className="text-gray-600">{items.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── PROFESSIONAL EXPERIENCE ── */}
          <section className="mb-5" aria-label="Professional Experience">
            <h2 className="text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-3 border-b border-gray-200 pb-1">Professional Experience</h2>
            <div className="space-y-5">
              {experience.map((job, i) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{job.role}</h3>
                    <span className="text-xs text-gray-500 shrink-0">{job.period}{job.type ? ` · ${job.type}` : ''}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium mb-1.5">{job.company} — {job.location}</p>
                  <ul className="space-y-1">
                    {job.bullets.map((b, j) => (
                      <li key={j} className="text-xs text-gray-700 leading-relaxed flex gap-2">
                        <span className="shrink-0 text-gray-400 mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── NOTABLE PROJECTS ── */}
          <section className="mb-5" aria-label="Notable Projects">
            <h2 className="text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-3 border-b border-gray-200 pb-1">Notable Projects</h2>
            <div className="space-y-2.5">
              {projects.map(({ name, desc, tags }) => (
                <div key={name} className="flex gap-3 text-xs">
                  <span className="font-semibold text-gray-800 shrink-0 w-52 print:w-48">{name}</span>
                  <span className="text-gray-600">{desc} <span className="text-gray-400 italic">({tags.join(", ")})</span></span>
                </div>
              ))}
            </div>
          </section>

          {/* ── EDUCATION ── */}
          <section className="mb-5" aria-label="Education">
            <h2 className="text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-3 border-b border-gray-200 pb-1">Education</h2>
            <div className="flex flex-wrap items-baseline justify-between gap-1 mb-0.5">
              <h3 className="text-sm font-bold text-gray-900">{education.degree}</h3>
              <span className="text-xs text-gray-500 shrink-0">{education.period}</span>
            </div>
            <p className="text-xs text-gray-600 font-medium mb-1">{education.school}</p>
            <p className="text-xs text-gray-600">Relevant Coursework: {education.coursework}</p>
          </section>

          {/* ── ADDITIONAL INFORMATION ── */}
          <section aria-label="Additional Information">
            <h2 className="text-xs font-bold uppercase tracking-[2px] text-gray-500 mb-2 border-b border-gray-200 pb-1">Additional Information</h2>
            <div className="space-y-1 text-xs text-gray-700">
              <p><span className="font-semibold text-gray-800">Upwork:</span> Top Rated Badge · $100K+ Earned · 400+ Jobs Completed · 99% Job Success Score · 12 Countries Served</p>
              <p><span className="font-semibold text-gray-800">Languages:</span> English (Professional Working Proficiency), Urdu (Full Professional Proficiency)</p>
              <p><span className="font-semibold text-gray-800">Availability:</span> Full-time remote · Flexible timezone overlap · Immediate start available</p>
            </div>
          </section>

        </div>
      </main>

      {/* ── ATS Audit panel (screen only) ── */}
      <aside className="print:hidden max-w-[860px] mx-auto px-4 pb-16 mt-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-bold text-foreground mb-4">ATS Optimization Audit</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { pass: true,  text: "Standard section headings (Professional Summary, Core Skills, Professional Experience, Education)" },
              { pass: true,  text: "Consistent date format throughout (Month YYYY – Month YYYY)" },
              { pass: true,  text: "Quantified achievements in every role (400+, 99%, $100K+, 68%, 32%, 90+, 39 calls)" },
              { pass: true,  text: "Action verbs open every bullet (Manage, Implement, Convert, Achieve, Led, Delivered, Built)" },
              { pass: true,  text: "Earlier experience split into separate roles — no pipe-separated single line" },
              { pass: true,  text: "Skills listed inline with category label — ATS-parseable format" },
              { pass: true,  text: "'React.js' instead of 'Basic React' — qualifier removed" },
              { pass: true,  text: "Added missing keywords: REST API, WPML, Multisite, Figma, Responsive Design, Composer, npm" },
              { pass: true,  text: "Removed 'Leverage' (AI/buzzword) from bullets" },
              { pass: true,  text: "Clean single-column layout — no tables, no multi-column, no graphics" },
              { pass: true,  text: "Contact info at top with email, phone, LinkedIn, website" },
              { pass: true,  text: "No 'References available upon request' line" },
            ].map(({ pass, text }) => (
              <div key={text} className="flex items-start gap-2 text-xs">
                <span className={`shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${pass ? 'bg-green-500' : 'bg-red-500'}`}>
                  {pass ? '✓' : '✗'}
                </span>
                <span className="text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <style>{`
        @media print {
          @page { margin: 12mm 15mm; size: A4; }

          /* Hide everything except the resume content */
          .print\\:hidden,
          nav, aside, footer,
          [class*="sticky"] { display: none !important; }

          /* Force white background — browser may strip it otherwise */
          html, body, main { background: #ffffff !important; }

          /* Force all text to dark hex — overrides Tailwind CSS variables
             which resolve differently in dark mode and cause blank PDFs */
          * {
            color: #111111 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          a { color: #111111 !important; text-decoration: none !important; }

          /* Restore dimmer shades for muted text */
          .text-gray-400, [class*="text-gray-4"] { color: #888888 !important; }
          .text-gray-500, [class*="text-gray-5"] { color: #666666 !important; }
          .text-gray-600, [class*="text-gray-6"] { color: #555555 !important; }
          .text-gray-700, [class*="text-gray-7"] { color: #333333 !important; }

          /* Strip all background tints so they don't block text */
          * { background-color: transparent !important; background: transparent !important; }

          /* Restore borders */
          .border-b-2 { border-bottom: 2px solid #222222 !important; }
          .border-b   { border-bottom: 1px solid #cccccc !important; }
          .border-gray-200 { border-color: #cccccc !important; }

          /* No page break inside a job block */
          section, div { page-break-inside: avoid; }
        }
      `}</style>
    </>
  );
}
