import React, { useState, useRef, useEffect } from 'react';
import {
  PageView,
  DashboardScreen,
  ProductItem,
  OrderItem,
  AlertItem,
  CampaignItem,
  ChatMessage,
  UserProfile,
  PlatformCode,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_ALERTS,
  INITIAL_FORECASTS,
  INITIAL_CAMPAIGNS,
} from '../data/initialData';
import {
  RevenueLineChart,
  PlatformDoughnutChart,
  StockMovementBarChart,
  PlatformSalesBarChart,
  CategoryDoughnutChart,
  CampaignPerformanceChart,
  RoasTrendChart,
} from './Charts';
import { renderFormattedAIText } from './FloatingAIAssistant';

interface DashboardPageProps {
  initialScreen?: DashboardScreen;
  user: UserProfile;
  onNavigate: (page: PageView) => void;
  onLogout: () => void;
}

const PLATFORM_BADGE_STYLE: Record<PlatformCode, { bg: string; color: string; name: string }> = {
  A: { bg: '#ff9900', color: '#000000', name: 'Amazon India' },
  F: { bg: '#2874f0', color: '#ffffff', name: 'Flipkart' },
  M: { bg: '#e94560', color: '#ffffff', name: 'Meesho' },
  O: { bg: '#3ecf8e', color: '#000000', name: 'ONDC' },
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  initialScreen = 'overview',
  user,
  onNavigate,
  onLogout,
}) => {
  const [activeScreen, setActiveScreen] = useState<DashboardScreen>(initialScreen);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Persistent state for products, campaigns, orders, alerts
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('unisell_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [campaigns, setCampaigns] = useState<CampaignItem[]>(() => {
    try {
      const saved = localStorage.getItem('unisell_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  const [orders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);

  useEffect(() => {
    try {
      localStorage.setItem('unisell_products', JSON.stringify(products));
    } catch {
      // ignore storage errors
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('unisell_campaigns', JSON.stringify(campaigns));
    } catch {
      // ignore storage errors
    }
  }, [campaigns]);

  // Period filters for charts
  const [revPeriod, setRevPeriod] = useState<'7D' | '30D' | '90D'>('7D');
  const [salesPeriod, setSalesPeriod] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');

  // Search & Product Filter
  const [globalSearch, setGlobalSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'live' | 'draft' | 'low'>('all');

  // Modals & Popovers
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<ProductItem | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPlatformInfo, setSelectedPlatformInfo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('1599');
  const [newProdStock, setNewProdStock] = useState('45');
  const [newProdCategory, setNewProdCategory] = useState('Kurtas');
  const [newProdEmoji, setNewProdEmoji] = useState('👘');
  const [newProdPlatforms, setNewProdPlatforms] = useState<PlatformCode[]>(['A', 'F', 'M', 'O']);
  const [aiListingLoading, setAiListingLoading] = useState(false);
  const [aiListingMeta, setAiListingMeta] = useState<{
    hsnCode: string;
    gstSlab: string;
    meeshoPrice: number;
    highlights: string[];
  } | null>(null);

  // New Campaign form state
  const [newCampName, setNewCampName] = useState('');
  const [newCampCats, setNewCampCats] = useState('Sarees · Ethnic Wear');
  const [newCampPlatform, setNewCampPlatform] = useState<'Amazon' | 'Flipkart' | 'Meesho' | 'ONDC' | 'Meta Ads'>('Amazon');
  const [newCampSpend, setNewCampSpend] = useState('15');

  // AI Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBusy, setChatBusy] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'ai',
      text: "Namaste! 🙏 I'm your **UNISELL AI**. Ask me anything about inventory, campaigns, listings, or growth for your store.",
      time: 'Just now',
    },
  ]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const chatAbortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, chatBusy, chatOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const getTimeStr = () =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const handleOptimizeListingWithAI = async () => {
    if (aiListingLoading) return;
    setAiListingLoading(true);
    try {
      const res = await fetch('/api/ai-optimize-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProdName || 'Rajasthani Mirror Work Kurti',
          category: newProdCategory,
          price: newProdPrice,
        }),
      });
      const data = await res.json();
      if (data.optimizedTitle) {
        setNewProdName(data.optimizedTitle);
      }
      if (data.sku) {
        setNewProdSku(data.sku);
      }
      setAiListingMeta({
        hsnCode: data.hsnCode || '6204',
        gstSlab: data.gstSlab || '5% GST',
        meeshoPrice: data.meeshoPrice || 1399,
        highlights: data.highlights || [],
      });
      showToast('✨ AI Mapping Agent 2.0 generated SEO title, SKU & HSN!');
    } catch {
      showToast('✨ AI Mapping Agent applied recommended category defaults');
    } finally {
      setAiListingLoading(false);
    }
  };

  const sendChatMessage = async (textOverride?: string) => {
    const text = (textOverride !== undefined ? textOverride : chatInput).trim();
    if (!text) return;

    if (chatAbortRef.current) {
      chatAbortRef.current.abort();
    }
    const controller = new AbortController();
    chatAbortRef.current = controller;

    if (textOverride === undefined) {
      setChatInput('');
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      time: getTimeStr(),
    };

    const currentHistory = messagesRef.current;
    setMessages((prev) => [...prev, userMsg]);
    setChatBusy(true);

    try {
      const historyPayload = currentHistory
        .filter((m) => m.id !== 'welcome-msg')
        .slice(-6)
        .map((m) => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.text,
        }));

      const storeContext = `Active catalog SKUs: ${products.length}. Low stock items: ${
        products.filter((p) => p.stock > 0 && p.stock <= 10).map((p) => `${p.name} (${p.stock} left)`).join(', ') || 'None'
      }. Out of stock items: ${
        products.filter((p) => p.stock === 0).map((p) => p.name).join(', ') || 'None'
      }. Live campaigns: ${campaigns.filter((c) => c.status === 'Live').length}.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyPayload, storeContext }),
        signal: controller.signal,
      });

      const data = await res.json();
      const reply = data.error
        ? `Sorry, something went wrong: ${data.error}`
        : data.reply || 'I have analyzed your store metrics and updated the recommendations.';

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          text: reply,
          time: getTimeStr(),
        },
      ]);
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'ai',
          text: 'Unable to reach the server right now. Please try again in a moment.',
          time: getTimeStr(),
        },
      ]);
    } finally {
      if (chatAbortRef.current === controller) {
        setChatBusy(false);
        setTimeout(() => chatInputRef.current?.focus(), 80);
      }
    }
  };

  const openChatWithPrompt = (promptText: string) => {
    setChatOpen(true);
    setTimeout(() => {
      sendChatMessage(promptText);
    }, 60);
  };

  // Filtered products
  const combinedSearch = (productSearch || globalSearch).toLowerCase().trim();
  const filteredProducts = products.filter((p) => {
    if (productFilter === 'live' && p.status !== 'live') return false;
    if (productFilter === 'draft' && p.status !== 'draft') return false;
    if (productFilter === 'low' && p.stock > 10) return false;
    if (combinedSearch) {
      return (
        p.name.toLowerCase().includes(combinedSearch) ||
        p.sku.toLowerCase().includes(combinedSearch) ||
        p.category.toLowerCase().includes(combinedSearch)
      );
    }
    return true;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (!globalSearch.trim()) return true;
    const q = globalSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.productName.toLowerCase().includes(q) ||
      o.platform.toLowerCase().includes(q)
    );
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    const priceNum = Math.max(99, parseInt(newProdPrice, 10) || 1299);
    const stockNum = Math.max(0, parseInt(newProdStock, 10) || 25);
    const skuCode =
      newProdSku.trim().toUpperCase() ||
      `UNI-${newProdCategory.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const created: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      sku: skuCode,
      price: priceNum,
      category: newProdCategory,
      stock: stockNum,
      status: 'live',
      emoji: newProdEmoji,
      platforms: newProdPlatforms.length ? newProdPlatforms : ['A', 'F'],
      aiForecast: 'Stable',
      salesRevenue: '₹0',
    };

    setProducts((prev) => [created, ...prev]);
    setShowAddProductModal(false);
    setNewProdName('');
    setNewProdSku('');
    setActiveScreen('products');
    showToast(`✓ "${created.name}" auto-listed across ${created.platforms.length} platforms!`);
  };

  const handleRestockProduct = (prodId: string, addUnits: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === prodId
          ? { ...p, stock: p.stock + addUnits, aiForecast: 'Restocked ✓' }
          : p
      )
    );
    const target = products.find((p) => p.id === prodId);
    if (target) {
      showToast(`✓ Reorder triggered: +${addUnits} units added to ${target.name}`);
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) return;
    const spend = Math.max(1, parseInt(newCampSpend, 10) || 10);
    const roasEst = 3.9;
    const created: CampaignItem = {
      id: `camp-${Date.now()}`,
      name: newCampName.trim(),
      categories: newCampCats.trim() || 'Ethnic Wear',
      platform: newCampPlatform,
      spendK: spend,
      revenueK: Math.round(spend * roasEst),
      roas: roasEst,
      status: 'Live',
      aiEnabled: true,
    };
    setCampaigns((prev) => [created, ...prev]);
    setShowNewCampaignModal(false);
    setNewCampName('');
    showToast(`✓ Campaign "${created.name}" launched with AI Bid Optimizer active!`);
  };

  const handleExportCSV = () => {
    const headers = ['SKU,Product Name,Category,Price (INR),Stock,Platforms'];
    const rows = products.map(
      (p) =>
        `"${p.sku}","${p.name}","${p.category}",${p.price},${p.stock},"${p.platforms.join('+')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `unisell_${activeScreen}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('⬇ Exported CSV report successfully');
  };

  const togglePlatformSelection = (code: PlatformCode) => {
    setNewProdPlatforms((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const screenTitleMap: Record<DashboardScreen, { main: string; sub: string }> = {
    overview: { main: 'Overview', sub: '/ Dashboard' },
    products: { main: 'Products', sub: '/ Listings' },
    inventory: { main: 'Inventory', sub: '/ Optimizer' },
    analytics: { main: 'Analytics', sub: '/ Insights' },
    campaigns: { main: 'Campaigns', sub: '/ AI Manager' },
  };

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#090d18] text-[#e8e6e0] flex flex-col md:flex-row">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-[52px] z-[101] bg-[#0f1420] border-b border-white/6 flex items-center px-4 gap-3">
        <button
          type="button"
          aria-label="Open Navigation Drawer"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="w-9 h-9 rounded-lg border border-white/8 bg-transparent text-[#7a7d8a] hover:text-[#c9a84c] flex items-center justify-center text-lg cursor-pointer"
        >
          ☰
        </button>
        <div className="font-serif-display text-xl font-bold text-[#c9a84c] tracking-wider flex-1">
          UNISELL
        </div>
        <button
          type="button"
          onClick={() => setShowAddProductModal(true)}
          className="bg-[#c9a84c] text-[#090d18] px-2.5 py-1.5 rounded-md text-xs font-bold border-none cursor-pointer"
        >
          + Listing
        </button>
        <button
          type="button"
          aria-label="Toggle AI Assistant"
          onClick={() => setChatOpen((prev) => !prev)}
          className="w-9 h-9 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center text-lg cursor-pointer"
        >
          🤖
        </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-[#090d18]/75 backdrop-blur-xs z-[99]"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`w-[240px] md:w-[220px] shrink-0 bg-[#0f1420] border-r border-white/6 flex flex-col h-screen overflow-y-auto fixed md:relative top-0 bottom-0 z-[100] transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div
          onClick={() => onNavigate('landing')}
          className="px-5 py-5 border-b border-white/6 flex items-center gap-2.5 cursor-pointer group"
          title="Back to UNISELL Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#c9a84c] flex items-center justify-center font-serif-display text-base font-bold text-[#090d18]">
            U
          </div>
          <div className="font-serif-display text-xl font-bold text-[#c9a84c] tracking-wider group-hover:text-[#e8c97a] transition-colors">
            UNISELL
          </div>
        </div>

        <div className="font-mono-code text-[0.6rem] text-[#7a7d8a] tracking-[0.15em] uppercase px-5 pt-4 pb-2">
          Workspace
        </div>
        <ul className="list-none px-2.5 space-y-0.5">
          {[
            { id: 'overview' as DashboardScreen, icon: '⬡', label: 'Overview', badge: null },
            {
              id: 'products' as DashboardScreen,
              icon: '⊞',
              label: 'Product Listing',
              badge: String(277 + products.length),
              badgeType: 'gold',
            },
            { id: 'inventory' as DashboardScreen, icon: '◫', label: 'Inventory', badge: null },
            { id: 'analytics' as DashboardScreen, icon: '◈', label: 'Analytics', badge: null },
            {
              id: 'campaigns' as DashboardScreen,
              icon: '📣',
              label: 'Campaigns',
              badge: 'NEW',
              badgeType: 'blue',
            },
          ].map((navItem) => {
            const isActive = activeScreen === navItem.id;
            return (
              <li key={navItem.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveScreen(navItem.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.84rem] font-medium transition-all cursor-pointer border text-left ${
                    isActive
                      ? 'bg-[#c9a84c]/14 text-[#c9a84c] border-[#c9a84c]/30'
                      : 'bg-transparent text-[#7a7d8a] border-transparent hover:bg-[#161d2e] hover:text-[#e8e6e0]'
                  }`}
                >
                  <span className="w-5 text-center text-base">{navItem.icon}</span>
                  <span className="truncate">{navItem.label}</span>
                  {navItem.badge && (
                    <span
                      className={`ml-auto text-[0.62rem] font-bold px-2 py-0.5 rounded-full font-mono-code ${
                        navItem.badgeType === 'blue'
                          ? 'bg-[#4f8ef7] text-white'
                          : 'bg-[#c9a84c] text-[#090d18]'
                      }`}
                    >
                      {navItem.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="font-mono-code text-[0.6rem] text-[#7a7d8a] tracking-[0.15em] uppercase px-5 pt-5 pb-2">
          AI Agents
        </div>
        <ul className="list-none px-2.5 space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                openChatWithPrompt(
                  'How is the AI Mapping Agent 2.0 optimizing my product listings across Amazon, Flipkart, Meesho, and ONDC?'
                );
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.83rem] font-medium text-[#7a7d8a] hover:bg-[#161d2e] hover:text-[#e8e6e0] bg-transparent border-none cursor-pointer text-left"
            >
              <span className="w-5 text-center">⟳</span>
              <span>Mapping Agent</span>
              <span className="ml-auto bg-[#3ecf8e] text-[#090d18] text-[0.6rem] font-bold px-2 py-0.5 rounded-full">
                ON
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                openChatWithPrompt(
                  'What is the Campaign Manager AI agent doing for my business right now?'
                );
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.83rem] font-medium text-[#7a7d8a] hover:bg-[#161d2e] hover:text-[#e8e6e0] bg-transparent border-none cursor-pointer text-left"
            >
              <span className="w-5 text-center">◉</span>
              <span>Campaign Mgr</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                openChatWithPrompt(
                  'How is the AI Customer Agent performing today? Any stats?'
                );
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.83rem] font-medium text-[#7a7d8a] hover:bg-[#161d2e] hover:text-[#e8e6e0] bg-transparent border-none cursor-pointer text-left"
            >
              <span className="w-5 text-center">✦</span>
              <span>Customer AI</span>
            </button>
          </li>
        </ul>

        <div className="font-mono-code text-[0.6rem] text-[#7a7d8a] tracking-[0.15em] uppercase px-5 pt-5 pb-2">
          Platforms
        </div>
        <ul className="list-none px-2.5 space-y-0.5">
          {[
            { name: 'Amazon India', color: '#ff9900', rev: '₹1.8L', orders: 148, sync: 'Synced 2m ago' },
            { name: 'Flipkart', color: '#2874f0', rev: '₹1.2L', orders: 104, sync: 'Synced 4m ago' },
            { name: 'Meesho', color: '#e94560', rev: '₹82K', orders: 68, sync: 'Synced 5m ago' },
            { name: 'ONDC', color: '#3ecf8e', rev: '₹38K', orders: 27, sync: 'Synced 1m ago' },
          ].map((plat) => (
            <li key={plat.name}>
              <button
                type="button"
                onClick={() => {
                  setSidebarOpen(false);
                  setSelectedPlatformInfo(plat.name);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[0.83rem] font-medium text-[#7a7d8a] hover:bg-[#161d2e] hover:text-[#e8e6e0] bg-transparent border-none cursor-pointer text-left"
              >
                <span className="w-5 text-center" style={{ color: plat.color }}>
                  ◉
                </span>
                <span>{plat.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex-1" />

        {/* Sidebar Bottom User Card */}
        <div className="p-3 border-t border-white/6 shrink-0">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#161d2e]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] flex items-center justify-center text-xs font-bold text-[#090d18] shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{user.name}</div>
              <div className="text-[0.68rem] text-[#c9a84c]">✦ {user.plan}</div>
            </div>
          </div>
          <div className="mt-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="flex-1 py-2 px-2 rounded-lg bg-[#161d2e] border border-white/8 text-[#7a7d8a] hover:text-[#c9a84c] text-xs font-medium cursor-pointer transition-colors"
            >
              ← Home
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex-1 py-2 px-2 rounded-lg bg-[#f56565]/10 hover:bg-[#f56565]/20 border border-[#f56565]/25 text-[#f56565] text-xs font-medium cursor-pointer transition-colors"
            >
              ⇤ Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden pt-[52px] md:pt-0">
        {/* DESKTOP TOPBAR */}
        <header className="hidden md:flex h-[56px] shrink-0 bg-[#0f1420] border-b border-white/6 items-center px-6 gap-4">
          <div className="font-serif-display text-xl font-bold flex-1">
            {screenTitleMap[activeScreen].main}{' '}
            <span className="text-[#c9a84c] italic">{screenTitleMap[activeScreen].sub}</span>
          </div>

          <div className="flex items-center gap-2 bg-[#161d2e] border border-white/8 rounded-lg px-3 py-1.5 w-[240px]">
            <span className="text-xs">🔍</span>
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search products, orders..."
              aria-label="Global dashboard search"
              className="bg-transparent border-none outline-none text-[#e8e6e0] text-xs w-full placeholder:text-[#7a7d8a]"
            />
            {globalSearch && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setGlobalSearch('')}
                className="text-[10px] text-[#7a7d8a] hover:text-[#e8e6e0] bg-transparent border-none cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              type="button"
              onClick={() => showToast('📅 Showing live metrics for current billing cycle')}
              className="bg-[#161d2e] border border-white/8 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] rounded-lg px-3 py-1.5 text-[#7a7d8a] text-xs cursor-pointer transition-colors whitespace-nowrap"
            >
              📅 Live Cycle
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-[#161d2e] border border-white/8 hover:border-[#c9a84c]/30 hover:text-[#c9a84c] rounded-lg px-3 py-1.5 text-[#7a7d8a] text-xs cursor-pointer transition-colors whitespace-nowrap"
            >
              ⬇ Export
            </button>

            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="w-8 h-8 rounded-lg bg-[#161d2e] border border-white/8 hover:border-[#c9a84c]/30 flex items-center justify-center cursor-pointer text-sm relative"
            >
              🔔
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#c9a84c] text-[#090d18] text-[0.55rem] font-bold flex items-center justify-center">
                {alerts.length}
              </span>
            </button>

            <button
              type="button"
              aria-label="Ask UNISELL AI"
              onClick={() => setChatOpen((prev) => !prev)}
              title="Ask UNISELL AI"
              className="w-8 h-8 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/30 hover:bg-[#c9a84c] hover:text-[#090d18] flex items-center justify-center cursor-pointer text-sm transition-colors"
            >
              🤖
            </button>

            <button
              type="button"
              onClick={() => setShowAddProductModal(true)}
              className="bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] border-none rounded-lg px-4 py-1.5 text-xs font-bold cursor-pointer transition-colors whitespace-nowrap"
            >
              + New Listing
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-11 w-80 bg-[#0f1420] border border-[#c9a84c]/30 rounded-xl shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono-code text-xs text-[#c9a84c] uppercase tracking-wider">
                    AI Agent Notifications
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#7a7d8a] hover:text-[#e8e6e0] bg-transparent border-none cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {alerts.map((al) => (
                    <div
                      key={al.id}
                      className="p-2.5 bg-[#161d2e] rounded-lg border-l-2 text-xs"
                      style={{ borderLeftColor: al.borderColor }}
                    >
                      <div className="font-semibold text-[#e8e6e0]">
                        {al.icon} {al.title}
                      </div>
                      <div className="text-[#a8aab8] text-[11px] mt-0.5">{al.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* SCROLLABLE SCREEN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* SCREEN 1: OVERVIEW */}
          {activeScreen === 'overview' && (
            <div className="unisell-fade-up space-y-5">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: '₹',
                    label: 'Total Revenue',
                    val: '₹4.28L',
                    delta: '↑ 18.4%',
                    deltaSub: 'vs last month',
                  },
                  {
                    icon: '📦',
                    label: 'Orders Today',
                    val: '347',
                    delta: '↑ 12%',
                    deltaSub: 'vs yesterday',
                  },
                  {
                    icon: '⊞',
                    label: 'Active Listings',
                    val: '1,284',
                    delta: '+42 new',
                    deltaSub: 'this week',
                  },
                  {
                    icon: '✦',
                    label: 'AI Tasks Saved',
                    val: '9.2K',
                    delta: '',
                    deltaSub: 'automated',
                  },
                ].map((k) => (
                  <div
                    key={k.label}
                    className="bg-[#0f1420] border border-white/6 hover:border-[#c9a84c]/30 rounded-xl p-5 relative overflow-hidden transition-all hover:-translate-y-0.5"
                  >
                    <div className="absolute top-4 right-4 text-2xl opacity-30">{k.icon}</div>
                    <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] tracking-[0.08em] uppercase">
                      {k.label}
                    </div>
                    <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#c9a84c] my-1.5 font-mono-code">
                      {k.val}
                    </div>
                    <div className="text-xs flex items-center gap-1.5">
                      {k.delta && <span className="text-[#3ecf8e] font-medium">{k.delta}</span>}
                      <span className="text-[#7a7d8a]">{k.deltaSub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase">
                      Revenue Trend
                    </div>
                    <div className="flex gap-1.5">
                      {(['7D', '30D', '90D'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setRevPeriod(p)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-colors ${
                            revPeriod === p
                              ? 'bg-[#c9a84c]/15 text-[#c9a84c] border-[#c9a84c]/35'
                              : 'bg-[#161d2e] text-[#7a7d8a] border-white/6 hover:text-[#e8e6e0]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[220px]">
                    <RevenueLineChart period={revPeriod} />
                  </div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 flex flex-col justify-between">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-2">
                    Platform Breakdown
                  </div>
                  <div className="h-[160px]">
                    <PlatformDoughnutChart />
                  </div>
                  <div className="space-y-2 mt-3">
                    {[
                      { name: 'Amazon', color: '#ff9900', pct: 78, val: '₹1.8L', delta: '↑14%', up: true },
                      { name: 'Flipkart', color: '#2874f0', pct: 55, val: '₹1.2L', delta: '↑22%', up: true },
                      { name: 'Meesho', color: '#e94560', pct: 38, val: '₹82K', delta: '↓3%', up: false },
                      { name: 'ONDC', color: '#3ecf8e', pct: 18, val: '₹38K', delta: '↑41%', up: true },
                    ].map((pl) => (
                      <div
                        key={pl.name}
                        className="flex items-center gap-3 px-3 py-2 bg-[#161d2e] rounded-lg border border-white/6"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: pl.color }}
                        />
                        <span className="text-xs font-medium flex-1">{pl.name}</span>
                        <div className="hidden sm:block w-20 h-1 bg-white/6 rounded">
                          <div
                            className="h-full rounded"
                            style={{ width: `${pl.pct}%`, backgroundColor: pl.color }}
                          />
                        </div>
                        <span className="font-mono-code text-xs text-[#c9a84c] w-12 text-right">
                          {pl.val}
                        </span>
                        <span
                          className={`text-[0.7rem] w-10 text-right font-mono-code ${
                            pl.up ? 'text-[#3ecf8e]' : 'text-[#f56565]'
                          }`}
                        >
                          {pl.delta}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders & AI Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 overflow-x-auto">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-3">
                    Recent Orders
                  </div>
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/6 text-[#7a7d8a] font-mono-code text-[0.68rem] uppercase">
                        <th className="text-left py-2.5 px-2 font-normal">Order ID</th>
                        <th className="text-left py-2.5 px-2 font-normal">Product</th>
                        <th className="text-left py-2.5 px-2 font-normal">Platform</th>
                        <th className="text-right py-2.5 px-2 font-normal">Amount</th>
                        <th className="text-right py-2.5 px-2 font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => {
                        const platColor =
                          o.platform === 'Amazon'
                            ? '#ff9900'
                            : o.platform === 'Flipkart'
                            ? '#2874f0'
                            : o.platform === 'Meesho'
                            ? '#e94560'
                            : '#3ecf8e';
                        const statusColor =
                          o.status === 'Delivered'
                            ? 'text-[#3ecf8e]'
                            : o.status === 'In Transit'
                            ? 'text-[#f6a623]'
                            : 'text-[#4f8ef7]';
                        return (
                          <tr
                            key={o.id}
                            className="border-b border-white/[0.03] hover:bg-[#161d2e] transition-colors"
                          >
                            <td className="py-3 px-2 font-mono-code text-[#c9a84c]">{o.id}</td>
                            <td className="py-3 px-2 text-[#a8aab8]">{o.productName}</td>
                            <td className="py-3 px-2 font-medium" style={{ color: platColor }}>
                              {o.platform}
                            </td>
                            <td className="py-3 px-2 text-right font-mono-code text-[#c9a84c]">
                              ₹{o.amount.toLocaleString('en-IN')}
                            </td>
                            <td className={`py-3 px-2 text-right font-semibold ${statusColor}`}>
                              {o.status}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-3">
                    🤖 AI Agent Alerts
                  </div>
                  <div className="space-y-2.5">
                    {alerts.map((al) => (
                      <div
                        key={al.id}
                        className="flex items-start gap-3 p-3 bg-[#161d2e] rounded-lg border-l-[3px]"
                        style={{ borderLeftColor: al.borderColor }}
                      >
                        <div className="text-base shrink-0 mt-0.5">{al.icon}</div>
                        <div className="text-xs text-[#a8aab8] leading-relaxed flex-1">
                          <strong className="text-[#e8e6e0] block mb-0.5">{al.title}</strong>
                          {al.description}
                          <div className="text-[0.65rem] text-[#7a7d8a] mt-1">
                            {al.agent} · {al.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: PRODUCTS */}
          {activeScreen === 'products' && (
            <div className="unisell-fade-up space-y-5">
              {/* AI Listing Panel */}
              <div className="bg-[#0f1420] border border-[#c9a84c]/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#c9a84c]/15 border-2 border-[#c9a84c]/35 flex items-center justify-center text-xl shrink-0 unisell-pulse">
                  🤖
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#c9a84c] mb-0.5">
                    AI Mapping Agent 2.0 — Active
                  </div>
                  <div className="text-xs text-[#7a7d8a]">
                    Upload once — AI auto-lists on Amazon, Flipkart, Meesho &amp; ONDC with optimised titles &amp; categories.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    openChatWithPrompt(
                      'I want to add a new product. What info do I need to auto-list on all platforms?'
                    )
                  }
                  className="bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] border-none rounded-lg px-4 py-2 text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  + AI Auto-List
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 bg-[#0f1420] border border-white/8 rounded-lg px-3.5 py-2 flex-1 min-w-[200px]">
                  <span className="text-xs">🔍</span>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products, SKU, category..."
                    aria-label="Search products"
                    className="bg-transparent border-none outline-none text-[#e8e6e0] text-xs w-full placeholder:text-[#7a7d8a]"
                  />
                </div>

                {[
                  { id: 'all' as const, label: `All (${products.length})` },
                  {
                    id: 'live' as const,
                    label: `Live (${products.filter((p) => p.status === 'live').length})`,
                  },
                  {
                    id: 'draft' as const,
                    label: `Draft (${products.filter((p) => p.status === 'draft').length})`,
                  },
                  {
                    id: 'low' as const,
                    label: `Low Stock (${products.filter((p) => p.stock <= 10).length})`,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProductFilter(tab.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer border transition-colors whitespace-nowrap ${
                      productFilter === tab.id
                        ? 'bg-[#0f1420] border-[#c9a84c]/40 text-[#c9a84c]'
                        : 'bg-[#0f1420] border-white/8 text-[#7a7d8a] hover:text-[#e8e6e0]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] border-none rounded-lg px-4 py-2 text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  + Add Product
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductModal(prod)}
                    className="bg-[#0f1420] border border-white/6 hover:border-[#c9a84c]/35 rounded-xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer shadow-lg"
                  >
                    <div className="h-[130px] bg-[#161d2e] flex items-center justify-center text-4xl border-b border-white/6 relative">
                      <span>{prod.emoji}</span>
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {prod.platforms.map((code) => (
                          <span
                            key={code}
                            title={PLATFORM_BADGE_STYLE[code].name}
                            className="w-[18px] h-[18px] rounded text-[0.55rem] font-bold flex items-center justify-center border border-white/10"
                            style={{
                              backgroundColor: PLATFORM_BADGE_STYLE[code].bg,
                              color: PLATFORM_BADGE_STYLE[code].color,
                            }}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-semibold truncate mb-1">{prod.name}</div>
                      <div className="font-mono-code text-[0.65rem] text-[#7a7d8a]">
                        SKU: {prod.sku} · {prod.category}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="font-serif-display text-xl font-bold text-[#c9a84c] font-mono-code">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                        {prod.stock === 0 ? (
                          <span className="text-xs text-[#f56565] font-medium">✗ Out of Stock</span>
                        ) : prod.stock <= 10 ? (
                          <span className="text-xs text-[#f6a623] font-medium">
                            ⚠ Low Stock ({prod.stock})
                          </span>
                        ) : (
                          <span className="text-xs text-[#3ecf8e] font-medium">
                            ✓ In Stock ({prod.stock})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Product via AI Dashed Card */}
                <div
                  onClick={() =>
                    openChatWithPrompt(
                      'Help me list a new product — a handcrafted Rajasthani mirror work kurti priced at ₹1,599'
                    )
                  }
                  className="border border-dashed border-[#c9a84c]/35 bg-[#161d2e]/60 hover:bg-[#161d2e] rounded-xl flex flex-col items-center justify-center min-h-[220px] cursor-pointer gap-1.5 p-6 text-center transition-colors"
                >
                  <div className="text-3xl text-[#c9a84c]/60">+</div>
                  <div className="text-sm font-medium text-[#a8aab8]">Add Product via AI</div>
                  <div className="text-xs text-[#7a7d8a]">Auto-lists to all platforms</div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: INVENTORY */}
          {activeScreen === 'inventory' && (
            <div className="unisell-fade-up space-y-5">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">📦</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Total SKUs
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#c9a84c] my-1.5 font-mono-code">
                    {277 + products.length}
                  </div>
                  <div className="text-xs text-[#3ecf8e]">
                    ↑ 12 <span className="text-[#7a7d8a]">this month</span>
                  </div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">⚠</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Low Stock
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f6a623] my-1.5 font-mono-code">
                    {10 + lowStockCount}
                  </div>
                  <div className="text-xs text-[#f6a623]">Action needed</div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">✗</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Out of Stock
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f56565] my-1.5 font-mono-code">
                    {2 + outOfStockCount}
                  </div>
                  <div className="text-xs text-[#f56565]">↑ 1 today</div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">🤖</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    AI Reorders
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#3ecf8e] my-1.5 font-mono-code">
                    8
                  </div>
                  <div className="text-xs text-[#7a7d8a]">auto-triggered</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 overflow-x-auto">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-3">
                    Inventory Status
                  </div>
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/6 text-[#7a7d8a] font-mono-code text-[0.65rem] uppercase">
                        <th className="text-left py-2.5 px-2 font-normal">Product</th>
                        <th className="text-left py-2.5 px-2 font-normal">SKU</th>
                        <th className="text-left py-2.5 px-2 font-normal">Stock</th>
                        <th className="text-left py-2.5 px-2 font-normal hidden sm:table-cell">
                          Level
                        </th>
                        <th className="text-left py-2.5 px-2 font-normal hidden sm:table-cell">
                          AI Forecast
                        </th>
                        <th className="text-right py-2.5 px-2 font-normal">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 6).map((item) => {
                        const isOut = item.stock === 0;
                        const isLow = item.stock > 0 && item.stock <= 10;
                        const barPct = Math.min(100, Math.round((item.stock / 150) * 100));
                        const barColor = isOut
                          ? '#f56565'
                          : isLow
                          ? '#f6a623'
                          : item.stock < 30
                          ? '#c9a84c'
                          : '#3ecf8e';

                        return (
                          <tr
                            key={item.id}
                            className="border-b border-white/[0.03] hover:bg-[#161d2e] transition-colors"
                          >
                            <td className="py-3 px-2 text-[#e8e6e0] font-medium">{item.name}</td>
                            <td className="py-3 px-2 font-mono-code text-[#c9a84c]">{item.sku}</td>
                            <td
                              className="py-3 px-2 font-mono-code font-medium"
                              style={{ color: barColor }}
                            >
                              {item.stock} units
                            </td>
                            <td className="py-3 px-2 hidden sm:table-cell">
                              <div className="w-20 h-1.5 bg-white/6 rounded overflow-hidden">
                                <div
                                  className="h-full rounded"
                                  style={{ width: `${barPct}%`, backgroundColor: barColor }}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-2 font-mono-code text-[#c9a84c] hidden sm:table-cell">
                              {item.aiForecast}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                {isOut ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRestockProduct(item.id, 40)}
                                    className="bg-[#f56565]/15 border border-[#f56565]/40 text-[#f56565] hover:bg-[#f56565] hover:text-[#090d18] rounded px-2.5 py-1 text-[0.7rem] font-semibold cursor-pointer transition-colors"
                                  >
                                    +40 Urgent
                                  </button>
                                ) : isLow ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRestockProduct(item.id, 50)}
                                    className="bg-[#f6a623]/15 border border-[#f6a623]/40 text-[#f6a623] hover:bg-[#f6a623] hover:text-[#090d18] rounded px-2.5 py-1 text-[0.7rem] font-semibold cursor-pointer transition-colors"
                                  >
                                    +50 Reorder
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProductModal(item)}
                                    className="bg-[#161d2e] border border-white/10 text-[#a8aab8] hover:border-[#c9a84c] hover:text-[#c9a84c] rounded px-2.5 py-1 text-[0.7rem] cursor-pointer transition-colors"
                                  >
                                    Review
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-3">
                    🤖 AI Demand Forecasts
                  </div>
                  <div className="space-y-2.5">
                    {INITIAL_FORECASTS.map((fc) => (
                      <div
                        key={fc.id}
                        className="p-3.5 bg-[#161d2e] rounded-lg border-l-[3px]"
                        style={{ borderLeftColor: fc.borderColor }}
                      >
                        <div className="text-xs font-semibold text-[#e8e6e0] mb-1">
                          {fc.product}
                        </div>
                        <div className="text-xs text-[#7a7d8a] leading-relaxed">{fc.detail}</div>
                        <button
                          type="button"
                          onClick={() => fc.prompt && openChatWithPrompt(fc.prompt)}
                          className="mt-2 text-[0.72rem] text-[#c9a84c] hover:underline font-semibold bg-transparent border-none cursor-pointer p-0"
                        >
                          {fc.actionLabel}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-2">
                  Stock Movement — Last 30 Days
                </div>
                <div className="h-[180px]">
                  <StockMovementBarChart />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4: ANALYTICS */}
          {activeScreen === 'analytics' && (
            <div className="unisell-fade-up space-y-5">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">₹</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Monthly Revenue
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#c9a84c] my-1.5 font-mono-code">
                    ₹18.4L
                  </div>
                  <div className="text-xs text-[#3ecf8e]">
                    ↑ 24% <span className="text-[#7a7d8a]">YoY</span>
                  </div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">%</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Profit Margin
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#c9a84c] my-1.5 font-mono-code">
                    28.4%
                  </div>
                  <div className="text-xs text-[#3ecf8e]">↑ 3.2pp</div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">🔄</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Return Rate
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#3ecf8e] my-1.5 font-mono-code">
                    4.2%
                  </div>
                  <div className="text-xs text-[#3ecf8e]">
                    ↓ 1.1% <span className="text-[#7a7d8a]">improved</span>
                  </div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">📣</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Avg ROAS
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#c9a84c] my-1.5 font-mono-code">
                    4.2x
                  </div>
                  <div className="text-xs text-[#3ecf8e]">
                    ↑ 25% <span className="text-[#7a7d8a]">AI optimised</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase">
                      Sales by Platform
                    </div>
                    <div className="flex gap-1.5">
                      {(['Monthly', 'Quarterly', 'Yearly'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSalesPeriod(p)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-colors ${
                            salesPeriod === p
                              ? 'bg-[#c9a84c]/15 text-[#c9a84c] border-[#c9a84c]/35'
                              : 'bg-[#161d2e] text-[#7a7d8a] border-white/6 hover:text-[#e8e6e0]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <PlatformSalesBarChart period={salesPeriod} />
                  </div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-3">
                    Category Revenue Split
                  </div>
                  <div className="h-[250px]">
                    <CategoryDoughnutChart />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-3">
                    Top Performing Products
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        rank: 1,
                        emoji: '👗',
                        name: 'Bridal Lehenga Set',
                        cat: 'Ethnic Wear · Amazon + Flipkart',
                        rev: '₹2.1L',
                      },
                      {
                        rank: 2,
                        emoji: '🥻',
                        name: 'Banarasi Silk Saree',
                        cat: 'Sarees · All Platforms',
                        rev: '₹1.8L',
                      },
                      {
                        rank: 3,
                        emoji: '👘',
                        name: 'Cotton Anarkali Kurta',
                        cat: 'Kurtas · All Platforms',
                        rev: '₹1.2L',
                      },
                      {
                        rank: 4,
                        emoji: '🧥',
                        name: 'Kashmir Woollen Shawl',
                        cat: 'Shawls · Amazon + ONDC',
                        rev: '₹94K',
                      },
                      {
                        rank: 5,
                        emoji: '🎽',
                        name: 'Palazzo Floral Set',
                        cat: 'Bottom Wear · Meesho + ONDC',
                        rev: '₹78K',
                      },
                    ].map((tp) => (
                      <div
                        key={tp.rank}
                        className="flex items-center gap-3 px-3.5 py-2.5 bg-[#161d2e] rounded-lg"
                      >
                        <div className="font-serif-display text-lg font-bold text-[#c9a84c] w-6 text-center font-mono-code">
                          {tp.rank}
                        </div>
                        <div className="text-xl">{tp.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{tp.name}</div>
                          <div className="text-[0.68rem] text-[#7a7d8a]">{tp.cat}</div>
                        </div>
                        <div className="font-mono-code text-xs text-[#c9a84c]">{tp.rev}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-2">
                    AI Campaign Performance
                  </div>
                  <div className="h-[230px]">
                    <CampaignPerformanceChart />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5: CAMPAIGNS */}
          {activeScreen === 'campaigns' && (
            <div className="unisell-fade-up space-y-5">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">📣</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Active Campaigns
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#c9a84c] my-1.5 font-mono-code">
                    {2 + campaigns.filter((c) => c.status === 'Live').length}
                  </div>
                  <div className="text-xs text-[#3ecf8e]">↑ 2 new</div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">💰</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Total Ad Spend
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#c9a84c] my-1.5 font-mono-code">
                    ₹64K
                  </div>
                  <div className="text-xs text-[#7a7d8a]">this month</div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">📈</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Avg ROAS
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#3ecf8e] my-1.5 font-mono-code">
                    4.2x
                  </div>
                  <div className="text-xs text-[#3ecf8e]">
                    ↑ 25% <span className="text-[#7a7d8a]">AI boost</span>
                  </div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 relative">
                  <div className="absolute top-4 right-4 text-2xl opacity-30">🎯</div>
                  <div className="font-mono-code text-[0.68rem] text-[#7a7d8a] uppercase">
                    Revenue from Ads
                  </div>
                  <div className="font-serif-display text-3xl sm:text-4xl font-bold text-[#c9a84c] my-1.5 font-mono-code">
                    ₹2.7L
                  </div>
                  <div className="text-xs text-[#3ecf8e]">↑ 18%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5 overflow-x-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase">
                      Active Campaigns
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNewCampaignModal(true)}
                      className="bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] border-none rounded-lg px-3.5 py-1.5 text-xs font-bold cursor-pointer"
                    >
                      + New Campaign
                    </button>
                  </div>

                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/6 text-[#7a7d8a] font-mono-code text-[0.65rem] uppercase">
                        <th className="text-left py-2.5 px-2 font-normal">Campaign</th>
                        <th className="text-left py-2.5 px-2 font-normal">Platform</th>
                        <th className="text-right py-2.5 px-2 font-normal hidden sm:table-cell">
                          Spend
                        </th>
                        <th className="text-right py-2.5 px-2 font-normal hidden sm:table-cell">
                          Revenue
                        </th>
                        <th className="text-right py-2.5 px-2 font-normal">ROAS</th>
                        <th className="text-right py-2.5 px-2 font-normal">Status</th>
                        <th className="text-right py-2.5 px-2 font-normal">AI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((camp) => {
                        const platColor =
                          camp.platform === 'Amazon'
                            ? '#ff9900'
                            : camp.platform === 'Flipkart'
                            ? '#2874f0'
                            : camp.platform === 'Meesho'
                            ? '#e94560'
                            : camp.platform === 'ONDC'
                            ? '#3ecf8e'
                            : '#f6a623';
                        const roasColor =
                          camp.roas >= 4.0
                            ? 'text-[#3ecf8e]'
                            : camp.roas >= 3.0
                            ? 'text-[#f6a623]'
                            : 'text-[#f56565]';
                        return (
                          <tr
                            key={camp.id}
                            className="border-b border-white/[0.03] hover:bg-[#161d2e] transition-colors"
                          >
                            <td className="py-3 px-2">
                              <div className="font-semibold text-[#e8e6e0]">{camp.name}</div>
                              <div className="text-[0.68rem] text-[#7a7d8a]">{camp.categories}</div>
                            </td>
                            <td className="py-3 px-2 font-medium" style={{ color: platColor }}>
                              {camp.platform}
                            </td>
                            <td className="py-3 px-2 text-right font-mono-code text-[#a8aab8] hidden sm:table-cell">
                              ₹{camp.spendK}K
                            </td>
                            <td className="py-3 px-2 text-right font-mono-code text-[#c9a84c] hidden sm:table-cell">
                              ₹{camp.revenueK}K
                            </td>
                            <td className={`py-3 px-2 text-right font-mono-code font-semibold ${roasColor}`}>
                              {camp.roas.toFixed(1)}x
                            </td>
                            <td className="py-3 px-2 text-right">
                              <span
                                className={`text-[0.68rem] font-semibold uppercase ${
                                  camp.status === 'Live'
                                    ? 'text-[#3ecf8e]'
                                    : camp.status === 'Paused'
                                    ? 'text-[#f6a623]'
                                    : 'text-[#7a7d8a]'
                                }`}
                              >
                                {camp.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <button
                                type="button"
                                aria-label={`Toggle AI optimization for ${camp.name}`}
                                onClick={() => {
                                  setCampaigns((prev) =>
                                    prev.map((c) =>
                                      c.id === camp.id ? { ...c, aiEnabled: !c.aiEnabled } : c
                                    )
                                  );
                                }}
                                className={`w-9 h-5 rounded-full relative transition-colors cursor-pointer border ${
                                  camp.aiEnabled
                                    ? 'bg-[#3ecf8e]/30 border-[#3ecf8e]'
                                    : 'bg-[#161d2e] border-white/10'
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${
                                    camp.aiEnabled
                                      ? 'left-[18px] bg-[#3ecf8e]'
                                      : 'left-0.5 bg-[#7a7d8a]'
                                  }`}
                                />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* AI Campaign Suggestions */}
                <div
                  className="border border-[#c9a84c]/30 rounded-xl p-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,168,76,0.08), transparent)',
                  }}
                >
                  <div className="font-mono-code text-xs text-[#c9a84c] tracking-wider uppercase mb-3">
                    🤖 AI Campaign Suggestions
                  </div>
                  <div className="space-y-2.5">
                    {[
                      {
                        label: '🔥 Boost Diwali Campaign Budget',
                        text: 'ROAS at 4.6x — well above break-even. Increasing budget by ₹8K could yield ₹37K additional revenue.',
                        action: '→ Ask AI for full analysis',
                        prompt:
                          'My Diwali Sale campaign on Amazon is at 4.6x ROAS. Should I increase the budget by ₹8K? Give me a detailed analysis and recommendation.',
                      },
                      {
                        label: '⚠ Meesho Campaign Underperforming',
                        text: 'Budget Ethnic Wear at 3.2x ROAS. AI recommends switching to video ads and refining audience targeting.',
                        action: '→ Get optimisation tips',
                        prompt:
                          'My Meesho Budget Ethnic Wear campaign ROAS is only 3.2x. How can I improve it? Should I try video ads or change my audience targeting?',
                      },
                      {
                        label: '✦ Flipkart Big Billion Days Prep',
                        text: 'Big Billion Days coming next month. Launch 3 campaigns now to build relevance score early.',
                        action: '→ Plan Big Billion strategy',
                        prompt:
                          'Flipkart Big Billion Days is next month. Help me plan a campaign strategy for my ethnic wear store. Which products to push, what budget, and what ad types?',
                      },
                    ].map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-[#161d2e] rounded-lg border-l-[3px] border-[#c9a84c]"
                      >
                        <div className="text-xs font-semibold text-[#e8e6e0] mb-1">{sug.label}</div>
                        <div className="text-xs text-[#7a7d8a] leading-relaxed">{sug.text}</div>
                        <button
                          type="button"
                          onClick={() => openChatWithPrompt(sug.prompt)}
                          className="mt-2 text-[0.72rem] text-[#c9a84c] hover:underline font-semibold bg-transparent border-none cursor-pointer p-0"
                        >
                          {sug.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-2">
                    ROAS Trend — Last 4 Weeks
                  </div>
                  <div className="h-[200px]">
                    <RoasTrendChart />
                  </div>
                </div>

                <div className="bg-[#0f1420] border border-white/6 rounded-xl p-5">
                  <div className="font-mono-code text-[0.7rem] text-[#7a7d8a] tracking-[0.1em] uppercase mb-3">
                    Ad Spend by Platform
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { name: 'Amazon', color: '#ff9900', spend: '₹28K', pct: 88, roas: '4.4x', good: true },
                      { name: 'Flipkart', color: '#2874f0', spend: '₹12K', pct: 55, roas: '4.1x', good: true },
                      { name: 'Meesho', color: '#e94560', spend: '₹8K', pct: 30, roas: '3.2x', good: false },
                      { name: 'ONDC', color: '#3ecf8e', spend: '₹5K', pct: 18, roas: '2.8x', good: false },
                      { name: 'Meta Ads', color: '#f6a623', spend: '₹11K', pct: 42, roas: '3.8x', good: true },
                    ].map((ad) => (
                      <div
                        key={ad.name}
                        className="flex items-center gap-3 px-3.5 py-2.5 bg-[#161d2e] rounded-lg"
                      >
                        <div className="text-xs font-semibold w-20" style={{ color: ad.color }}>
                          {ad.name}
                        </div>
                        <div className="font-mono-code text-xs text-[#7a7d8a] w-12">{ad.spend}</div>
                        <div className="flex-1 h-1.5 bg-white/6 rounded overflow-hidden">
                          <div
                            className="h-full rounded"
                            style={{ width: `${ad.pct}%`, backgroundColor: ad.color, opacity: 0.8 }}
                          />
                        </div>
                        <div
                          className={`font-mono-code text-xs font-semibold w-10 text-right ${
                            ad.good ? 'text-[#3ecf8e]' : 'text-[#f6a623]'
                          }`}
                        >
                          {ad.roas}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FLOATING AI ASSISTANT PANEL */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[380px] bg-[#0f1420] border border-[#c9a84c]/35 rounded-2xl shadow-2xl flex flex-col z-[1000] overflow-hidden unisell-fade-up">
          <div
            className="px-4 py-3.5 border-b border-white/6 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.1), transparent)',
            }}
          >
            <div className="w-9 h-9 rounded-full bg-[#c9a84c]/15 border-2 border-[#c9a84c]/35 flex items-center justify-center text-base shrink-0 unisell-pulse">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#c9a84c]">UNISELL AI Assistant</div>
              <div className="text-[0.68rem] text-[#3ecf8e] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ecf8e]" />
                <span>Online · Live Store Intelligence</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close AI Assistant"
              onClick={() => setChatOpen(false)}
              className="bg-transparent border-none text-[#7a7d8a] hover:text-[#e8e6e0] cursor-pointer text-base p-1"
            >
              ✕
            </button>
          </div>

          <div
            ref={chatScrollRef}
            className="h-[300px] overflow-y-auto p-4 flex flex-col gap-3"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 items-end ${
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    m.role === 'ai'
                      ? 'bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c]'
                      : 'bg-gradient-to-br from-[#c9a84c] to-[#e8c97a] text-[#090d18]'
                  }`}
                >
                  {m.role === 'ai' ? 'U' : user.name.charAt(0).toUpperCase()}
                </div>
                <div className="max-w-[82%]">
                  <div
                    className={`px-3.5 py-2.5 text-xs leading-relaxed break-words ${
                      m.role === 'ai'
                        ? 'bg-[#161d2e] text-[#a8aab8] rounded-tl-xs rounded-tr-xl rounded-br-xl rounded-bl-xl'
                        : 'bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#e8e6e0] rounded-tl-xl rounded-tr-xs rounded-br-xl rounded-bl-xl'
                    }`}
                  >
                    {renderFormattedAIText(m.text)}
                  </div>
                  <div
                    className={`text-[0.6rem] text-[#7a7d8a] mt-1 ${
                      m.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {chatBusy && (
              <div className="flex gap-2.5 items-end">
                <div className="w-6 h-6 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] flex items-center justify-center text-xs font-bold">
                  U
                </div>
                <div className="bg-[#161d2e] px-3.5 py-2.5 rounded-tl-xs rounded-tr-xl rounded-br-xl rounded-bl-xl flex gap-1.5 items-center">
                  <span className="unisell-typing-dot" />
                  <span className="unisell-typing-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="unisell-typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          <div className="px-4 pb-2.5 flex flex-wrap gap-1.5">
            {[
              {
                label: '📊 Best platform?',
                prompt: 'What is my best performing platform this month?',
              },
              {
                label: '📦 Restock alerts',
                prompt: 'Which products should I restock urgently?',
              },
              {
                label: '📣 Campaign ideas',
                prompt: 'Give me 3 campaign ideas for the upcoming wedding season',
              },
              {
                label: '📈 Boost Meesho',
                prompt: 'How can I improve my Meesho sales this month?',
              },
            ].map((qb) => (
              <button
                key={qb.label}
                type="button"
                onClick={() => sendChatMessage(qb.prompt)}
                className="bg-[#161d2e] border border-white/8 hover:border-[#c9a84c]/35 hover:text-[#c9a84c] rounded-full px-3 py-1 text-[0.72rem] text-[#7a7d8a] cursor-pointer transition-colors"
              >
                {qb.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendChatMessage();
            }}
            className="p-3 border-t border-white/6 flex gap-2 items-center"
          >
            <input
              ref={chatInputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about inventory, campaigns, sales..."
              aria-label="Ask UNISELL AI Assistant"
              className="flex-1 bg-[#161d2e] border border-white/8 focus:border-[#c9a84c]/40 rounded-lg px-3.5 py-2 text-xs text-[#e8e6e0] outline-none"
            />
            <button
              type="submit"
              disabled={chatBusy}
              aria-label="Send message"
              className="w-9 h-9 rounded-lg bg-[#c9a84c] hover:bg-[#e8c97a] disabled:opacity-50 text-[#090d18] border-none cursor-pointer flex items-center justify-center text-sm shrink-0"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* CHAT FAB */}
      {!chatOpen && (
        <button
          type="button"
          aria-label="Open UNISELL AI Chat"
          onClick={() => setChatOpen(true)}
          className="fixed bottom-5 right-5 w-13 h-13 rounded-full bg-[#c9a84c] hover:scale-110 border-none cursor-pointer flex items-center justify-center text-2xl shadow-[0_4px_20px_rgba(201,168,76,0.4)] transition-transform z-[999]"
        >
          🤖
        </button>
      )}

      {/* MODAL: ADD NEW PRODUCT */}
      {showAddProductModal && (
        <div
          onClick={() => setShowAddProductModal(false)}
          className="fixed inset-0 bg-[#090d18]/85 backdrop-blur-xs flex items-center justify-center z-[2000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f1420] border border-[#c9a84c]/35 rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close Add Product modal"
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#161d2e] border border-white/8 text-[#7a7d8a] hover:text-[#c9a84c] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="font-mono-code text-[0.65rem] text-[#c9a84c] uppercase tracking-widest mb-1">
              AI Mapping Agent 2.0
            </div>
            <h3 className="font-serif-display text-2xl font-bold mb-4">
              List Once, Publish Everywhere
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-[#7a7d8a]">Product Title</label>
                  <button
                    type="button"
                    disabled={aiListingLoading}
                    onClick={handleOptimizeListingWithAI}
                    className="text-[11px] font-mono-code text-[#c9a84c] hover:text-[#e8c97a] bg-[#c9a84c]/15 border border-[#c9a84c]/35 rounded px-2 py-0.5 cursor-pointer transition-colors"
                  >
                    {aiListingLoading ? '✨ Optimizing with AI...' : '✨ AI Auto-Optimize SEO & HSN'}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Rajasthani Mirror Work Kurti"
                  className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3.5 py-2 text-xs text-[#e8e6e0] outline-none"
                />
              </div>

              {aiListingMeta && (
                <div className="p-3 rounded-lg bg-[#161d2e] border border-[#c9a84c]/30 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#c9a84c] font-mono-code text-[11px]">
                    <span>HSN: {aiListingMeta.hsnCode} ({aiListingMeta.gstSlab})</span>
                    <span>Meesho Smart Price: ₹{aiListingMeta.meeshoPrice}</span>
                  </div>
                  {aiListingMeta.highlights.map((hl, idx) => (
                    <div key={idx} className="text-[11px] text-[#a8aab8]">
                      ✓ {hl}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#7a7d8a] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3.5 py-2 text-xs text-[#e8e6e0] outline-none font-mono-code"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#7a7d8a] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3.5 py-2 text-xs text-[#e8e6e0] outline-none font-mono-code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#7a7d8a] mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3 py-2 text-xs text-[#e8e6e0] outline-none"
                  >
                    <option value="Sarees">Sarees</option>
                    <option value="Kurtas">Kurtas</option>
                    <option value="Ethnic Wear">Ethnic Wear</option>
                    <option value="Dupattas">Dupattas</option>
                    <option value="Shawls">Shawls</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#7a7d8a] mb-1">Icon</label>
                  <select
                    value={newProdEmoji}
                    onChange={(e) => setNewProdEmoji(e.target.value)}
                    className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3 py-2 text-xs text-[#e8e6e0] outline-none"
                  >
                    <option value="👘">👘 Kurta</option>
                    <option value="🥻">🥻 Saree</option>
                    <option value="👗">👗 Lehenga</option>
                    <option value="🧣">🧣 Dupatta</option>
                    <option value="🧥">🧥 Shawl</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#7a7d8a] mb-1.5">
                  Target Marketplaces (Auto-Map)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['A', 'F', 'M', 'O'] as PlatformCode[]).map((code) => {
                    const active = newProdPlatforms.includes(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => togglePlatformSelection(code)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center gap-2 border cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#c9a84c]/15 border-[#c9a84c] text-[#e8e6e0]'
                            : 'bg-[#161d2e] border-white/8 text-[#7a7d8a]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded text-[0.6rem] font-bold flex items-center justify-center"
                          style={{
                            backgroundColor: PLATFORM_BADGE_STYLE[code].bg,
                            color: PLATFORM_BADGE_STYLE[code].color,
                          }}
                        >
                          {code}
                        </span>
                        <span>{PLATFORM_BADGE_STYLE[code].name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] font-bold py-3 rounded-lg text-xs cursor-pointer border-none mt-2"
              >
                ⚡ Auto-Map &amp; Publish Listing →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW CAMPAIGN */}
      {showNewCampaignModal && (
        <div
          onClick={() => setShowNewCampaignModal(false)}
          className="fixed inset-0 bg-[#090d18]/85 backdrop-blur-xs flex items-center justify-center z-[2000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f1420] border border-[#c9a84c]/35 rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close New Campaign modal"
              onClick={() => setShowNewCampaignModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#161d2e] border border-white/8 text-[#7a7d8a] hover:text-[#c9a84c] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="font-mono-code text-[0.65rem] text-[#c9a84c] uppercase tracking-widest mb-1">
              AI Campaign Manager
            </div>
            <h3 className="font-serif-display text-2xl font-bold mb-4">Launch New Ad Campaign</h3>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5">
              <div>
                <label className="block text-xs text-[#7a7d8a] mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  placeholder="e.g. Festive Silk Saree Boost"
                  className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3.5 py-2 text-xs text-[#e8e6e0] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#7a7d8a] mb-1">Platform</label>
                  <select
                    value={newCampPlatform}
                    onChange={(e) =>
                      setNewCampPlatform(
                        e.target.value as 'Amazon' | 'Flipkart' | 'Meesho' | 'ONDC' | 'Meta Ads'
                      )
                    }
                    className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3 py-2 text-xs text-[#e8e6e0] outline-none"
                  >
                    <option value="Amazon">Amazon</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Meesho">Meesho</option>
                    <option value="ONDC">ONDC</option>
                    <option value="Meta Ads">Meta Ads</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#7a7d8a] mb-1">Budget (₹ in K)</label>
                  <input
                    type="number"
                    required
                    value={newCampSpend}
                    onChange={(e) => setNewCampSpend(e.target.value)}
                    className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3.5 py-2 text-xs text-[#e8e6e0] outline-none font-mono-code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#7a7d8a] mb-1">Target Categories</label>
                <input
                  type="text"
                  value={newCampCats}
                  onChange={(e) => setNewCampCats(e.target.value)}
                  className="w-full bg-[#161d2e] border border-white/10 focus:border-[#c9a84c] rounded-lg px-3.5 py-2 text-xs text-[#e8e6e0] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] font-bold py-3 rounded-lg text-xs cursor-pointer border-none mt-2"
              >
                📣 Launch Campaign with AI Bidding →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRODUCT DETAIL / QUICK RESTOCK */}
      {selectedProductModal && (
        <div
          onClick={() => setSelectedProductModal(null)}
          className="fixed inset-0 bg-[#090d18]/85 backdrop-blur-xs flex items-center justify-center z-[2000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f1420] border border-[#c9a84c]/35 rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close product detail modal"
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#161d2e] border border-white/8 text-[#7a7d8a] hover:text-[#c9a84c] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-[#161d2e] flex items-center justify-center text-4xl border border-white/8">
                {selectedProductModal.emoji}
              </div>
              <div>
                <div className="font-mono-code text-xs text-[#c9a84c]">
                  {selectedProductModal.sku}
                </div>
                <h3 className="font-serif-display text-2xl font-bold">
                  {selectedProductModal.name}
                </h3>
                <div className="text-xs text-[#7a7d8a]">{selectedProductModal.category}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4 p-3.5 bg-[#161d2e] rounded-xl">
              <div>
                <div className="text-[0.68rem] text-[#7a7d8a]">Selling Price</div>
                <div className="font-serif-display text-2xl font-bold text-[#c9a84c] font-mono-code">
                  ₹{selectedProductModal.price.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-[0.68rem] text-[#7a7d8a]">Available Stock</div>
                <div className="font-serif-display text-2xl font-bold text-[#3ecf8e] font-mono-code">
                  {selectedProductModal.stock} units
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  handleRestockProduct(selectedProductModal.id, 30);
                  setSelectedProductModal(null);
                }}
                className="flex-1 bg-[#c9a84c] hover:bg-[#e8c97a] text-[#090d18] font-bold py-2.5 rounded-lg text-xs cursor-pointer border-none"
              >
                + Restock 30 Units
              </button>
              <button
                type="button"
                onClick={() => {
                  const prodName = selectedProductModal.name;
                  setSelectedProductModal(null);
                  openChatWithPrompt(
                    `Optimize title, keywords, and pricing strategy for ${prodName} across Amazon and Flipkart.`
                  );
                }}
                className="flex-1 bg-[#161d2e] border border-[#c9a84c]/35 text-[#c9a84c] hover:bg-[#c9a84c]/15 font-semibold py-2.5 rounded-lg text-xs cursor-pointer"
              >
                🤖 Ask AI to Optimize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PLATFORM SYNC INFO */}
      {selectedPlatformInfo && (
        <div
          onClick={() => setSelectedPlatformInfo(null)}
          className="fixed inset-0 bg-[#090d18]/85 backdrop-blur-xs flex items-center justify-center z-[2000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f1420] border border-[#c9a84c]/35 rounded-2xl p-6 w-full max-w-sm relative shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close platform modal"
              onClick={() => setSelectedPlatformInfo(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#161d2e] border border-white/8 text-[#7a7d8a] hover:text-[#c9a84c] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            <div className="font-mono-code text-[0.65rem] text-[#3ecf8e] uppercase tracking-widest mb-1">
              ● Live OAuth Connection
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#c9a84c] mb-2">
              {selectedPlatformInfo}
            </h3>
            <p className="text-xs text-[#a8aab8] leading-relaxed mb-4">
              Two-way catalog, inventory, and order webhook sync is active. All SKU price and stock changes propagate in under 15 seconds.
            </p>
            <button
              type="button"
              onClick={() => {
                const name = selectedPlatformInfo;
                setSelectedPlatformInfo(null);
                showToast(`⟳ Triggered instant catalog sync with ${name}`);
              }}
              className="w-full bg-[#c9a84c] text-[#090d18] font-bold py-2.5 rounded-lg text-xs border-none cursor-pointer"
            >
              ⟳ Force Sync Now
            </button>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#161d2e] border border-[#c9a84c] text-[#e8e6e0] px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl z-[3000] unisell-fade-up"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
