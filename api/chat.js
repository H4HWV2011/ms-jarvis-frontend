export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Sugar, only POST requests are allowed for chatting with Ms. Jarvis.'
    });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request',
        message: 'Honey child, please provide a message to chat with Ms. Jarvis.'
      });
    }

    // Connect to MountainShares AI Gateway on port 3002
    const aiResponse = await getMsJarvisAIResponse(message);

    res.status(200).json({
      success: true,
      response: aiResponse.response,
      confidence: aiResponse.confidence,
      culturalSensitivity: aiResponse.culturalSensitivity,
      timestamp: new Date().toISOString(),
      service: 'Ms. Jarvis AI - Mount Hope & Oakvale, WV',
      model: 'MountainShares AI Gateway + NEOCORTX',
      aiAgents: aiResponse.agentsUsed,
      truthLayer: aiResponse.truthVerified
    });

  } catch (error) {
    console.error('MountainShares AI error:', error);

    // Fallback to basic response if AI system unavailable
    const fallbackResponse = getFallbackResponse(req.body.message);

    res.status(200).json({
      success: true,
      response: fallbackResponse,
      timestamp: new Date().toISOString(),
      service: 'Ms. Jarvis AI - Fallback Mode',
      model: 'Emergency Fallback',
      note: 'AI Gateway temporarily unavailable, using emergency responses'
    });
  }
}

async function getMsJarvisAIResponse(message) {
  try {
    // Connect to YOUR MountainShares AI Gateway on port 3002
    const aiServiceUrl = process.env.MOUNTAINSHARES_AI_SERVICE_URL || 'http://localhost:3002/api/chat';

    const aiRequest = {
      message: message,
      context: {
        location: "Mount Hope & Oakvale, WV",
        ecosystem: "MountainShares",
        culturalContext: "Appalachian Heritage",
        safetyLevel: "community-focused",
        emotionalIntelligence: true,
        elderValidation: true
      },
      agents: {
        emotional: true,
        cultural: true,
        security: true,
        economic: true,
        heritage: true
      }
    };

    const response = await fetch(aiServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MOUNTAINSHARES_AI_KEY || 'dev-key'}`,
        'X-Community': 'Mount-Hope-Oakvale',
        'X-Cultural-Validation': 'required'
      },
      body: JSON.stringify(aiRequest),
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`AI Gateway responded with status: ${response.status}`);
    }

    const aiData = await response.json();

    // Process AI response with community safeguards
    return processAIResponse(aiData, message);

  } catch (error) {
    console.error('MountainShares AI Gateway error:', error);
    throw error;
  }
}

function processAIResponse(aiData, originalMessage) {
  // Apply MountainShares community safeguards
  const processedResponse = {
    response: aiData.response || aiData.text || aiData.message || "Well hello there, honey child!",
    confidence: aiData.confidence || 0.85,
    culturalSensitivity: aiData.culturalSensitivity || 0.9,
    agentsUsed: aiData.agentsUsed || ['emotional', 'cultural'],
    truthVerified: aiData.truthVerified || true
  };

  // Apply Appalachian cultural filtering
  processedResponse.response = applyCulturalFiltering(processedResponse.response);

  // Emergency safety check
  if (containsMedicalEmergency(originalMessage)) {
    processedResponse.response = "🚨 Honey child, for medical emergencies please call 911 immediately! " + processedResponse.response;
    processedResponse.emergencyAlert = true;
  }

  // Add MountainShares ecosystem context
  processedResponse.response = addEcosystemContext(processedResponse.response, originalMessage);

  return processedResponse;
}

function applyCulturalFiltering(response) {
  // Add authentic Appalachian expressions
  const endearments = ['honey child', 'sugar', 'darlin\'', 'sweetie', 'dear'];
  const randomEndearment = endearments[Math.floor(Math.random() * endearments.length)];

  // Ensure response maintains cultural authenticity
  if (!response.includes('honey') && !response.includes('sugar') && !response.includes('darlin')) {
    response = response.replace(/\b(Hi|Hello|Hey)\b/gi, `Well hello there, ${randomEndearment}`);
  }

  return response;
}

function containsMedicalEmergency(message) {
  const emergencyKeywords = [
    'medical emergency', 'ambulance', 'heart attack', 'stroke', 'chest pain',
    'breathing trouble', 'unconscious', 'bleeding', 'poison', 'overdose'
  ];

  const lowerMessage = message.toLowerCase();
  return emergencyKeywords.some(keyword => lowerMessage.includes(keyword));
}

function addEcosystemContext(response, originalMessage) {
  const lowerMessage = originalMessage.toLowerCase();

  // Add relevant MountainShares contract information if relevant
  if (lowerMessage.includes('contract') || lowerMessage.includes('address')) {
    response += " Our MountainShares ecosystem runs on Arbitrum mainnet with verified contracts including our Token at 0xE8A9c6fFE6b2344147D886EcB8608C5F7863B20D and Central Command at 0x7F246dD285E7c53190b5Ae927a3a581393F9a521.";
  }

  if (lowerMessage.includes('price') || lowerMessage.includes('token') || lowerMessage.includes('value')) {
    response += " MountainShares tokens maintain 1:1 USD backing in Phase 1, with appreciation potential as our communities grow stronger together.";
  }

  return response;
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Emergency medical response always takes priority
  if (containsMedicalEmergency(message)) {
    return "🚨 For medical emergencies, call 911 immediately! I'm Ms. Jarvis, your MountainShares AI for Mount Hope and Oakvale. I handle blockchain questions, not medical ones, sugar!";
  }

  // Basic fallback responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Well hello there, honey child! I'm Ms. Jarvis, your MountainShares AI assistant. My NEOCORTX system is temporarily updating, but I'm still here to help you with our blockchain ecosystem serving Mount Hope and Oakvale. What can I do for you, sugar?";
  }

  return "Well darlin', I'm Ms. Jarvis, your MountainShares AI assistant. My Darwin Gödel Machine is currently updating its AI models, but I'm still here to help you learn about our blockchain ecosystem for Mount Hope and Oakvale communities. What would you like to know, honey child?";
}
