export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const responses = {
    hello: "Hello! I'm Ms. Jarvis, your MountainShares AI assistant! I'm working on getting fully operational. How can I help you today?",
    status: "System status: I'm running on Vercel and ready to help with your MountainShares contracts!",
    contract: "I'm ready to help analyze your contracts! I can provide guidance on your 28 contract rewrites.",
    default: "I'm Ms. Jarvis, and I'm here to help with your MountainShares community needs!"
  };

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: "Ms. Jarvis is online!",
      status: "ready",
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    const { message } = req.body || {};
    const query = (message || '').toLowerCase();
    
    let response = responses.default;
    if (query.includes('hello') || query.includes('hi')) response = responses.hello;
    if (query.includes('status')) response = responses.status;
    if (query.includes('contract')) response = responses.contract;

    return res.status(200).json({
      success: true,
      sender: 'Ms. Jarvis',
      message: response,
      timestamp: new Date().toISOString()
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
