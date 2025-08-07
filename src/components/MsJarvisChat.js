import React, { useState, useEffect, useRef } from 'react';

const MsJarvisChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(`user-${Date.now()}`);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.REACT_APP_MS_JARVIS_API_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{
      id: 1,
      text: "Well, hey there, shugah! I'm Ms. Jarvis from Mount Hope, WV. I'm here to help you with anything you need - whether it's creative ideas, technical solutions, spiritual guidance, or financial planning. What can I do for you today, darlin'?",
      sender: 'ms-jarvis',
      timestamp: new Date(),
      consultation: { specialists: ['welcome'], confidence: 'high' }
    }]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: userId
        })
      });

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
        sources: data.sources
      };

      setMessages(prev => [...prev, jarvisMessage]);
    } catch (error) {
      console.error('Ms. Jarvis consultation error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Well, shucks! I'm having a little trouble right now, honey child. Could you try asking me again in just a moment?",
        sender: 'ms-jarvis',
        timestamp: new Date(),
        isError: true
      };
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
      'welcome': '#ff6b35'
    };

    return consultation.specialists.map(specialist => (
      <span 
        key={specialist}
        style={{ 
          display: 'inline-block',
          padding: '0.3rem 0.6rem',
          margin: '0.2rem',
          borderRadius: '20px',
          color: 'white',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'capitalize',
          backgroundColor: specialistColors[specialist] || '#666',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {specialist === 'welcome' ? '🏔️ Welcome' : `${specialist} specialist`}
      </span>
    ));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Beautiful Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Elegant Header with Real Ms. Jarvis Photo */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: '#2c3e50',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        borderBottom: '2px solid rgba(255,255,255,0.3)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '4px solid #ff6b35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 0 30px rgba(255,107,53,0.6), 0 0 60px rgba(255,107,53,0.3)'
          }}>
            <img 
              src="/ms_jarvis_image1.jpg" 
              alt="Ms. Jarvis" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: '50%'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              borderRadius: '50%'
            }}>
              🏔️
            </div>
            {/* Online Status Dot */}
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '20px',
              height: '20px',
              background: '#22c55e',
              border: '3px solid white',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
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
              Your AI Assistant from Mount Hope, WV
            </p>
          </div>
        </div>
        
        {/* Decorative Hearts */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '20px',
          fontSize: '1.2rem',
          opacity: 0.6
        }}>
          💖
        </div>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '20px',
          fontSize: '1rem',
          opacity: 0.4
        }}>
          💝
        </div>
      </div>

      {/* Beautiful Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem 1.5rem',
        background: 'transparent',
        position: 'relative',
        zIndex: 5
      }}>
        {messages.map(message => (
          <div key={message.id} style={{
            display: 'flex',
            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '1.5rem',
            animation: 'messageSlideIn 0.3s ease-out'
          }}>
            <div style={{
              maxWidth: '75%',
              padding: '1.2rem 1.5rem',
              borderRadius: message.sender === 'user' ? '25px 25px 8px 25px' : '25px 25px 25px 8px',
              background: message.sender === 'user' 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
              {/* Message Avatar for Ms. Jarvis with Real Photo */}
              {message.sender === 'ms-jarvis' && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '2px solid #ff6b35',
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
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderRadius: '50%'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    borderRadius: '50%'
                  }}>
                    👩‍💼
                  </div>
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
              
              {/* Beautiful Specialist Badges */}
              {message.consultation && (
                <div style={{
                  marginTop: '0.8rem',
                  paddingTop: '0.8rem',
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
                    <span>✨ Confidence: <strong>{message.consultation.confidence}</strong></span>
                    {message.consultation.processingTime && (
                      <span>⚡ {message.consultation.processingTime}ms</span>
                    )}
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
        
        {/* Beautiful Loading Animation with Real Photo */}
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
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              border: '2px solid rgba(255,107,53,0.2)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #ff6b35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                animation: 'pulse 1.5s ease-in-out infinite',
                boxShadow: '0 4px 15px rgba(255,107,53,0.4)'
              }}>
                <img 
                  src="/ms_jarvis_image1.jpg" 
                  alt="Ms. Jarvis" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  borderRadius: '50%'
                }}>
                  👩‍💼
                </div>
              </div>
              <div style={{ 
                color: '#7f8c8d', 
                fontStyle: 'italic',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>Ms. Jarvis is consulting with her AI specialists</span>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ff6b35',
                    animation: 'bounce 1.4s ease-in-out infinite'
                  }} />
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ff6b35',
                    animation: 'bounce 1.4s ease-in-out 0.2s infinite'
                  }} />
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ff6b35',
                    animation: 'bounce 1.4s ease-in-out 0.4s infinite'
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Beautiful Input Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '1.5rem 2rem',
        borderTop: '2px solid rgba(255,255,255,0.3)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
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
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Ms. Jarvis anything - creative ideas, technical help, spiritual guidance, or financial advice..."
              disabled={isLoading}
              rows="2"
              style={{
                width: '100%',
                padding: '1rem 1.2rem',
                border: '2px solid rgba(102,126,234,0.3)',
                borderRadius: '25px',
                resize: 'none',
                fontFamily: 'inherit',
                fontSize: '1rem',
                background: 'rgba(255,255,255,0.9)',
                color: '#2c3e50',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(102,126,234,0.3)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
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
            onMouseEnter={(e) => {
              if (!(!inputMessage.trim() || isLoading)) {
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isLoading ? '🤔' : '💬'}
          </button>
        </div>
        
        {/* Beautiful Quick Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { icon: '💻', text: 'Code Request', prompt: "Write a Solidity smart contract for MountainShares employee payroll" },
            { icon: '🎨', text: 'Creative Help', prompt: "Provide creative ideas for Heritage NFT marketplace" },
            { icon: '💰', text: 'Financial Analysis', prompt: "Analyze the financial sustainability of our community project" },
            { icon: '🕊️', text: 'Spiritual Guidance', prompt: "Guide me with Appalachian values for community decision-making" }
          ].map((action, index) => (
            <button 
              key={index}
              onClick={() => setInputMessage(action.prompt)}
              style={{
                padding: '0.6rem 1rem',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)',
                border: '2px solid rgba(102,126,234,0.3)',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: '#2c3e50',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)';
                e.target.style.color = '#2c3e50';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <span>{action.icon}</span>
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default MsJarvisChat;
