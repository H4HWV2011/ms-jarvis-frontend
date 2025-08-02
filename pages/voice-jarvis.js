import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function VoiceMsJarvis() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ms. Jarvis',
      message: "Hello! I'm Ms. Jarvis. I can now hear you and speak back! Just click the microphone to start talking with me.",
      timestamp: new Date().toISOString(),
      personality: 'motherly_caring'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
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
          // Automatically send the voice message
          setTimeout(() => sendMessage(transcript), 100);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Initialize speech synthesis
      if (window.speechSynthesis) {
        synthesisRef.current = window.speechSynthesis;
        setVoiceEnabled(true);
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakMessage = (text, personality = 'motherly_caring') => {
    if (!synthesisRef.current || isSpeaking) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure Ms. Jarvis's voice characteristics based on personality
    const voices = synthesisRef.current.getVoices();
    
    // Prefer female voices for Ms. Jarvis's motherly personality
    let preferredVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Woman') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Karen') ||
      voice.name.includes('Susan')
    );

    // Fallback to any English female voice
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
      );
    }

    // Final fallback to any English voice
    if (!preferredVoice) {
      preferredVoice = voices.find(voice => voice.lang.startsWith('en'));
    }

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Adjust voice characteristics for Ms. Jarvis's personality
    switch (personality) {
      case 'motherly_caring':
        utterance.rate = 0.9; // Slightly slower, more caring
        utterance.pitch = 1.1; // Slightly higher, warmer
        utterance.volume = 0.8; // Gentle volume
        break;
      case 'helpful_analytical':
        utterance.rate = 1.0; // Normal pace for information
        utterance.pitch = 1.0; // Neutral pitch
        utterance.volume = 0.9; // Clear volume
        break;
      case 'warm_welcoming':
        utterance.rate = 0.85; // Slower, more welcoming
        utterance.pitch = 1.2; // Higher, friendlier
        utterance.volume = 0.9; // Warm volume
        break;
      default:
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 0.85;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'You',
      message: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const jarvisResponse = await response.json();
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message || 'I apologize, but I encountered an issue processing your request.',
        timestamp: jarvisResponse.timestamp,
        personality: jarvisResponse.personality || 'motherly_caring',
        data: jarvisResponse.data
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      // Speak Ms. Jarvis's response
      if (voiceEnabled) {
        setTimeout(() => {
          speakMessage(jarvisMessage.message, jarvisMessage.personality);
        }, 500); // Small delay to ensure message is displayed first
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
      
      if (voiceEnabled) {
        speakMessage(errorMessage.message, 'apologetic');
      }
    }
  };

  return (
    <div className="voice-chat-container">
      <Head>
        <title>Ms. Jarvis Voice - MountainShares AI Assistant</title>
        <meta name="description" content="Voice-enabled Ms. Jarvis AI Assistant" />
      </Head>

      <div className="chat-header">
        <h1>
          <span className="status-indicator"></span>
          Ms. Jarvis Voice
        </h1>
        <p>Your Voice-Enabled MountainShares AI Assistant</p>
        <div className="voice-status">
          {voiceEnabled ? (
            <span className="voice-ready">🎤 Voice Ready</span>
          ) : (
            <span className="voice-disabled">🔇 Voice Disabled</span>
          )}
          {isSpeaking && <span className="speaking">🗣️ Speaking</span>}
          {isListening && <span className="listening">👂 Listening</span>}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender === 'Ms. Jarvis' ? 'jarvis' : 'user'}`}>
            <div className="message-header">
              {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString()}
              {msg.sender === 'Ms. Jarvis' && (
                <button 
                  className="replay-button"
                  onClick={() => speakMessage(msg.message, msg.personality)}
                  disabled={isSpeaking}
                >
                  🔊
                </button>
              )}
            </div>
            <div className="message-content">{msg.message}</div>
          </div>
        ))}
      </div>

      <div className="voice-controls">
        <div className="voice-input-section">
          <button 
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
            disabled={!voiceEnabled}
          >
            {isListening ? '🛑 Stop' : '🎤 Talk'}
          </button>
          
          <div className="text-input-wrapper">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Or type your message here..."
              className="text-input"
            />
            <button onClick={() => sendMessage()} className="send-button">
              Send
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .voice-chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chat-header {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 20px;
          text-align: center;
        }

        .chat-header h1 {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .status-indicator {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: #4ade80;
          border-radius: 50%;
          margin-right: 10px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 10px #4ade80;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .voice-status {
          margin-top: 10px;
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .voice-ready, .voice-disabled, .speaking, .listening {
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .voice-ready {
          background: rgba(74, 222, 128, 0.3);
          border: 1px solid #4ade80;
        }

        .speaking {
          background: rgba(251, 191, 36, 0.3);
          border: 1px solid #fbbf24;
          animation: pulse 1s infinite;
        }

        .listening {
          background: rgba(239, 68, 68, 0.3);
          border: 1px solid #ef4444;
          animation: pulse 0.5s infinite;
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
          max-width: 75%;
          padding: 15px 20px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .message.jarvis {
          background: rgba(255,255,255,0.2);
          align-self: flex-start;
          border-bottom-left-radius: 8px;
        }

        .message.user {
          background: rgba(74, 144, 226, 0.3);
          align-self: flex-end;
          border-bottom-right-radius: 8px;
        }

        .message-header {
          font-weight: bold;
          margin-bottom: 8px;
          font-size: 0.9rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .replay-button {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .replay-button:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }

        .voice-controls {
          padding: 20px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }

        .voice-input-section {
          display: flex;
          gap: 15px;
          align-items: center;
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
          min-width: 120px;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .voice-button.listening {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          animation: pulse 1s infinite;
        }

        .voice-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .text-input-wrapper {
          flex: 1;
          display: flex;
          gap: 10px;
        }

        .text-input {
          flex: 1;
          padding: 15px 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 25px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 1rem;
          outline: none;
        }

        .text-input::placeholder {
          color: rgba(255,255,255,0.7);
        }

        .text-input:focus {
          border-color: rgba(255,255,255,0.6);
          background: rgba(255,255,255,0.2);
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
