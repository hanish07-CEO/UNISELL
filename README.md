# UNISELL — AI-Powered E-Commerce Command Center

> "List Once, Sell Everywhere" — a unified command center concept for Indian SMEs
> selling across Amazon, Flipkart, Meesho, and ONDC, with a Claude-powered AI assistant.

🔗 **Live Demo:** https://unisell-mghz.onrender.com/

## 📖 The Problem

Small Indian sellers running stores across multiple marketplaces have to jump between
separate dashboards for each platform to track revenue, inventory, and campaigns.
UNISELL is designed to bring that into one place, with an AI assistant that can answer
natural-language questions about the business instead of digging through spreadsheets.

## ✅ Currently Working

- Landing page / product pitch (live at the link above)
- Claude-powered AI chat assistant with demo store context
- Multi-turn conversation memory (last 10 messages)
- Secure backend API proxy — key never exposed to the browser

## 🎯 Product Vision (designed, not yet built)

The landing page previews the full planned feature set:
- Unified dashboard across Amazon, Flipkart, Meesho, and ONDC
- One-upload AI product listing across all platforms
- Predictive inventory optimizer
- Automated ad campaign management
- 9-language multilingual customer support

## 🖼️ Screenshot

<img width="1918" height="927" alt="image" src="https://github.com/user-attachments/assets/f514d57b-0a6a-4e5a-ab1b-da5bd209e140" />


---

## 🚀 Quick Start (Local)

### 1. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set up your API key
\`\`\`bash
cp .env.example .env
\`\`\`
Open `.env` and add your Anthropic API key:
\`\`\`
ANTHROPIC_API_KEY=sk-ant-your-key-here
\`\`\`
Get your key at → https://console.anthropic.com

### 3. Run the server
\`\`\`bash
npm start
\`\`\`
Open **http://localhost:3000** in your browser. ✅

---

## 📁 Project Structure

\`\`\`
unisell/
├── server.js          ← Express backend + AI proxy
├── package.json
├── .env.example       ← Copy to .env and add your API key
├── .gitignore
└── public/
    └── index.html     ← Landing page + dashboard frontend
\`\`\`

---

## 🔒 How the API Proxy Works

The AI chat **never** exposes your Anthropic API key to the browser.

\`\`\`
Browser  →  POST /api/chat  →  server.js  →  Anthropic API
                                  ↑
                          API key lives here
                          (in .env on server)
\`\`\`

---

## ☁️ Deployment

Currently deployed on **Render** (free tier) at the live demo link above.

<details>
<summary>Deploy your own copy</summary>

**Render:**
1. Push to GitHub
2. Go to https://render.com → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add env var: `ANTHROPIC_API_KEY=your-key`

**Railway:**
1. Go to https://railway.app → New Project → Deploy from GitHub
2. Add environment variable: `ANTHROPIC_API_KEY=your-key`
</details>

## 📦 Tech Stack

| Layer    | Tech                                       |
| -------- | ------------------------------------------ |
| Backend  | Node.js + Express                          |
| AI       | Anthropic Claude API                       |
| Frontend | Vanilla HTML/CSS/JS                        |
| Hosting  | Render                                     |
| Fonts    | Google Fonts (Cormorant Garamond, DM Sans) |

## 🛡️ Security Notes

- ✅ API key never sent to browser
- ✅ `.env` is in `.gitignore`
- ⚠️ Add rate limiting for production (e.g. `express-rate-limit`)
- ⚠️ Add authentication before handling real user data

## 🗺️ Roadmap

- [ ] Real Amazon/Flipkart/Meesho OAuth integration
- [ ] Actual inventory sync (currently demo data)
- [ ] User authentication
- [ ] Rate limiting

---

Built with ❤️ by Hanish
