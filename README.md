# UNISELL — AI-Powered E-Commerce Command Center (React + TypeScript)

> **"List Once, Sell Everywhere"** — An AI-powered multi-channel e-commerce command center for 63M Indian MSMEs selling across **Amazon India, Flipkart, Meesho, and ONDC**, built with **React 19, TypeScript, Tailwind CSS, Express, and Google Gemini AI**.

🔗 **Live Demo:** https://unisell-mghz.onrender.com/

---

## ✨ What's Included

### 1. Enhanced Landing Page (with Magic UI Startup Template Features)
- **Interactive Magnetic Particle Canvas (`MagneticParticlesCanvas`):** Full-viewport HTML5 `<canvas>` particle field that magnetically reacts to cursor movement.
- **Shimmer Kicker & Metallic Gradient Hero:** Animated shimmer badge (`Introducing UNISELL AI 2.0 — List Once, Sell Everywhere`), orbiting gold rings, and live metrics (`90% Time Saved`, `5 AI Agents`, `₹345B Market by 2030`, `9 Indian Languages`).
- **3D Perspective Hero Showcase (`BorderBeam` + `ImageGlow`):** Interactive `[perspective:2000px]` Command Center preview with an animated perimeter `BorderBeam`, radial `ImageGlow`, and live tab switching (`Live Overview`, `AI Listing Sync`, `Inventory Radar`).
- **Trusted Ecosystem & Curved `SphereMask` Horizon Arc:** Ecosystem showcase (`Amazon India`, `Flipkart`, `Meesho`, `ONDC Network`, `Shiprocket`, `Razorpay`) paired with a curved planetary horizon glow divider.
- **Interactive 4-Tier Pricing (`Uday`, `Pragati`, `Udyog`, `Samrat`):** Monthly / Annual billing toggle (`2 MONTHS FREE ✨`), animated price transitions, and interactive `Subscribe` loading state.
- **5-Row Animated Marquee Tile Matrix CTA (`MarqueeTileMatrixCTA`):** Five rows of glowing glassmorphic icon tiles scrolling in reverse marquee behind a frosted-glass CTA overlay.
- **Floating UNISELL AI Assistant:** Available directly on both the Landing Page and the Command Center Dashboard.

### 2. Split-Screen Authentication (`AuthPage.tsx`)
- **Sign In & Create Account Tabs** with real-time validation, 4-segment password strength meter, forgot-password flow, and 1-click **Explore Demo Dashboard** access.

### 3. 5-Screen AI Command Center (`DashboardPage.tsx`)
- **Overview:** KPI cards, interactive SVG Revenue Trend (`7D`, `30D`, `90D`), Platform Breakdown Doughnut, Recent Orders, and AI Agent Alerts.
- **Product Listing (`AI Mapping Agent 2.0`):** Searchable/filterable product grid, `+ New Listing` modal with **`✨ AI Auto-Optimize SEO & HSN`** (`/api/ai-optimize-listing`), and instant multi-marketplace publishing.
- **Inventory Optimizer:** Live stock health bars, 1-click restock actions (`+40 Urgent`, `+50 Reorder`), AI Demand Forecasts, and Stock Movement chart.
- **Analytics & Insights:** Multi-Platform Sales Bar Chart (`Monthly`, `Quarterly`, `Yearly`), Sales by Category Doughnut, and Top Performing Products.
- **AI Campaign Manager:** Active Campaigns table with live AI optimization toggles, `+ New Campaign` modal, AI Campaign Suggestions, ROAS Trend, and Ad Spend breakdown.

---

## 🚀 Quick Start (Local Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
Add your `GEMINI_API_KEY` (or `GROQ_API_KEY`) to `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Full-Stack Development Server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## ☁️ Deploying to Render (`https://unisell-mghz.onrender.com/`)

1. Push or sync this repository to **https://github.com/hanish07-CEO/UNISELL**
2. In your **Render Web Service** settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `NODE_ENV=production npm start`
   - **Environment Variables:** Set `GEMINI_API_KEY` (or `GROQ_API_KEY`)

---

## 📁 Project Structure

```text
UNISELL/
├── server.ts                                 # Express backend + Gemini/Groq AI API routes (/api/chat, /api/ai-optimize-listing)
├── index.html                                # Entry HTML with PWA manifest & Google Fonts
├── package.json                              # Full-stack scripts & dependencies
├── public/
│   ├── manifest.json                         # PWA Web App Manifest
│   ├── sw.js                                 # Offline-capable Service Worker
│   └── icons/                                # App icons (32px to 512px)
└── src/
    ├── App.tsx                               # View router & persistent state
    ├── index.css                             # UNISELL dark navy/gold theme & animations
    ├── types.ts                              # TypeScript interfaces
    ├── data/initialData.ts                   # Seed catalog, orders, campaigns & chart series
    └── components/
        ├── LandingPage.tsx                   # Landing page with Magic UI Startup Template features
        ├── StartupTemplateFeatures.tsx       # MagneticParticlesCanvas, BorderBeam, SphereMask, MarqueeTileMatrixCTA
        ├── FloatingAIAssistant.tsx           # Floating AI chat widget & markdown formatter
        ├── AuthPage.tsx                      # Split-screen Sign In / Create Account flow
        ├── DashboardPage.tsx                 # 5-screen Command Center Dashboard
        ├── Charts.tsx                        # Interactive custom SVG charts
        ├── EngagementEffects.tsx             # Scroll progress, cursor sparkles, Anti-Gravity mode & PWA hook
        └── OfflinePage.tsx                   # Offline fallback view
```

---

Built with ❤️ by **Hanish**
