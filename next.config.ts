import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/waitlist': ['./content/waitlist/**/*'],
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/array/:path*',
        destination: 'https://eu-assets.i.posthog.com/array/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ]
  },
  // Anciennes adresses de l'espace membres (/atelier) : redirigées vers /section, pour que les liens déjà donnés marchent toujours.
  async redirects() {
    return [
      { source: '/atelier', destination: '/section/', permanent: true },
      { source: '/atelier/:path*', destination: '/section/:path*', permanent: true },
      { source: '/atelier-acces', destination: '/section/', permanent: true },
      { source: '/section-acces', destination: '/section/', permanent: false },
      // Le lead magnet « 233 prompts IA » est retiré : les anciens liens mènent à la communauté Claude to Client.
      { source: '/prompts-ia', destination: '/#communaute', permanent: false },
    ]
  },
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
