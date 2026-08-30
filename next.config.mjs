/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only the testimony page is public for now — send the root there.
  // (Temporary redirect so it's easy to re-open the full site later.)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/testimony',
        permanent: false,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '60mb',
    },
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
    };
    return config;
  },
};

export default nextConfig;
