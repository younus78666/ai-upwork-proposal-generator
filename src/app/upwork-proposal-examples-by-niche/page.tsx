import UpworkProposalExamplesByNichePage from '@/components/pages/UpworkProposalExamplesByNiche'

export const metadata = {
  title: "Upwork Proposal Examples by Niche | Ultimate Freelancers",
  description: "Real Upwork proposal examples for web developers, designers, VAs, data entry, SEO, WordPress, content writers, and data analysts. Copy and customise.",
  alternates: { canonical: "https://ultimatefreelancers.com/upwork-proposal-examples-by-niche" },
  openGraph: {
    title: "Upwork Proposal Examples by Niche | Ultimate Freelancers",
    description: "Real Upwork proposal examples for web developers, designers, VAs, data entry, SEO, WordPress, content writers, and data analysts. Copy and customise.",
    url: "https://ultimatefreelancers.com/upwork-proposal-examples-by-niche",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Upwork Proposal Examples by Niche | Ultimate Freelancers",
    description: "Real Upwork proposal examples for web developers, designers, VAs, data entry, SEO, WordPress, content writers, and data analysts. Copy and customise.",
  },
}


export default function Page() { return <UpworkProposalExamplesByNichePage /> }
