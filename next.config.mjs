/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com' }],
    remotePatterns: [{ protocol: 'http', hostname: 'localhost' }],
    remotePatterns: [{ protocol: 'https', hostname: 'greenworld-shop.vercel.app' }],
  },
};

export default nextConfig;
