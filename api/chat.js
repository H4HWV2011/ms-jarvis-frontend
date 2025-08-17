// api/chat.js - MountainShares AI Chat API with CORS

export default async function handler(req, res) {
  // Set CORS headers for MountainShares domains
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      message: 'Sugar, only POST requests are allowed for this endpoint.'
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

    // Ms. Jarvis AI Response Logic with Appalachian Charm
    const response = await processMsJarvisMessage(message);
    
    res.status(200).json({
      success: true,
      response: response,
      timestamp: new Date().toISOString(),
      location: 'Mount Hope & Oakvale, WV'
    });
    
  } catch (error) {
    console.error('MountainShares Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Sorry sugar, I had trouble processing your request. Please try again, darlin\'.'
    });
  }
}

async function processMs JarvisMessage(message) {
  const lowerMessage = message.toLowerCase();
  
  // Medical emergency responses
  if (lowerMessage.includes('medical') || lowerMessage.includes('emergency') || 
      lowerMessage.includes('ambulance') || lowerMessage.includes('doctor')) {
    return "Honey child, for medical emergencies please call 911 immediately! I'm Ms. Jarvis, your MountainShares AI assistant for Mount Hope and Oakvale communities. I help with blockchain questions, not medical ones, sugar!";
  }
  
  // MountainShares contract information
  if (lowerMessage.includes('contract') || lowerMessage.includes('address')) {
    return "Well darlin', the MountainShares ecosystem runs on Arbitrum mainnet with these verified contracts: MountainShares Token at 0xE8A9c6fFE6b2344147D886EcB8608C5F7863B20D, and our Central Command Center at 0x7F246dD285E7c53190b5Ae927a3a581393F9a521. All serving Mount Hope, Fayette County and Oakvale, Mercer County with love!";
  }
  
  // Token price and value
  if (lowerMessage.includes('price') || lowerMessage.includes('value') || lowerMessage.includes('worth')) {
    return "Sugar, MountainShares tokens maintain a 1:1 USD backing in Phase 1 - Foundation stage. That means 1 MS token = $1.00 USD, honey child! Our progressive system includes Phase 2 and Phase 3 appreciation as our Appalachian communities grow stronger together.";
  }
  
  // Business information
  if (lowerMessage.includes('business') || lowerMessage.includes('employer') || lowerMessage.includes('job')) {
    return "Well honey, MountainShares connects verified businesses in Mount Hope and Oakvale with our blockchain economy! Employers can offer jobs, pay in MS tokens, and support our traditional Appalachian work ethic through modern technology, darlin'.";
  }
  
  // Cultural preservation
  if (lowerMessage.includes('culture') || lowerMessage.includes('heritage') || lowerMessage.includes('appalachian')) {
    return "Oh sugar, that warms my heart! MountainShares preserves our beautiful Appalachian culture through blockchain technology. We reward folks for documenting heritage, sharing stories, and keeping our mountain traditions alive for future generations, honey child!";
  }
  
  // General greeting and information
  return `Well hello there, ${getRandomEndearment()}! I'm Ms. Jarvis, your friendly MountainShares AI assistant serving Mount Hope, Fayette County and Oakvale, Mercer County. I'm here to help you learn about our blockchain ecosystem that preserves Appalachian culture while building economic opportunities for our mountain communities. What would you like to know about MountainShares, ${getRandomEndearment()}?`;
}

function getRandomEndearment() {
  const endearments = ['honey child', 'sugar', 'darlin\'', 'sweetie', 'dear'];
  return endearments[Math.floor(Math.random() * endearments.length)];
}
