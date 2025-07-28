import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function VoiceJarvisRAG() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ms. Jarvis',
      message: "Hello dear! I'm Ms. Jarvis with enhanced verification capabilities. I can now check my facts against verified sources and tell you exactly how confident I am in my responses. I'll be honest when I'm uncertain rather than guessing. What would you like to discuss?",
      timestamp: new Date().toISOString(),
      confidence_level: 0.95,
      verification_status: "SYSTEM_VERIFIED"
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    initializeVoiceSystem();
  }, []);

  const initializeVoiceSystem = async () => {
    if (typeof window !== 'undefined') {
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
          setTimeout(() => sendMessageWithRAG(transcript), 100);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }

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

  const speakWithConfidence = (text, confidenceLevel, voiceSettings = {}) => {
    if (!synthesisRef.current || isSpeaking) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synthesisRef.current.getVoices();
    const jarvisVoice = voices.find(voice => 
      voice.name.includes('Aria') || 
      voice.name.includes('Karen') || 
      voice.name.includes('Samantha')
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (jarvisVoice) {
      utterance.voice = jarvisVoice;
    }

    // Adjust voice characteristics based on confidence
    if (confidenceLevel > 0.8) {
      utterance.rate = 0.88; // Normal confident pace
      utterance.pitch = 1.08; // Warm, assured tone
      utterance.volume = 0.85; // Normal volume
    } else if (confidenceLevel > 0.6) {
      utterance.rate = 0.82; // Slightly slower, more careful
      utterance.pitch = 1.05; // Slightly more cautious tone
      utterance.volume = 0.8; // Slightly quieter
    } else {
      utterance.rate = 0.78; // Slower, more thoughtful
      utterance.pitch = 1.02; // More uncertain tone
      utterance.volume = 0.75; // Quieter, more humble
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const sendMessageWithRAG = async (messageText = null) => {
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
      const response = await fetch('/api/jarvis-rag-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const jarvisResponse = await response.json();
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message,
        timestamp: jarvisResponse.timestamp,
        confidence_level: jarvisResponse.confidence_level,
        verification_status: jarvisResponse.verification_status,
        ai_reasoning: jarvisResponse.ai_reasoning,
        hallucination_protection: jarvisResponse.hallucination_protection
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      // Speak with confidence-adjusted voice characteristics
      if (voiceEnabled) {
        setTimeout(() => {
          speakWithConfidence(jarvisResponse.message, jarvisResponse.confidence_level);
        }, 500);
      }
    } catch (error) {
      console.error('RAG-enhanced AI error:', error);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.8) return '#4ade80'; // Green
    if (confidence > 0.6) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence > 0.8) return 'High Confidence';
    if (confidence > 0.6) return 'Medium Confidence';
    return 'Low Confidence - Verification Needed';
  };

  return (
    <div className="rag-voice-container">
      <Head>
        <title>Ms. Jarvis RAG-Enhanced Voice + AI - MountainShares</title>
      </Head>

      <div className="header">
        <h1>🧠 Ms. Jarvis RAG-Enhanced Voice + Verification</h1>
        <div className="status-bar">
          <div className="status-item">
            <span className="indicator voice-ready"></span>
            Voice: {voiceEnabled ? 'Ready' : 'Disabled'}
          </div>
          <div className="status-item">
            <span className="indicator rag-active"></span>
            RAG Verification: Active
          </div>
          <div className="status-item">
            <span className="indicator confidence-scoring"></span>
            Confidence Scoring: Enabled
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
              {msg.confidence_level && (
                <div className="confidence-indicator" style={{backgroundColor: getConfidenceColor(msg.confidence_level)}}>
                  {Math.round(msg.confidence_level * 100)}% - {getConfidenceLabel(msg.confidence_level)}
                </div>
              )}
            </div>
            <div className="message-content">{msg.message}</div>
            {msg.verification_status && (
              <div className="verification-status">
                <strong>Verification:</strong> {msg.verification_status}
              </div>
            )}
            {msg.hallucination_protection && (
              <div className="hallucination-protection">
                <details>
                  <summary>🛡️ Hallucination Protection Active</summary>
                  <div className="protection-details">
                    <p><strong>Knowledge Base Checks:</strong> {msg.hallucination_protection.knowledge_base_checks}</p>
                    <p><strong>Confidence Scoring:</strong> {msg.hallucination_protection.confidence_scoring}</p>
                    <p><strong>Uncertainty Handling:</strong> {msg.hallucination_protection.uncertainty_acknowledgment}</p>
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
        
        {isSpeaking && (
          <div className="speaking-indicator">
            <div className="pulse-ring"></div>
            🗣️ Ms. Jarvis is speaking with verified confidence...
          </div>
        )}
      </div>

      <div className="voice-controls">
        <button 
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? () => setIsListening(false) : startListening}
          disabled={!voiceEnabled}
        >
          {isListening ? '🛑 Stop Listening' : '🎤 Talk to Ms. Jarvis (RAG Enhanced)'}
        </button>
        
        <div className="text-input-section">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessageWithRAG()}
            placeholder="Ask me anything - I'll verify my facts and show my confidence level..."
          />
          <button onClick={() => sendMessageWithRAG()}>Send</button>
        </div>
      </div>

      <style jsx>{`
        .rag-voice-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          color: white;
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          text-align: center;
        }

        .status-bar {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          margin-bottom: 30px;
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
        .rag-active { background: #3b82f6; }
        .confidence-scoring { background: #f59e0b; }

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
          flex-wrap: wrap;
          gap: 10px;
        }

        .confidence-indicator {
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .verification-status {
          margin-top: 8px;
          font-size: 0.85rem;
          background: rgba(0,0,0,0.2);
          padding: 6px 10px;
          border-radius: 8px;
        }

        .hallucination-protection {
          margin-top: 10px;
          font-size: 0.9rem;
        }

        .protection-details {
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
          min-width: 280px;
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
