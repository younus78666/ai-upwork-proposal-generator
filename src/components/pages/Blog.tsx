'use client'
import { useState } from 'react';
import Link from 'next/link';
import { Helmet } from '@/lib/helmet-stub';
import { Search } from 'lucide-react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import { blogPosts } from '@/data/blogPosts';

const CATEGORY_COLORS: Record<string, string> = {
  'Proposal Writing': 'bg-primary text-white',
  'Examples':         'bg-emerald-600 text-white',
  'Proposal Tips':    'bg-blue-600 text-white',
  'Tools':            'bg-violet-600 text-white',
};

const CATEGORY_BANDS: Record<string, string> = {
  'Proposal Writing': 'from-primary/80 to-primary/40',
  'Examples':         'from-emerald-600/80 to-emerald-400/40',
  'Proposal Tips':    'from-blue-600/80 to-blue-400/40',
  'Tools':            'from-violet-600/80 to-violet-400/40',
};

function categoryBadge(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-muted text-muted-foreground';
}

function categoryBand(cat: string) {
  return CATEGORY_BANDS[cat] ?? 'from-primary/80 to-primary/40';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Build category counts
  const categoryCounts: Record<string, number> = {};
  for (const p of blogPosts) {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
  }

  const filtered = blogPosts.filter(p => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !activeCategory || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);

  return (
    <>
      <Helmet>
        <title>Upwork Proposal Writing Blog | Ultimate Freelancers</title>
        <meta name="description" content="Free guides, real examples, and proven frameworks for writing Upwork proposals that get replies. Tips from top-rated Upwork freelancers with $100K+ earned." />
        <link rel="canonical" href="https://ultimatefreelancers.com/blog" />
        <meta property="og:title" content="Upwork Proposal Writing Blog | Ultimate Freelancers" />
        <meta property="og:description" content="Free guides, real examples, and proven frameworks for writing Upwork proposals that get replies. Tips from top-rated Upwork freelancers with $100K+ earned." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ultimatefreelancers.com/blog" />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="og:site_name" content="Ultimate Freelancers" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upwork Proposal Writing Blog | Ultimate Freelancers" />
        <meta name="twitter:description" content="Free guides, real examples, and proven frameworks for Upwork proposals that get replies." />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Blog",
              "@id": "https://ultimatefreelancers.com/blog#blog",
              "url": "https://ultimatefreelancers.com/blog",
              "image": "https://ultimatefreelancers.com/og-image.png",
              "name": "Upwork Proposal Blog",
              "description": "Free guides on writing Upwork proposals that get replies.",
              "publisher": { "@id": "https://ultimatefreelancers.com/#organization" },
              "blogPost": blogPosts.map(p => ({
                "@type": "BlogPosting",
                "headline": p.title,
                "url": `https://ultimatefreelancers.com/blog/${p.slug}`,
                "datePublished": p.publishedAt,
                "description": p.excerpt,
                "author": { "@type": "Person", "name": p.author.name }
              }))
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ultimatefreelancers.com" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ultimatefreelancers.com/blog" }
              ]
            },
            {
              "@type": "WebPage",
              "url": "https://ultimatefreelancers.com/blog",
              "name": "Upwork Proposal Writing Blog | Ultimate Freelancers",
              "isPartOf": { "@type": "WebSite", "url": "https://ultimatefreelancers.com" },
              "author": { "@type": "Person", "name": "Muhammad Younus", "@id": "https://ultimatefreelancers.com/about#person" }
            }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">

        <main>
          {/* Dark hero */}
          <section className="relative overflow-hidden bg-[#0f0e0c] py-[120px] px-4">
            {/* subtle gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="relative z-10 max-w-5xl mx-auto">
              {/* breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/30">
                <Link href="/" className="transition-colors hover:text-primary/80">Home</Link>
                <span>/</span>
                <span className="text-white/50">Blog</span>
              </nav>

              {/* eyebrow */}
              <div className="mb-5 flex items-center gap-3">
                <span className="block h-px w-9 bg-primary/70" />
                <span className="text-[10.5px] uppercase tracking-[0.30em] text-primary/80">Proposal Guides</span>
              </div>

              <h1 className="mb-6 max-w-[760px] text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1.03] tracking-[-0.03em] text-white">
                Upwork proposal tips from{' '}
                <em className="not-italic" style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                  freelancers who win
                </em>
              </h1>
              <p className="max-w-[540px] text-[16px] leading-[1.75] text-white/55">
                Practical guides, real examples, and frameworks that top Upwork earners use to land more clients.
              </p>
            </div>
          </section>

          {/* Content area */}
          <section className="bg-muted/30 py-[72px]">
            <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start">

                {/* Left: post grid */}
                <div>
                  {filtered.length === 0 ? (
                    <p className="py-16 text-center text-muted-foreground">No posts match your search.</p>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {filtered.map(post => (
                        <Link
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          className="group flex flex-col overflow-hidden border border-border bg-card transition-all hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]"
                        >
                          {/* Image band */}
                          <div className="relative h-[200px] overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${categoryBand(post.category)} transition-transform duration-500 group-hover:scale-[1.04]`} />
                            {/* category badge */}
                            <span className={`absolute left-4 top-4 px-3 py-1 text-[9px] uppercase tracking-[0.22em] font-semibold ${categoryBadge(post.category)}`}>
                              {post.category}
                            </span>
                          </div>

                          {/* Body */}
                          <div className="flex flex-1 flex-col p-6">
                            <h2 className="mb-3 flex-1 text-[17px] font-semibold leading-[1.28] tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary">
                              {post.title}
                            </h2>
                            <p className="mb-4 text-[13px] font-light leading-[1.78] text-muted-foreground line-clamp-3">
                              {post.excerpt}
                            </p>
                            {/* Meta bar */}
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-3 text-[11px]">
                              <span className="font-medium text-foreground">{post.author.name}</span>
                              <span className="text-muted-foreground/50">·</span>
                              <span className="text-muted-foreground">{formatDate(post.publishedAt)}</span>
                              <span className="ml-auto text-primary tracking-[0.04em]">{post.readTime}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: sticky sidebar */}
                <aside className="hidden lg:block lg:sticky lg:top-24">

                  {/* Search */}
                  <div className="mb-6 border border-border bg-card p-6">
                    <p className="mb-4 border-b border-border pb-3 text-[10px] uppercase tracking-[0.24em] text-foreground">
                      Search
                    </p>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 border border-border border-r-0 bg-muted/40 px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        aria-label="Search"
                        className="flex items-center justify-center bg-primary px-3 py-2.5 transition-colors hover:bg-primary/90"
                      >
                        <Search className="h-4 w-4 text-white" strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mb-6 border border-border bg-card p-6">
                    <p className="mb-4 border-b border-border pb-3 text-[10px] uppercase tracking-[0.24em] text-foreground">
                      Categories
                    </p>
                    <ul className="flex flex-col">
                      <li className="border-b border-border last:border-0">
                        <button
                          type="button"
                          onClick={() => setActiveCategory(null)}
                          className={`flex w-full items-center justify-between py-2.5 text-[13px] font-light transition-colors ${activeCategory === null ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
                        >
                          All Posts
                          <span className="bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{blogPosts.length}</span>
                        </button>
                      </li>
                      {Object.entries(categoryCounts).map(([cat, count]) => (
                        <li key={cat} className="border-b border-border last:border-0">
                          <button
                            type="button"
                            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                            className={`flex w-full items-center justify-between py-2.5 text-[13px] font-light transition-colors ${activeCategory === cat ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}`}
                          >
                            {cat}
                            <span className="bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{count}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recent Posts */}
                  <div className="mb-6 border border-border bg-card p-6">
                    <p className="mb-4 border-b border-border pb-3 text-[10px] uppercase tracking-[0.24em] text-foreground">
                      Recent Posts
                    </p>
                    <div className="flex flex-col gap-4">
                      {recentPosts.map(post => (
                        <Link
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          className="group flex items-start gap-3"
                        >
                          {/* Color thumb */}
                          <div className={`h-14 w-[72px] flex-shrink-0 overflow-hidden`}>
                            <div className={`h-full w-full bg-gradient-to-br ${categoryBand(post.category)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-[12.5px] font-medium leading-[1.38] text-foreground transition-colors group-hover:text-primary line-clamp-2">
                              {post.title}
                            </span>
                            <span className="mt-1 block text-[11px] text-muted-foreground">
                              {formatDate(post.publishedAt)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* CTA widget */}
                  <div className="border-0 bg-foreground p-6">
                    <p className="mb-3 border-b border-white/10 pb-3 text-[10px] uppercase tracking-[0.24em] text-white/40">
                      Try It Free
                    </p>
                    <p className="mb-2 text-[20px] font-semibold leading-[1.15] text-white">
                      Generate winning{' '}
                      <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
                        proposals
                      </em>
                    </p>
                    <p className="mb-5 text-[13px] leading-[1.65] text-white/50">
                      Paste any Upwork job post and get 3 tailored proposals in 60 seconds. Free with your own API key.
                    </p>
                    <Link href="/"
                      className="block w-full bg-primary py-3 text-center text-[10px] uppercase tracking-[0.20em] text-white transition-colors hover:bg-primary/90"
                    >
                      Try Free Now
                    </Link>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* Mobile CTA */}
          <section className="border-t border-border bg-secondary/30 py-16 text-center lg:hidden">
            <div className="container mx-auto px-4">
              <h2 className="mb-3 text-xl font-bold tracking-tight">Ready to put these tips to work?</h2>
              <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
                Generate 3 personalized proposals from any Upwork job post in 60 seconds.
              </p>
              <Link href="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition-all hover:bg-primary/90"
              >
                Try the Generator Free
              </Link>
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
