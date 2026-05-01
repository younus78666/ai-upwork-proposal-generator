import SchemaAuditPage from '@/components/pages/SchemaAudit'

export const metadata = {
  title: "Schema Audit Tool | Ultimate Freelancers",
  description: "Free schema markup audit tool. Check structured data, fix errors, and validate JSON-LD across your entire site.",
  alternates: { canonical: "https://ultimatefreelancers.com/schema-audit" },
  openGraph: {
    title: "Schema Audit Tool | Ultimate Freelancers",
    description: "Free schema markup audit tool. Check structured data, fix errors, and validate JSON-LD across your entire site.",
    url: "https://ultimatefreelancers.com/schema-audit/",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Schema Audit Tool | Ultimate Freelancers",
    description: "Free schema markup audit tool. Check structured data, fix errors, and validate JSON-LD across your entire site.",
  },
}


export default function Page() { return <SchemaAuditPage /> }
