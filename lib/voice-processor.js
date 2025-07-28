export class LocalVoiceProcessor {
  constructor() {
    this.isInitialized = false;
    this.recognition = null;
    this.synthesis = null;
    this.voiceOptions = [];
  }

  async initialize() {
    if (typeof window === 'undefined') return false;

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }

    // Initialize Speech Synthesis
    if (window.speechSynthesis) {
      this.synthesis = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        this.voiceOptions = this.synthesis.getVoices();
        this.isInitialized = true;
      };

      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = loadVoices;
      } else {
        loadVoices();
      }
    }

    return this.isInitialized;
  }

  getJarvisVoice() {
    // Find the best voice for Ms. Jarvis's motherly personality
    const preferredNames = [
      'Samantha', 'Karen', 'Susan', 'Victoria', 'Aria', 'Jenny', 'Michelle'
    ];

    for (const name of preferredNames) {
      const voice = this.voiceOptions.find(v => v.name.includes(name));
      if (voice) return voice;
    }

    // Fallback to any English female voice
    return this.voiceOptions.find(v => 
      v.lang.startsWith('en') && 
      (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'))
    ) || this.voiceOptions.find(v => v.lang.startsWith('en'));
  }

  speak(text, personality = 'motherly_caring') {
    if (!this.synthesis || !text) return Promise.reject('Synthesis not available');

    return new Promise((resolve, reject) => {
      this.synthesis.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = this.getJarvisVoice();
      
      if (voice) {
        utterance.voice = voice;
      }

      // Configure voice based on personality
      switch (personality) {
        case 'motherly_caring':
          utterance.rate = 0.85;
          utterance.pitch = 1.1;
          utterance.volume = 0.8;
          break;
        case 'helpful_analytical':
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 0.9;
          break;
        case 'warm_welcoming':
          utterance.rate = 0.8;
          utterance.pitch = 1.2;
          utterance.volume = 0.9;
          break;
        default:
          utterance.rate = 0.9;
          utterance.pitch = 1.05;
          utterance.volume = 0.85;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);

      this.synthesis.speak(utterance);
    });
  }

  listen() {
    if (!this.recognition) return Promise.reject('Recognition not available');

    return new Promise((resolve, reject) => {
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      this.recognition.onerror = (event) => reject(event.error);
      this.recognition.onend = () => {}; // Will resolve via onresult

      this.recognition.start();
    });
  }
}
