import PrivacyPage from '@/components/pages/Privacy'

export const metadata = {
  title: "Privacy Policy | Ultimate Freelancers",
  description: "Privacy Policy for Ultimate Freelancers: how we collect, store, and protect your data, API keys, and project information. Your API key is never stored.",
  alternates: { canonical: "https://ultimatefreelancers.com/privacy" },
  openGraph: {
    title: "Privacy Policy | Ultimate Freelancers",
    description: "Privacy Policy for Ultimate Freelancers: how we collect, store, and protect your data, API keys, and project information. Your API key is never stored.",
    url: "https://ultimatefreelancers.com/privacy/",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Privacy Policy | Ultimate Freelancers",
    description: "Privacy Policy for Ultimate Freelancers: how we collect, store, and protect your data, API keys, and project information. Your API key is never stored.",
  },
}


export default function Page() { return <PrivacyPage /> }
