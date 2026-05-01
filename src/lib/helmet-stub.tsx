// Stub: in Next.js, SEO is handled via generateMetadata() per page.
// This no-op component prevents react-helmet-async from breaking SSR.

export function Helmet({ children }: { children?: React.ReactNode }) {
  return null
}

export function HelmetProvider({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}
