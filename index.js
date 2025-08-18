const express = require('express');
const app = express();

// Change this to your actual frontend domain!
const FRONTEND_URL = "https://ai.mountainshares.us";

// --- Global CORS Middleware ---
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // For CORS preflight
  }
  next();
});

app.use(express.json());

// --- Health Endpoint (must be above any wildcard or 404) ---
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// --- Your existing routes, for example: ---
app.post('/chat-with-mountainshares-brain', async (req, res) => {
  // Your AI logic goes here (or call your AI microservice, etc)
  res.json({ reply: "Hello from Ms. Jarvis Brain!" });
});

// --- Express listen ---
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
