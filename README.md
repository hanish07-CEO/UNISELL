# UNISELL — AI-Powered E-Commerce Command Center

> "List Once, Sell Everywhere" — Multi-channel e-commerce management for Indian SMEs

---

## 🚀 Quick Start (Local)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your API key
```bash
cp .env.example .env
```
Open `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
Get your key at → https://console.anthropic.com

### 3. Run the server
```bash
npm start
```

Open **http://localhost:3000** in your browser. ✅

---

## 📁 Project Structure

```
unisell/
├── server.js          ← Express backend + AI proxy
├── package.json
├── .env.example       ← Copy to .env and add your API key
├── .gitignore
└── public/
    └── index.html     ← Full dashboard frontend
```

---

## 🔒 How the API Proxy Works

The AI chat **never** exposes your Anthropic API key to the browser.

```
Browser  →  POST /api/chat  →  server.js  →  Anthropic API
                                  ↑
                          API key lives here
                          (in .env on server)
```

The frontend sends messages to `/api/chat` on your own server. The server adds the API key and forwards to Anthropic. Safe. ✅

---

## ☁️ Deploy to Production

### Option A — Railway (Easiest, free tier)
1. Push this folder to a GitHub repo
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add environment variable: `ANTHROPIC_API_KEY=your-key`
4. Railway auto-detects Node.js and deploys. Done!

### Option B — Render (Free tier)
1. Push to GitHub
2. Go to https://render.com → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add env var: `ANTHROPIC_API_KEY=your-key`
6. Deploy!

### Option C — Heroku
```bash
heroku create unisell-app
heroku config:set ANTHROPIC_API_KEY=your-key
git push heroku main
```

### Option D — VPS / DigitalOcean
```bash
# On your server:
git clone your-repo
cd unisell
npm install
cp .env.example .env
nano .env  # add your API key

# Run with PM2 (keeps alive on reboot)
npm install -g pm2
pm2 start server.js --name unisell
pm2 startup
pm2 save
```

Then point your domain's DNS to the server IP and use Nginx as a reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🤖 AI Features

The AI assistant is powered by **Claude (claude-sonnet-4-20250514)** and has full context about:
- Rahul Mehta's ethnic wear store data
- Revenue, inventory, campaign performance
- Platform-specific advice (Amazon, Flipkart, Meesho, ONDC)
- Multi-turn conversation memory (last 10 messages)

### Customising the AI context
Edit the `systemPrompt` in `server.js` to match your actual store data.

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js + Express |
| AI | Anthropic Claude API |
| Frontend | Vanilla HTML/CSS/JS |
| Charts | Chart.js |
| Fonts | Google Fonts (Cormorant Garamond, DM Sans) |

---

## 🛡️ Security Notes

- ✅ API key never sent to browser
- ✅ `.env` is in `.gitignore` — never commit it
- ✅ Add rate limiting for production (e.g. `express-rate-limit`)
- ✅ Add authentication before going live with real data

---

Built with ❤️ for UNISELL · Brandathon 2025
