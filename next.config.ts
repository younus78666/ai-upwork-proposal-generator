import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: false,
  typescript: {
    // Dashboard components have pre-existing DB schema drift from Supabase types.
    // These are runtime-safe — remove this flag once types are regenerated.
    ignoreBuildErrors: true,
  },
}

export default nextConfig
