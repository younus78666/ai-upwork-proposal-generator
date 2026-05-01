import { Helmet } from '@/lib/helmet-stub';
;
import { LandingFooter } from "@/components/landing/LandingFooter";

const Privacy = () => {
  const lastUpdated = "April 27, 2026";

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Data Usage | Ultimate Freelancers</title>
        <meta name="description" content="Privacy Policy for Ultimate Freelancers: how we collect, store, and protect your data, API keys, and project information. Your API key is never stored." />
        <link rel="canonical" href="https://ultimatefreelancers.com/privacy" />
        <meta property="og:title" content="Privacy Policy - Data Usage | Ultimate Freelancers" />
        <meta property="og:description" content="How Ultimate Freelancers handles your data. We never store your API key or proposals on our servers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ultimatefreelancers.com/privacy" />
        <meta name="robots" content="noindex, follow" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://ultimatefreelancers.com/privacy#webpage",
          "url": "https://ultimatefreelancers.com/privacy",
          "name": "Privacy Policy - Data Usage | Ultimate Freelancers",
          "description": "Privacy Policy for Ultimate Freelancers: how we collect, store, and protect your data, API keys, and project information. Your API key is never stored.",
          "publisher": { "@id": "https://ultimatefreelancers.com/#organization" },
          "isPartOf": { "@type": "WebSite", "url": "https://ultimatefreelancers.com" },
          "author": { "@type": "Person", "name": "Muhammad Younus", "@id": "https://ultimatefreelancers.com/about#person" }
        })}</script>
      </Helmet>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-3xl">

          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">Last updated: {lastUpdated}</p>

          <div className="space-y-10 text-muted-foreground">

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Overview</h2>
              <p>
                Ultimate Freelancers ("we", "us", "the service") is an AI-powered Upwork proposal generator. This policy explains what data we collect, what we don't collect, and how your information is handled. We have designed this tool with privacy as a default; most of your data never leaves your own browser.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. What We Do NOT Collect</h2>
              <p>The following data is handled entirely in your browser and is never sent to our servers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>API Keys:</strong> Your OpenAI, Claude, Gemini, or Groq API key is stored in your browser's <code className="text-xs bg-muted px-1 py-0.5 rounded">sessionStorage</code> only. It is automatically deleted when you close the browser tab. We never receive, log, or store your API key.
                </li>
                <li>
                  <strong>Saved Projects:</strong> Your portfolio projects (name, description, URL, skills) are stored in your browser's <code className="text-xs bg-muted px-1 py-0.5 rounded">localStorage</code> with a 6-month expiry. They stay on your device. We do not have access to them.
                </li>
                <li>
                  <strong>Job Descriptions &amp; Proposals:</strong> The job descriptions you paste and the proposals that are generated exist only in your current browser session. We do not store or log the content of proposals.
                </li>
                <li>
                  <strong>Your Name, Client Names, or Freelancer Details:</strong> Any personal or professional details you enter in the tool are not transmitted to or stored by us.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. What We Do Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Basic Usage Analytics:</strong> We may collect anonymized, aggregate data about how the tool is used (page visits, feature usage counts) via standard web analytics. This data cannot be used to identify individual users.
                </li>
                <li>
                  <strong>Error Logs:</strong> If a technical error occurs, anonymized error details may be logged to help us fix bugs. These logs do not contain your job descriptions, proposals, or API keys.
                </li>
                <li>
                  <strong>Contact Information (if provided):</strong> If you reach out to us via email, we collect only what you voluntarily share to respond to your inquiry.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. How Proposal Generation Works</h2>
              <p>
                When you click "Generate Proposal", your browser sends the job description, your answers, and your saved project information directly to the AI provider you selected (OpenAI, Anthropic, Google, or Groq) using your own API key. This request goes directly from your browser to the AI provider and does not pass through our servers. The AI provider's own privacy policy and terms of service govern how they handle this data.
              </p>
              <p>
                We recommend reviewing the privacy policy of your chosen provider:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Privacy Policy</a></li>
                <li><a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Anthropic Privacy Policy</a></li>
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a></li>
                <li><a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Groq Privacy Policy</a></li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Cookies</h2>
              <p>
                We use essential cookies only, for maintaining your session and remembering your preferences (such as dark/light mode). We do not use third-party advertising cookies or cross-site tracking. You can disable cookies in your browser settings, though some features may not work correctly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Third-Party Services</h2>
              <p>
                The service uses the following third-party infrastructure:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> Backend infrastructure and edge functions. Supabase routes API requests but does not store proposal content.</li>
                <li><strong>Vercel:</strong> Hosting and CDN for the frontend application.</li>
              </ul>
              <p>
                We do not sell, trade, or rent your data to any third party for marketing purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">6. Data Retention</h2>
              <p>
                Because we do not store most of your data on our servers, there is little to retain or delete. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>API keys:</strong> Auto-deleted from your browser when you close the tab.</li>
                <li><strong>Saved projects:</strong> Stored in your browser for 6 months, then automatically expired.</li>
                <li><strong>Anonymous analytics:</strong> Retained for up to 12 months in aggregate form only.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">7. Your Rights</h2>
              <p>Since most of your data is stored on your own device, you have full control:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clear your saved projects at any time from the Projects page or by clearing your browser's local storage.</li>
                <li>Your API key is automatically removed when you close the browser tab.</li>
                <li>For any data we do hold, you may request access, correction, or deletion by contacting us.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">8. Upwork Compliance</h2>
              <p>
                This tool is designed to help freelancers write proposals for Upwork. We do not endorse, facilitate, or encourage any violation of Upwork's Terms of Service. Specifically:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Proposals generated by this tool are a starting point. You are responsible for reviewing and submitting them in compliance with Upwork's policies.</li>
                <li>The tool does not assist with circumventing Upwork's payment system, fake reviews, or any activity prohibited by Upwork's Terms of Service.</li>
                <li>The tool specifically avoids generating proposals that offer to purchase hosting, domains, or other third-party services on behalf of clients, as this violates Upwork policy.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">9. Changes to This Policy</h2>
              <p>
                We may update this policy as the service evolves. Material changes will be noted with a new "Last updated" date at the top of this page. Continued use of the service after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">10. Contact</h2>
              <p>
                Questions about this Privacy Policy or how your data is handled? Contact us at{" "}
                <a href="mailto:hello@muhammadyounus.com" className="text-primary hover:underline">
                  hello@muhammadyounus.com
                </a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <LandingFooter />
    </>
  );
};

export default Privacy;
