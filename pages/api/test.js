module.exports = async function handler(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: "Test API working!",
      method: req.method,
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        hasArbitrumRpc: !!process.env.ARBITRUM_RPC,
        hasPhase: !!process.env.PHASE,
        hasDeveloperMode: !!process.env.DEVELOPER_MODE
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
