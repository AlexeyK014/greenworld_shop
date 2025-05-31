/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com' }],
    remotePatterns: [{ protocol: 'http', hostname: 'localhost' }],
  },
};

export default nextConfig;
