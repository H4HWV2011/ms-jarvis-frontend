/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Proxy API calls to your AI backend (now publicly accessible)
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: 'https://dd8905861b8e.ngrok-free.app/api/ai/:path*'  // Your ngrok URL
      }
    ];
  },
  // Enable CORS for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
