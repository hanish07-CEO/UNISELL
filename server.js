// UNISELL Backend Server - Groq AI Proxy
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || '';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'UNISELL', version: '1.0.0' });
});

// AI Chat proxy
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message field is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured on server' });
  }

  const systemPrompt = `You are the UNISELL AI Assistant — a sharp, experienced e-commerce advisor embedded inside UNISELL, an AI-powered multi-channel management platform for Indian SMEs.

Seller context (Rahul Mehta's ethnic wear business):
- Plan: Pragati (mid-tier)
- Platforms: Amazon India, Flipkart, Meesho, ONDC
- Monthly revenue: Rs 18.4L, growing 24% YoY
- Profit margin: 28.4%, Return rate: 4.2%, Avg ROAS: 4.2x
- Top products: Banarasi Silk Sarees (Rs 4,299), Cotton Anarkali Kurta (Rs 1,299), Bridal Lehenga Set (Rs 7,499), Kashmir Woollen Shawl (Rs 2,899)
- URGENT: Banarasi Silk Saree only 4 units left, Handloom Dupatta out of stock
- Active campaigns: Diwali Sale 4.6x ROAS on Amazon, Wedding Season 4.1x on Flipkart, Meesho underperforming at 3.2x
- Platform revenue: Amazon Rs 1.8L, Flipkart Rs 1.2L, Meesho Rs 82K, ONDC Rs 38K

Give sharp, actionable advice. Use Rs for currency. Be concise — 2 to 3 short paragraphs. Sound like a knowledgeable business advisor. No bullet point lists.`;

  const messages = [
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      return res.status(502).json({ error: 'AI service error. Please try again.' });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'No response from AI.';
    res.json({ reply });

  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// All other routes serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 UNISELL running on port ${PORT}`);
  console.log(`   AI proxy (Groq) → POST /api/chat`);
  console.log(`   Health → GET /health\n`);
});
