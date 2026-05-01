import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Providers } from '@/components/Providers'
import { SiteHeaderWrapper } from '@/components/SiteHeaderWrapper'

export const metadata: Metadata = {
  title: 'Free Upwork Proposal Generator | Ultimate Freelancers',
  description:
    'Generate 3 personalized Upwork proposals from any job post in 60 seconds. Answers screening questions. Free with your own API key. No account required.',
  keywords:
    'upwork proposal generator, upwork cover letter generator, ai upwork proposal generator, upwork proposal generator free, upwork cover letter example, upwork cover letter sample, upwork proposal example, upwork proposal template, upwork proposal writing',
  authors: [{ name: 'Ultimate Freelancers' }],
  robots: 'index, follow',
  metadataBase: new URL('https://ultimatefreelancers.com'),
  openGraph: {
    title: 'Free Upwork Proposal Generator — 3 Cover Letter Variants in 60 Seconds',
    description:
      'Paste any Upwork job post. Get 3 personalized cover letter variants plus screening question answers in 60 seconds. No account. No Chrome extension. Free.',
    type: 'website',
    url: 'https://ultimatefreelancers.com/',
    siteName: 'Ultimate Freelancers',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@UltimateFreelancers',
    title: 'Free Upwork Proposal Generator — 3 Cover Letter Variants in 60 Seconds',
    description:
      'Paste any Upwork job post. Get 3 personalized cover letter variants plus screening question answers in 60 seconds. No account. No extension.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'GpB41C6B4KSHEArOcqXceNpw2ukr4kBeU0heWzz5uRk',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=General+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap"
        />
        <link rel="preconnect" href="https://nglboerrgaqyzxgndndl.supabase.co" />
        <link rel="icon" href="/Favicon.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/Favicon.png" />
        <meta name="theme-color" content="#F26522" />
        <link rel="canonical" href="https://ultimatefreelancers.com/" />
      </head>
      <body className="min-h-full antialiased">
        <Providers>
          <SiteHeaderWrapper />
          {children}
        </Providers>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9HX8PEYLEP"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9HX8PEYLEP');
          `}
        </Script>
      </body>
    </html>
  )
}
