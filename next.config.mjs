/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // Handle subdomain routing for homepage
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: '(?<city>[^.]+)\\.platinumlist\\.net',
            },
          ],
          destination: '/:city',
        },
        // Handle subdomain routing for other paths, excluding global routes
        {
          source: '/((?!login|checkout|api|_next|favicon.ico).*)',
          has: [
            {
              type: 'host',
              value: '(?<city>[^.]+)\\.platinumlist\\.net',
            },
          ],
          destination: '/:city/$1',
        },
      ],
    };
  },
  
  // Optional: Add custom headers for better subdomain handling
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-City-Subdomain',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
