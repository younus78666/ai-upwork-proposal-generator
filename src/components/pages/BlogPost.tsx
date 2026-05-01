'use client'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useParams } from 'next/navigation';
import { Helmet } from '@/lib/helmet-stub';
import { useEffect, useRef, useState } from 'react';
;
import { LandingFooter } from '@/components/landing/LandingFooter';
import { blogPosts } from '@/data/blogPosts';

/* ─── Markdown renderer ─── */
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^## (.+)$/gm, (_, t) => `<h2 id="${slugify(t)}" class="text-2xl font-bold tracking-tight mt-10 mb-4 text-foreground">${t}</h2>`)
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-6 mb-3 text-foreground">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/40 pl-5 py-1 my-4 text-muted-foreground italic bg-secondary/30 rounded-r-lg pr-4">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc text-muted-foreground mb-1">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-muted-foreground mb-1">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>)/g, (m) => m.includes('list-decimal') ? m : m)
    .replace(/\[ \]/g, '<span class="inline-block w-4 h-4 border-2 border-border rounded mr-2 align-middle"></span>')
    .replace(/\[x\]/gi, '<span class="inline-block w-4 h-4 bg-primary rounded mr-2 align-middle"></span>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-muted-foreground">')
    .replace(/^(?!<[h|b|l|t|p|s])(.)/gm, '<p class="mb-4 leading-relaxed text-muted-foreground">$1');
}

