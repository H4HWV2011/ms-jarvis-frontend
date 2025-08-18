const express = require('express');
const app = express();

// --- Production CORS for Vercel Frontend ---
const FRONTEND_URL = "https://ms-jarvis-frontend-lok5t396a-ms-jarvis.vercel.app";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // for preflight
  }
  next();
});

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.post('/chat-with-mountainshares-brain', async (req, res) => {
  // AI logic here
  res.json({ message: 'Chat endpoint works!' });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
