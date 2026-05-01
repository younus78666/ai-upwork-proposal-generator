import UpworkScreeningQuestionsPage from '@/components/pages/UpworkScreeningQuestions'

export const metadata = {
  title: "Upwork Screening Questions | Ultimate Freelancers",
  description: "How to answer Upwork client screening questions with examples. 10 real questions with model answers, strategy tips, and common mistakes to avoid.",
  alternates: { canonical: "https://ultimatefreelancers.com/upwork-screening-questions" },
  openGraph: {
    title: "Upwork Screening Questions | Ultimate Freelancers",
    description: "How to answer Upwork client screening questions with examples. 10 real questions with model answers, strategy tips, and common mistakes to avoid.",
    url: "https://ultimatefreelancers.com/upwork-screening-questions",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Upwork Screening Questions | Ultimate Freelancers",
    description: "How to answer Upwork client screening questions with examples. 10 real questions with model answers, strategy tips, and common mistakes to avoid.",
  },
}


export default function Page() { return <UpworkScreeningQuestionsPage /> }
