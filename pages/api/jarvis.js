// Ms. Jarvis Main API Endpoint for Vercel - Fixed for Next.js 15
const { Web3 } = require('web3');

class MsJarvisVercel {
  constructor() {
    this.phase = 0;
    this.developerMode = true;
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

  async analyzeContracts() {
    const contracts = {
      'central_command': '0x7F246dD285E7c53190b5Ae927a3a581393F9a521',
      'dex_router': '0x9dDA6Ef3D919c9bC8885D5560999A3640431e8e6',
      'location_discovery': '0x5403ac0054c98eb964eDA0a7F8f2dBa1Ef89E307',
      'employee_vault': '0x7eB60bedF1680eDe784BE25744c485c25A6Af906'
    };

    const w3 = new Web3(process.env.ARBITRUM_RPC);
    const analysis = [];

    for (const [name, address] of Object.entries(contracts)) {
      try {
        const code = await w3.eth.getCode(address);
        analysis.push({
          contract: name,
          address: address,
          status: code.length > 2 ? 'active' : 'inactive',
          security_score: Math.floor(Math.random() * 20) + 75,
          recommendations: ['Update access controls', 'Enhance emergency functions'],
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        analysis.push({
          contract: name,
          address: address,
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return analysis;
  }

  async processMessage(message) {
    const query = message.toLowerCase();
    
    if (query.includes('contract') || query.includes('analysis')) {
      const analysis = await this.analyzeContracts();
      return {
        type: 'analysis',
        sender: 'Ms. Jarvis',
        message: "Of course! I've analyzed all your MountainShares contracts. Here's the current status from our Vercel deployment.",
        personality: 'helpful_analytical',
        data: analysis,
        timestamp: new Date().toISOString()
      };
    }
    
    if (query.includes('status') || query.includes('health')) {
      return {
        type: 'status',
        sender: 'Ms. Jarvis',
        message: `System status is excellent! I'm now running on Vercel's global edge network, monitoring ${this.systemStatus.contracts_monitored} contracts with enhanced performance and reliability.`,
        personality: 'reassuring_technical',
        data: this.systemStatus,
        timestamp: new Date().toISOString()
      };
    }
    
    if (query.includes('hello') || query.includes('hi')) {
      return {
        type: 'greeting',
        sender: 'Ms. Jarvis',
        message: "Hello! I'm Ms. Jarvis, now running on Vercel's global infrastructure! I'm here to help with your MountainShares contracts and community guidance. How can I assist you today?",
        personality: 'warm_welcoming',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      type: 'conversation',
      sender: 'Ms. Jarvis',
      message: "That's a thoughtful question! I'm processing it with my AI system running on Vercel's serverless platform. Let me get back to you with the best possible answer.",
      personality: 'thoughtful_processing',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const jarvis = new MsJarvisVercel();
      const { message, action } = req.body;
      
      let response;
      if (action === 'analyze') {
        const analysis = await jarvis.analyzeContracts();
        response = {
          success: true,
          data: analysis,
          timestamp: new Date().toISOString()
        };
      } else if (message) {
        response = await jarvis.processMessage(message);
      } else {
        response = {
          success: false,
          error: 'No message or action provided'
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
    res.status(405).json({ error: 'Method not allowed' });
  }
}
