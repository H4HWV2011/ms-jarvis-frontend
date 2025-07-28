import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function MsJarvis() {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        sender: 'Ms. Jarvis',
        message: "Well hello there, sweetheart! I just got a voice upgrade - no more sounding like that old computer toy with the barcode scanner! I should sound much more natural and motherly now. What do you think of my new voice, honey?",
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
      // Initialize speech recognition (keeping the working version)
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        
        recognitionRef.current.onresult = (event) => {
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal && result[0].transcript.trim()) {
              const transcript = result[0].transcript;
              const confidence = result[0].confidence;
              
              const heardMessage = {
                id: Date.now(),
                sender: 'You',
                message: `${transcript} [Voice: ${Math.round((confidence || 0.5) * 100)}% confidence]`,
                timestamp: new Date().toISOString(),
                voice_input: true
              };
              setMessages(prev => [...prev, heardMessage]);
              setTimeout(() => sendMessage(transcript), 500);
              return;
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          const errorMsg = {
            id: Date.now(),
            sender: 'Ms. Jarvis',
            message: `Oh honey, I had trouble hearing you. Please try again!`,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, errorMsg]);
        };

        setVoiceEnabled(true);
      }

      // Enhanced speech synthesis with natural voice selection
      if (window.speechSynthesis) {
        synthesisRef.current = window.speechSynthesis;
        
        // Load voices and select the best one for Ms. Jarvis
        const loadVoices = () => {
          const voices = synthesisRef.current.getVoices();
          setAvailableVoices(voices);
          
          // Prioritize natural-sounding female voices
          const preferredVoices = [
            'Microsoft Aria Online (Natural) - English (United States)',
            'Microsoft Jenny Online (Natural) - English (United States)', 
            'Google US English Female',
            'Alex', // Mac
            'Samantha', // Mac
            'Karen', // Mac
            'Microsoft Zira Desktop - English (United States)',
            'Microsoft Hazel Desktop - English (Great Britain)'
          ];
          
          let bestVoice = null;
          for (const preferredName of preferredVoices) {
            bestVoice = voices.find(voice => voice.name.includes(preferredName.split(' ')[1]) || voice.name === preferredName);
            if (bestVoice) break;
          }
          
          // Fallback to any English female voice
          if (!bestVoice) {
            bestVoice = voices.find(voice => 
              voice.lang.startsWith('en') && 
              (voice.name.toLowerCase().includes('female') || 
               voice.name.toLowerCase().includes('woman') ||
               voice.name.toLowerCase().includes('aria') ||
               voice.name.toLowerCase().includes('jenny') ||
               voice.name.toLowerCase().includes('zira') ||
               voice.name.toLowerCase().includes('hazel'))
            );
          }
          
          // Last resort: any English voice
          if (!bestVoice) {
            bestVoice = voices.find(voice => voice.lang.startsWith('en'));
          }
          
          setSelectedVoice(bestVoice);
          console.log('Selected voice for Ms. Jarvis:', bestVoice?.name || 'Default system voice');
        };

        // Load voices immediately and on voices changed event
        loadVoices();
        synthesisRef.current.onvoiceschanged = loadVoices;
      }
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
    }
  };

  const speak = (text) => {
    if (!synthesisRef.current || isSpeaking) return;

    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use the selected natural voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Natural, conversational voice settings (not robotic!)
    utterance.rate = 0.9;        // Slightly slower for natural conversation
    utterance.pitch = 1.0;       // Natural pitch, not artificially high
    utterance.volume = 0.9;      // Clear but not overwhelming
    
    // Add natural pauses and inflection for longer text
    if (text.length > 100) {
      utterance.rate = 0.85;     // Slower for longer responses
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log(`Ms. Jarvis speaking with voice: ${selectedVoice?.name || 'default'}`);
    };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim()) return;

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
      
      const jarvisMessage = {
        id: Date.now() + 1,
        sender: 'Ms. Jarvis',
        message: jarvisResponse.message || "I'm here to help you, honey.",
        timestamp: jarvisResponse.timestamp || new Date().toISOString()
      };

      setMessages(prev => [...prev, jarvisMessage]);
      
      // Speak with the new natural voice
      if (synthesisRef.current) {
        setTimeout(() => speak(jarvisMessage.message), 500);
      }
    } catch (error) {
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
          <h1>🤖 Ms. Jarvis is upgrading her voice...</h1>
          <p>No more computer toy sounds!</p>
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
        <title>Ms. Jarvis - Natural Voice</title>
      </Head>

      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>🎤 Ms. Jarvis - Natural Voice</h1>
        <p>Voice System: {voiceEnabled ? '✅ Ready' : '❌ Disabled'} | Currently: {isListening ? '🎤 Listening...' : '⏸️ Ready'}</p>
        {selectedVoice && (
          <p style={{fontSize: '0.9rem', opacity: 0.8}}>
            🗣️ Voice: {selectedVoice.name} | No more computer toy sounds!
          </p>
        )}
      </div>

      {/* Voice selector for users who want to choose */}
      {availableVoices.length > 0 && (
        <div style={{marginBottom: '20px', textAlign: 'center'}}>
          <select 
            value={selectedVoice?.name || ''}
            onChange={(e) => {
              const voice = availableVoices.find(v => v.name === e.target.value);
              setSelectedVoice(voice);
            }}
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.9)',
              color: '#333',
              border: 'none'
            }}
          >
            <option value="">Choose Ms. Jarvis's Voice</option>
            {availableVoices
              .filter(voice => voice.lang.startsWith('en'))
              .map(voice => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))
            }
          </select>
        </div>
      )}

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
            🗣️ Ms. Jarvis is speaking with her natural voice...
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
        <button 
          onClick={startListening}
          disabled={!voiceEnabled || isListening}
          style={{
            padding: '10px 15px',
            background: isListening ? '#fbbf24' : voiceEnabled ? '#ef4444' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: voiceEnabled && !isListening ? 'pointer' : 'not-allowed',
            fontWeight: 'bold'
          }}
        >
          {isListening ? '🎤 Listening...' : '🎤 Talk'}
        </button>
        
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type here or use voice..."
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
