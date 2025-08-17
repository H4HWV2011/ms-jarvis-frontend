// api/health.js - Health check for MountainShares API

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    status: 'healthy',
    service: 'MountainShares Ms. Jarvis API',
    location: 'Mount Hope & Oakvale, WV',
    timestamp: new Date().toISOString(),
    message: 'Howdy! Ms. Jarvis is ready to help Mount Hope and Oakvale communities, honey child!'
  });
}

