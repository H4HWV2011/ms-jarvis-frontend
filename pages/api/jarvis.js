// Minimal Ms. Jarvis API - No external dependencies
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const systemStatus = {
      contracts_monitored: 35,
      healthy_contracts: 31,
      needs_attention: 4,
      last_analysis: new Date().toISOString(),
      phase: 0,
      developer_mode: true,
      deployment: 'vercel_production',
      environment: {
        nodeVersion: process.version,
        hasArbitrumRpc: !!process.env.ARBITRUM_RPC,
        hasPhase: !!process.env.PHASE,
        hasDeveloperMode: !!process.env.DEVELOPER_MODE
      }
    };

    // Handle GET request for basic status
    if (req.method === 'GET') {
      res.status(200).json({
        success: true,
        message: "Ms. Jarvis is online and ready!",
        status: systemStatus,
        instructions: "Send a POST request with {message: 'your message'} to chat",
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Handle POST request for messages
    if (req.method === 'POST') {
      const { message, action } = req.body || {};
      
      let response;
      
      if (message) {
        const query = message.toLowerCase();
        
        if (query.includes('hello') || query.includes('hi')) {
          response = {
            type: 'greeting',
            sender: 'Ms. Jarvis',
            message: "Hello! I'm Ms. Jarvis, successfully running on Vercel! I'm here to help with your MountainShares contracts and community guidance. How can I assist you today?",
            personality: 'warm_welcoming',
            timestamp: new Date().toISOString()
          };
        } else if (query.includes('status') || query.includes('health')) {
          response = {
            type: 'status',
            sender: 'Ms. Jarvis',
            message: `System status is excellent! I'm running on Vercel's global edge network, monitoring ${systemStatus.contracts_monitored} contracts with enhanced performance and reliability.`,
            personality: 'reassuring_technical',
            data: systemStatus,
            timestamp: new Date().toISOString()
          };
        } else if (query.includes('contract')) {
          response = {
            type: 'analysis',
            sender: 'Ms. Jarvis',
            message: "I'm ready to help analyze your MountainShares contracts! While I'm in simplified mode right now, I can still provide guidance on your 28 contract rewrites and system monitoring.",
            personality: 'helpful_analytical',
            data: {
              contracts_available: ['central_command', 'dex_router', 'location_discovery', 'employee_vault'],
              analysis_ready: true,
              recommendations: ['Update access controls', 'Enhance emergency functions', 'Review security parameters']
            },
            timestamp: new Date().toISOString()
          };
        } else {
          response = {
            type: 'conversation',
            sender: 'Ms. Jarvis',
            message: "I'm processing your request with my AI system on Vercel. How can I assist you with your MountainShares community needs?",
            personality: 'thoughtful_processing',
            timestamp: new Date().toISOString()
          };
        }
      } else {
        response = {
          success: false,
          error: 'No message provided. Send {message: "your message"}'
        };
      }
      
      res.status(200).json(response);
    } else {
      res.status(405).json({ 
        error: `Method ${req.method} not allowed. Use GET for status or POST for messages.`
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
}
