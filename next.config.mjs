/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore type errors during build
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    'puppeteer-extra', 
    'puppeteer-extra-plugin-stealth', 
    'mongoose',
    'ssh2',
    'archiver'
  ],
  async rewrites() {
    return {
      beforeFiles: [
        // Handle subdomain routing for homepage
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: '(?<city>[^.]+)\\.(platinumlist\\.net|plateniemlist\\.net)',
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
              value: '(?<city>[^.]+)\\.(platinumlist\\.net|plateniemlist\\.net)',
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
