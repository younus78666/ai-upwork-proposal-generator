import GeneratePage from '@/components/pages/Generate'

export const metadata = {
  title: "Generate Proposal | Ultimate Freelancers",
  description: "Generate 3 personalized Upwork proposals from any job post in 60 seconds.",
  alternates: { canonical: "https://ultimatefreelancers.com/generate" },
  openGraph: {
    title: "Generate Proposal | Ultimate Freelancers",
    description: "Generate 3 personalized Upwork proposals from any job post in 60 seconds.",
    url: "https://ultimatefreelancers.com/generate/",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Generate Proposal | Ultimate Freelancers",
    description: "Generate 3 personalized Upwork proposals from any job post in 60 seconds.",
  },
}

export default function Page() { return <GeneratePage /> }
