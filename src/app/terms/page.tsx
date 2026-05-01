import TermsPage from '@/components/pages/Terms'

export const metadata = {
  title: "Terms of Service | Ultimate Freelancers",
  description: "Terms of Service for Ultimate Freelancers. Free to use with your own API key. No account, no signup required. Read our full usage and data handling terms.",
  alternates: { canonical: "https://ultimatefreelancers.com/terms" },
  openGraph: {
    title: "Terms of Service | Ultimate Freelancers",
    description: "Terms of Service for Ultimate Freelancers. Free to use with your own API key. No account, no signup required. Read our full usage and data handling terms.",
    url: "https://ultimatefreelancers.com/terms/",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Terms of Service | Ultimate Freelancers",
    description: "Terms of Service for Ultimate Freelancers. Free to use with your own API key. No account, no signup required. Read our full usage and data handling terms.",
  },
}


export default function Page() { return <TermsPage /> }
