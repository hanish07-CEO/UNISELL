require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured on server' });
  const system = 'You are the UNISELL AI Assistant for an Indian ethnic wear e-commerce store. Give sharp business advice about inventory, campaigns, listings and growth. Use Rs for currency. Keep responses to 2-3 short paragraphs.';
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: 500, messages: [{ role: 'system', content: system }, ...history.slice(-6), { role: 'user', content: message }] })
    });
    const data = await r.json();
    res.json({ reply: data?.choices?.[0]?.message?.content || 'No response.' });
  } catch (e) {
    res.status(500).json({ error: 'Server error: ' + e.message });
  }
});

app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/offline.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'offline.html')));

app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => console.log('UNISELL running on port ' + PORT));
