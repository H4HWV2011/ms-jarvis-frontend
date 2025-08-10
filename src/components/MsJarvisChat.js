import React, { useState, useEffect, useRef } from 'react';
import './MsJarvisChat.css';

const MsJarvisChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(`user-${Date.now()}`);
  const messagesEndRef = useRef(null);

  // Enhanced state for better conversation management
  const [conversationContext, setConversationContext] = useState({
    lastTopic: null,
    userPreferences: {},
    conversationHistory: []
  });
  const [userMood, setUserMood] = useState('neutral');

  // Use production backend URL
  const API_URL = 'https://ms-jarvis-core-mknskn576-ms-jarvis.vercel.app/chat-with-mountainshares-brain';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      id: 1,
      text: "Well, hey there, shugah! I'm Ms. Jarvis from Mount Hope, WV. I'm here to help you with anything you need - whether it's creative ideas, technical solutions, spiritual guidance, financial planning, community matters, education, or health & wellness. What can I do for you today, darlin'?",
      sender: 'ms-jarvis',
      timestamp: new Date(),
      consultation: { specialists: ['welcome'], confidence: 'high' }
    }]);
  }, []);

  // Enhanced sentiment analysis and mood detection
  const detectSentiment = (message) => {
    const positiveWords = ['happy', 'excited', 'great', 'awesome', 'wonderful', 'love', 'amazing', 'fantastic', 'excellent', 'good', 'pleased', 'delighted', 'thrilled', 'grateful', 'blessed', 'thankful'];
    const negativeWords = ['sad', 'angry', 'frustrated', 'upset', 'worried', 'concerned', 'trouble', 'problem', 'issue', 'difficult', 'bad', 'terrible', 'awful', 'stressed', 'anxious', 'depressed', 'hurt'];
    const questionWords = ['how', 'what', 'when', 'where', 'why', 'which', 'who', 'can', 'could', 'would', 'should', 'will', 'do', 'does', 'did'];
    const urgentWords = ['urgent', 'emergency', 'asap', 'immediately', 'quickly', 'fast', 'help me', 'need now', 'critical'];

    const messageLower = message.toLowerCase();

    let sentiment = 'neutral';
    let confidence = 0;
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      if (messageLower.includes(word)) {
        positiveCount++;
        confidence += 1;
      }
    });

    negativeWords.forEach(word => {
      if (messageLower.includes(word)) {
        negativeCount++;
        confidence += 1;
      }
    });

    if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    }

    const hasQuestion = questionWords.some(word => messageLower.includes(word)) || messageLower.includes('?');
    const isUrgent = urgentWords.some(word => messageLower.includes(word));

    return {
      sentiment,
      confidence,
      isQuestion: hasQuestion,
      isUrgent,
      needsSupport: sentiment === 'negative' && confidence > 0,
      positiveScore: positiveCount,
      negativeScore: negativeCount
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Analyze sentiment and context
    const sentimentAnalysis = detectSentiment(inputMessage);

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      sentiment: sentimentAnalysis
    };

    setMessages(prev => [...prev, userMessage]);

    // Update conversation context
    setConversationContext(prev => ({
      ...prev,
      conversationHistory: [...prev.conversationHistory.slice(-5), userMessage],
      lastTopic: sentimentAnalysis.isQuestion ? 'question' : 'statement'
    }));

    // Update user mood tracking
    setUserMood(sentimentAnalysis.sentiment);

    setInputMessage('');
    setIsLoading(true);

    // Add timeout to prevent infinite waiting
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: userId,
          context: conversationContext,
          sentiment: sentimentAnalysis
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const jarvisMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'ms-jarvis',
        timestamp: new Date(),
        consultation: data.consultation,
        culturalEnhancement: data.culturalEnhancement,
        locationUsed: data.locationUsed,
        personalityBalance: data.personalityBalance
      };

      setMessages(prev => [...prev, jarvisMessage]);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Ms. Jarvis consultation error:', error);

      let errorMessage;

      if (error.name === 'AbortError') {
        errorMessage = {
          id: Date.now() + 1,
          text: "Well, shucks! I'm taking a bit longer than usual to consult with my AI specialists, honey child. This happens sometimes when I'm doing deep thinking about complex matters. Could you try asking me again, darlin'? I promise I'll be quicker next time!",
          sender: 'ms-jarvis',
          timestamp: new Date(),
          isError: true
        };
      } else {
        errorMessage = {
          id: Date.now() + 1,
          text: sentimentAnalysis.needsSupport
            ? "Oh honey, I can see you might be going through something difficult right now, and I'm having a little technical trouble too. Please know that I'm here for you, darlin', and you're stronger than these mountains! Try asking me again in a moment, and remember - you're not alone."
            : sentimentAnalysis.isUrgent
            ? "Well, shucks! I know this is urgent for you, sugar, and I'm having a little technical hiccup right now. Don't you worry - try asking me again in just a moment and I'll be right here to help you quickly!"
            : "Well, shucks! I'm having a little trouble right now, honey child. Could you try asking me again in just a moment? I'll be right here waiting for you, darlin'!",
          sender: 'ms-jarvis',
          timestamp: new Date(),
          isError: true
        };
      }

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSpecialistBadges = (consultation) => {
    if (!consultation?.specialists) return null;

    const specialistColors = {
      'creative': '#e91e63',
      'technical': '#2196f3',
      'spiritual': '#9c27b0',
      'financial': '#4caf50',
      'community': '#ff6b35',
      'education': '#ff9800',
      'health': '#8bc34a',
      'welcome': '#ff6b35'
    };

    return consultation.specialists.map(specialist => (
      <span
        key={specialist}
        style={{
          display: 'inline-block',
          padding: '0.3rem 0.6rem',
          margin: '0.2rem',
          backgroundColor: specialistColors[specialist] || '#6c757d',
          color: 'white',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '600',
          textTransform: 'capitalize',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        {specialist}
      </span>
    ));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                         radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none'
      }} />

      {/* Main Container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.2)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.9) 0%, rgba(255,107,53,0.7) 100%)',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(255,107,53,0.6), 0 0 60px rgba(255,107,53,0.3)'
          }}>
            <img
              src="/ms_jarvis_image1.jpg"
              alt="Ms. Jarvis"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '2rem',
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🏔️
            </div>
            <div className="pulse-animation" style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '20px',
              height: '20px',
              background: userMood === 'positive' ? '#22c55e' : userMood === 'negative' ? '#f59e0b' : '#22c55e',
              border: '3px solid white',
              borderRadius: '50%'
            }} />
          </div>
          <div>
            <h1 style={{
              margin: '0',
              fontSize: '2rem',
              fontWeight: '300',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Ms. Jarvis
            </h1>
            <p style={{
              margin: '0.3rem 0 0 0',
              fontSize: '1rem',
              fontWeight: '400',
              color: '#7f8c8d',
              fontStyle: 'italic'
            }}>
              Your Enhanced AI Assistant from Mount Hope, WV
            </p>
          </div>
        </div>

        {/* Mood Indicator */}
        {conversationContext.conversationHistory.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            fontSize: '1.5rem',
            opacity: 0.7
          }}>
            {userMood === 'positive' ? '😊' : userMood === 'negative' ? '🤗' : '😌'}
          </div>
        )}

        {/* Messages Container */}
        <div style={{
          height: '500px',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          zIndex: 5
        }}>
          {messages.map(message => (
            <div key={message.id} className="message-slide-in" style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '1.2rem 1.5rem',
                borderRadius: message.sender === 'user' ? '25px 25px 8px 25px' : '25px 25px 25px 8px',
                background: message.sender === 'user'
                  ? message.sentiment?.sentiment === 'negative'
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : message.sentiment?.sentiment === 'positive'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: message.sender === 'user' ? 'white' : '#2c3e50',
                boxShadow: message.sender === 'user'
                  ? '0 8px 25px rgba(102,126,234,0.3)'
                  : '0 8px 25px rgba(0,0,0,0.15)',
                border: message.sender === 'ms-jarvis' ? '2px solid rgba(255,107,53,0.2)' : 'none',
                position: 'relative'
              }}>
                {message.sender === 'ms-jarvis' && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '15px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(255,107,53,0.4)'
                  }}>
                    <img
                      src="/ms_jarvis_image1.jpg"
                      alt="Ms. Jarvis"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}

                <div style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  fontSize: '1rem',
                  fontWeight: message.sender === 'user' ? '400' : '500'
                }}>
                  {message.text}
                </div>

                {/* Cultural Enhancement Indicators */}
                {message.culturalEnhancement && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.7rem',
                    color: '#7f8c8d',
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    {message.culturalEnhancement === 'aapcappe-integrated-balanced' && (
                      <span style={{
                        background: '#e91e63',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.6rem'
                      }}>
                        WVU Research-Backed
                      </span>
                    )}
                    {message.locationUsed && (
                      <span style={{
                        background: '#4caf50',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.6rem'
                      }}>
                        Mount Hope Context
                      </span>
                    )}
                    {message.personalityBalance === 'adaptive' && (
                      <span style={{
                        background: '#9c27b0',
                        color: 'white',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        fontSize: '0.6rem'
                      }}>
                        Natural Character
                      </span>
                    )}
                  </div>
                )}

                {/* Sentiment Indicator for User Messages */}
                {message.sender === 'user' && message.sentiment && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.7rem',
                    color: message.sentiment.sentiment === 'positive' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    {message.sentiment.sentiment === 'positive' && <span>😊 Positive</span>}
                    {message.sentiment.sentiment === 'negative' && <span>🤗 Needs Support</span>}
                    {message.sentiment.isQuestion && <span>❓ Question</span>}
                    {message.sentiment.isUrgent && <span>⚡ Urgent</span>}
                  </div>
                )}

                {/* Specialist Badges */}
                {message.consultation && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      {getSpecialistBadges(message.consultation)}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: '#7f8c8d'
                    }}>
                      <span>Confidence: {message.consultation.confidence}</span>
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                )}

                <div style={{
                  fontSize: '0.75rem',
                  color: message.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#95a5a6',
                  marginTop: '0.5rem',
                  textAlign: 'right'
                }}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Animation */}
          {isLoading && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                maxWidth: '75%',
                padding: '1.2rem 1.5rem',
                borderRadius: '25px 25px 25px 8px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                backdropFilter: 'blur(20px)',
                color: '#2c3e50',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                border: '2px solid rgba(255,107,53,0.2)',
                position: 'relative'
              }}>
                <div className="pulse-loading" style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(255,107,53,0.4)'
                }}>
                  <img
                    src="/ms_jarvis_image1.jpg"
                    alt="Ms. Jarvis"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{
                  color: '#7f8c8d',
                  fontStyle: 'italic',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>Ms. Jarvis is consulting with her enhanced AI specialists</span>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <div className="bounce-dot" style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ff6b35'
                    }} />
                    <div className="bounce-dot-delay-1" style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ff6b35'
                    }} />
                    <div className="bounce-dot-delay-2" style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ff6b35'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '1.5rem 2rem 2rem',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                id="ms-jarvis-message-input"
                name="message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Ms. Jarvis anything - creative ideas, technical help, spiritual guidance, financial advice, community support, education, or wellness..."
                disabled={isLoading}
                rows="2"
                autoComplete="off"
                style={{
                  width: '100%',
                  padding: '1rem 1.2rem',
                  border: '2px solid rgba(255,107,53,0.3)',
                  borderRadius: '15px',
                  resize: 'none',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: !inputMessage.trim() || isLoading
                  ? 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: !inputMessage.trim() || isLoading
                  ? '0 4px 15px rgba(0,0,0,0.1)'
                  : '0 6px 20px rgba(102,126,234,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isLoading ? '🤔' : '💬'}
            </button>
          </div>

          {/* Enhanced Quick Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { icon: '💻', text: 'Technical Help', prompt: "I need help with a technical challenge" },
              { icon: '🎨', text: 'Creative Ideas', prompt: "I'd like some creative inspiration" },
              { icon: '💰', text: 'Financial Advice', prompt: "I have questions about financial planning" },
              { icon: '🙏', text: 'Spiritual Guidance', prompt: "I'm seeking some spiritual wisdom" },
              { icon: '🏔️', text: 'Community Support', prompt: "I need help with a community matter" },
              { icon: '📚', text: 'Learning Help', prompt: "I want to learn something new" },
              { icon: '🌿', text: 'Wellness Tips', prompt: "I'm interested in health and wellness advice" }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.prompt)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, rgba(255,107,53,0.8) 0%, rgba(255,107,53,0.6) 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(255,107,53,0.3)'
                }}
              >
                <span>{action.icon}</span>
                <span>{action.text}</span>
              </button>
            ))}
          </div>

          {/* Conversation Context Indicator */}
          {conversationContext.conversationHistory.length > 0 && (
            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#7f8c8d',
              fontStyle: 'italic'
            }}>
              💬 {conversationContext.conversationHistory.length} messages • Ms. Jarvis remembers your conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MsJarvisChat;
