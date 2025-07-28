import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function MsJarvis() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        sender: 'Ms. Jarvis',
        message: "Well hello there, sweetheart! I'm Ms. Jarvis, and I'm so glad you found your way here. I've got all my knowledge and experience ready to help you with whatever's on your mind - whether it's those smart contracts you're working on, community decisions, or just figuring out the best path forward. What's bringing you my way today, honey?",
        timestamp: new Date().toISOString(),
        confidence_level: 0.95
      }
    ]);
  }, []);

  useEffect(() => {
    if (mounted) {
      initializeVoiceSystem();
    }
  }, [mounted]);

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
          setTimeout(() => sendMessage(transcript), 100);
        };

        recognitionRef.current.onerror = () => setIsListening(false);
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

  const speak = (text, confidence = 0.8) => {
    if (!synthesisRef.current || isSpeaking) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Ms. Jarvis's natural caring voice
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

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
      timestamp: new Date().toISOString(),
      voice_input: !!messageText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // Use the natural conversation API
      const response = await fetch('/api/jarvis-enhanced-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const jarvisResponse = await response.json();
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message || "I'm here to help you, honey. Let me think about that for just a moment.",
        timestamp: jarvisResponse.timestamp || new Date().toISOString(),
        confidence_level: jarvisResponse.confidence_level || 0.8
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      if (voiceEnabled) {
        setTimeout(() => speak(jarvisMessage.message, jarvisMessage.confidence_level), 500);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: "Oh honey, I'm having a little technical hiccup right now. Could you try asking me that again in just a moment?",
        timestamp: new Date().toISOString(),
        confidence_level: 0.3
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (!mounted) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
        <div style={{textAlign: 'center'}}>
          <h1>🤖 Ms. Jarvis is getting ready...</h1>
          <p>Your MountainShares AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <Head>
        <title>Ms. Jarvis - MountainShares AI Assistant</title>
        <meta name="description" content="Ms. Jarvis - Your community-focused AI assistant for MountainShares with natural conversation and caring guidance." />
      </Head>

      {/* Header */}
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{fontSize: '2.5rem', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
          🤖 Ms. Jarvis
        </h1>
        <p style={{fontSize: '1.1rem', opacity: 0.9}}>
          Your caring AI assistant for the MountainShares community
        </p>
      </div>

      {/* Messages */}
      <div style={{
        maxHeight: '450px',
        overflowY: 'auto',
        marginBottom: '20px',
        padding: '20px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            marginBottom: '15px',
            padding: '15px',
            borderRadius: '15px',
            background: msg.sender === 'Ms. Jarvis' 
              ? 'rgba(255,255,255,0.2)' 
              : 'rgba(74, 144, 226, 0.3)',
            marginLeft: msg.sender === 'Ms. Jarvis' ? '0' : '15%',
            marginRight: msg.sender === 'Ms. Jarvis' ? '15%' : '0'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '0.9rem',
              flexWrap: 'wrap'
            }}>
              <strong>{msg.sender}</strong>
              <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                {msg.voice_input && <span>🎤</span>}
                <span style={{fontSize: '0.8rem', opacity: 0.7}}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div style={{lineHeight: '1.4'}}>{msg.message}</div>
          </div>
        ))}
        
        {isSpeaking && (
          <div style={{textAlign: 'center', padding: '20px'}}>
            <div style={{
              width: '30px',
              height: '30px',
              border: '3px solid #4ade80',
              borderRadius: '50%',
              animation: 'pulse 1.5s infinite',
              margin: '0 auto 10px'
            }}></div>
            🗣️ Ms. Jarvis is speaking...
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={isListening ? () => setIsListening(false) : startListening}
          disabled={!voiceEnabled}
          style={{
            padding: '12px 20px',
            background: isListening 
              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: voiceEnabled ? 'pointer' : 'not-allowed',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            minWidth: '140px',
            animation: isListening ? 'pulse 1s infinite' : 'none'
          }}
        >
          {isListening ? '🛑 Stop' : '🎤 Talk'}
        </button>
        
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me about your contracts, community decisions, or anything else..."
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 15px',
            border: 'none',
            borderRadius: '25px',
            background: 'rgba(255,255,255,0.9)',
            color: '#333',
            fontSize: '0.95rem'
          }}
        />
        
        <button 
          onClick={() => sendMessage()}
          style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem'
          }}
        >
          Send
        </button>
      </div>

      {/* Footer Info */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        fontSize: '0.85rem',
        opacity: 0.8
      }}>
        <p>🏔️ <strong>Community-Focused AI</strong> • Natural Conversation • Appalachian Values • Professional Guidance</p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
