import React, { useState, useEffect } from 'react';
import MountainSharesAITruthLayer from './MountainSharesAITruthLayer.js';

const TruthVerifiedChat = ({ 
  apiUrl = 'https://cb7e75ba9152.ngrok-free.app/api/chat/public',
  gatewayUrl = process.env.REACT_APP_AI_GATEWAY_URL || 'http://localhost:3001'
}) => {
  const [messages, setMessages] = useState([{
    id: 1,
    type: 'ai',
    content: `Well howdy there, honey child! I'm Ms. Jarvis, and I'm here to help you learn about our MountainShares blockchain ecosystem serving Mount Hope, Fayette County and Oakvale, Mercer County. Every response is protected by our Truth Layer to keep you safe from AI misinformation, sugar!`,
    verified: true,
    corrected: false,
    timestamp: new Date()
  }]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState('checking');
  
  // Initialize AI Gateway
  const [aiGateway] = useState(() => new MountainSharesAITruthLayer(gatewayUrl));

  // Check gateway health
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await aiGateway.checkHealth();
        setGatewayStatus(isHealthy ? 'online' : 'offline');
      } catch {
        setGatewayStatus('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [aiGateway]);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add user message
    const userMsgObj = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsgObj]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get AI response from your existing API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      let rawAIResponse = data.response || data.message || 'No response received';

      // CRITICAL: Route through AI Gateway for truth verification
      const verifiedResult = await aiGateway.processAIResponse(userMessage, rawAIResponse);

      // Add verified AI response
      const aiMsgObj = {
        id: Date.now() + 1,
        type: 'ai',
        content: verifiedResult.response,
        verified: verifiedResult.verified,
        corrected: verifiedResult.corrected,
        error: verifiedResult.error,
        originalContent: rawAIResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsgObj]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response
      const fallbackMsgObj = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry sugar, I had trouble connecting to our system. Please try again, and for any medical emergencies, call 911 immediately.',
        verified: false,
        error: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMsgObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const renderVerificationBadge = (msg) => {
    if (msg.type !== 'ai') return null;

    if (msg.verified && msg.corrected) {
      return <div className="verification-badge corrected-badge">🛡️ Hallucination corrected by Truth Layer</div>;
    } else if (msg.verified && !msg.corrected) {
      return <div className="verification-badge verified-badge">✅ Truth verified</div>;
    } else if (msg.error) {
      return <div className="verification-badge error-badge">⚠️ Fallback response - Gateway offline</div>;
    }
    return null;
  };

  return (
    <div className="mountainshares-chat">
      {/* Truth Layer Status Header */}
      <div className="chat-header">
        <h1>🏔️ MountainShares AI Chat</h1>
        <div className={`truth-layer-status ${gatewayStatus === 'offline' ? 'truth-layer-offline' : ''}`}>
          🛡️ Truth Layer: {gatewayStatus === 'online' ? '✅ Protecting Mount Hope & Oakvale' : 
                          gatewayStatus === 'offline' ? '⚠️ Offline - Using Safety Mode' : 
                          '🔄 Checking...'}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages" style={{ height: '400px', overflowY: 'auto', padding: '20px' }}>
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}>
            <div style={{ marginBottom: '8px' }}>
              {msg.content.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            {renderVerificationBadge(msg)}
          </div>
        ))}

        {isLoading && (
          <div className="ai-message">
            <div>🛡️ Verifying response for accuracy and safety...</div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '20px', gap: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Ms. Jarvis about MountainShares... (try 'Is MountainShares a medical service?')"
          disabled={isLoading}
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            border: '1px solid #ddd', 
            borderRadius: '25px',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputValue.trim()}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #2d5a2d, #4a7c4a)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !inputValue.trim() ? 0.6 : 1
          }}
        >
          {isLoading ? 'Verifying...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default TruthVerifiedChat;
