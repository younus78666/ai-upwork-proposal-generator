import FreelanceProposalTemplatePage from '@/components/pages/FreelanceProposalTemplate'

export const metadata = {
  title: "Freelance Proposal Template | Ultimate Freelancers",
  description: "5 freelance proposal templates for Upwork, Fiverr, email outreach, Statement of Work, and quick pitches. Each includes a breakdown of what to customise.",
  alternates: { canonical: "https://ultimatefreelancers.com/freelance-proposal-template" },
  openGraph: {
    title: "Freelance Proposal Template | Ultimate Freelancers",
    description: "5 freelance proposal templates for Upwork, Fiverr, email outreach, Statement of Work, and quick pitches. Each includes a breakdown of what to customise.",
    url: "https://ultimatefreelancers.com/freelance-proposal-template",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Freelance Proposal Template | Ultimate Freelancers",
    description: "5 freelance proposal templates for Upwork, Fiverr, email outreach, Statement of Work, and quick pitches. Each includes a breakdown of what to customise.",
  },
}


export default function Page() { return <FreelanceProposalTemplatePage /> }
