/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  // Optimize for Vercel deployment
  output: 'standalone',
  images: {
    unoptimized: true, // Since you're using static media
  },
};
export default nextConfig;
