/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '60mb',
    },
    // The streaming route reads from the private media directory at runtime.
    outputFileTracingIncludes: {
      '/api/portal/stream/[lessonId]': ['./media/**/*'],
      '/api/**/*': ['./media/**/*'],
    },
  },
  async headers() {
    return [
      {
        source: '/portal/:path*',
        headers: [
          { key: 'Referrer-Policy', value: 'same-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;
