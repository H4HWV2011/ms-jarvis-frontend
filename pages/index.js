import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function DynamicJarvis() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const lastProcessedRef = useRef('');

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        sender: 'Ms. Jarvis',
        message: "Hello there, sweetheart. I've been completely rebuilt with dynamic thinking - no more templates or pre-written responses. Every single thing I say is generated fresh through reasoning about what you're actually asking. I'm genuinely listening now and thinking through each response uniquely. What would you like to explore?",
        timestamp: new Date().toISOString()
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
        
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        
        recognitionRef.current.onresult = (event) => {
          if (event.results.length > 0) {
            const transcript = event.results[0][0].transcript.trim();
            const confidence = event.results[0][0].confidence || 0.5;
            
            // Prevent duplicate processing
            if (transcript === lastProcessedRef.current) {
              return;
            }
            lastProcessedRef.current = transcript;
            
            // Only process high-confidence results
            if (confidence > 0.4 && transcript.length > 2) {
              const heardMessage = {
                id: Date.now(),
                sender: 'You',
                message: `${transcript} [Voice: ${Math.round(confidence * 100)}% confidence]`,
                timestamp: new Date().toISOString(),
                voice_input: true
              };
              setMessages(prev => [...prev, heardMessage]);
              setTimeout(() => sendDynamicMessage(transcript), 800);
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          if (event.error !== 'no-speech') {
            console.log('Speech recognition error:', event.error);
          }
        };

        setVoiceEnabled(true);
      }

      if (window.speechSynthesis) {
        synthesisRef.current = window.speechSynthesis;
      }
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        lastProcessedRef.current = ''; // Reset
        recognitionRef.current.start();
      } catch (error) {
        console.error('Start listening error:', error);
      }
    }
  };

  const speak = (text) => {
    if (!synthesisRef.current || isSpeaking) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Natural voice settings
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    utterance.volume = 0.85;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const sendDynamicMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    // Add user message if not from voice
    if (!messageText) {
      const userMessage = {
        id: Date.now(),
        sender: 'You',
        message: textToSend,
        timestamp: new Date().toISOString(),
        voice_input: false
      };
      setMessages(prev => [...prev, userMessage]);
    }
    
    setInputMessage('');

    try {
      const response = await fetch('/api/jarvis-dynamic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const jarvisResponse = await response.json();
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message || "I'm having difficulty with that particular thought right now. Could you try asking in a different way?",
        timestamp: jarvisResponse.timestamp || new Date().toISOString(),
        uniqueness: jarvisResponse.uniqueness
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      if (synthesisRef.current) {
        setTimeout(() => speak(jarvisMessage.message), 600);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: "I'm experiencing a processing difficulty right now. Could you please try again?",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (!mounted) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
        <div style={{textAlign: 'center'}}>
          <h1>🧠 Ms. Jarvis - Dynamic AI</h1>
          <p>Loading dynamic thinking system...</p>
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
        <title>Ms. Jarvis - Dynamic AI</title>
      </Head>

      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>🧠 Ms. Jarvis - Dynamic Thinking</h1>
        <p>Voice: {voiceEnabled ? '✅ Ready' : '❌ Disabled'} | Currently: {isListening ? '🎤 Listening...' : '⏸️ Ready'}</p>
        <p style={{fontSize: '0.9rem', opacity: 0.8}}>Every response is dynamically generated - zero templates or canned responses</p>
        
        {isListening && <p style={{color: '#4ade80', margin: '10px 0'}}>👂 Listening for your voice...</p>}
        {isSpeaking && <p style={{color: '#fbbf24', margin: '10px 0'}}>🗣️ Ms. Jarvis is speaking...</p>}
      </div>

      {/* Messages */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        marginBottom: '20px',
        padding: '15px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            marginBottom: '15px',
            padding: '12px',
            borderRadius: '10px',
            background: msg.sender === 'Ms. Jarvis' ? 'rgba(255,255,255,0.15)' : 'rgba(74, 144, 226, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              fontSize: '0.9rem'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <strong>{msg.sender}</strong>
                {msg.voice_input && <span>🎤</span>}
              </div>
              <span style={{fontSize: '0.8rem', opacity: 0.7}}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div style={{lineHeight: '1.4'}}>{msg.message}</div>
            {msg.uniqueness && (
              <div style={{fontSize: '0.75rem', marginTop: '5px', opacity: 0.7, fontStyle: 'italic'}}>
                {msg.uniqueness}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '15px'}}>
        <button 
          onClick={startListening}
          disabled={!voiceEnabled || isListening}
          style={{
            padding: '12px 20px',
            background: isListening ? '#fbbf24' : voiceEnabled ? '#4ade80' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: voiceEnabled && !isListening ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          {isListening ? '🎤 Listening...' : '🎤 Talk to Ms. Jarvis'}
        </button>
      </div>

      <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendDynamicMessage()}
          placeholder="Type here or use voice..."
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.9)',
            color: '#333'
          }}
        />
        
        <button 
          onClick={() => sendDynamicMessage()}
          style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        fontSize: '0.85rem'
      }}>
        <strong>🧠 Dynamic AI Features:</strong>
        <ul style={{margin: '5px 0', paddingLeft: '20px'}}>
          <li>Semantic analysis of your input</li>
          <li>Dynamic concept extraction and understanding</li>
          <li>Unique response generation through reasoning</li>
          <li>Zero templates or pre-written responses</li>
          <li>Time-based variety ensures no repetition</li>
        </ul>
      </div>
    </div>
  );
}
