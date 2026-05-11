/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Запрещает браузеру угадывать тип контента
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Защита от Clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Запрещает обращение с других доменов
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // HSTS - Force HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Content Security Policy - защита от XSS
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js требует для своих скриптов
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-no-referrer',
          },
          // Permissions Policy (старые браузеры)
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
