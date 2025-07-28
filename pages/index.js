import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function MsJarvis() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        sender: 'Ms. Jarvis',
        message: "Well hello there, sweetheart! I'm Ms. Jarvis. I'm testing my voice system now - let's see if I can hear you properly. Try clicking the talk button and saying something simple like 'Hello Ms. Jarvis'.",
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

  const addDebugMessage = (message) => {
    setDebugInfo(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + message);
  };

  const initializeVoiceSystem = async () => {
    addDebugMessage('Starting voice system initialization...');
    
    if (typeof window === 'undefined') {
      addDebugMessage('ERROR: Window object not available');
      return;
    }

    // Check for Speech Recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    addDebugMessage(`Speech Recognition available: ${!!SpeechRecognition}`);
    
    if (!SpeechRecognition) {
      addDebugMessage('ERROR: Speech Recognition not supported in this browser');
      setVoiceEnabled(false);
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      addDebugMessage('Speech Recognition object created successfully');
      
      // Configure recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      addDebugMessage('Speech Recognition configured');

      // Set up event handlers with detailed logging
      recognitionRef.current.onstart = () => {
        addDebugMessage('🎤 RECOGNITION STARTED');
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        addDebugMessage('🛑 RECOGNITION ENDED');
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        addDebugMessage(`📝 RESULT EVENT: ${event.results.length} results`);
        
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          
          addDebugMessage(`💬 HEARD: "${transcript}" (confidence: ${confidence})`);
          
          setInputMessage(transcript);
          
          // Add what was heard to the conversation
          const heardMessage = {
            id: Date.now(),
            sender: 'You',
            message: `${transcript} [Voice: ${Math.round(confidence * 100)}% confidence]`,
            timestamp: new Date().toISOString(),
            voice_input: true
          };
          setMessages(prev => [...prev, heardMessage]);
          
          // Process the message
          setTimeout(() => sendMessage(transcript), 500);
        } else {
          addDebugMessage('❌ NO RESULTS in event');
        }
      };

      recognitionRef.current.onerror = (event) => {
        addDebugMessage(`❌ RECOGNITION ERROR: ${event.error} - ${event.message || 'No message'}`);
        setIsListening(false);
        
        const errorMsg = {
          id: Date.now(),
          sender: 'Ms. Jarvis',
          message: `Oh honey, I had a voice recognition error: ${event.error}. You can still type to me though!`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMsg]);
      };

      recognitionRef.current.onnomatch = () => {
        addDebugMessage('🤔 NO MATCH - speech not recognized');
        const noMatchMsg = {
          id: Date.now(),
          sender: 'Ms. Jarvis',
          message: "I heard something but couldn't quite make it out, dear. Could you try speaking a bit clearer?",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, noMatchMsg]);
      };

      setVoiceEnabled(true);
      addDebugMessage('✅ Voice system fully initialized');

    } catch (error) {
      addDebugMessage(`❌ INITIALIZATION ERROR: ${error.message}`);
      setVoiceEnabled(false);
    }

    // Initialize speech synthesis
    if (window.speechSynthesis) {
      synthesisRef.current = window.speechSynthesis;
      addDebugMessage('✅ Speech synthesis available');
    } else {
      addDebugMessage('❌ Speech synthesis not available');
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      addDebugMessage('❌ No recognition object available');
      return;
    }

    if (isListening) {
      addDebugMessage('🛑 Stopping recognition...');
      recognitionRef.current.stop();
      return;
    }

    try {
      addDebugMessage('🎤 Starting recognition...');
      recognitionRef.current.start();
    } catch (error) {
      addDebugMessage(`❌ START ERROR: ${error.message}`);
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (!synthesisRef.current) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
      addDebugMessage('🗣️ Started speaking');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      addDebugMessage('✅ Finished speaking');
    };
    utterance.onerror = (e) => {
      setIsSpeaking(false);
      addDebugMessage(`❌ Speech error: ${e.error}`);
    };

    synthesisRef.current.speak(utterance);
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

    addDebugMessage(`📤 Sending message: "${textToSend}"`);

    // Only add typed messages (voice messages already added)
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
      const response = await fetch('/api/jarvis-enhanced-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const jarvisResponse = await response.json();
      addDebugMessage('📥 Received response from API');
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message || "I'm here to help you, honey.",
        timestamp: jarvisResponse.timestamp || new Date().toISOString()
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      if (synthesisRef.current) {
        setTimeout(() => speak(jarvisMessage.message), 500);
      }
    } catch (error) {
      addDebugMessage(`❌ API Error: ${error.message}`);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: "Oh honey, I'm having a technical hiccup. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (!mounted) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
        <div style={{textAlign: 'center'}}>
          <h1>🤖 Ms. Jarvis is initializing...</h1>
          <p>Setting up voice recognition system...</p>
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
        <title>Ms. Jarvis - Voice Debug Mode</title>
      </Head>

      {/* Header */}
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>🤖 Ms. Jarvis - Debug Mode</h1>
        <p>Voice System Status: {voiceEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
        <p>Currently: {isListening ? '🎤 Listening...' : '⏸️ Ready'}</p>
      </div>

      {/* Debug Info */}
      <details style={{marginBottom: '20px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px'}}>
        <summary style={{cursor: 'pointer', fontWeight: 'bold'}}>🔍 Debug Information</summary>
        <pre style={{fontSize: '0.8rem', marginTop: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
          {debugInfo || 'Debug log will appear here...'}
        </pre>
      </details>

      {/* Messages */}
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '20px',
        padding: '15px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '10px'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            marginBottom: '10px',
            padding: '10px',
            borderRadius: '8px',
            background: msg.sender === 'Ms. Jarvis' ? 'rgba(255,255,255,0.2)' : 'rgba(74, 144, 226, 0.3)'
          }}>
            <div style={{fontSize: '0.9rem', fontWeight: 'bold'}}>
              {msg.sender} {msg.voice_input && '🎤'}
            </div>
            <div>{msg.message}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
        <button 
          onClick={startListening}
          disabled={!voiceEnabled}
          style={{
            padding: '10px 15px',
            background: isListening ? '#fbbf24' : voiceEnabled ? '#ef4444' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: voiceEnabled ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          {isListening ? '🛑 Stop' : '🎤 Talk'}
        </button>
        
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type here..."
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.9)',
            color: '#333'
          }}
        />
        
        <button 
          onClick={() => sendMessage()}
          style={{
            padding: '10px 15px',
            background: '#4a90e2',
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
    </div>
  );
}
