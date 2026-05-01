import HowToWriteUpworkProposalPage from '@/components/pages/HowToWriteUpworkProposal'

export const metadata = {
  title: "How to Write an Upwork Proposal | Ultimate Freelancers",
  description: "Step-by-step guide to writing Upwork proposals. The 5-part QDIPC structure, opening lines, screening questions, and real examples of good vs bad proposals.",
  alternates: { canonical: "https://ultimatefreelancers.com/how-to-write-upwork-proposal" },
  openGraph: {
    title: "How to Write an Upwork Proposal | Ultimate Freelancers",
    description: "Step-by-step guide to writing Upwork proposals. The 5-part QDIPC structure, opening lines, screening questions, and real examples of good vs bad proposals.",
    url: "https://ultimatefreelancers.com/how-to-write-upwork-proposal",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "How to Write an Upwork Proposal | Ultimate Freelancers",
    description: "Step-by-step guide to writing Upwork proposals. The 5-part QDIPC structure, opening lines, screening questions, and real examples of good vs bad proposals.",
  },
}


export default function Page() { return <HowToWriteUpworkProposalPage /> }
