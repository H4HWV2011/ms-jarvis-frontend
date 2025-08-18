/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_AI_API_URL: 'http://172.25.234.163:8081',
    NEXT_PUBLIC_AI_DOMAIN: 'ai.mountainshares.us'
  },
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: 'http://172.25.234.163:8081/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig
