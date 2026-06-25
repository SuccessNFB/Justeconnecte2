/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Replace '*.supabase.co' with your specific project hostname in production
      // e.g. { protocol: 'https', hostname: 'abcdefghij.supabase.co' }
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },
  // Prevent exposing the framework name in response headers
  poweredByHeader: false,
}
export default nextConfig
