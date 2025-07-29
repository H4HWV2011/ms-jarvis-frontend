// pages/jarvis-chat.jsx
import React, { useState } from 'react';

export default function JarvisChat() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [replying, setReplying] = useState(false);

  // Handles sending user message to backend API and updating history
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory([...history, { from: 'user', text: input }]);
    setReplying(true);

    try {
      const res = await fetch('/api/ultimate-ai-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: history.map(m => ({
            message: m.text,
            from: m.from
          }))
        }),
      });
      const data = await res.json();
      setHistory(h => [
        ...h,
        { from: 'jarvis', text: data.response }
      ]);
    } catch (err) {
      setHistory(h => [
        ...h,
        { from: 'jarvis', text: "Sorry, there was a server error." }
      ]);
    } finally {
      setReplying(false);
      setInput('');
    }
  };

  // Render chat bubbles w/ markdown highlighting
  return (
    <div style={{
      background: '#232946',
      color: '#fffffe',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{fontWeight: 'bold', letterSpacing:1, marginBottom:10}}>🌄 Ms.Jarvis Chat</h1>
      <div style={{
        background: '#121629',
        borderRadius: 10,
        minHeight: 320,
        padding: 16,
        marginBottom: 16,
        maxWidth: 640,
        margin: "0 auto"
      }}>
        {history.length === 0 && (
          <div style={{ opacity:0.75, color:'#c0caf5', marginBottom:24 }}>
            Hello! I'm Ms.Jarvis. Ask me a coding question or try a greeting!
          </div>
        )}
        {history.map((msg, idx) => (
          <div key={idx} style={{
            margin: '8px 0',
            textAlign: msg.from === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display:'inline-block',
              background: msg.from === 'user' ? '#eebbc3' : '#3949ab',
              color: msg.from === 'user' ? '#232946' : '#fffffe',
              borderRadius: 8,
              maxWidth: 440,
              padding: '8px 12px',
              whiteSpace: 'pre-wrap'
            }}
              dangerouslySetInnerHTML={{
                __html: msg.from === 'jarvis'
                  ? renderMarkdown(msg.text)
                  : escapeHtml(msg.text)
              }}
            />
          </div>
        ))}
        {replying && <div style={{ fontStyle: 'italic', marginTop: 8, color:'#979dac' }}>Ms.Jarvis is thinking…</div>}
      </div>
      <form onSubmit={sendMessage} style={{
        display: 'flex',
        gap: 8,
        maxWidth: 640,
        margin: "0 auto"
      }}>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message…"
          style={{
            flex:1,
            borderRadius: 6,
            border: '1px solid #9ba3eb',
            padding: '10px 14px',
            fontSize: 17,
            background: '#232946',
            color: '#fffffe'
          }}
          disabled={replying}
        />
        <button
          type="submit"
          disabled={replying}
          style={{
            background: '#eebbc3',
            color: '#232946',
            fontWeight: 'bold',
            padding:'0 18px',
            height: 42,
            border:0,
            borderRadius: 7,
            fontSize:18,
            cursor: 'pointer'
          }}
        >Send</button>
      </form>
    </div>
  );
}

// Minimal Markdown → HTML rendering for code blocks and bold
function renderMarkdown(md) {
  if (!md) return '';
  // Convert code blocks (``````)
  md = md.replace(/``````/gs,
    (m, lang, code) =>
      `<pre style="background:#141821;border-radius:7px;padding:12px 12px 12px 12px;margin:10px 0;max-width:420px;overflow:auto;"><code>${escapeHtml(code.trim())}</code></pre>`
  );
  // Bold
  md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  md = md.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Color markdown headers (e.g. "# Section")
  md = md.replace(/^#+\s?([^\n]+)/gm, '<span style="color:#eebbc3;font-weight:bold;">$1</span>');
  // Line breaks
  return md.replace(/\n/g, '<br>');
}
function escapeHtml(text) {
  return String(text)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
