// components/TestAIBridge.jsx
import { useState } from 'react';

export default function TestAIBridge() {
  const [selectedAI, setSelectedAI] = useState('local_transformers');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [bridgeStatus, setBridgeStatus] = useState('Ready to test AI bridges');
  const [loading, setLoading] = useState(false);

  const availableAIs = [
    { id: 'local_transformers', name: 'Local Transformers AI', desc: 'PyTorch + Transformers' },
    { id: 'local_pytorch', name: 'Local PyTorch AI', desc: 'Neural Networks' },
    { id: 'production_system', name: 'Production Infrastructure AI', desc: 'MountainShares Systems' }
  ];

  const testBridge = async (bridgeTest = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/individual-ai-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message || (bridgeTest ? 'Bridge connection test' : 'Hello, how are you?'),
          targetAI: selectedAI,
          bridgeTest: bridgeTest
        })
      });
      
      const data = await res.json();
      setResponse(data.response);
      setBridgeStatus(`🔗 Bridge: ${data.bridgeStatus} | 💚 Health: ${data.connectionHealth} | ⚡ Source: ${data.aiSource}`);
    } catch (error) {
      setResponse(`❌ Error: ${error.message}`);
      setBridgeStatus('🚨 Bridge connection failed');
    }
    setLoading(false);
  };

  const quickTests = [
    { text: 'how are you', label: 'Greeting Test' },
    { text: 'How many bits could a two bit two it a two bit could two bits?', label: 'Two Bits Question' },
    { text: 'system status', label: 'System Status' },
    { text: 'Bridge connection test', label: 'Bridge Test' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">🔗 Individual AI Bridge Tester</h1>
          <p className="text-gray-600 mt-1">Phase 1: Testing individual AI connections before network integration</p>
        </div>

        {/* AI Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Select AI System to Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableAIs.map(ai => (
              <div key={ai.id} className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedAI === ai.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`} onClick={() => setSelectedAI(ai.id)}>
                <h3 className="font-semibold">{ai.name}</h3>
                <p className="text-sm text-gray-600">{ai.desc}</p>
                <div className={`mt-2 text-xs px-2 py-1 rounded ${
                  selectedAI === ai.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedAI === ai.id ? 'Selected' : 'Available'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-xl font-semibold mb-4">Message Input</h2>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message to test the AI bridge..."
              className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Quick Test Buttons */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Tests:</h3>
            <div className="flex flex-wrap gap-2">
              {quickTests.map((test, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(test.text)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                >
                  {test.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => testBridge(true)}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              {loading ? '🔄 Testing...' : '🔍 Test Bridge Connection'}
            </button>
            <button
              onClick={() => testBridge(false)}
              disabled={loading || !message.trim()}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 transition-colors"
            >
              {loading ? '🔄 Processing...' : '📤 Send Message'}
            </button>
            <button
              onClick={() => {
                setMessage('');
                setResponse('');
                setBridgeStatus('Ready to test AI bridges');
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🧹 Clear
            </button>
          </div>
        </div>

        {/* Bridge Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">Bridge Status</h2>
          <div className={`p-3 rounded-lg ${
            bridgeStatus.includes('optimal') ? 'bg-green-100 text-green-800' :
            bridgeStatus.includes('failed') ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            <strong>Status:</strong> {bridgeStatus}
          </div>
        </div>

        {/* AI Response */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">AI Response</h2>
          <div className="bg-gray-50 border rounded-lg p-4 min-h-[200px]">
            {response ? (
              <pre className="whitespace-pre-wrap text-sm">{response}</pre>
            ) : (
              <p className="text-gray-500 italic">No response yet. Test an AI bridge connection to see output.</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">🧠 AI Bridge Testing Instructions</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Phase 1:</strong> Test each AI individually to ensure bridge connections work</li>
            <li>• <strong>Bridge Test:</strong> Validates connection health and capabilities</li>
            <li>• <strong>Message Test:</strong> Sends actual queries to test AI processing</li>
            <li>• <strong>Next Phase:</strong> Once all individual bridges work, connect AIs to each other</li>
            <li>• <strong>Final Phase:</strong> Integrate stable AI network with Gödel machine controller</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
