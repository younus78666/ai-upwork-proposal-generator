import BlogPage from '@/components/pages/Blog'

export const metadata = {
  title: "Upwork & Freelancing Blog | Ultimate Freelancers",
  description: "Practical guides on writing Upwork proposals, winning clients, pricing your services, and building a sustainable freelance business.",
  alternates: { canonical: "https://ultimatefreelancers.com/blog" },
  openGraph: {
    title: "Upwork & Freelancing Blog | Ultimate Freelancers",
    description: "Practical guides on writing Upwork proposals, winning clients, pricing your services, and building a sustainable freelance business.",
    url: "https://ultimatefreelancers.com/blog",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Upwork & Freelancing Blog | Ultimate Freelancers",
    description: "Practical guides on writing Upwork proposals, winning clients, pricing your services, and building a sustainable freelance business.",
  },
}

export default function Page() { return <BlogPage /> }
