import UpworkProposalGeneratorPage from '@/components/pages/UpworkProposalGenerator'

export const metadata = {
  title: "Free AI Upwork Proposal Generator | Ultimate Freelancers",
  description: "Free AI Upwork proposal generator. Paste any job post, get 3 personalised variants plus screening question answers in 60 seconds. No account required.",
  alternates: { canonical: "https://ultimatefreelancers.com/upwork-proposal-generator" },
  openGraph: {
    title: "Free AI Upwork Proposal Generator | Ultimate Freelancers",
    description: "Free AI Upwork proposal generator. Paste any job post, get 3 personalised variants plus screening question answers in 60 seconds. No account required.",
    url: "https://ultimatefreelancers.com/upwork-proposal-generator",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free AI Upwork Proposal Generator | Ultimate Freelancers",
    description: "Free AI Upwork proposal generator. Paste any job post, get 3 personalised variants plus screening question answers in 60 seconds. No account required.",
  },
}


export default function Page() { return <UpworkProposalGeneratorPage /> }
