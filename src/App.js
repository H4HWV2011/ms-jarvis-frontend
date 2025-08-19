import React from 'react';
import './App.css';
import TruthVerifiedChat from './components/TruthVerifiedChat.jsx';

function App() {
  return (
    <div className="App">
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <TruthVerifiedChat 
            apiUrl="https://cb7e75ba9152.ngrok-free.app/api/chat/public"
            gatewayUrl={process.env.REACT_APP_AI_GATEWAY_URL || 'http://localhost:3001'}
          />
          
          {/* Community Info Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(255,255,255,0.8)',
            borderRadius: '15px',
            fontSize: '14px',
            color: '#666'
          }}>
            <strong>🏔️ Serving Appalachian Communities</strong><br />
            Mount Hope, Fayette County & Oakvale, Mercer County, West Virginia<br />
            Protected by MountainShares AI Gateway Truth Layer<br />
            <em>Preserving culture while ensuring accuracy</em>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
