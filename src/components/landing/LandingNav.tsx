'use client'
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const LandingNav = () => {
  const onGetStarted = () => {
    document.getElementById('job-title')?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/#examples', label: 'Examples' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#features', label: 'Features' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <header>
    <nav aria-label="Main navigation" className={`sticky top-0 z-50 bg-[#FAFAF7]/85 backdrop-blur-[24px] saturate-150 border-b border-border transition-shadow duration-200 ${scrolled ? 'shadow-[0_2px_8px_rgba(26,26,46,0.06)]' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <a href="/">
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/Logo---Ultimate-Freelancers.png"
                alt="Ultimate Freelancers"
                className="h-9 w-auto"
                width="180"
                height="36"
                fetchPriority="high"
              />
            </picture>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-muted-foreground hover:text-foreground transition-colors font-medium text-sm after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1.5px] after:bg-primary after:scale-x-0 after:transition-transform hover:after:scale-x-100"
              >
                {link.label}
              </a>
            ))}
            <Link href="/about" className="relative text-muted-foreground hover:text-foreground transition-colors font-medium text-sm after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1.5px] after:bg-primary after:scale-x-0 after:transition-transform hover:after:scale-x-100">
              About
            </Link>
            <Link href="/blog" className="relative text-muted-foreground hover:text-foreground transition-colors font-medium text-sm after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1.5px] after:bg-primary after:scale-x-0 after:transition-transform hover:after:scale-x-100">
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/projects">
              <Button variant="outline" className="font-medium gap-2">
                Projects
              </Button>
            </Link>
            <Link href="/api-key">
              <Button variant="outline" className="font-medium gap-2">
                API Key
              </Button>
            </Link>
            <Button
              onClick={onGetStarted}
              className="gradient-primary text-primary-foreground font-semibold px-6"
            >
              Try Free
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/projects" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full font-semibold mt-2 gap-2">
                  Projects
                </Button>
              </Link>
              <Link href="/api-key" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full font-semibold gap-2">
                  API Key
                </Button>
              </Link>
              <Link href="/about" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full font-semibold gap-2">
                  About
                </Button>
              </Link>
              <Link href="/blog" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full font-semibold gap-2">
                  Blog
                </Button>
              </Link>
              <Button
                onClick={() => { setIsOpen(false); onGetStarted(); }}
                className="w-full gradient-primary text-primary-foreground font-semibold"
              >
                Try Free
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
    </header>
  );
};