function extractH2s(content: string): { id: string; text: string }[] {
  const matches = [...content.matchAll(/^## (.+)$/gm)];
  return matches.map(m => ({ id: slugify(m[1]), text: m[1] }));
}

/* ─── TOC ─── */
function TableOfContents({ headings }: { headings: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-3">
        In This Article
      </div>
      <ul className="space-y-0.5">
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={e => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`block rounded px-2.5 py-1.5 text-[13px] leading-snug transition-all ${
                activeId === h.id
                  ? 'border-l-2 border-primary bg-primary/5 pl-3 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Share buttons ─── */
function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `https://ultimatefreelancers.com/blog/${slug}`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-3">
        Share This Article
      </div>
      <div className="flex gap-2 flex-wrap">
        {/* Twitter/X */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
          target="_blank" rel="noopener noreferrer"
          aria-label="Share on X"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`}
          target="_blank" rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
        {/* Copy link */}
        <button
          onClick={copy}
          aria-label="Copy link"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          {copied ? (
            <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Related posts mini widget ─── */
function RelatedMini({ posts }: { posts: typeof blogPosts }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-3">
        Related Articles
      </div>
      <div className="space-y-4">
        {posts.map(p => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex gap-3 items-start transition-opacity hover:opacity-75"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
              {p.author.initials}
            </div>
            <div className="min-w-0">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary">{p.category}</div>
              <div className="text-[13px] font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {p.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ─── CTA sidebar widget ─── */
function SidebarCTA() {
  return (
    <div className="rounded-xl bg-primary p-5 text-white">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/50 border-b border-white/10 pb-3 mb-4">
        Free Tool
      </div>
      <p className="text-sm leading-relaxed text-white/75 mb-4">
        Put these tips to work. Paste any Upwork job and get 3 personalized proposals in 60 seconds. Free with your own API key.
      </p>
      <Link href="/"
        className="block w-full rounded-lg bg-white text-center text-[11px] font-bold uppercase tracking-wider text-primary py-2.5 transition-all hover:bg-white/90"
      >
        Try Free
      </Link>
    </div>
  );
}

/* ─── Main component ─── */
export default function BlogPost() {
  const params = useParams()
  const slug = params?.slug as string;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) { if (typeof window !== 'undefined') window.location.href = '/blog'; return null; }

  const currentIndex = blogPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3);
  const headings = extractH2s(post.content);

  return (
    <>
      <Helmet>
        <title>{post.metaTitle} | Ultimate Freelancers</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://ultimatefreelancers.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://ultimatefreelancers.com/blog/${post.slug}`} />
        <meta property="og:image" content="https://ultimatefreelancers.com/og-image.png" />
        <meta property="og:site_name" content="Ultimate Freelancers" />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content="https://ultimatefreelancers.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `https://ultimatefreelancers.com/blog/${post.slug}#article`,
              "headline": post.title,
              "description": post.excerpt,
              "url": `https://ultimatefreelancers.com/blog/${post.slug}`,
              "image": {
                "@type": "ImageObject",
                "url": "https://ultimatefreelancers.com/og-image.png",
                "width": 1200,
                "height": 630
              },
              "datePublished": post.publishedAt,
              "dateModified": post.publishedAt,
              "author": {
                "@type": "Person",
                "@id": "https://ultimatefreelancers.com/about#person",
                "name": post.author.name,
                "jobTitle": post.author.role,
                "url": "https://ultimatefreelancers.com/about"
              },
              "publisher": { "@id": "https://ultimatefreelancers.com/#organization" },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://ultimatefreelancers.com/blog/${post.slug}`
              },
              "articleSection": post.category,
              "inLanguage": "en-US"
            },
            {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ultimatefreelancers.com" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ultimatefreelancers.com/blog" },
                { "@type": "ListItem", "position": 3, "name": post.category, "item": `https://ultimatefreelancers.com/blog/${post.slug}` }
              ]
            }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">

        <main>
          {/* ── Post hero ── */}
          <section className="border-b border-border bg-background pt-24 pb-10">
            <div className="container mx-auto max-w-6xl px-4">
              {/* Breadcrumb */}
              <div className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-foreground">{post.category}</span>
              </div>

              <span className="mb-4 inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {post.category}
              </span>

              <h1 className="mt-3 max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-foreground">
                {post.title}
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="mt-7 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {post.author.initials}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{post.author.name}</div>
                  <div className="text-xs text-muted-foreground">{post.author.role}</div>
                </div>
                <span className="text-border">|</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </section>

          {/* ── Article + Sidebar ── */}
          <section className="bg-white py-12">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid gap-12 lg:grid-cols-[1fr_300px]">

                {/* Article body */}
                <article>
                  <div
                    className="prose-custom"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
                  />

                  {/* Author bio */}
                  <div className="mt-12 flex gap-4 rounded-xl border border-border bg-card p-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {post.author.initials}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{post.author.name}</div>
                      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">{post.author.role}</div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        A freelancer sharing practical frameworks for winning on Upwork. All guides are based on real proposal data, not theory.
                      </p>
                    </div>
                  </div>
                </article>

                {/* Sticky sidebar */}
                <aside className="hidden lg:block">
                  <div className="sticky top-24 flex flex-col gap-5">
                    <TableOfContents headings={headings} />
                    <ShareButtons title={post.title} slug={post.slug} />
                    <RelatedMini posts={related} />
                    <SidebarCTA />
                  </div>
                </aside>

              </div>
            </div>
          </section>

          {/* ── Inline CTA (mobile — below article, above prev/next) ── */}
          <div className="lg:hidden border-t border-border bg-card">
            <div className="container mx-auto max-w-6xl px-4 py-8">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
                <h3 className="mb-2 text-lg font-bold">Put these tips to work in 60 seconds</h3>
                <p className="mb-5 text-sm text-muted-foreground">Paste any Upwork job post and get 3 personalized proposals free.</p>
                <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary/90">
                  Try Free
                </Link>
              </div>
            </div>
          </div>

          {/* ── Prev / Next strip ── */}
          {(prevPost || nextPost) && (
            <div className="border-t border-b border-border bg-secondary/20 py-6">
              <div className="container mx-auto max-w-6xl px-4">
                <div className="flex items-center justify-between gap-6">
                  {prevPost ? (
                    <Link href={`/blog/${prevPost.slug}`} className="group flex flex-col gap-1 max-w-xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Previous</span>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                        ← {prevPost.title}
                      </span>
                    </Link>
                  ) : <div />}

                  {nextPost && (
                    <Link href={`/blog/${nextPost.slug}`} className="group flex flex-col gap-1 max-w-xs text-right">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Next</span>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {nextPost.title} →
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Related posts (full-width grid) ── */}
          {related.length > 0 && (
            <section className="border-t border-border bg-secondary/20 py-16">
              <div className="container mx-auto max-w-6xl px-4">
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-primary">Continue Reading</div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">More from the blog</h2>
                  </div>
                  <Link href="/blog" className="text-sm font-medium text-primary hover:underline hidden sm:block">
                    All posts →
                  </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map(p => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="h-1.5 bg-primary/20" />
                      <div className="flex flex-1 flex-col p-6">
                        <span className="mb-3 text-[10px] font-bold uppercase tracking-wider text-primary">{p.category}</span>
                        <h3 className="flex-1 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors mb-3">
                          {p.title}
                        </h3>
                        <div className="flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                            {p.author.initials}
                          </div>
                          <span>{p.author.name}</span>
                          <span>·</span>
                          <span>{p.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>

        <LandingFooter />
      </div>
    </>
  );
}
