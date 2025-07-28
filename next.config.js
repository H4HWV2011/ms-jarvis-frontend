/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['web3', 'ethers']
  },
  env: {
    ARBITRUM_RPC: 'https://arb1.arbitrum.io/rpc',
    PHASE: '0',
    DEVELOPER_MODE: 'true'
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
