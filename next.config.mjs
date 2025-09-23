const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  i18n: {
    locales: ['es', 'pt'],
    defaultLocale: 'es',
    localeDetection: false,
    domains: isDev
      ? [
          { domain: 'es.lawx.local', defaultLocale: 'es', locales: ['es'] },
          { domain: 'pt.lawx.local', defaultLocale: 'pt', locales: ['pt'] },
        ]
      : [
          { domain: 'es.lawx.ai', defaultLocale: 'es', locales: ['es'] },
          { domain: 'pt.lawx.ai', defaultLocale: 'pt', locales: ['pt'] },
        ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
    ];
  },
};

export default nextConfig;

