import AboutPage from '@/components/pages/About'

export const metadata = {
  title: "Muhammad Younus, Top Rated Freelancer | Ultimate Freelancers",
  description: "Muhammad Younus, Senior WordPress developer, 7+ years, 400+ Upwork projects, $100K+ earned, Top Rated Plus badge. Creator of the free AI proposal tool.",
  alternates: { canonical: "https://ultimatefreelancers.com/about" },
  openGraph: {
    title: "Muhammad Younus, Top Rated Freelancer | Ultimate Freelancers",
    description: "Muhammad Younus, Senior WordPress developer, 7+ years, 400+ Upwork projects, $100K+ earned, Top Rated Plus badge. Creator of the free AI proposal tool.",
    url: "https://ultimatefreelancers.com/about/",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Muhammad Younus, Top Rated Freelancer | Ultimate Freelancers",
    description: "Muhammad Younus, Senior WordPress developer, 7+ years, 400+ Upwork projects, $100K+ earned, Top Rated Plus badge. Creator of the free AI proposal tool.",
  },
}


export default function Page() { return <AboutPage /> }
