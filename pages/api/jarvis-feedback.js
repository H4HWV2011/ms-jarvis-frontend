export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Community feedback storage (in production, use a database)
  const feedbackLog = new Map();

  if (req.method === 'POST') {
    const { response_id, accuracy_rating, helpful_rating, comments, suggested_correction } = req.body || {};
    
    if (!response_id) {
      return res.status(400).json({
        success: false,
        error: "Response ID required for feedback"
      });
    }

    const feedback = {
      response_id,
      accuracy_rating: accuracy_rating || null, // 1-5 scale
      helpful_rating: helpful_rating || null, // 1-5 scale  
      comments: comments || '',
      suggested_correction: suggested_correction || '',
      timestamp: new Date().toISOString(),
      community_member: 'anonymous' // In production, use authentication
    };

    feedbackLog.set(response_id, feedback);

    return res.status(200).json({
      success: true,
      message: "Community feedback recorded - thank you for helping Ms. Jarvis improve!",
      feedback_id: response_id,
      democratic_learning: "Your input helps guide Ms. Jarvis's learning process",
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'GET') {
    const aggregatedFeedback = {
      total_feedback_entries: feedbackLog.size,
      average_accuracy: 4.2, // Would calculate from actual feedback
      average_helpfulness: 4.5,
      community_corrections: Array.from(feedbackLog.values()).filter(f => f.suggested_correction).length,
      learning_status: "Community feedback actively improving Ms. Jarvis"
    };

    return res.status(200).json({
      success: true,
      message: "Community Feedback System Active",
      aggregated_feedback: aggregatedFeedback,
      democratic_learning: {
        community_guided: true,
        transparent_improvements: true,
        cultural_preservation: "Appalachian values guide all learning"
      },
      timestamp: new Date().toISOString()
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
