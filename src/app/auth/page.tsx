import AuthPage from '@/components/pages/Auth'

export const metadata = {
  title: "Sign In | Ultimate Freelancers",
  description: "Sign in or create an account to save your proposals, projects, and notes.",
  alternates: { canonical: "https://ultimatefreelancers.com/auth" },
  openGraph: {
    title: "Sign In | Ultimate Freelancers",
    description: "Sign in or create an account to save your proposals, projects, and notes.",
    url: "https://ultimatefreelancers.com/auth/",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sign In | Ultimate Freelancers",
    description: "Sign in or create an account to save your proposals, projects, and notes.",
  },
}

export default function Page() { return <AuthPage /> }
