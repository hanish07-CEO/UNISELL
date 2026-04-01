require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
// ── Using Groq (free) instead of Anthropic ──

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── HEALTH CHECK ──
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'UNISELL AI Backend', version: '1.0.0' });
});

// ── AI PROXY ENDPOINT ──
// This keeps your ANTHROPIC_API_KEY secret on the server — never exposed to the browser
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message field is required' });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured on server' });
  }

  const systemPrompt = `You are the UNISELL AI Assistant — a sharp, experienced e-commerce advisor embedded inside UNISELL, an AI-powered multi-channel management platform for Indian SMEs.

Seller context (Rahul Mehta's ethnic wear business):
- Plan: Pragati (mid-tier)
- Platforms: Amazon India, Flipkart, Meesho, ONDC
- Monthly revenue: ₹18.4L, growing 24% YoY
- Profit margin: 28.4%, Return rate: 4.2%, Avg ROAS: 4.2x
- Top products: Banarasi Silk Sarees (₹4,299), Cotton Anarkali Kurta (₹1,299), Bridal Lehenga Set (₹7,499), Kashmir Woollen Shawl (₹2,899), Ethnic Printed Tops (₹449)
- URGENT: Banarasi Silk Saree — only 4 units left (festive season approaching), Handloom Dupatta — out of stock, 12 pending orders
- Active campaigns: Diwali Sale 4.6x ROAS on Amazon, Wedding Season Push 4.1x on Flipkart, Meesho Budget Ethnic Wear underperforming at 3.2x
- Platform revenue: Amazon ₹1.8L (↑14%), Flipkart ₹1.2L (↑22%), Meesho ₹82K (↓3%), ONDC ₹38K (↑41%)
- Active listings: 1,284 across all platforms

Your role: Provide sharp, actionable, data-driven advice on inventory management, ad campaigns, product listings, pricing, and sales growth. Use ₹ for all currency. Be concise and direct — 2–3 short paragraphs max. Sound like a knowledgeable business advisor familiar with Indian e-commerce, not a generic chatbot. No bullet point lists — use flowing prose.`;

  // Build messages array (support multi-turn conversation history)
  const messages = [
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
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
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── CATCH-ALL → serve frontend ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 UNISELL backend running on http://localhost:${PORT}`);
  console.log(`   AI proxy (Groq) → POST /api/chat`);
  console.log(`   Health          → GET  /health\n`);
});
