import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function MsJarvis() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState('enhanced-knowledge');
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        sender: 'Ms. Jarvis',
        message: "Well hello there, sweetheart! I'm Ms. Jarvis, and I'm so glad we got me organized in one place - no more running around looking for me in different locations! I have all my capabilities right here: my enhanced knowledge with that comprehensive technical information, my Four AI Debaters for democratic reasoning, real-time data when I need it, and my caring guidance for your MountainShares community. What can I help you with today, honey?",
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
    
    // Ms. Jarvis's caring voice characteristics
    utterance.rate = confidence > 0.8 ? 0.88 : 0.82;
    utterance.pitch = confidence > 0.8 ? 1.08 : 1.05;
    utterance.volume = 0.85;

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
      const response = await fetch(`/api/jarvis-${selectedAPI}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const jarvisResponse = await response.json();
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message || "I'm here to help you, honey. Let me think about that.",
        timestamp: jarvisResponse.timestamp || new Date().toISOString(),
        confidence_level: jarvisResponse.confidence_level || 0.8,
        verification_status: jarvisResponse.verification_status,
        ai_reasoning: jarvisResponse.ai_reasoning
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      if (voiceEnabled) {
        setTimeout(() => speak(jarvisMessage.message, jarvisMessage.confidence_level), 500);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: "I apologize, dear, but I'm having a small technical issue. Please try again in a moment.",
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
          <h1>🤖 Loading Ms. Jarvis...</h1>
          <p>Your MountainShares AI assistant</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <Head>
        <title>Ms. Jarvis - MountainShares AI Assistant</title>
        <meta name="description" content="Ms. Jarvis - Your community-controlled AI assistant for MountainShares with Four AI Debaters, enhanced knowledge, and democratic governance." />
      </Head>

      {/* Header */}
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{fontSize: '2.5rem', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
          🤖 Ms. Jarvis
        </h1>
        <p style={{fontSize: '1.2rem', opacity: 0.9}}>
          Your MountainShares AI Assistant - All in One Place!
        </p>
        <p style={{fontSize: '1rem', opacity: 0.8, marginTop: '10px'}}>
          Four AI Debaters • Enhanced Knowledge • Community Values • Voice Interaction
        </p>
      </div>

      {/* Quick Mode Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          {key: 'enhanced-knowledge', label: '🧠 Smart', desc: 'Most comprehensive'},
          {key: 'rag-enhanced', label: '🛡️ Verified', desc: 'No hallucinations'},
          {key: 'realtime-enhanced', label: '⏱️ Current', desc: 'Live data'},
          {key: 'full-ai', label: '⚖️ Democratic', desc: 'Four AI Debaters'}
        ].map(api => (
          <button
            key={api.key}
            onClick={() => setSelectedAPI(api.key)}
            style={{
              padding: '8px 12px',
              background: selectedAPI === api.key 
                ? 'rgba(255,255,255,0.3)' 
                : 'rgba(255,255,255,0.1)',
              border: selectedAPI === api.key ? '2px solid #4ade80' : '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '0.85rem'
            }}
          >
            <div>{api.label}</div>
            <div style={{fontSize: '0.7rem', opacity: 0.8}}>{api.desc}</div>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        maxHeight: '400px',
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
            marginLeft: msg.sender === 'Ms. Jarvis' ? '0' : '20%',
            marginRight: msg.sender === 'Ms. Jarvis' ? '20%' : '0'
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
                {msg.confidence_level && (
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: msg.confidence_level > 0.8 ? '#4ade80' : msg.confidence_level > 0.6 ? '#fbbf24' : '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {Math.round(msg.confidence_level * 100)}%
                  </span>
                )}
                <span style={{fontSize: '0.8rem', opacity: 0.7}}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div>{msg.message}</div>
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
            🗣️ Ms. Jarvis is speaking with {selectedAPI.includes('enhanced') ? 'enhanced' : 'standard'} knowledge...
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
            minWidth: '160px',
            animation: isListening ? 'pulse 1s infinite' : 'none'
          }}
        >
          {isListening ? '🛑 Stop' : '🎤 Talk to Me'}
        </button>
        
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me about your contracts, community decisions, or anything else..."
          style={{
            flex: 1,
            minWidth: '250px',
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
        <p>🏔️ <strong>Community-Controlled AI</strong> • Democratic Governance • Appalachian Values • Professional Contract Analysis</p>
        <p>Ready to help with your 28 compromised contracts and all your MountainShares community needs!</p>
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
