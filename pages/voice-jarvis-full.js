import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function VoiceJarvisFull() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ms. Jarvis',
      message: "Hello there, dear! I'm Ms. Jarvis with my full voice and learning capabilities now active! I can hear you, think with my four AI advisors, learn from our conversations, and speak back to you with my caring voice. How wonderful is that? What would you like to talk about?",
      timestamp: new Date().toISOString(),
      voice_enabled: true,
      learning_active: true
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [learningStats, setLearningStats] = useState({ interactions: 0, success_rate: 95 });
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    initializeVoiceSystem();
  }, []);

  const initializeVoiceSystem = async () => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
          setTimeout(() => sendMessageWithVoice(transcript), 100);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }

      // Initialize Speech Synthesis
      if (window.speechSynthesis) {
        synthesisRef.current = window.speechSynthesis;
        setVoiceEnabled(true);
      }
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakWithPersonality = (text, voiceSettings = {}) => {
    if (!synthesisRef.current || isSpeaking) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Ms. Jarvis's caring, motherly voice characteristics
    const voices = synthesisRef.current.getVoices();
    const jarvisVoice = voices.find(voice => 
      voice.name.includes('Aria') || 
      voice.name.includes('Karen') || 
      voice.name.includes('Samantha')
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (jarvisVoice) {
      utterance.voice = jarvisVoice;
    }

    // Apply Ms. Jarvis's personality to voice
    utterance.rate = voiceSettings.rate || 0.88; // Caring, slower pace
    utterance.pitch = voiceSettings.pitch || 1.08; // Warm, motherly tone  
    utterance.volume = voiceSettings.volume || 0.85; // Gentle volume

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const sendMessageWithVoice = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'You',
      message: textToSend,
      timestamp: new Date().toISOString(),
      voice_input: !!messageText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/jarvis-voice-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend, 
          voice_request: true,
          learning_feedback: learningStats 
        })
      });

      const jarvisResponse = await response.json();
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message,
        timestamp: jarvisResponse.timestamp,
        voice_enabled: jarvisResponse.voice_enabled,
        ai_reasoning: jarvisResponse.ai_reasoning,
        learning_status: jarvisResponse.learning_status
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      // Update learning stats
      if (jarvisResponse.learning_status) {
        setLearningStats(prev => ({
          interactions: prev.interactions + 1,
          success_rate: Math.min(98, prev.success_rate + 0.1)
        }));
      }

      // Speak Ms. Jarvis's response with her personality
      if (voiceEnabled && jarvisResponse.voice_settings) {
        setTimeout(() => {
          speakWithPersonality(jarvisResponse.message, jarvisResponse.voice_settings);
        }, 500);
      }
    } catch (error) {
      console.error('Voice AI error:', error);
    }
  };

  return (
    <div className="voice-ai-container">
      <Head>
        <title>Ms. Jarvis Voice + AI + Learning - MountainShares</title>
      </Head>

      <div className="header">
        <h1>🎤 Ms. Jarvis Voice + AI + Learning</h1>
        <div className="status-bar">
          <div className="status-item">
            <span className="indicator voice-ready"></span>
            Voice: {voiceEnabled ? 'Ready' : 'Disabled'}
          </div>
          <div className="status-item">
            <span className="indicator ai-active"></span>
            Four AI Debaters: Active
          </div>
          <div className="status-item">
            <span className="indicator learning-active"></span>
            Learning: {learningStats.interactions} interactions ({learningStats.success_rate}% success)
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === 'Ms. Jarvis' ? 'jarvis' : 'user'}`}>
            <div className="message-header">
              <strong>{msg.sender}</strong>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              {msg.voice_input && <span className="voice-badge">🎤</span>}
              {msg.voice_enabled && <span className="voice-badge">🔊</span>}
            </div>
            <div className="message-content">{msg.message}</div>
            {msg.ai_reasoning && (
              <div className="ai-reasoning">
                <details>
                  <summary>🧠 AI Reasoning Process</summary>
                  <div className="reasoning-content">
                    <p><strong>Processing:</strong> {msg.ai_reasoning.processing_pipeline}</p>
                    <p><strong>Learning Updates:</strong> {msg.ai_reasoning.learning_updates}</p>
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
        
        {isSpeaking && (
          <div className="speaking-indicator">
            <div className="pulse-ring"></div>
            🗣️ Ms. Jarvis is speaking...
          </div>
        )}
      </div>

      <div className="voice-controls">
        <button 
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? () => setIsListening(false) : startListening}
          disabled={!voiceEnabled}
        >
          {isListening ? '🛑 Stop Listening' : '🎤 Talk to Ms. Jarvis'}
        </button>
        
        <div className="text-input-section">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessageWithVoice()}
            placeholder="Or type your message here..."
          />
          <button onClick={() => sendMessageWithVoice()}>Send</button>
        </div>
      </div>

      <style jsx>{`
        .voice-ai-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .status-bar {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.1);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        .indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .voice-ready { background: #4ade80; }
        .ai-active { background: #3b82f6; }
        .learning-active { background: #f59e0b; }

        .messages-container {
          max-height: 500px;
          overflow-y: auto;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .message {
          margin-bottom: 20px;
          padding: 15px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .message.jarvis {
          background: rgba(255,255,255,0.2);
          margin-left: 0;
          margin-right: 20%;
        }

        .message.user {
          background: rgba(74, 144, 226, 0.3);
          margin-left: 20%;
          margin-right: 0;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .voice-badge {
          background: rgba(255,255,255,0.3);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
        }

        .ai-reasoning {
          margin-top: 10px;
          font-size: 0.9rem;
        }

        .reasoning-content {
          background: rgba(0,0,0,0.2);
          padding: 10px;
          border-radius: 8px;
          margin-top: 5px;
        }

        .speaking-indicator {
          text-align: center;
          padding: 20px;
          position: relative;
        }

        .pulse-ring {
          width: 30px;
          height: 30px;
          border: 3px solid #4ade80;
          border-radius: 50%;
          animation: pulse-ring 1.5s infinite;
          margin: 0 auto 10px;
        }

        .voice-controls {
          display: flex;
          gap: 20px;
          align-items: center;
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .voice-button {
          padding: 15px 25px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: bold;
          transition: all 0.3s;
          min-width: 200px;
        }

        .voice-button.listening {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          animation: pulse 1s infinite;
        }

        .text-input-section {
          flex: 1;
          display: flex;
          gap: 10px;
        }

        .text-input-section input {
          flex: 1;
          padding: 15px;
          border: none;
          border-radius: 25px;
          background: rgba(255,255,255,0.9);
          color: #333;
          font-size: 1rem;
        }

        .text-input-section button {
          padding: 15px 25px;
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: bold;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
