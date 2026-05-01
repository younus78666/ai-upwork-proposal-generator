import Link from 'next/link';

export const LandingFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F5F3EE] text-foreground border-t border-border">

      {/* Main grid */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="grid gap-12 lg:grid-cols-[2.5fr_1fr_1fr_1fr]">

          {/* Brand col */}
          <div className="max-w-sm">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/Logo---Ultimate-Freelancers.png"
                alt="Ultimate Freelancers"
                className="h-12 w-auto mb-6"
                width="240"
                height="71"
                loading="lazy"
              />
            </picture>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Free AI-powered Upwork proposal generator. Get 3 personalized cover letter variants plus screening question answers in 60 seconds. No account. No Chrome extension. Bring your own API key.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: '✓', label: 'No account required' },
                { icon: '✓', label: 'Free (BYOK)' },
                { icon: '✓', label: 'Browser-only storage' },
              ].map(({ icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/60 px-3 py-1 text-xs text-muted-foreground">
                  <span className="text-primary">{icon}</span> {label}
                </span>
              ))}
            </div>
          </div>

          {/* Tool */}
          <div>
            <h5 className="mb-5 text-[11px] font-bold uppercase tracking-[2px] text-foreground/50">Tool</h5>
            <ul className="space-y-3.5">
              {[
                { label: 'Proposal Generator', href: '/' },
                { label: 'How It Works', href: '/#how-it-works' },
                { label: 'Features', href: '/#features' },
                { label: 'Examples', href: '/#examples' },
                { label: 'API Key Setup', href: '/api-key' },
                { label: 'Saved Projects', href: '/projects' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="mb-5 text-[11px] font-bold uppercase tracking-[2px] text-foreground/50">Resources</h5>
            <ul className="space-y-3.5">
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'Proposal Tips', href: '/blog/how-to-write-upwork-proposal' },
                { label: 'Cover Letter Examples', href: '/upwork-cover-letter-examples' },
                { label: 'Proposal Examples', href: '/upwork-proposal-examples' },
                { label: 'How to Submit a Proposal', href: '/how-to-submit-proposal-upwork' },
                { label: 'Freelance Proposal Template', href: '/freelance-proposal-template' },
                { label: 'How to Write a Cover Letter', href: '/how-to-write-upwork-cover-letter' },
                { label: 'Message to Client', href: '/upwork-message-to-client-sample' },
                { label: 'Screening Questions', href: '/blog/how-to-answer-upwork-screening-questions' },
                { label: 'FAQ', href: '/#faq' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="mb-5 text-[11px] font-bold uppercase tracking-[2px] text-foreground/50">Company</h5>
            <ul className="space-y-3.5">
              <li><Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About</Link></li>
              <li><Link href="/resume" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Resume</Link></li>
              <li><a href="mailto:muhammadddyounus@gmail.com" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</a></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link></li>
              <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Ultimate Freelancers. All rights reserved. Built by freelancers, for freelancers.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Sitemap</a>
          </div>
        </div>
      </div>

    </footer>
  );
};
