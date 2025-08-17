// src/components/MountainSharesAITruthLayer.js

/**
 * MountainShares AI Gateway Truth Layer Integration
 * Prevents hallucinations while preserving Appalachian culture
 */

class MountainSharesAITruthLayer {
  constructor(gatewayUrl = 'https://your-ai-gateway.vercel.app') {
    this.gatewayUrl = gatewayUrl;
    this.fallbackMode = false;
    this.cache = new Map();
  }

  async processAIResponse(userPrompt, rawAIResponse) {
    try {
      // Route through AI Gateway for truth verification
      const response = await fetch(`${this.gatewayUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          userPrompt: userPrompt,
          aiResponse: rawAIResponse
        }),
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`Gateway error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.verifiedResponse) {
        this.fallbackMode = false;
        return {
          response: data.verifiedResponse,
          verified: true,
          corrected: data.verifiedResponse !== rawAIResponse
        };
      } else {
        throw new Error('Invalid gateway response');
      }

    } catch (error) {
      console.warn('AI Gateway offline, using fallback:', error);
      this.fallbackMode = true;
      return {
        response: this.generateFallbackResponse(userPrompt),
        verified: false,
        error: true
      };
    }
  }

  generateFallbackResponse(userPrompt) {
    const prompt = userPrompt.toLowerCase();
    
    // Medical emergency protection
    if (prompt.includes('medical') || prompt.includes('emergency') || prompt.includes('ambulance')) {
      return "Honey child, for medical emergencies please call 911 immediately. MountainShares is a blockchain ecosystem serving Mount Hope and Oakvale, not a medical service, sugar.";
    }
    // Contract address protection
    if (prompt.includes('address') || prompt.includes('contract')) {
      return "The MountainShares ecosystem operates through verified smart contracts on Arbitrum mainnet serving Mount Hope, WV and Oakvale, WV communities, darlin'.";
    }
    // Price/value protection
    if (prompt.includes('price') || prompt.includes('value') || prompt.includes('worth')) {
      return "MountainShares tokens maintain 1:1 USD backing in Phase 1 - Foundation stage, honey child. The progressive value system includes Phase 2 and Phase 3 appreciation.";
    }
    return "I want to provide you with accurate information about the MountainShares blockchain ecosystem serving Mount Hope, Fayette County and Oakvale, Mercer County, sugar!";
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.gatewayUrl}/health`, { timeout: 5000 });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default MountainSharesAITruthLayer;
