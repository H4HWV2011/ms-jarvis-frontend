/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['web3'], // Updated syntax for Next.js 15
  env: {
    ARBITRUM_RPC: process.env.ARBITRUM_RPC,
    PHASE: process.env.PHASE,
    DEVELOPER_MODE: process.env.DEVELOPER_MODE
  },
  experimental: {
    // Remove deprecated options
  }
}

module.exports = nextConfig
