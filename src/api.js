import React, { useState } from 'react';

export default function MsJarvisChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  async function sendMessage(e) {
    e.preventDefault();
    setError(null);
    if (!input.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch('https://api.mountainshares.us/api/chat/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setMessages(msgs => [
        ...msgs,
        { from: 'user', text: input },
        { from: 'jarvis', text: data.response }
      ]);
      setInput('');
    } catch (err) {
      setError('Error contacting Ms. Jarvis. Please try again.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div style={{maxWidth: 500, margin: '2em auto', padding: 16, border: '1px solid #aaa', borderRadius: 8}}>
      <h2>Ms. Jarvis Chat</h2>
      <div style={{minHeight: 160, marginBottom: 16, background: '#f9f9fc', padding: 8, borderRadius: 4}}>
        {messages.map((m, i) =>
          <div key={i} style={{margin: '4px 0', textAlign: m.from === 'user' ? 'right' : 'left'}}>
            <b>{m.from === 'user' ? 'You' : 'Ms. Jarvis'}:</b> {m.text}
          </div>
        )}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          disabled={isSending}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{width: '75%', padding: 8, borderRadius: 4}}
        />
        <button type="submit" disabled={isSending || !input.trim()} style={{padding: 8, marginLeft: 8}}>Send</button>
      </form>
      {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
    </div>
  );
}
