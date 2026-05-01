import IndexPage from '@/components/pages/Index'

export const metadata = {
  title: "Free Upwork Proposal Generator | Ultimate Freelancers",
  description: "Generate 3 personalized Upwork proposals from any job post in 60 seconds. Answers screening questions. Free with your own API key. No account required.",
  alternates: { canonical: "https://ultimatefreelancers.com/" },
  openGraph: {
    title: "Free Upwork Proposal Generator | Ultimate Freelancers",
    description: "Generate 3 personalized Upwork proposals from any job post in 60 seconds. Answers screening questions. Free with your own API key. No account required.",
    url: "https://ultimatefreelancers.com/",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free Upwork Proposal Generator | Ultimate Freelancers",
    description: "Generate 3 personalized Upwork proposals from any job post in 60 seconds. Answers screening questions. Free with your own API key. No account required.",
  },
}

export default function Page() { return <IndexPage /> }
