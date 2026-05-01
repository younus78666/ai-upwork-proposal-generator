import HowToSubmitProposalUpworkPage from '@/components/pages/HowToSubmitProposalUpwork'

export const metadata = {
  title: "How to Submit an Upwork Proposal | Ultimate Freelancers",
  description: "Step-by-step guide to submitting an Upwork proposal. Covers the cover letter, screening questions, connects cost, boosted proposals, and beginner mistakes.",
  alternates: { canonical: "https://ultimatefreelancers.com/how-to-submit-proposal-upwork" },
  openGraph: {
    title: "How to Submit an Upwork Proposal | Ultimate Freelancers",
    description: "Step-by-step guide to submitting an Upwork proposal. Covers the cover letter, screening questions, connects cost, boosted proposals, and beginner mistakes.",
    url: "https://ultimatefreelancers.com/how-to-submit-proposal-upwork",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "How to Submit an Upwork Proposal | Ultimate Freelancers",
    description: "Step-by-step guide to submitting an Upwork proposal. Covers the cover letter, screening questions, connects cost, boosted proposals, and beginner mistakes.",
  },
}


export default function Page() { return <HowToSubmitProposalUpworkPage /> }
