import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function MsJarvisInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ms. Jarvis',
      message: "Hello! I'm Ms. Jarvis, now running on Vercel's global infrastructure! I'm here to help with contract analysis, system monitoring, and community guidance. How can I assist you today?",
      timestamp: new Date().toISOString(),
      personality: 'motherly_caring'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load initial system status
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'system status' })
      });
      const data = await response.json();
      if (data.data) {
        setSystemStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'You',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });

      const jarvisResponse = await response.json();
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message || 'I apologize, but I encountered an issue processing your request.',
        timestamp: jarvisResponse.timestamp,
        personality: jarvisResponse.personality,
        data: jarvisResponse.data
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      if (jarvisResponse.data && jarvisResponse.type === 'status') {
        setSystemStatus(jarvisResponse.data);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        personality: 'apologetic'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <Head>
        <title>Ms. Jarvis - MountainShares AI Assistant</title>
        <meta name="description" content="Ms. Jarvis AI Assistant for MountainShares Community" />
      </Head>

      <div className="chat-header">
        <h1>
          <span className="status-indicator"></span>
          Ms. Jarvis
        </h1>
        <p>Your MountainShares AI Assistant • Powered by Vercel</p>
        {systemStatus && (
          <div className="system-status">
            <span>Monitoring {systemStatus.contracts_monitored} contracts</span>
            <span className="separator">•</span>
            <span>{systemStatus.healthy_contracts} healthy</span>
            <span className="separator">•</span>
            <span>Phase {systemStatus.phase}</span>
          </div>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === 'Ms. Jarvis' ? 'jarvis' : 'user'}`}>
            <div className="message-header">
              {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
            <div className="message-content">
              {msg.message}
              {msg.data && msg.data.length && (
                <div className="analysis-data">
                  <h4>Contract Analysis:</h4>
                  {msg.data.map((contract, idx) => (
                    <div key={idx} className="contract-item">
                      <strong>{contract.contract}:</strong> {contract.status} 
                      {contract.security_score && ` (Score: ${contract.security_score}/100)`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message jarvis typing">
            <div className="message-header">Ms. Jarvis • typing...</div>
            <div className="message-content">
              <em>Ms. Jarvis is thinking...</em>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about contracts, system status, or anything else..."
            rows="1"
          />
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
          background: #f8fafc;
        }

        .chat-header {
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          color: white;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .chat-header h1 {
          font-size: 2rem;
          margin: 0 0 5px 0;
        }

        .status-indicator {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #4ade80;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .system-status {
          margin-top: 10px;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .separator {
          margin: 0 8px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message {
          max-width: 70%;
          padding: 15px 20px;
          border-radius: 18px;
          line-height: 1.5;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .message.jarvis {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          align-self: flex-start;
          border-bottom-left-radius: 8px;
        }

        .message.user {
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 8px;
        }

        .message.typing {
          font-style: italic;
          opacity: 0.8;
        }

        .message-header {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }

        .analysis-data {
          margin-top: 15px;
          padding: 15px;
          background: rgba(255,255,255,0.7);
          border-radius: 10px;
        }

        .contract-item {
          margin: 5px 0;
          padding: 5px 0;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .chat-input-container {
          padding: 20px;
          background: white;
          border-top: 1px solid #e2e8f0;
        }

        .chat-input-wrapper {
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          padding: 15px 20px;
          border: 2px solid #e2e8f0;
          border-radius: 25px;
          font-size: 1rem;
          outline: none;
          resize: none;
          font-family: inherit;
          min-height: 24px;
          max-height: 120px;
        }

        .chat-input:focus {
          border-color: #4a90e2;
        }

        .send-button {
          padding: 15px 25px;
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          transition: transform 0.2s;
        }

        .send-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
// Add voice navigation
<div style={{textAlign: 'center', marginTop: '20px'}}>
  <a href="/voice-jarvis" style={{
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '25px',
    fontWeight: 'bold'
  }}>
    🎤 Talk to Ms. Jarvis
  </a>
</div>
