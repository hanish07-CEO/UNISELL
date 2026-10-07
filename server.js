// server.ts
import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var COMPACT_STORE_CONTEXT = `You are UNISELL AI Assistant for Rahul Mehta's Indian ethnic wear store (Pragati Plan).
Store stats: Monthly Revenue \u20B94.28L (+18.4% MoM), 347 orders today, 1,284 listings across Amazon India (\u20B91.8L, 43%, 4.4x ROAS), Flipkart (\u20B91.2L, 29%, +22%, 4.1x ROAS), Meesho (\u20B982K, 19%, -3%, 3.2x ROAS), ONDC (\u20B938K, 9%, +41%, 2.8x ROAS).
SKUs: Banarasi Silk Saree SAR-BNR-001 (\u20B94,299, 4 left LOW STOCK), Handloom Chanderi Dupatta DUP-CHA-004 (\u20B91,299, 0 left OUT OF STOCK, 12 pending orders), Bridal Lehenga Choli Set LEH-BRI-005 (\u20B97,499, 18 left), Cotton Anarkali Kurta KUR-ANK-002 (\u20B91,299, 142 in stock), Woollen Shawl SHA-KSH-006 (\u20B92,899, 6 left).
Reply concisely (under 110 words) with Indian Rupees (\u20B9) and actionable bullets.`;
function generateSmartFallback(message, storeContext) {
  const lower = message.toLowerCase();
  if (lower.includes("lehenga") || lower.includes("margin") || lower.includes("profit")) {
    return `\u{1F48E} **Profit Margin Strategy \u2014 Bridal Lehenga Choli Set (LEH-BRI-005, \u20B97,499):**

1. **Channel Mix Shift:** Move 30% of Bridal Lehenga ad spend from marketplace search to **ONDC & Direct Storefront** (saves **14%\u201318% marketplace commission**, boosting net margin by **~\u20B91,120 per unit**).
2. **Bridal Combo Upsell:** Bundle *Bridal Lehenga (\u20B97,499)* + *Kundan Bridal Necklace (\u20B92,499)* at **\u20B99,299** on Amazon & Flipkart \u2014 increases Average Order Value (AOV) by **24%** while sharing a single \u20B9140 logistics fee.
3. **Pre-Season Inventory Lock:** You have **18 units** in stock with +40% wedding demand predicted. Reorder **+20 units** now to lock in pre-surge weaver rates.`;
  }
  if (lower.includes("mapping") && lower.includes("agent")) {
    return `\u{1F5FA}\uFE0F **AI Mapping Agent 2.0 Status \u2014 Active**

\u2022 **Catalog Coverage:** 1,284 active listings synced across Amazon India, Flipkart, Meesho & ONDC.
\u2022 **Recent Optimization:** Auto-generated regional Hindi & Tamil search keywords for *Banarasi Silk Saree (SAR-BNR-001)* and *Bridal Lehenga Set (LEH-BRI-005)*, lifting organic impressions by **+28%**.
\u2022 **HSN & GST Compliance:** 100% of SKUs verified under HSN 5007 / 6204 (5% & 12% GST slabs).

Click **"+ New Listing"** anytime to auto-map a new product across all 4 marketplaces in one click!`;
  }
  if (lower.includes("customer") && (lower.includes("agent") || lower.includes("ai") || lower.includes("support"))) {
    return `\u{1F916} **Multilingual Customer AI \u2014 Live Today**

\u2022 **Queries Resolved Today:** 142 buyer messages across Hindi, Tamil, Marathi, Telugu & English.
\u2022 **Avg Response Time:** 1.8 seconds (\u2193 80% support cost reduction).
\u2022 **Return Prevention:** Converted 19 size-exchange requests on Flipkart & Meesho into replacement orders, saving **\u20B931,400** in GMV today.`;
  }
  if (lower.includes("best") && lower.includes("platform")) {
    return `\u{1F4CA} **Amazon India** is your highest-revenue platform this month at **\u20B91.8L** (43% of total sales, \u219114% MoM) with a strong **4.4x ROAS**.

However, **ONDC** is your fastest-growing channel (**\u219141% MoM** at \u20B938K) with lower commission fees, and **Flipkart** is surging at **\u219122% MoM** (\u20B91.2L).

**Recommendation:** Keep scaling Amazon sponsored brand ads for Sarees & Lehengas while syncing your full Cotton Kurta catalog to ONDC.`;
  }
  if (lower.includes("restock") || lower.includes("dupatt") || lower.includes("banarasi") || lower.includes("stock") || lower.includes("reorder") || lower.includes("inventory")) {
    return `\u{1F4E6} **Urgent Restock Priorities:**

1. **Handloom Chanderi Dupatta (DUP-CHA-004):** Currently **0 units** with 12 pending orders on Amazon & ONDC. Trigger an express reorder of **+40 units** immediately to avoid seller penalty points.
2. **Banarasi Silk Saree (SAR-BNR-001):** Only **4 units** left! With festive demand projected to spike **3x in 14 days**, reorder **+50 units** now (estimated revenue unlock: \u20B92.14L).
3. **Woollen Shawl (SHA-KSH-006):** 6 units left \u2014 reorder **+25 units** ahead of winter demand.`;
  }
  if (lower.includes("meesho")) {
    return `\u{1F4C8} **How to Boost Your Meesho Sales (Currently \u20B982K, \u21933%):**

1. **Price-Point Bundling:** Meesho buyers convert best between **\u20B9399\u2013\u20B9899**. Bundle your Ethnic Tops & Dupattas at \u20B9749 with zero-shipping pricing.
2. **Switch Ad Creatives:** Your *Budget Ethnic Wear* campaign is at **3.2x ROAS**. Replace static catalog photos with 15-sec vertical drape videos to lift CTR by ~35%.
3. **Next-Day Dispatch Tag:** Enable NDD on Cotton Anarkali Kurtas (142 units ready) to win the Meesho Smart Coin visibility boost.`;
  }
  if (lower.includes("flipkart") || lower.includes("big billion")) {
    return `\u{1F680} **Flipkart Performance & Big Billion Prep (\u20B91.2L/mo, \u219122%):**

\u2022 **Orders Today:** 104 orders at **4.1x ROAS** on *Wedding Season Push*.
\u2022 **Top Seller:** *Cotton Anarkali Kurta Set (\u20B91,299)* and *Bridal Lehenga Set (\u20B97,499)*.
\u2022 **Action Plan:** Opt into Flipkart Assured for your top 5 SKUs and allocate **\u20B915K** to Sponsored Display ads 10 days before Big Billion Days for 30% lower CPC.`;
  }
  if (lower.includes("amazon")) {
    return `\u{1F3C6} **Amazon India Performance (\u20B91.8L/mo, 43% Share, \u219114%):**

\u2022 **Orders Today:** 148 orders \xB7 **Ad Spend:** \u20B928K at **4.4x ROAS**.
\u2022 **Star Campaign:** *Diwali Sale 2025* is generating \u20B982K from \u20B918K spend (**4.6x ROAS**).
\u2022 **Next Step:** Restock *Banarasi Silk Saree (SAR-BNR-001)* (only 4 units left) so you don't lose the Amazon Buy Box!`;
  }
  if (lower.includes("ondc")) {
    return `\u{1F310} **ONDC Network Growth (\u20B938K/mo, \u219141% MoM):**

\u2022 **Fastest Growing Channel:** ONDC orders rose **41%** this month with only 3% network fee vs 18\u201322% marketplace commission.
\u2022 **Recommendation:** Push your full *Kolhapuri Mojari (\u20B9999)* and *Pooja Thali (\u20B91,450)* catalog to ONDC buyer apps (Paytm, Magicpin, Mystore) with a 5% direct-buyer discount.`;
  }
  if (lower.includes("campaign") || lower.includes("diwali") || lower.includes("wedding") || lower.includes("roas") || lower.includes("ad")) {
    return `\u{1F4E3} **Recommended Campaign Strategy (Blended 4.2x ROAS):**

1. **Scale Diwali Sale 2025 (Amazon):** Running at a stellar **4.6x ROAS** (\u20B918K \u2192 \u20B982K). Increase budget by **+\u20B98K** on high-converting keywords (*"pure banarasi silk saree wedding"*); projected incremental return is **+\u20B937K**.
2. **Wedding Season Bridal Push (Flipkart + Amazon):** Allocate **\u20B915K** targeting Tier-1 & Tier-2 cities for *Bridal Lehenga Choli Set (\u20B97,499)*.
3. **Pause Low-ROAS Sets:** Keep *New Year Clearance (2.2x)* paused and reallocate \u20B95K to Meta Reels retargeting (3.8x ROAS).`;
  }
  if (lower.includes("add") || lower.includes("list") || lower.includes("kurti") || lower.includes("product") || lower.includes("optimize") || lower.includes("title") || lower.includes("seo")) {
    return `\u26A1 **AI Mapping Agent 2.0 Ready!**

To auto-list and optimize your product across **Amazon, Flipkart, Meesho & ONDC**:
\u2022 **Optimized Title:** *Handcrafted Rajasthani Mirror Work Cotton Kurti for Women \u2014 Festive & Ethnic Wear*
\u2022 **Suggested Pricing:** \u20B91,599 on Amazon/Flipkart \xB7 \u20B91,399 on Meesho/ONDC
\u2022 **Auto-Mapped HSN:** 6204 (5% GST slab)

Click **"+ New Listing"** in the top bar and use **"\u2728 AI Auto-Optimize SEO & HSN"** to publish live to all 4 marketplaces!`;
  }
  if (lower.includes("hindi") || lower.includes("namaste") || lower.includes("kaise")) {
    return `\u0928\u092E\u0938\u094D\u0924\u0947 \u0930\u093E\u0939\u0941\u0932 \u091C\u0940! \u{1F64F} **UNISELL AI** \u0906\u092A\u0915\u0940 \u0938\u0947\u0935\u093E \u092E\u0947\u0902 \u0924\u0948\u092F\u093E\u0930 \u0939\u0948:

\u2022 **\u0915\u0941\u0932 \u092E\u093E\u0938\u093F\u0915 \u092C\u093F\u0915\u094D\u0930\u0940 (Revenue):** \u20B94.28 \u0932\u093E\u0916 (\u092A\u093F\u091B\u0932\u0947 \u092E\u0939\u0940\u0928\u0947 \u0938\u0947 \u219118.4% \u0905\u0927\u093F\u0915)
\u2022 **\u0906\u091C \u0915\u0947 \u0911\u0930\u094D\u0921\u0930:** 347 \u0911\u0930\u094D\u0921\u0930 (Amazon: 148, Flipkart: 104, Meesho: 68, ONDC: 27)
\u2022 **\u0924\u0941\u0930\u0902\u0924 \u0927\u094D\u092F\u093E\u0928 \u0926\u0947\u0902:** *Handloom Chanderi Dupatta* \u0915\u093E \u0938\u094D\u091F\u0949\u0915 \u0938\u092E\u093E\u092A\u094D\u0924 (0) \u0939\u094B \u0917\u092F\u093E \u0939\u0948 \u0914\u0930 *Banarasi Silk Saree* \u0915\u0947 \u0915\u0947\u0935\u0932 4 \u092A\u0940\u0938 \u092C\u091A\u0947 \u0939\u0948\u0902\u0964 \u0915\u0943\u092A\u092F\u093E \u0924\u0941\u0930\u0902\u0924 \u0930\u0940-\u0911\u0930\u094D\u0921\u0930 \u0915\u0930\u0947\u0902!`;
  }
  const contextLine = storeContext ? `
\u2022 **Live Catalog Snapshot:** ${storeContext}` : "";
  return `Namaste Rahul! \u{1F64F} Here is my **UNISELL AI** analysis for **"${message.slice(0, 65)}"**:

\u2022 **Revenue & Velocity:** \u20B94.28L this month (\u219118.4% MoM) across **347 orders today** \u2014 led by Amazon India (\u20B91.8L, 4.4x ROAS) and Flipkart (\u20B91.2L, \u219122%).${contextLine}
\u2022 **Immediate Action:** Reorder **+40 units** of *Handloom Chanderi Dupatta* (0 stock, 12 pending orders) and **+50 units** of *Banarasi Silk Saree* (4 units left).
\u2022 **Profit Tip:** Shift +\u20B98K ad budget to Amazon *Diwali Sale 2025* (4.6x ROAS) for an estimated **+\u20B936.8K** incremental return.`;
}
async function callGeminiWithTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Gemini call timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    promise.then((res) => {
      clearTimeout(timer);
      resolve(res);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  app.use(express.json());
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", app: "UNISELL React + TypeScript" });
  });
  app.post("/api/chat", async (req, res) => {
    const { message, history = [], storeContext } = req.body || {};
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    if (geminiKey && geminiKey !== "MY_GEMINI_API_KEY") {
      try {
        const ai = new GoogleGenAI({
          apiKey: geminiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build"
            }
          }
        });
        const recentTurns = Array.isArray(history) ? history.slice(-4).map(
          (h) => `${h.role || "user"}: ${h.content || ""}`
        ).join("\n") : "";
        const compactPrompt = `${COMPACT_STORE_CONTEXT}
${storeContext ? `Live state: ${storeContext}
` : ""}${recentTurns ? `Recent chat:
${recentTurns}
` : ""}Seller question: ${message}`;
        const response = await callGeminiWithTimeout(
          ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: compactPrompt
          }),
          6500
        );
        const replyText = response.text?.trim();
        if (replyText) {
          res.json({ reply: replyText, source: "gemini" });
          return;
        }
      } catch (error) {
        console.warn(
          "Gemini API busy or timed out, checking secondary/fallback:",
          error?.message
        );
      }
    }
    if (groqKey) {
      try {
        const groqRes = await callGeminiWithTimeout(
          fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              max_tokens: 450,
              messages: [
                { role: "system", content: COMPACT_STORE_CONTEXT },
                ...Array.isArray(history) ? history.slice(-6) : [],
                { role: "user", content: message }
              ]
            })
          }),
          6e3
        );
        const groqData = await groqRes.json();
        const groqReply = groqData?.choices?.[0]?.message?.content?.trim();
        if (groqReply) {
          res.json({ reply: groqReply, source: "groq" });
          return;
        }
      } catch (err) {
        console.warn("Groq API fallback error:", err?.message);
      }
    }
    res.json({ reply: generateSmartFallback(message, storeContext), source: "fallback" });
  });
  app.post("/api/ai-optimize-listing", async (req, res) => {
    const { title = "", category = "Ethnic Wear", price = "1599" } = req.body || {};
    const cleanTitle = String(title).trim() || "Handcrafted Ethnic Wear";
    const basePrice = Math.max(99, parseInt(String(price), 10) || 1599);
    const fallbackResult = {
      optimizedTitle: `${cleanTitle} \u2014 Authentic Indian ${category} (Festive & Wedding Collection)`,
      sku: `UNI-${String(category).slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      recommendedPrice: basePrice,
      meeshoPrice: Math.max(99, Math.round(basePrice * 0.88)),
      hsnCode: category === "Sarees" ? "5007" : "6204",
      gstSlab: basePrice > 1e3 ? "12% GST" : "5% GST",
      highlights: [
        `Amazon & Flipkart SEO title mapped with high-converting ${category.toLowerCase()} keywords`,
        `Meesho zero-commission price point recommended at \u20B9${Math.max(99, Math.round(basePrice * 0.88))}`,
        `ONDC network catalog schema & HSN ${category === "Sarees" ? "5007" : "6204"} verified`
      ]
    };
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      res.json(fallbackResult);
      return;
    }
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const response = await callGeminiWithTimeout(
        ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: `Generate an optimized Indian e-commerce marketplace title (under 90 chars) for product "${cleanTitle}" in category "${category}" priced at \u20B9${basePrice}. Return ONLY the optimized title text, nothing else.`
        }),
        3800
      );
      const aiTitle = response.text?.trim().replace(/^["']|["']$/g, "");
      res.json({
        ...fallbackResult,
        optimizedTitle: aiTitle && aiTitle.length > 8 ? aiTitle : fallbackResult.optimizedTitle
      });
    } catch {
      res.json(fallbackResult);
    }
  });
  const distPath = path.join(__dirname, "dist");
  const useProdStatic = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER) || Boolean(process.argv[1]?.endsWith("server.js")) && fs.existsSync(path.join(distPath, "index.html"));
  if (!useProdStatic) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`UNISELL Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
