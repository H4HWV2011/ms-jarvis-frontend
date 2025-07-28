import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function MsJarvisInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ms. Jarvis',
      message: "Hello! I'm Ms. Jarvis, your MountainShares AI assistant running on Vercel! How can I help you today?",
      timestamp: new Date().toISOString(),
      personality: 'motherly_caring'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

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
        personality: jarvisResponse.personality
      };

      setMessages(prev => [...prev, jarvisMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        personality: 'apologetic'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Head>
        <title>Ms. Jarvis - MountainShares AI Assistant</title>
      </Head>

      <div style={{ 
        background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1>Ms. Jarvis</h1>
        <p>Your MountainShares AI Assistant • Powered by Vercel</p>
      </div>

      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ddd', 
        padding: '20px',
        marginBottom: '20px',
        borderRadius: '10px'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            marginBottom: '15px',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: msg.sender === 'Ms. Jarvis' ? '#f0f8ff' : '#e6f3ff',
            textAlign: msg.sender === 'Ms. Jarvis' ? 'left' : 'right'
          }}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: 'center', fontStyle: 'italic' }}>
            Ms. Jarvis is thinking...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me about contracts, system status, or anything else..."
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
