import { useRef, useState } from "react";

export default function JarvisChat() {
  const [chat, setChat] = useState([
    {
      msjarvis:
        "Hello! I'm Ms.Jarvis, your warm, trustworthy coding assistant from the mountains. How can I help you today?",
    },
  ]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  async function sendMessage(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    
    const history = chat.filter(x => x.user).map(x => ({ message: x.user }));
    const newChat = [...chat, { user: msg }];
    setChat(newChat);
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/ultimate-ai-bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      setChat([...newChat, { msjarvis: data.response }]);
    } catch (err) {
      setChat([...newChat, { msjarvis: "Sorry, I'm having trouble connecting right now. Please try again!" }]);
    }
    setLoading(false);
    setTimeout(() => {
      if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #f4e4d6 0%, #e8d5c4 50%, #dcc5a8 100%)",
      minHeight: "100vh",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: "20px 10px"
    }}>
      <div style={{ 
        maxWidth: 600, 
        margin: "0 auto", 
        background: "rgba(255, 255, 255, 0.95)", 
        borderRadius: 20, 
        boxShadow: "0 10px 30px rgba(101, 67, 33, 0.2)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #8B4513, #A0522D)",
          color: "white",
          padding: "20px",
          textAlign: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 15 }}>
            <span style={{ fontSize: 28 }}>🏔️</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>Ms.Jarvis</h1>
              <p style={{ margin: "5px 0 0 0", fontSize: 14, opacity: 0.9 }}>
                Your nurturing AI assistant from the Appalachian Mountains
              </p>
            </div>
            <span style={{ fontSize: 28 }}>🤎</span>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{
          height: "400px",
          overflowY: "auto",
          padding: "20px",
          background: "linear-gradient(to bottom, #faf7f2, #f5f0e8)"
        }}>
          {chat.map((turn, i) =>
            turn.user ? (
              <div key={i} style={{ textAlign: "right", margin: "15px 0" }}>
                <div style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #d4a574, #c49660)",
                  color: "white",
                  padding: "12px 18px",
                  borderRadius: "20px 20px 5px 20px",
                  maxWidth: "70%",
                  fontWeight: "500",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                  {turn.user}
                </div>
              </div>
            ) : (
              <div key={i} style={{ textAlign: "left", margin: "15px 0" }}>
                <div style={{
                  display: "inline-block",
                  background: "white",
                  color: "#5d4037",
                  border: "2px solid #d7ccc8",
                  padding: "15px 20px",
                  borderRadius: "20px 20px 20px 5px",
                  maxWidth: "80%",
                  boxShadow: "0 3px 12px rgba(93, 64, 55, 0.1)",
                  lineHeight: "1.5"
                }}>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {String(turn.msjarvis)
                      .replace(/\\n/g, "\n")
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .split('\n')
                      .map((line, j) => (
                        <div key={j} dangerouslySetInnerHTML={{ __html: line || "<br/>" }} />
                      ))}
                  </div>
                </div>
              </div>
            )
          )}
          {loading && (
            <div style={{ textAlign: "left", margin: "15px 0" }}>
              <div style={{
                display: "inline-block",
                background: "white",
                color: "#8d6e63",
                border: "2px solid #d7ccc8",
                padding: "15px 20px",
                borderRadius: "20px 20px 20px 5px",
                fontStyle: "italic"
              }}>
                Ms.Jarvis is thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          padding: "20px", 
          background: "linear-gradient(135deg, #efebe6, #e8ddd4)",
          borderTop: "1px solid #d7ccc8"
        }}>
          <form onSubmit={sendMessage} style={{ display: "flex", gap: 12 }}>
            <input
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="Ask Ms.Jarvis anything... code help, explanations, or just chat!"
              style={{
                flex: 1,
                padding: "15px 18px",
                border: "2px solid #bcaaa4",
                borderRadius: 15,
                fontSize: 16,
                outline: "none",
                background: "white",
                color: "#5d4037"
              }}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !msg.trim()}
              style={{
                background: loading || !msg.trim() 
                  ? "#bcaaa4" 
                  : "linear-gradient(135deg, #8B4513, #A0522D)",
                color: "white",
                border: "none",
                borderRadius: 15,
                padding: "15px 25px",
                fontSize: 16,
                fontWeight: "bold",
                cursor: loading || !msg.trim() ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          padding: "15px",
          color: "#8d6e63",
          fontSize: 13,
          background: "rgba(139, 69, 19, 0.05)"
        }}>
          <span style={{ fontSize: 16 }}>🏞️ 💚</span>
          <span style={{ marginLeft: 8 }}>
            Powered by Appalachian wisdom • Secure & trustworthy AI
          </span>
        </div>
      </div>
    </div>
  );
}
