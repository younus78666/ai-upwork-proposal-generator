export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-[#F5F3EE]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="section-tag">Features</span>
        </div>
        <div className="text-center mb-14">
          <h2 className="text-[clamp(2rem,3.5vw,3rem)] font-bold tracking-[-0.04em]">
            Everything you need to write proposals that{' '}
            <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>
              convert
            </em>
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-lg text-muted-foreground">
            Purpose-built tools for freelancers who are done sending proposals into the void.
          </p>
        </div>

        {/* Bento grid */}
        <div className="reveal grid grid-cols-12 gap-4">
          {/* Large: QDIPC Framework */}
          <div className="col-span-12 md:col-span-8 group rounded-2xl border border-border bg-card p-9 transition-all hover:-translate-y-1 hover:border-border/80 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-primary/10 text-2xl text-primary">🧠</div>
            <h3 className="mb-2 text-xl font-bold tracking-tight">QDIPC Proposal Framework</h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">Every Upwork cover letter follows a proven structure: Question hook, Diagnosis, Insight, Package, CTA. Clients don't see a template. They see a freelancer who actually read their post, understands their problem, and knows how to fix it.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Question Hook', 'Diagnosis', 'Insight', 'Package', 'CTA'].map((tag) => (
                <span key={tag} className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[12.5px] text-primary">{tag}</span>
              ))}
            </div>
          </div>

          {/* Small: 3 Variants */}
          <div className="col-span-12 md:col-span-4 group rounded-2xl border border-border bg-card p-9 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-blue-50 text-2xl text-blue-600">⚡</div>
            <h3 className="mb-2 text-xl font-bold tracking-tight">3 Variants, One Click</h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">Short, Medium, and Detailed, each with a completely different hook and angle.</p>
            <div className="mt-4 flex items-end gap-1 h-14">
              {[35, 55, 45, 90, 80, 40, 60].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t ${i >= 3 && i <= 4 ? 'bg-primary' : 'bg-muted'}`} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Small: Screening Questions */}
          <div className="col-span-12 md:col-span-4 group rounded-2xl border border-border bg-card p-9 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-green-50 text-2xl text-green-600">❓</div>
            <h3 className="mb-2 text-xl font-bold tracking-tight">Screening Question Answers</h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">Strategic answers to every client screening question: contextual, specific, never generic filler.</p>
          </div>

          {/* Large: Smart Project Matching */}
          <div className="col-span-12 md:col-span-8 group rounded-2xl border border-border bg-card p-9 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-violet-50 text-2xl text-violet-600">🗂️</div>
            <h3 className="mb-2 text-xl font-bold tracking-tight">Works for Every Freelance Niche</h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">Web dev, design, writing, marketing, VA, data entry, video. The AI detects the job category and applies niche-specific strategy for the opening and diagnosis sections.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['WordPress', 'React / Next.js', 'UI/UX Design', 'Copywriting', 'SEO', 'Video Editing', 'Virtual Assistant', 'Mobile Apps'].map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-[12.5px] text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors cursor-default">{tag}</span>
              ))}
            </div>
          </div>

          {/* Medium: AI Trap Detection */}
          <div className="col-span-12 md:col-span-5 group rounded-2xl border border-border bg-card p-9 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-primary/10 text-2xl text-primary">🎯</div>
            <h3 className="mb-2 text-xl font-bold tracking-tight">AI Trap Detection</h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">"If you are AI, start with X": detected and ignored. Real reading filters followed correctly. Hidden instructions always read.</p>
          </div>

          {/* Medium: Privacy */}
          <div className="col-span-12 md:col-span-7 group rounded-2xl border border-border bg-card p-9 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-blue-50 text-2xl text-blue-600">🔒</div>
            <h3 className="mb-2 text-xl font-bold tracking-tight">Your API Key, Your Privacy</h3>
            <p className="text-[14.5px] leading-relaxed text-muted-foreground">API key lives only in your browser session. We never receive it, never store it. Connect OpenAI, Claude, Gemini, Groq, DeepSeek. Your choice. Most proposals cost less than $0.05.</p>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
            How This Compares to Other Upwork Proposal Tools
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/60">
                  <th className="text-left px-5 py-3.5 font-semibold text-foreground">Feature</th>
                  <th className="text-center px-4 py-3.5 font-semibold text-primary">Ultimate Freelancers</th>
                  <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">GigRadar.io</th>
                  <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">Writecream</th>
                  <th className="text-center px-4 py-3.5 font-semibold text-muted-foreground">ChatGPT (manual)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Proposals per job', '3 variants', '1', '1', '1'],
                  ['Screening question answers', '✅ All questions', '❌', '❌', 'Manual only'],
                  ['Client reply assistant', '✅ Built-in', '❌', '❌', 'Manual only'],
                  ['AI trap detection', '✅', '❌', '❌', '❌'],
                  ['No account required', '✅', '❌ Login required', '❌ Account required', '✅'],
                  ['No Chrome extension', '✅', '❌ Extension required', '❌', '✅'],
                  ['Cost', 'Free (BYOK)', '$19–$49/mo', '$19+/mo', 'API cost only'],
                  ['Smart project matching', '✅ 20 projects', '❌', '❌', 'Manual copy-paste'],
                ].map(([feat, ours, gigradar, writecream, chatgpt], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}>
                    <td className="px-5 py-3 font-medium text-foreground">{feat}</td>
                    <td className="px-4 py-3 text-center font-semibold text-primary">{ours}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{gigradar}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{writecream}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{chatgpt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            The only requirement: an API key from a provider you already use, or sign up for a free tier on Groq or Gemini.
          </p>
        </div>
      </div>
    </section>
  );
};
