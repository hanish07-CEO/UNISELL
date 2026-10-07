import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPACT_STORE_CONTEXT = `You are UNISELL AI Assistant for Rahul Mehta's Indian ethnic wear store (Pragati Plan).
Store stats: Monthly Revenue ₹4.28L (+18.4% MoM), 347 orders today, 1,284 listings across Amazon India (₹1.8L, 43%, 4.4x ROAS), Flipkart (₹1.2L, 29%, +22%, 4.1x ROAS), Meesho (₹82K, 19%, -3%, 3.2x ROAS), ONDC (₹38K, 9%, +41%, 2.8x ROAS).
SKUs: Banarasi Silk Saree SAR-BNR-001 (₹4,299, 4 left LOW STOCK), Handloom Chanderi Dupatta DUP-CHA-004 (₹1,299, 0 left OUT OF STOCK, 12 pending orders), Bridal Lehenga Choli Set LEH-BRI-005 (₹7,499, 18 left), Cotton Anarkali Kurta KUR-ANK-002 (₹1,299, 142 in stock), Woollen Shawl SHA-KSH-006 (₹2,899, 6 left).
Reply concisely (under 110 words) with Indian Rupees (₹) and actionable bullets.`;

function generateSmartFallback(message: string, storeContext?: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('lehenga') || lower.includes('margin') || lower.includes('profit')) {
    return `💎 **Profit Margin Strategy — Bridal Lehenga Choli Set (LEH-BRI-005, ₹7,499):**\n\n1. **Channel Mix Shift:** Move 30% of Bridal Lehenga ad spend from marketplace search to **ONDC & Direct Storefront** (saves **14%–18% marketplace commission**, boosting net margin by **~₹1,120 per unit**).\n2. **Bridal Combo Upsell:** Bundle *Bridal Lehenga (₹7,499)* + *Kundan Bridal Necklace (₹2,499)* at **₹9,299** on Amazon & Flipkart — increases Average Order Value (AOV) by **24%** while sharing a single ₹140 logistics fee.\n3. **Pre-Season Inventory Lock:** You have **18 units** in stock with +40% wedding demand predicted. Reorder **+20 units** now to lock in pre-surge weaver rates.`;
  }

  if (lower.includes('mapping') && lower.includes('agent')) {
    return `🗺️ **AI Mapping Agent 2.0 Status — Active**\n\n• **Catalog Coverage:** 1,284 active listings synced across Amazon India, Flipkart, Meesho & ONDC.\n• **Recent Optimization:** Auto-generated regional Hindi & Tamil search keywords for *Banarasi Silk Saree (SAR-BNR-001)* and *Bridal Lehenga Set (LEH-BRI-005)*, lifting organic impressions by **+28%**.\n• **HSN & GST Compliance:** 100% of SKUs verified under HSN 5007 / 6204 (5% & 12% GST slabs).\n\nClick **"+ New Listing"** anytime to auto-map a new product across all 4 marketplaces in one click!`;
  }

  if (
    lower.includes('customer') &&
    (lower.includes('agent') || lower.includes('ai') || lower.includes('support'))
  ) {
    return `🤖 **Multilingual Customer AI — Live Today**\n\n• **Queries Resolved Today:** 142 buyer messages across Hindi, Tamil, Marathi, Telugu & English.\n• **Avg Response Time:** 1.8 seconds (↓ 80% support cost reduction).\n• **Return Prevention:** Converted 19 size-exchange requests on Flipkart & Meesho into replacement orders, saving **₹31,400** in GMV today.`;
  }

  if (lower.includes('best') && lower.includes('platform')) {
    return `📊 **Amazon India** is your highest-revenue platform this month at **₹1.8L** (43% of total sales, ↑14% MoM) with a strong **4.4x ROAS**.\n\nHowever, **ONDC** is your fastest-growing channel (**↑41% MoM** at ₹38K) with lower commission fees, and **Flipkart** is surging at **↑22% MoM** (₹1.2L).\n\n**Recommendation:** Keep scaling Amazon sponsored brand ads for Sarees & Lehengas while syncing your full Cotton Kurta catalog to ONDC.`;
  }

  if (
    lower.includes('restock') ||
    lower.includes('dupatt') ||
    lower.includes('banarasi') ||
    lower.includes('stock') ||
    lower.includes('reorder') ||
    lower.includes('inventory')
  ) {
    return `📦 **Urgent Restock Priorities:**\n\n1. **Handloom Chanderi Dupatta (DUP-CHA-004):** Currently **0 units** with 12 pending orders on Amazon & ONDC. Trigger an express reorder of **+40 units** immediately to avoid seller penalty points.\n2. **Banarasi Silk Saree (SAR-BNR-001):** Only **4 units** left! With festive demand projected to spike **3x in 14 days**, reorder **+50 units** now (estimated revenue unlock: ₹2.14L).\n3. **Woollen Shawl (SHA-KSH-006):** 6 units left — reorder **+25 units** ahead of winter demand.`;
  }

  if (lower.includes('meesho')) {
    return `📈 **How to Boost Your Meesho Sales (Currently ₹82K, ↓3%):**\n\n1. **Price-Point Bundling:** Meesho buyers convert best between **₹399–₹899**. Bundle your Ethnic Tops & Dupattas at ₹749 with zero-shipping pricing.\n2. **Switch Ad Creatives:** Your *Budget Ethnic Wear* campaign is at **3.2x ROAS**. Replace static catalog photos with 15-sec vertical drape videos to lift CTR by ~35%.\n3. **Next-Day Dispatch Tag:** Enable NDD on Cotton Anarkali Kurtas (142 units ready) to win the Meesho Smart Coin visibility boost.`;
  }

  if (lower.includes('flipkart') || lower.includes('big billion')) {
    return `🚀 **Flipkart Performance & Big Billion Prep (₹1.2L/mo, ↑22%):**\n\n• **Orders Today:** 104 orders at **4.1x ROAS** on *Wedding Season Push*.\n• **Top Seller:** *Cotton Anarkali Kurta Set (₹1,299)* and *Bridal Lehenga Set (₹7,499)*.\n• **Action Plan:** Opt into Flipkart Assured for your top 5 SKUs and allocate **₹15K** to Sponsored Display ads 10 days before Big Billion Days for 30% lower CPC.`;
  }

  if (lower.includes('amazon')) {
    return `🏆 **Amazon India Performance (₹1.8L/mo, 43% Share, ↑14%):**\n\n• **Orders Today:** 148 orders · **Ad Spend:** ₹28K at **4.4x ROAS**.\n• **Star Campaign:** *Diwali Sale 2025* is generating ₹82K from ₹18K spend (**4.6x ROAS**).\n• **Next Step:** Restock *Banarasi Silk Saree (SAR-BNR-001)* (only 4 units left) so you don't lose the Amazon Buy Box!`;
  }

  if (lower.includes('ondc')) {
    return `🌐 **ONDC Network Growth (₹38K/mo, ↑41% MoM):**\n\n• **Fastest Growing Channel:** ONDC orders rose **41%** this month with only 3% network fee vs 18–22% marketplace commission.\n• **Recommendation:** Push your full *Kolhapuri Mojari (₹999)* and *Pooja Thali (₹1,450)* catalog to ONDC buyer apps (Paytm, Magicpin, Mystore) with a 5% direct-buyer discount.`;
  }

  if (
    lower.includes('campaign') ||
    lower.includes('diwali') ||
    lower.includes('wedding') ||
    lower.includes('roas') ||
    lower.includes('ad')
  ) {
    return `📣 **Recommended Campaign Strategy (Blended 4.2x ROAS):**\n\n1. **Scale Diwali Sale 2025 (Amazon):** Running at a stellar **4.6x ROAS** (₹18K → ₹82K). Increase budget by **+₹8K** on high-converting keywords (*"pure banarasi silk saree wedding"*); projected incremental return is **+₹37K**.\n2. **Wedding Season Bridal Push (Flipkart + Amazon):** Allocate **₹15K** targeting Tier-1 & Tier-2 cities for *Bridal Lehenga Choli Set (₹7,499)*.\n3. **Pause Low-ROAS Sets:** Keep *New Year Clearance (2.2x)* paused and reallocate ₹5K to Meta Reels retargeting (3.8x ROAS).`;
  }

  if (
    lower.includes('add') ||
    lower.includes('list') ||
    lower.includes('kurti') ||
    lower.includes('product') ||
    lower.includes('optimize') ||
    lower.includes('title') ||
    lower.includes('seo')
  ) {
    return `⚡ **AI Mapping Agent 2.0 Ready!**\n\nTo auto-list and optimize your product across **Amazon, Flipkart, Meesho & ONDC**:\n• **Optimized Title:** *Handcrafted Rajasthani Mirror Work Cotton Kurti for Women — Festive & Ethnic Wear*\n• **Suggested Pricing:** ₹1,599 on Amazon/Flipkart · ₹1,399 on Meesho/ONDC\n• **Auto-Mapped HSN:** 6204 (5% GST slab)\n\nClick **"+ New Listing"** in the top bar and use **"✨ AI Auto-Optimize SEO & HSN"** to publish live to all 4 marketplaces!`;
  }

  if (lower.includes('hindi') || lower.includes('namaste') || lower.includes('kaise')) {
    return `नमस्ते राहुल जी! 🙏 **UNISELL AI** आपकी सेवा में तैयार है:\n\n• **कुल मासिक बिक्री (Revenue):** ₹4.28 लाख (पिछले महीने से ↑18.4% अधिक)\n• **आज के ऑर्डर:** 347 ऑर्डर (Amazon: 148, Flipkart: 104, Meesho: 68, ONDC: 27)\n• **तुरंत ध्यान दें:** *Handloom Chanderi Dupatta* का स्टॉक समाप्त (0) हो गया है और *Banarasi Silk Saree* के केवल 4 पीस बचे हैं। कृपया तुरंत री-ऑर्डर करें!`;
  }

  const contextLine = storeContext ? `\n• **Live Catalog Snapshot:** ${storeContext}` : '';
  return `Namaste Rahul! 🙏 Here is my **UNISELL AI** analysis for **"${message.slice(0, 65)}"**:\n\n• **Revenue & Velocity:** ₹4.28L this month (↑18.4% MoM) across **347 orders today** — led by Amazon India (₹1.8L, 4.4x ROAS) and Flipkart (₹1.2L, ↑22%).${contextLine}\n• **Immediate Action:** Reorder **+40 units** of *Handloom Chanderi Dupatta* (0 stock, 12 pending orders) and **+50 units** of *Banarasi Silk Saree* (4 units left).\n• **Profit Tip:** Shift +₹8K ad budget to Amazon *Diwali Sale 2025* (4.6x ROAS) for an estimated **+₹36.8K** incremental return.`;
}

