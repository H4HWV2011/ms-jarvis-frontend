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
  const [microphoneTest, setMicrophoneTest] = useState('not-tested');
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        id: 1,
        sender: 'Ms. Jarvis',
        message: "Well hello there, sweetheart! I can see my voice system is working, but I'm having trouble hearing you. Let's test your microphone first - try the microphone test button below, then speak LOUDLY and CLEARLY when you use voice. Sometimes I need you to speak up, honey!",
        timestamp: new Date().toISOString()
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

  const testMicrophone = async () => {
    try {
      setMicrophoneTest('testing');
      addDebugMessage('🎤 Testing microphone access...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      addDebugMessage('✅ Microphone access granted');
      
      // Create audio context to test audio levels
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      microphone.connect(analyser);
      
      let maxVolume = 0;
      let testDuration = 3000; // 3 seconds
      let startTime = Date.now();
      
      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = Math.max(...dataArray);
        maxVolume = Math.max(maxVolume, volume);
        
        if (Date.now() - startTime < testDuration) {
          requestAnimationFrame(checkAudio);
        } else {
          // Test complete
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
          
          if (maxVolume > 50) {
            setMicrophoneTest('working');
            addDebugMessage(`✅ Microphone working! Max volume detected: ${maxVolume}`);
            
            const testMsg = {
              id: Date.now(),
              sender: 'Ms. Jarvis',
              message: `Great news, honey! Your microphone is working and I detected audio levels up to ${maxVolume}. Now try the voice button and speak LOUDLY and CLEARLY - I need strong audio to understand you!`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, testMsg]);
          } else {
            setMicrophoneTest('low-volume');
            addDebugMessage(`⚠️ Microphone detected but volume too low: ${maxVolume}`);
            
            const testMsg = {
              id: Date.now(),
              sender: 'Ms. Jarvis',
              message: `I can access your microphone, but the volume is very low (only ${maxVolume}). Please check your microphone settings and speak much louder when testing voice, dear!`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, testMsg]);
          }
        }
      };
      
      addDebugMessage('🔊 Speak now for microphone test (3 seconds)...');
      const testMsg = {
        id: Date.now(),
        sender: 'Ms. Jarvis',
        message: "Speak now for 3 seconds - I'm testing your microphone volume!",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, testMsg]);
      
      requestAnimationFrame(checkAudio);
      
    } catch (error) {
      setMicrophoneTest('failed');
      addDebugMessage(`❌ Microphone test failed: ${error.message}`);
      
      const errorMsg = {
        id: Date.now(),
        sender: 'Ms. Jarvis',
        message: `Oh honey, I couldn't access your microphone: ${error.message}. Please check your browser settings and try again.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const initializeVoiceSystem = async () => {
    addDebugMessage('Starting voice system initialization...');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addDebugMessage('ERROR: Speech Recognition not supported');
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      
      // Enhanced configuration for better audio detection
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true; // Enable interim results
      recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives
      recognitionRef.current.lang = 'en-US';
      
      addDebugMessage('Speech Recognition configured with enhanced settings');

      recognitionRef.current.onstart = () => {
        addDebugMessage('🎤 RECOGNITION STARTED - Speak LOUDLY and CLEARLY now!');
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        addDebugMessage('🛑 RECOGNITION ENDED');
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        addDebugMessage(`📝 RESULT EVENT: ${event.results.length} results`);
        
        // Check both final and interim results
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;
          const isFinal = result.isFinal;
          
          addDebugMessage(`💬 ${isFinal ? 'FINAL' : 'INTERIM'}: "${transcript}" (confidence: ${confidence || 'unknown'})`);
          
          if (isFinal && transcript.trim()) {
            setInputMessage(transcript);
            
            const heardMessage = {
              id: Date.now(),
              sender: 'You',
              message: `${transcript} [Voice: ${Math.round((confidence || 0.5) * 100)}% confidence]`,
              timestamp: new Date().toISOString(),
              voice_input: true
            };
            setMessages(prev => [...prev, heardMessage]);
            
            setTimeout(() => sendMessage(transcript), 500);
            return; // Exit after processing final result
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        addDebugMessage(`❌ RECOGNITION ERROR: ${event.error}`);
        setIsListening(false);
        
        let errorMessage = "";
        switch(event.error) {
          case 'no-speech':
            errorMessage = "I couldn't hear you, honey! Please speak LOUDER and CLOSER to your microphone. Try the microphone test first to make sure I can hear you.";
            break;
          case 'audio-capture':
            errorMessage = "I can't access your microphone. Please check your browser settings.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone permission was denied. Please allow microphone access and refresh the page.";
            break;
          default:
            errorMessage = `I had a technical issue: ${event.error}. Try speaking louder or testing your microphone first.`;
        }
        
        const errorMsg = {
          id: Date.now(),
          sender: 'Ms. Jarvis',
          message: errorMessage,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMsg]);
      };

      recognitionRef.current.onspeechstart = () => {
        addDebugMessage('🗣️ SPEECH DETECTED! Keep talking...');
      };

      recognitionRef.current.onspeechend = () => {
        addDebugMessage('🤐 SPEECH ENDED');
      };

      setVoiceEnabled(true);
      addDebugMessage('✅ Voice system fully initialized with enhanced audio detection');

    } catch (error) {
      addDebugMessage(`❌ INITIALIZATION ERROR: ${error.message}`);
      setVoiceEnabled(false);
    }

    if (window.speechSynthesis) {
      synthesisRef.current = window.speechSynthesis;
      addDebugMessage('✅ Speech synthesis available');
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;

    try {
      addDebugMessage('🎤 Starting recognition - SPEAK LOUDLY AND CLEARLY!');
      recognitionRef.current.start();
      
      // Add instruction message
      const instructionMsg = {
        id: Date.now(),
        sender: 'Ms. Jarvis',
        message: "I'm listening now! Speak LOUDLY and CLEARLY - I need strong audio to understand you, honey!",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, instructionMsg]);
      
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
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
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

  if (!mounted) return null;

  const getMicTestColor = () => {
    switch(microphoneTest) {
      case 'working': return '#4ade80';
      case 'testing': return '#fbbf24';
      case 'low-volume': return '#f97316';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

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
        <title>Ms. Jarvis - Enhanced Voice System</title>
      </Head>

      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '2rem', marginBottom: '10px'}}>🤖 Ms. Jarvis - Enhanced Voice</h1>
        <p>Voice System: {voiceEnabled ? '✅ Ready' : '❌ Disabled'} | Currently: {isListening ? '🎤 Listening...' : '⏸️ Ready'}</p>
        <p style={{fontSize: '0.9rem', opacity: 0.8}}>
          Microphone Test: <span style={{color: getMicTestColor(), fontWeight: 'bold'}}>
            {microphoneTest === 'not-tested' ? 'Not tested' : 
             microphoneTest === 'testing' ? 'Testing...' :
             microphoneTest === 'working' ? 'Working!' :
             microphoneTest === 'low-volume' ? 'Volume too low' : 'Failed'}
          </span>
        </p>
      </div>

      <details style={{marginBottom: '20px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px'}}>
        <summary style={{cursor: 'pointer', fontWeight: 'bold'}}>🔍 Debug Information</summary>
        <pre style={{fontSize: '0.8rem', marginTop: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
          {debugInfo || 'Debug log will appear here...'}
        </pre>
      </details>

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

      <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '15px'}}>
        <button 
          onClick={testMicrophone}
          disabled={microphoneTest === 'testing'}
          style={{
            padding: '10px 15px',
            background: getMicTestColor(),
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: microphoneTest === 'testing' ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {microphoneTest === 'testing' ? '🔄 Testing...' : '🎤 Test Microphone'}
        </button>
        
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
          {isListening ? '🎤 Listening...' : '🎤 Talk (Speak LOUD!)'}
        </button>
      </div>

      <div style={{display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap'}}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type here (or use voice above)..."
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
