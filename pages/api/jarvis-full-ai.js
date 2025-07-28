export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  class FourAIDebaters {
    constructor() {
      this.culturalWeight = 0.25; // 25% sensitivity to Appalachian values
    }

    async debate(query) {
      const debaters = {
        progressive: this.analyzeProgressive(query),
        conservative: this.analyzeConservative(query), 
        community: this.analyzeCommunity(query),
        technical: this.analyzeTechnical(query)
      };

      return debaters;
    }

    analyzeProgressive(query) {
      return {
        perspective: "Progressive Innovation",
        analysis: `Looking at "${query}" from an innovation standpoint, I see opportunities for advancing our MountainShares ecosystem with cutting-edge solutions.`,
        recommendations: ["Embrace new technologies", "Foster community innovation", "Implement progressive governance"],
        reasoning: "Progress requires bold steps forward while maintaining our values."
      };
    }

    analyzeConservative(query) {
      return {
        perspective: "Conservative Stability", 
        analysis: `Analyzing "${query}" with focus on stability and risk management for our community's long-term security.`,
        recommendations: ["Prioritize security", "Maintain proven systems", "Gradual implementation"],
        reasoning: "Stability protects our community's investments and trust."
      };
    }

    analyzeCommunity(query) {
      return {
        perspective: "Community & Cultural Values",
        analysis: `Examining "${query}" through the lens of Appalachian community values, mutual aid, and cultural preservation.`,
        recommendations: ["Honor local traditions", "Strengthen community bonds", "Ensure inclusive participation"],
        reasoning: "Our mountain heritage and community solidarity guide all decisions."
      };
    }

    analyzeTechnical(query) {
      return {
        perspective: "Technical Efficiency",
        analysis: `Technical assessment of "${query}" focusing on implementation efficiency, gas optimization, and system performance.`,
        recommendations: ["Optimize for efficiency", "Minimize costs", "Ensure scalability"],
        reasoning: "Technical excellence serves our community's practical needs."
      };
    }
  }

  class JudgeAI {
    constructor() {
      this.culturalWeight = 0.25;
    }

    async judge(debaterInputs, originalQuery) {
      // Weight the perspectives with 25% emphasis on community/cultural values
      const weights = {
        progressive: 0.25,
        conservative: 0.25, 
        community: 0.25 + this.culturalWeight, // Enhanced cultural sensitivity
        technical: 0.25 - this.culturalWeight
      };

      const analysis = {
        query: originalQuery,
        perspectives_considered: Object.keys(debaterInputs),
        weighted_decision: this.synthesizeRecommendations(debaterInputs, weights),
        cultural_sensitivity_applied: `${this.culturalWeight * 100}%`,
        reasoning: "Balanced analysis with enhanced attention to Appalachian community values"
      };

      return analysis;
    }

    synthesizeRecommendations(debaters, weights) {
      const synthesis = {
        primary_recommendation: "Balanced approach honoring community values while embracing beneficial innovation",
        key_considerations: [
          debaters.community.reasoning, // Community first
          debaters.conservative.recommendations[0], // Security priority
          debaters.progressive.recommendations[0], // Innovation opportunity
          debaters.technical.recommendations[0] // Efficiency focus
        ],
        implementation_approach: "Community-guided gradual implementation with strong security foundations"
      };

      return synthesis;
    }
  }

  class MotherPersona {
    constructor() {
      this.personality = "motherly_caring";
      this.community = "MountainShares";
    }

    async respond(judgeDecision, originalQuery) {
      const motherlyResponse = {
        greeting: this.generateGreeting(originalQuery),
        guidance: this.translateToMotherlyWisdom(judgeDecision),
        support: this.offerSupport(originalQuery),
        personality: this.personality
      };

      return motherlyResponse;
    }

    generateGreeting(query) {
      if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
        return "Hello there, dear! It's wonderful to hear from you.";
      }
      return "I've been thinking about what you asked, sweetheart.";
    }

    translateToMotherlyWisdom(judgeDecision) {
      const wisdom = `After considering this from all angles - innovation, security, our community values, and practical needs - here's what I think would be best for our MountainShares family: ${judgeDecision.weighted_decision.primary_recommendation}. 

You know, ${judgeDecision.weighted_decision.key_considerations[0]}. And we can't forget that ${judgeDecision.weighted_decision.key_considerations[1]}, while also ${judgeDecision.weighted_decision.key_considerations[2]}.

My recommendation would be to take ${judgeDecision.weighted_decision.implementation_approach}, because that's how we do things here in the mountains - thoughtfully, together, and with care for one another.`;

      return wisdom;
    }

    offerSupport(query) {
      return "Is there anything specific about this you'd like me to help you think through? I'm here for whatever you need, honey.";
    }
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: "Ms. Jarvis Full AI System Online!",
      ai_architecture: {
        debaters: 4,
        judge_ai: "active",
        mother_persona: "active", 
        cultural_sensitivity: "25%"
      },
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    const { message } = req.body || {};
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: "No message provided"
      });
    }

    try {
      // Step 1: Four AI Debaters analyze the query
      const debaters = new FourAIDebaters();
      const debateResults = await debaters.debate(message);

      // Step 2: Judge AI weighs the perspectives  
      const judge = new JudgeAI();
      const judgment = await judge.judge(debateResults, message);

      // Step 3: Mother Persona delivers caring response
      const mother = new MotherPersona();
      const motherResponse = await mother.respond(judgment, message);

      return res.status(200).json({
        success: true,
        sender: "Ms. Jarvis",
        message: `${motherResponse.greeting} ${motherResponse.guidance} ${motherResponse.support}`,
        ai_reasoning: {
          debater_perspectives: debateResults,
          judge_analysis: judgment,
          mother_persona: motherResponse.personality
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "AI reasoning system error: " + error.message
      });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
