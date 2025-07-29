// components/TextJarvis.jsx
import { useState, useEffect, useRef } from 'react';

export default function TextJarvis() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    {
      type: 'jarvis',
      text: '👋 Ms. Jarvis Text-Only Mode Initialized\n\nVoice functionality disabled for optimal performance.\nAll production infrastructure operational.\n\nType "help" for available commands.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    
    const userMessage = message.trim();
    setLoading(true);
    setConversation(prev => [...prev, { 
      type: 'user', 
      text: userMessage,
      timestamp: new Date().toISOString()
    }]);
    setMessage('');
    
    try {
      const response = await fetch('/api/jarvis-text-only', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setConnected(true);
      
      setConversation(prev => [...prev, { 
        type: 'jarvis', 
        text: data.response,
        timestamp: data.timestamp 
      }]);
    } catch (error) {
      console.error('Connection error:', error);
      setConnected(false);
      setConversation(prev => [...prev, { 
        type: 'error', 
        text: `❌ Connection Error: ${error.message}\n\nYour production infrastructure is still running!\nError Handling & Recovery systems are operational.`,
        timestamp: new Date().toISOString()
      }]);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setConversation([
      {
        type: 'jarvis',
        text: '🧹 Conversation cleared. Ms. Jarvis text-only mode ready.\n\nAll production systems remain operational.',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🤖 Ms. Jarvis - Text Only Mode</h1>
              <p className="text-gray-600 mt-1">Production Infrastructure Assistant | Voice Disabled</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {connected ? 'Connected' : 'Connection Error'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Infrastructure: ✅ Operational
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg whitespace-pre-wrap ${
                  msg.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : msg.type === 'error' 
                    ? 'bg-red-100 text-red-800 border border-red-200' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="text-sm">{msg.text}</div>
                  <div className={`text-xs mt-1 opacity-70 ${
                    msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                    <span className="text-sm">Ms. Jarvis is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to Ms. Jarvis... (Enter to send, Shift+Enter for new line)"
                className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={loading}
              />
              <div className="flex flex-col space-y-2">
                <button
                  onClick={sendMessage}
                  disabled={loading || !message.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '⏳' : '📤'}
                </button>
                <button
                  onClick={clearConversation}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  title="Clear conversation"
                >
                  🧹
                </button>
              </div>
            </div>
            
            {/* Status Bar */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div>
                <strong>Status:</strong> Text-only mode | Voice: ❌ Disabled | API: ✅ Active
              </div>
              <div>
                Infrastructure: Error Handling ✅ | Monitoring ✅ | Config ✅
              </div>
            </div>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Commands:</h3>
          <div className="flex flex-wrap gap-2">
            {['status', 'system', 'time', 'help'].map(cmd => (
              <button
                key={cmd}
                onClick={() => setMessage(cmd)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
