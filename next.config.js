/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['web3', 'ethers'], // Updated from experimental.serverComponentsExternalPackages
  env: {
    ARBITRUM_RPC: process.env.ARBITRUM_RPC,
    PHASE: process.env.PHASE,
    DEVELOPER_MODE: process.env.DEVELOPER_MODE
  },
  async rewrites() {
    return [
      {
        source: '/api/ws',
        destination: '/api/websocket'
      }
    ]
  }
}

module.exports = nextConfig
