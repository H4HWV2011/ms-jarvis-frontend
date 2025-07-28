const { Web3 } = require('web3');

class MsJarvisVercel {
  constructor() {
    this.systemStatus = {
      contracts_monitored: 35,
      healthy_contracts: 31,
      needs_attention: 4,
      last_analysis: new Date().toISOString(),
      phase: 0,
      developer_mode: true,
      deployment: 'vercel_production'
    };
  }

  async processMessage(message) {
    const query = message.toLowerCase();
    
    if (query.includes('hello') || query.includes('hi')) {
      return {
        type: 'greeting',
        sender: 'Ms. Jarvis',
        message: "Hello! I'm Ms. Jarvis, successfully running on Vercel! How can I help you today?",
        personality: 'warm_welcoming',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      type: 'conversation',
      sender: 'Ms. Jarvis',
      message: "I'm processing your request on Vercel. How can I assist you?",
      personality: 'thoughtful_processing',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request for basic status
  if (req.method === 'GET') {
    const jarvis = new MsJarvisVercel();
    res.status(200).json({
      success: true,
      message: "Ms. Jarvis is online and ready!",
      status: jarvis.systemStatus,
      instructions: "Send a POST request with {message: 'your message'} to chat",
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Handle POST request for messages
  if (req.method === 'POST') {
    try {
      const jarvis = new MsJarvisVercel();
      const { message, action } = req.body;
      
      let response;
      if (message) {
        response = await jarvis.processMessage(message);
      } else {
        response = {
          success: false,
          error: 'No message provided. Send {message: "your message"}'
        };
      }
      
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.status(405).json({ 
      error: `Method ${req.method} not allowed. Use GET for status or POST for messages.`
    });
  }
}