async function callGeminiWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Gemini call timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', app: 'UNISELL React + TypeScript' });
  });

  app.post('/api/chat', async (req, res) => {
    const { message, history = [], storeContext } = req.body || {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    // 1. Primary: Google Gemini API
    if (geminiKey && geminiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const recentTurns = Array.isArray(history)
          ? history
              .slice(-4)
              .map(
                (h: { role?: string; content?: string }) =>
                  `${h.role || 'user'}: ${h.content || ''}`
              )
              .join('\n')
          : '';

        const compactPrompt = `${COMPACT_STORE_CONTEXT}\n${
          storeContext ? `Live state: ${storeContext}\n` : ''
        }${recentTurns ? `Recent chat:\n${recentTurns}\n` : ''}Seller question: ${message}`;

        const response = await callGeminiWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: compactPrompt,
          }),
          6500
        );

        const replyText = response.text?.trim();
        if (replyText) {
          res.json({ reply: replyText, source: 'gemini' });
          return;
        }
      } catch (error) {
        console.warn(
          'Gemini API busy or timed out, checking secondary/fallback:',
          (error as Error)?.message
        );
      }
    }

    // 2. Secondary (for Render deployments with GROQ_API_KEY configured)
    if (groqKey) {
      try {
        const groqRes = await callGeminiWithTimeout(
          fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              max_tokens: 450,
              messages: [
                { role: 'system', content: COMPACT_STORE_CONTEXT },
                ...(Array.isArray(history) ? history.slice(-6) : []),
                { role: 'user', content: message },
              ],
            }),
          }),
          6000
        );
        const groqData = (await groqRes.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const groqReply = groqData?.choices?.[0]?.message?.content?.trim();
        if (groqReply) {
          res.json({ reply: groqReply, source: 'groq' });
          return;
        }
      } catch (err) {
        console.warn('Groq API fallback error:', (err as Error)?.message);
      }
    }

    // 3. Instant Store Intelligence Engine Fallback
    res.json({ reply: generateSmartFallback(message, storeContext), source: 'fallback' });
  });

  app.post('/api/ai-optimize-listing', async (req, res) => {
    const { title = '', category = 'Ethnic Wear', price = '1599' } = req.body || {};
    const cleanTitle = String(title).trim() || 'Handcrafted Ethnic Wear';
    const basePrice = Math.max(99, parseInt(String(price), 10) || 1599);

    const fallbackResult = {
      optimizedTitle: `${cleanTitle} — Authentic Indian ${category} (Festive & Wedding Collection)`,
      sku: `UNI-${String(category).slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      recommendedPrice: basePrice,
      meeshoPrice: Math.max(99, Math.round(basePrice * 0.88)),
      hsnCode: category === 'Sarees' ? '5007' : '6204',
      gstSlab: basePrice > 1000 ? '12% GST' : '5% GST',
      highlights: [
        `Amazon & Flipkart SEO title mapped with high-converting ${category.toLowerCase()} keywords`,
        `Meesho zero-commission price point recommended at ₹${Math.max(99, Math.round(basePrice * 0.88))}`,
        `ONDC network catalog schema & HSN ${category === 'Sarees' ? '5007' : '6204'} verified`,
      ],
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.json(fallbackResult);
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await callGeminiWithTimeout(
        ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: `Generate an optimized Indian e-commerce marketplace title (under 90 chars) for product "${cleanTitle}" in category "${category}" priced at ₹${basePrice}. Return ONLY the optimized title text, nothing else.`,
        }),
        3800
      );

      const aiTitle = response.text?.trim().replace(/^["']|["']$/g, '');
      res.json({
        ...fallbackResult,
        optimizedTitle: aiTitle && aiTitle.length > 8 ? aiTitle : fallbackResult.optimizedTitle,
      });
    } catch {
      res.json(fallbackResult);
    }
  });

  const distPath = path.join(__dirname, 'dist');
  const useProdStatic =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.RENDER) ||
    (Boolean(process.argv[1]?.endsWith('server.js')) &&
      fs.existsSync(path.join(distPath, 'index.html')));

  if (!useProdStatic) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UNISELL Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
