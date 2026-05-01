import UpworkProposalTemplatePage from '@/components/pages/UpworkProposalTemplate'

export const metadata = {
  title: "Free Upwork Proposal Templates | Ultimate Freelancers",
  description: "5 copy-paste Upwork proposal templates: short, medium, detailed, no experience, and high budget. Each with a full breakdown and notes on what to customise.",
  alternates: { canonical: "https://ultimatefreelancers.com/upwork-proposal-template" },
  openGraph: {
    title: "Free Upwork Proposal Templates | Ultimate Freelancers",
    description: "5 copy-paste Upwork proposal templates: short, medium, detailed, no experience, and high budget. Each with a full breakdown and notes on what to customise.",
    url: "https://ultimatefreelancers.com/upwork-proposal-template",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free Upwork Proposal Templates | Ultimate Freelancers",
    description: "5 copy-paste Upwork proposal templates: short, medium, detailed, no experience, and high budget. Each with a full breakdown and notes on what to customise.",
  },
}


export default function Page() { return <UpworkProposalTemplatePage /> }
