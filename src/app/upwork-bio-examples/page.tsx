import UpworkBioExamplesPage from '@/components/pages/UpworkBioExamples'

export const metadata = {
  title: "Upwork Bio Examples | Ultimate Freelancers",
  description: "10 Upwork profile bio examples by niche. Web dev, design, VA, SEO, content writing, and more. See what works and why clients click your profile.",
  alternates: { canonical: "https://ultimatefreelancers.com/upwork-bio-examples" },
  openGraph: {
    title: "Upwork Bio Examples | Ultimate Freelancers",
    description: "10 Upwork profile bio examples by niche. Web dev, design, VA, SEO, content writing, and more. See what works and why clients click your profile.",
    url: "https://ultimatefreelancers.com/upwork-bio-examples",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Upwork Bio Examples | Ultimate Freelancers",
    description: "10 Upwork profile bio examples by niche. Web dev, design, VA, SEO, content writing, and more. See what works and why clients click your profile.",
  },
}


export default function Page() { return <UpworkBioExamplesPage /> }
