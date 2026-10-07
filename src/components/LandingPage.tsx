import React, { useState } from 'react';
import { Check, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { PageView, DashboardScreen } from '../types';
import { usePWAInstall } from './EngagementEffects';
import {
  MagneticParticlesCanvas,
  BorderBeam,
  SphereMask,
  MarqueeTileMatrixCTA,
} from './StartupTemplateFeatures';
import { FloatingAIAssistant } from './FloatingAIAssistant';

interface LandingPageProps {
  onNavigate: (page: PageView, options?: { tab?: 'si' | 'reg'; screen?: DashboardScreen }) => void;
}

interface PricingPlan {
  id: string;
  tierLabel: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isMostPopular: boolean;
  features: string[];
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'price_uday',
    tierLabel: 'Basic · Starter',
    name: 'Uday',
    description: 'A foundational plan for D2C startups and individual Indian sellers',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    isMostPopular: false,
    features: [
      '2 marketplace integrations (Amazon + Flipkart)',
      'Up to 500 active product listings',
      'AI-powered analytics dashboard',
      'Multilingual support (Hindi + English)',
      'Automated GST invoice sync',
    ],
  },
  {
    id: 'price_pragati',
    tierLabel: 'Premium · Most Popular',
    name: 'Pragati',
    description: 'A high-growth plan for scaling multi-channel D2C brands',
    monthlyPrice: 2999,
    yearlyPrice: 29990,
    isMostPopular: true,
    features: [
      'All 5 marketplace integrations + ONDC',
      'Unlimited product listings & SKUs',
      'AI Mapping Agent 2.0 & Inventory Optimizer',
      'AI Campaign Manager (Amazon + Meta Ads)',
      '9 Indian regional languages supported',
      'Priority seller support',
    ],
  },
  {
    id: 'price_udyog',
    tierLabel: 'Enterprise',
    name: 'Udyog',
    description: 'An enterprise plan with advanced AI workflows for large organizations',
    monthlyPrice: 5999,
    yearlyPrice: 59990,
    isMostPopular: false,
    features: [
      'Custom AI catalog & pricing solutions',
      '24/7 dedicated account manager',
      'Unlimited warehouses & multi-GSTIN',
      'Access to all 5 autonomous AI agents',
      'Custom ERP / Tally / SAP integrations',
      'Data security and compliance SLA',
    ],
  },
  {
    id: 'price_samrat',
    tierLabel: 'Ultimate',
    name: 'Samrat',
    description: 'The ultimate plan with bespoke AI features for industry leaders',
    monthlyPrice: 8999,
    yearlyPrice: 89990,
    isMostPopular: false,
    features: [
      'Bespoke AI development & model fine-tuning',
      'White-glove onboarding & support',
      'Unlimited projects, brands & storefronts',
      'Priority access to new AI tools',
      'Custom marketplace & logistics integrations',
      'Highest data security and compliance',
    ],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<'privacy' | 'terms' | 'contact' | 'faq' | null>(null);
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [heroShowcaseTab, setHeroShowcaseTab] = useState<'overview' | 'mapping' | 'inventory'>(
    'overview'
  );
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);

  const { isInstallable, install } = usePWAInstall();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubscribeClick = (planId: string) => {
    if (subscribingPlanId) return;
    setSubscribingPlanId(planId);
    setTimeout(() => {
      setSubscribingPlanId(null);
      onNavigate('login', { tab: 'reg' });
    }, 650);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.includes('@')) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactEmail('');
      setContactCompany('');
      setInfoModal(null);
    }, 1800);
  };

  const tickerPlatforms = [
    'Amazon India',
    'Flipkart',
    'Meesho',
    'ONDC',
    'JioMart',
    'Snapdeal',
    'Meta Ads',
    'Google Shopping',
  ];

  const features: {
    icon: string;
    num: string;
    title: string;
    desc: string;
    badge: string;
    screen: DashboardScreen;
  }[] = [
    {
      icon: '🗺️',
      num: '01. AI MAPPING AGENT',
      title: 'Unified Dashboard',
      desc: 'Single dashboard to manage products, inventory, marketing, and customer engagement across all platforms simultaneously.',
      badge: '↓ 90% Time Reduction',
      screen: 'overview',
    },
    {
      icon: '⚡',
      num: '02. AI PRODUCT LISTING',
      title: 'AI Product Listing',
      desc: 'Upload once — AI automatically maps, formats, and lists your products across Amazon, Flipkart, Meesho, and ONDC in seconds.',
      badge: '5 Platforms, 1 Upload',
      screen: 'products',
    },
    {
      icon: '📦',
      num: '03. AI INVENTORY OPTIMIZER',
      title: 'Inventory Optimizer',
      desc: 'Predictive analytics for demand forecasting and stock alerts. Prevent stockouts and overstock situations automatically.',
      badge: '↓ 30% Stock Reduction',
      screen: 'inventory',
    },
    {
      icon: '📊',
      num: '04. AI ANALYTICS',
      title: 'Analytics & Insights',
      desc: 'Real-time predictive insights on sales trends and market opportunities using ML — across all your channels in one view.',
      badge: 'Real-Time ML Insights',
      screen: 'analytics',
    },
    {
      icon: '🤖',
      num: '05. AI CUSTOMER SERVICE',
      title: 'Multilingual Support',
      desc: '24/7 multilingual chatbot supporting 9 Indian languages — handles customer queries, returns, and support autonomously.',
      badge: '↓ 80% Cost Reduction',
      screen: 'overview',
    },
    {
      icon: '📣',
      num: '06. AI CAMPAIGN MANAGER',
      title: 'Campaign Manager',
      desc: 'Automated ad optimization across Amazon and Meta Ads. AI continuously optimizes bids and creatives for maximum ROAS.',
      badge: '↑ 25% ROAS Improvement',
      screen: 'campaigns',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-[#e8e6e0] unisell-noise relative overflow-x-hidden">
      {/* FULL-PAGE INTERACTIVE MAGNETIC PARTICLES CANVAS (from startup-template-sage.vercel.app) */}
      <MagneticParticlesCanvas
        className="fixed inset-0 z-0"
        quantity={95}
        staticity={45}
        ease={50}
        color="#c9a84c"
      />

      {/* TOP BAR CONTRACT: 3 Zones */}
      <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-[5%] py-4 bg-[#0b0f1a]/85 backdrop-blur-md border-b border-[#c9a84c]/20">
        {/* Zone 1: Brand Title */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif-display text-2xl sm:text-[1.8rem] font-bold tracking-[0.08em] text-[#c9a84c] no-underline whitespace-nowrap"
        >
          UNI<span className="text-[#e8e6e0]">SELL</span>
        </a>

        {/* Zone 2: Nav Links */}
        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-8">
          <button
            type="button"
            onClick={() => scrollToSection('features')}
            className="text-[#8a8c96] hover:text-[#c9a84c] text-sm font-medium tracking-wider transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how')}
            className="text-[#8a8c96] hover:text-[#c9a84c] text-sm font-medium tracking-wider transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap"
          >
            How it Works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('pricing')}
            className="text-[#8a8c96] hover:text-[#c9a84c] text-sm font-medium tracking-wider transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('market')}
            className="text-[#8a8c96] hover:text-[#c9a84c] text-sm font-medium tracking-wider transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap"
          >
            Market
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dashboard', { screen: 'overview' })}
            className="text-[#8a8c96] hover:text-[#c9a84c] text-sm font-medium tracking-wider transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap"
          >
            Command Center
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {isInstallable && (
            <button
              type="button"
              onClick={install}
              className="hidden sm:inline-flex items-center gap-1.5 border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c]/15 px-3 py-2 rounded text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              ⬇ Install App
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('login', { tab: 'si' })}
            className="hidden sm:inline-flex items-center justify-center text-xs sm:text-sm font-medium text-[#e8e6e0] hover:text-[#c9a84c] px-3 py-2 transition-colors cursor-pointer bg-transparent border-none whitespace-nowrap"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => onNavigate('login', { tab: 'reg' })}
            className="bg-[#c9a84c] hover:bg-[#e8c97a] text-[#0b0f1a] px-4 sm:px-5 py-2 rounded font-semibold text-xs sm:text-sm tracking-wide transition-colors cursor-pointer border-none whitespace-nowrap"
          >
            Start Free Trial
          </button>
          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden bg-transparent border border-[#c9a84c]/25 rounded-md px-2.5 py-1.5 text-[#e8e6e0] text-base cursor-pointer"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-[61px] left-0 right-0 bg-[#111827]/95 backdrop-blur-lg border-b border-[#c9a84c]/20 z-[99] px-[5%] py-4 flex flex-col gap-2 md:hidden">
          <button
            type="button"
            onClick={() => scrollToSection('features')}
            className="text-left text-[#8a8c96] hover:text-[#c9a84c] text-sm py-2 border-b border-[#c9a84c]/15 bg-transparent"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('how')}
            className="text-left text-[#8a8c96] hover:text-[#c9a84c] text-sm py-2 border-b border-[#c9a84c]/15 bg-transparent"
          >
            How it Works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('pricing')}
            className="text-left text-[#8a8c96] hover:text-[#c9a84c] text-sm py-2 border-b border-[#c9a84c]/15 bg-transparent"
          >
            Pricing
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('market')}
            className="text-left text-[#8a8c96] hover:text-[#c9a84c] text-sm py-2 border-b border-[#c9a84c]/15 bg-transparent"
          >
            Market
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigate('dashboard', { screen: 'overview' });
            }}
            className="text-left text-[#c9a84c] font-semibold text-sm py-2 bg-transparent"
          >
            Open Live Command Center →
          </button>
        </div>
      )}

      {/* HERO SECTION WITH SHIMMER KICKER, ORBITING RINGS & 3D PERSPECTIVE BORDER-BEAM SHOWCASE */}
      <section
        id="top"
        className="relative mx-auto pt-32 pb-16 px-6 md:px-8 max-w-[82rem] text-center overflow-hidden"
      >
        {/* Radial Glow */}
        <div
          className="absolute w-[680px] h-[680px] rounded-full pointer-events-none top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Orbiting Rings */}
        <div
          className="unisell-ring w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] lg:w-[480px] lg:h-[480px]"
          style={{ animationDuration: '30s', top: '28%' }}
        >
          <div className="unisell-ring-dot" />
        </div>
        <div
          className="unisell-ring w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] lg:w-[680px] lg:h-[680px]"
          style={{ animationDuration: '45s', animationDirection: 'reverse', top: '28%' }}
        >
          <div className="unisell-ring-dot" />
        </div>
        <div
          className="unisell-ring w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[900px] lg:h-[900px]"
          style={{ animationDuration: '60s', top: '28%' }}
        >
          <div className="unisell-ring-dot" />
        </div>

        {/* Magic UI Animated Shimmer Kicker Button */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard', { screen: 'overview' })}
          className="gravity-target relative z-10 backdrop-blur-[12px] inline-flex h-8 items-center justify-between rounded-full border border-[#c9a84c]/35 bg-white/[0.06] px-4 text-xs transition-all ease-in hover:cursor-pointer hover:bg-white/[0.12] hover:border-[#c9a84c] group gap-1.5 mb-6 unisell-fade-up"
        >
          <Sparkles className="size-3.5 text-[#c9a84c]" />
          <span className="unisell-shimmer-text font-medium tracking-wide">
            Introducing UNISELL AI 2.0 — List Once, Sell Everywhere
          </span>
          <ChevronRight className="ml-0.5 size-3.5 text-[#c9a84c] transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </button>

        {/* Hero Headline */}
        <h1 className="gravity-target relative z-10 font-serif-display bg-gradient-to-br from-[#ffffff] from-30% via-[#e8e6e0] to-[#c9a84c]/80 bg-clip-text text-transparent text-[clamp(2.85rem,8vw,6.8rem)] font-bold leading-[1.04] tracking-tight text-balance unisell-fade-up">
          List <span className="italic font-normal text-[#e8e6e0]">Once.</span>
          <br />
          Sell <span className="text-[#c9a84c]">Everywhere.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="gravity-target relative z-10 mt-6 mx-auto text-base sm:text-lg md:text-xl text-[#8a8c96] max-w-[620px] leading-[1.7] text-balance unisell-fade-up">
          UNISELL empowers 63 million Indian SMEs to manage Amazon, Flipkart, Meesho &amp; ONDC from a single intelligent command center — reducing operations by 90%.
        </p>

        {/* Hero Actions */}
        <div className="gravity-target relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto unisell-fade-up">
          <button
            type="button"
            onClick={() => onNavigate('login', { tab: 'reg' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#c9a84c] hover:bg-[#e8c97a] text-[#0b0f1a] px-8 py-3.5 rounded-lg font-bold text-[0.95rem] cursor-pointer border-none transition-all hover:-translate-y-0.5 shadow-[0_0_30px_rgba(201,168,76,0.3)] group whitespace-nowrap"
          >
            <span>Get Started for Free</span>
            <ChevronRight className="size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dashboard', { screen: 'overview' })}
            className="w-full sm:w-auto bg-[#111827]/70 hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#e8e6e0] px-8 py-3.5 rounded-lg font-medium text-[0.95rem] cursor-pointer border border-[#c9a84c]/25 transition-colors whitespace-nowrap backdrop-blur-sm"
          >
            Launch Live Demo
          </button>
        </div>

        {/* Hero Stats */}
        <div className="gravity-target relative z-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 mt-14 unisell-fade-up">
          <div className="text-center">
            <div className="font-serif-display text-3xl sm:text-[2.4rem] font-bold text-[#c9a84c] leading-none font-mono-code">
              90%
            </div>
            <div className="text-xs text-[#8a8c96] mt-1.5 tracking-wider">Time Saved</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-[#c9a84c]/20" />
          <div className="text-center">
            <div className="font-serif-display text-3xl sm:text-[2.4rem] font-bold text-[#c9a84c] leading-none font-mono-code">
              5
            </div>
            <div className="text-xs text-[#8a8c96] mt-1.5 tracking-wider">AI Agents</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-[#c9a84c]/20" />
          <div className="text-center">
            <div className="font-serif-display text-3xl sm:text-[2.4rem] font-bold text-[#c9a84c] leading-none font-mono-code">
              ₹345B
            </div>
            <div className="text-xs text-[#8a8c96] mt-1.5 tracking-wider">Market by 2030</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-[#c9a84c]/20" />
          <div className="text-center">
            <div className="font-serif-display text-3xl sm:text-[2.4rem] font-bold text-[#c9a84c] leading-none font-mono-code">
              9
            </div>
            <div className="text-xs text-[#8a8c96] mt-1.5 tracking-wider">Indian Languages</div>
          </div>
        </div>

        {/* 3D PERSPECTIVE HERO COMMAND CENTER SHOWCASE WITH BORDER-BEAM & IMAGE-GLOW (from startup-template-sage.vercel.app) */}
        <div
          data-testid="hero-perspective-showcase"
          className="relative mt-20 sm:mt-24 unisell-fade-up [perspective:2000px] after:pointer-events-none after:absolute after:inset-0 after:z-30 after:[background:linear-gradient(to_top,#0b0f1a_16%,transparent_55%)]"
        >
          <div className="relative rounded-2xl border border-[#c9a84c]/30 bg-[#111827]/90 shadow-[0_25px_90px_-15px_rgba(0,0,0,0.85)] before:pointer-events-none before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(160px)] before:[background-image:linear-gradient(to_bottom,#c9a84c,#9c40ff,transparent_45%)] before:animate-image-glow overflow-hidden">
            {/* Animated BorderBeam traveling around the showcase */}
            <BorderBeam
              size={240}
              duration={11}
              delay={0}
              colorFrom="#c9a84c"
              colorTo="#9c40ff"
              borderWidth={1.5}
            />

            {/* Browser Top Chrome + Interactive Preview Mode Switcher */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#090d18]/90 border-b border-[#c9a84c]/20">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 font-mono-code text-xs text-[#8a8c96]">
                  app.unisell.in — AI Command Center
                </span>
              </div>

              {/* Interactive Segmented Control */}
              <div className="flex items-center gap-1 bg-[#161d2e] p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  onClick={() => setHeroShowcaseTab('overview')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    heroShowcaseTab === 'overview'
                      ? 'bg-[#c9a84c] text-[#0b0f1a] font-semibold'
                      : 'text-[#8a8c96] hover:text-[#e8e6e0] bg-transparent'
                  }`}
                >
                  Live Overview
                </button>
                <button
                  type="button"
                  onClick={() => setHeroShowcaseTab('mapping')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    heroShowcaseTab === 'mapping'
                      ? 'bg-[#c9a84c] text-[#0b0f1a] font-semibold'
                      : 'text-[#8a8c96] hover:text-[#e8e6e0] bg-transparent'
                  }`}
                >
                  AI Listing Sync
                </button>
                <button
                  type="button"
                  onClick={() => setHeroShowcaseTab('inventory')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    heroShowcaseTab === 'inventory'
                      ? 'bg-[#c9a84c] text-[#0b0f1a] font-semibold'
                      : 'text-[#8a8c96] hover:text-[#e8e6e0] bg-transparent'
                  }`}
                >
                  Inventory Radar
                </button>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('dashboard', { screen: 'overview' })}
                className="text-xs font-mono-code text-[#c9a84c] hover:text-[#e8c97a] bg-transparent border-none cursor-pointer whitespace-nowrap"
              >
                Open Full Screen ↗
              </button>
            </div>

            {/* Showcase Interior */}
            <div className="relative z-20 p-5 sm:p-8 text-left">
              {heroShowcaseTab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {[
                      {
                        label: 'TOTAL GMV (30D)',
                        val: '₹4,24,800',
                        delta: '+18.4% vs last month',
                      },
                      {
                        label: 'ORDERS SYNCED TODAY',
                        val: '347',
                        delta: 'Zero manual entry · 4 channels',
                      },
                      {
                        label: 'ACTIVE MULTI-LISTINGS',
                        val: '1,284',
                        delta: '99.4% catalog health score',
                      },
                      {
                        label: 'BLENDED AD ROAS',
                        val: '4.2x',
                        delta: '+25% via AI Campaign Agent',
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl border border-[#c9a84c]/20 bg-[#0b0f1a]/90 p-4"
                      >
                        <div className="text-[11px] font-mono-code text-[#8a8c96] tracking-wider">
                          {stat.label}
                        </div>
                        <div className="mt-1.5 font-serif-display text-2xl sm:text-3xl font-bold text-[#c9a84c] font-mono-code">
                          {stat.val}
                        </div>
                        <div className="mt-1 text-xs text-[#3ecf8e]">{stat.delta}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
                    {/* Multi-channel Revenue Bars */}
                    <div className="rounded-xl border border-white/10 bg-[#0b0f1a]/80 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono-code text-[#8a8c96]">
                          REAL-TIME CHANNEL VELOCITY (AMAZON · FLIPKART · MEESHO · ONDC)
                        </span>
                        <span className="text-xs text-[#3ecf8e] font-mono-code">
                          ● Live Telemetry
                        </span>
                      </div>
                      <div className="flex items-end gap-2.5 h-32 pt-4">
                        {[48, 62, 54, 78, 69, 86, 74, 92, 81, 96, 88, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-gradient-to-t from-[#c9a84c]/15 to-[#c9a84c]/70 border-t-2 border-[#e8c97a] unisell-bar-grow"
                            style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Active Autonomous Agents Status */}
                    <div className="rounded-xl border border-white/10 bg-[#0b0f1a]/80 p-5 flex flex-col justify-between gap-2.5">
                      <div className="text-xs font-mono-code text-[#8a8c96] mb-1">
                        AUTONOMOUS AI AGENTS
                      </div>
                      {[
                        {
                          name: 'AI Mapping Agent 2.0',
                          state: 'Synced 8 SKUs across 4 channels',
                        },
                        {
                          name: 'Inventory Forecaster',
                          state: 'Diwali surge alert: Banarasi Silk',
                        },
                        {
                          name: 'Multilingual Support Bot',
                          state: 'Resolved 142 Hindi & Tamil queries',
                        },
                      ].map((ag) => (
                        <div
                          key={ag.name}
                          className="flex items-center justify-between rounded-lg bg-[#161d2e]/80 px-3.5 py-2.5 border border-white/5"
                        >
                          <div>
                            <div className="text-xs font-semibold text-[#e8e6e0]">{ag.name}</div>
                            <div className="text-[11px] text-[#8a8c96]">{ag.state}</div>
                          </div>
                          <span className="text-[11px] font-mono-code text-[#3ecf8e]">Active</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {heroShowcaseTab === 'mapping' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                  {[
                    {
                      sku: 'SAR-BNR-001',
                      title: 'Banarasi Silk Saree — Royal Blue',
                      price: '₹4,299',
                      channels: 'Amazon · Flipkart · Meesho · ONDC',
                      status: 'Mapped in 3.2s',
                    },
                    {
                      sku: 'KUR-CHK-002',
                      title: 'Lucknowi Chikankari Kurta Set',
                      price: '₹1,849',
                      channels: 'Amazon · Flipkart · Meesho',
                      status: 'HSN & GST Verified',
                    },
                    {
                      sku: 'JWL-KND-004',
                      title: 'Jaipuri Kundan Bridal Necklace',
                      price: '₹3,499',
                      channels: 'Amazon · Flipkart · ONDC',
                      status: '9 Regional Titles Ready',
                    },
                  ].map((item) => (
                    <div
                      key={item.sku}
                      className="rounded-xl border border-[#c9a84c]/25 bg-[#0b0f1a]/90 p-5"
                    >
                      <div className="font-mono-code text-xs text-[#c9a84c]">{item.sku}</div>
                      <div className="font-serif-display text-xl font-bold text-[#e8e6e0] mt-1">
                        {item.title}
                      </div>
                      <div className="mt-2 font-mono-code text-lg font-bold text-[#3ecf8e]">
                        {item.price}
                      </div>
                      <div className="mt-3 text-xs text-[#8a8c96]">{item.channels}</div>
                      <div className="mt-3 pt-3 border-t border-white/10 text-xs text-[#c9a84c] font-mono-code">
                        ✦ {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {heroShowcaseTab === 'inventory' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                  {[
                    {
                      product: 'Chanderi Cotton Dupatta',
                      stock: '4 units left',
                      forecast: 'Depletes in 36 hours · Reorder 120 units',
                      urgency: 'Critical Low Stock',
                    },
                    {
                      product: 'Banarasi Silk Saree - Royal Blue',
                      stock: '48 units in stock',
                      forecast: '+64% wedding season velocity predicted',
                      urgency: 'Optimal Buffer',
                    },
                    {
                      product: 'Kolhapuri Handcrafted Mojari',
                      stock: '19 units in stock',
                      forecast: 'Auto-synced across 4 marketplace warehouses',
                      urgency: 'Synced Live',
                    },
                  ].map((inv) => (
                    <div
                      key={inv.product}
                      className="rounded-xl border border-[#c9a84c]/25 bg-[#0b0f1a]/90 p-5"
                    >
                      <div className="text-xs font-mono-code text-[#c9a84c]">{inv.urgency}</div>
                      <div className="font-serif-display text-xl font-bold text-[#e8e6e0] mt-1">
                        {inv.product}
                      </div>
                      <div className="mt-2 font-mono-code text-base text-[#e8e6e0]">
                        {inv.stock}
                      </div>
                      <div className="mt-2 text-xs text-[#8a8c96] leading-relaxed">
                        {inv.forecast}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY TEAMS & MARKETPLACES SECTION (#clients from startup-template-sage.vercel.app) */}
      <section
        id="clients"
        className="relative z-10 text-center mx-auto max-w-[80rem] px-6 md:px-8 pt-6 pb-8"
      >
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          <h2 className="text-center text-xs sm:text-sm font-mono-code font-semibold tracking-[0.2em] text-[#8a8c96] uppercase">
            INTEGRATED WITH INDIA&apos;S LEADING COMMERCE &amp; LOGISTICS INFRASTRUCTURE
          </h2>
          <div className="mt-8">
            <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 list-none p-0 m-0">
              {[
                { name: 'AMAZON INDIA', sub: 'SP-API Partner' },
                { name: 'FLIPKART', sub: 'Seller Hub Sync' },
                { name: 'MEESHO', sub: '0% Commission Feed' },
                { name: 'ONDC NETWORK', sub: 'Protocol Ready' },
                { name: 'SHIPROCKET', sub: 'Auto-Dispatch' },
                { name: 'RAZORPAY', sub: 'Instant Settlements' },
              ].map((brand) => (
                <li
                  key={brand.name}
                  className="group flex flex-col items-center opacity-75 hover:opacity-100 transition-opacity"
                >
                  <span className="font-serif-display text-lg sm:text-xl font-bold tracking-[0.12em] text-[#e8e6e0] group-hover:text-[#c9a84c] transition-colors">
                    {brand.name}
                  </span>
                  <span className="text-[10px] font-mono-code text-[#8a8c96] tracking-wider">
                    {brand.sub}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CURVED PLANETARY HORIZON SPHERE MASK (from startup-template-sage.vercel.app) */}
      <SphereMask />

      {/* PLATFORMS TICKER */}
      <div className="border-t border-b border-[#c9a84c]/20 py-4 overflow-hidden bg-[#c9a84c]/[0.03] relative z-10">
        <div className="unisell-ticker-track">
          {[...tickerPlatforms, ...tickerPlatforms].map((plat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-[#8a8c96] text-sm font-medium tracking-wider"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
              <span>{plat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-[5%] bg-[#111827]/90 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="font-mono-code text-xs text-[#c9a84c] tracking-[0.18em] uppercase mb-3">
            01. Core Intelligence
          </div>
          <h2 className="font-serif-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.15]">
            Five AI Agents,
            <br />
            <span className="italic font-normal">One Command Center</span>
          </h2>
          <p className="text-[#8a8c96] mt-3 max-w-[520px] leading-[1.7]">
            A comprehensive suite of intelligent agents automating the entire D2C e-commerce value chain for Indian SMEs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.5px] mt-14 border border-[#c9a84c]/20 rounded-xl overflow-hidden bg-[#c9a84c]/20">
            {features.map((f) => (
              <div
                key={f.num}
                onClick={() => onNavigate('dashboard', { screen: f.screen })}
                className="feature-card-item bg-[#0b0f1a] hover:bg-[#1a2236] p-8 sm:p-10 relative overflow-hidden transition-colors cursor-pointer group"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
                  }}
                />
                <div className="w-12 h-12 rounded-lg bg-[#c9a84c]/15 border border-[#c9a84c]/25 flex items-center justify-center text-2xl mb-6">
                  {f.icon}
                </div>
                <div className="font-mono-code text-[0.68rem] text-[#c9a84c] tracking-[0.1em] mb-3">
                  {f.num}
                </div>
                <h3 className="font-serif-display text-2xl font-semibold mb-3 text-[#e8e6e0]">
                  {f.title}
                </h3>
                <p className="text-[#8a8c96] text-sm leading-[1.7]">{f.desc}</p>
                <div className="mt-5 text-[#c9a84c] text-xs font-semibold tracking-wider">
                  {f.badge} · <span className="underline">Explore in Command Center →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="py-24 px-[5%] bg-[#0b0f1a] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="font-mono-code text-xs text-[#c9a84c] tracking-[0.18em] uppercase mb-3">
            02. Process
          </div>
          <h2 className="font-serif-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.15]">
            Up and running
            <br />
            <span className="italic font-normal">in 3 steps</span>
          </h2>
          <p className="text-[#8a8c96] mt-3 max-w-[520px] leading-[1.7]">
            Designed for non-technical users. No coding. No complexity. Just results.
          </p>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-0 mt-16 relative">
            <div
              className="hidden md:block absolute top-9 left-[12%] right-[12%] h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
              }}
            />

            {[
              {
                num: '1',
                title: 'Connect Platforms',
                desc: 'Link your Amazon Seller, Flipkart, Meesho, and ONDC accounts with one-click OAuth. Takes under 2 minutes.',
              },
              {
                num: '2',
                title: 'Upload Products',
                desc: 'Add your products once. The AI Mapping Agent formats and pushes listings to all connected platforms automatically.',
              },
              {
                num: '3',
                title: 'Let AI Work',
                desc: "UNISELL's 5 AI agents manage inventory, ads, customer service, and analytics — while you focus on growing your business.",
              },
            ].map((st) => (
              <div key={st.num} className="step-card-item flex-1 text-center px-6 relative z-10 max-w-sm">
                <div className="w-[72px] h-[72px] rounded-full bg-[#111827] border-2 border-[#c9a84c] flex items-center justify-center mx-auto mb-6 font-serif-display text-2xl font-bold text-[#c9a84c] relative">
                  <span>{st.num}</span>
                  <div className="absolute -inset-1.5 rounded-full border border-[#c9a84c]/20 pointer-events-none" />
                </div>
                <h3 className="font-serif-display text-xl font-semibold mb-2">{st.title}</h3>
                <p className="text-[#8a8c96] text-sm leading-[1.65]">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section className="py-24 px-[5%] bg-[#111827]/90 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="font-mono-code text-xs text-[#c9a84c] tracking-[0.18em] uppercase mb-3">
              03. Command Center
            </div>
            <h2 className="font-serif-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.15]">
              Your entire business,
              <br />
              <span className="italic font-normal">one screen</span>
            </h2>
            <p className="text-[#8a8c96] mt-3 max-w-[520px] leading-[1.7]">
              Real-time insights across Amazon, Flipkart, Meesho and ONDC — unified in a single, intelligent dashboard built for Indian sellers.
            </p>

            <ul className="mt-6 space-y-2.5 text-[#8a8c96] text-sm list-none">
              <li>✦ &nbsp;Unified order management</li>
              <li>✦ &nbsp;Cross-platform inventory sync</li>
              <li>✦ &nbsp;AI-generated sales forecasts</li>
              <li>✦ &nbsp;One-click bulk listing updates</li>
              <li>✦ &nbsp;Real-time profit &amp; loss view</li>
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('dashboard', { screen: 'overview' })}
              className="mt-8 bg-[#c9a84c]/15 hover:bg-[#c9a84c] text-[#c9a84c] hover:text-[#0b0f1a] border border-[#c9a84c]/40 px-6 py-3 rounded font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              Launch Interactive Command Center →
            </button>
          </div>

          {/* Interactive Preview Window */}
          <div
            onClick={() => onNavigate('dashboard', { screen: 'overview' })}
            className="bg-[#1a2236] border border-[#c9a84c]/25 rounded-2xl overflow-hidden cursor-pointer hover:border-[#c9a84c]/60 transition-colors shadow-2xl"
          >
            <div className="bg-[#111827] px-5 py-3.5 border-b border-[#c9a84c]/20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs text-[#8a8c96] font-mono-code">
                unisell.app — Command Center
              </span>
              <span className="ml-auto text-[11px] text-[#c9a84c] font-mono-code">
                Click to interact ↗
              </span>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#111827] border border-[#c9a84c]/20 rounded-lg p-4">
                  <div className="text-[0.68rem] text-[#8a8c96] tracking-wider mb-1">TOTAL REVENUE</div>
                  <div className="font-serif-display text-2xl font-bold text-[#c9a84c] font-mono-code">
                    ₹4.2L
                  </div>
                  <div className="text-[0.68rem] text-[#4caf7e] mt-1">↑ 18% this month</div>
                </div>
                <div className="bg-[#111827] border border-[#c9a84c]/20 rounded-lg p-4">
                  <div className="text-[0.68rem] text-[#8a8c96] tracking-wider mb-1">ORDERS TODAY</div>
                  <div className="font-serif-display text-2xl font-bold text-[#c9a84c] font-mono-code">
                    347
                  </div>
                  <div className="text-[0.68rem] text-[#4caf7e] mt-1">↑ 12% vs yesterday</div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-[#111827] border border-[#c9a84c]/20 rounded-lg p-4">
                  <div className="text-[0.68rem] text-[#8a8c96] tracking-wider mb-1">ACTIVE LISTINGS</div>
                  <div className="font-serif-display text-2xl font-bold text-[#c9a84c] font-mono-code">
                    1,284
                  </div>
                  <div className="text-[0.68rem] text-[#4caf7e] mt-1">↑ 42 new</div>
                </div>
              </div>

              <div className="hidden sm:block bg-[#111827] border border-[#c9a84c]/20 rounded-lg p-4">
                <div className="text-[0.7rem] text-[#8a8c96] mb-3">WEEKLY SALES — ALL PLATFORMS</div>
                <div className="flex items-end gap-2 h-[60px]">
                  {[55, 70, 45, 80, 65, 90, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-[#c9a84c]/15 border-t-2 border-[#c9a84c] unisell-bar-grow"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { name: 'Amazon India', color: '#ff9900', pct: 78, val: '₹1.8L' },
                  { name: 'Flipkart', color: '#2874f0', pct: 55, val: '₹1.2L' },
                  { name: 'Meesho', color: '#e94560', pct: 40, val: '₹82K' },
                  { name: 'ONDC', color: '#4caf7e', pct: 22, val: '₹38K' },
                ].map((plat) => (
                  <div
                    key={plat.name}
                    className="bg-[#111827] border border-[#c9a84c]/20 rounded-md px-4 py-2.5 flex items-center justify-between"
                  >
                    <div className="text-xs font-medium flex items-center gap-2 w-28">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: plat.color }}
                      />
                      <span>{plat.name}</span>
                    </div>
                    <div className="flex-1 mx-4 h-1 bg-white/5 rounded">
                      <div
                        className="h-full rounded bg-[#c9a84c]"
                        style={{ width: `${plat.pct}%` }}
                      />
                    </div>
                    <div className="font-mono-code text-xs text-[#c9a84c] w-12 text-right">
                      {plat.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE 4-TIER PRICING SECTION WITH MONTHLY / ANNUAL TOGGLE (from startup-template-sage.vercel.app Module 1638) */}
      <section id="pricing" className="py-24 px-[5%] bg-[#0b0f1a] relative z-10">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-2 md:px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="font-mono-code text-xs text-[#c9a84c] tracking-[0.18em] uppercase mb-3">
              04. Pricing
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#e8e6e0]">
              Simple, <span className="italic font-normal text-[#c9a84c]">transparent</span> pricing for everyone.
            </h2>
            <p className="mt-5 text-base sm:text-lg leading-8 text-[#8a8c96]">
              Choose an <strong className="text-[#e8e6e0] font-semibold">affordable plan</strong> that&apos;s packed with autonomous AI agents for multi-channel listing, inventory forecasting, and driving profitable GMV.
            </p>
          </div>

          {/* Monthly / Annual Switch Toggle with "2 MONTHS FREE ✨" */}
          <div className="flex w-full items-center justify-center gap-3 mt-2">
            <span
              className={`text-sm font-medium ${
                billingInterval === 'month' ? 'text-[#e8e6e0]' : 'text-[#8a8c96]'
              }`}
            >
              Monthly
            </span>
            <button
              id="interval"
              type="button"
              role="switch"
              aria-checked={billingInterval === 'year'}
              aria-label="Toggle annual billing"
              onClick={() =>
                setBillingInterval((prev) => (prev === 'month' ? 'year' : 'month'))
              }
              className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none ${
                billingInterval === 'year' ? 'bg-[#c9a84c]' : 'bg-[#1a2236] border-[#c9a84c]/30'
              }`}
            >
              <span
                className={`pointer-events-none block h-4 w-4 rounded-full bg-[#0b0f1a] shadow-lg transition-transform ${
                  billingInterval === 'year'
                    ? 'translate-x-5 bg-[#0b0f1a]'
                    : 'translate-x-0.5 bg-[#e8e6e0]'
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                billingInterval === 'year' ? 'text-[#e8e6e0]' : 'text-[#8a8c96]'
              }`}
            >
              Annual
            </span>
            <span className="inline-block whitespace-nowrap rounded-full bg-[#c9a84c] px-2.5 py-1 text-[11px] font-bold uppercase leading-4 tracking-wide text-[#0b0f1a]">
              2 MONTHS FREE ✨
            </span>
          </div>

          {/* 4-Column Pricing Grid */}
          <div className="mx-auto grid w-full justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {PRICING_PLANS.map((plan) => {
              const displayPrice =
                billingInterval === 'year'
                  ? plan.yearlyPrice.toLocaleString('en-IN')
                  : plan.monthlyPrice.toLocaleString('en-IN');
              const isSubscribing = subscribingPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`price-card-item relative flex flex-col gap-6 rounded-2xl p-6 text-[#e8e6e0] overflow-hidden transition-transform hover:-translate-y-1 ${
                    plan.isMostPopular
                      ? 'border-2 border-[#c9a84c] bg-gradient-to-b from-[#c9a84c]/12 via-[#111827] to-[#0b0f1a] shadow-[0_0_40px_rgba(201,168,76,0.16)]'
                      : 'border border-[#c9a84c]/20 bg-[#111827]/75'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-mono-code text-[#c9a84c] tracking-wider uppercase mb-1">
                      {plan.tierLabel}
                    </div>
                    <h3 className="font-serif-display text-2xl font-bold leading-7 text-[#e8e6e0]">
                      {plan.name}
                    </h3>
                    <p className="mt-2 min-h-[40px] text-xs leading-5 text-[#8a8c96]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Animated Price Display */}
                  <div
                    key={`${plan.id}-${billingInterval}`}
                    className="flex items-baseline gap-1 unisell-fade-up"
                  >
                    <span className="font-serif-display text-4xl font-bold text-[#c9a84c] font-mono-code">
                      ₹{displayPrice}
                    </span>
                    <span className="text-xs text-[#8a8c96] font-mono-code">
                      / {billingInterval}
                    </span>
                  </div>

                  {/* Subscribe Button with Shimmer Sweep & Spinner */}
                  <button
                    type="button"
                    disabled={subscribingPlanId !== null}
                    onClick={() => handleSubscribeClick(plan.id)}
                    className={`group relative inline-flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-lg text-sm font-bold tracking-wide transition-all duration-300 ease-out cursor-pointer whitespace-nowrap ${
                      plan.isMostPopular
                        ? 'bg-[#c9a84c] text-[#0b0f1a] hover:bg-[#e8c97a] hover:ring-2 hover:ring-[#c9a84c] hover:ring-offset-2 hover:ring-offset-[#0b0f1a]'
                        : 'bg-[#1a2236] text-[#e8e6e0] border border-[#c9a84c]/30 hover:border-[#c9a84c] hover:text-[#c9a84c] hover:ring-2 hover:ring-[#c9a84c]/50'
                    }`}
                  >
                    <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-15 transition-all duration-1000 ease-out group-hover:-translate-x-96" />
                    {isSubscribing ? (
                      <>
                        <span>Subscribing</span>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </button>

                  <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-transparent via-[#c9a84c]/35 to-transparent" />

                  <ul className="flex flex-col gap-2.5 font-normal list-none p-0 m-0">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs font-medium text-[#e8e6e0]/90"
                      >
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3ecf8e] p-[2px] text-[#0b0f1a]">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MARKET OPPORTUNITY SECTION */}
      <section id="market" className="py-24 px-[5%] bg-[#111827]/90 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="font-mono-code text-xs text-[#c9a84c] tracking-[0.18em] uppercase mb-3">
            05. Market Opportunity
          </div>
          <h2 className="font-serif-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.15]">
            A <span className="italic font-normal">₹28 Lakh Crore</span>
            <br />
            opportunity awaits
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-center mt-12">
            <div>
              <div className="market-stat-item mb-8 pb-8 border-b border-[#c9a84c]/20">
                <div className="font-serif-display text-5xl font-bold text-[#c9a84c] font-mono-code">
                  $150B
                </div>
                <div className="text-[#8a8c96] text-sm mt-1.5">
                  Current Indian e-commerce market size (2025)
                </div>
              </div>
              <div className="market-stat-item mb-8 pb-8 border-b border-[#c9a84c]/20">
                <div className="font-serif-display text-5xl font-bold text-[#c9a84c] font-mono-code">
                  $345B
                </div>
                <div className="text-[#8a8c96] text-sm mt-1.5">
                  Projected market by 2030 — 19% CAGR growth
                </div>
              </div>
              <div className="market-stat-item">
                <div className="font-serif-display text-5xl font-bold text-[#c9a84c] font-mono-code">
                  63M
                </div>
                <div className="text-[#8a8c96] text-sm mt-1.5">
                  Indian MSMEs — our primary addressable market
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <svg width="260" height="260" viewBox="0 0 260 260">
                <circle
                  cx="130"
                  cy="130"
                  r="100"
                  fill="none"
                  stroke="rgba(201,168,76,0.08)"
                  strokeWidth="36"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="100"
                  fill="none"
                  stroke="#c9a84c"
                  strokeWidth="36"
                  strokeDasharray="628"
                  strokeDashoffset="157"
                  strokeLinecap="round"
                  transform="rotate(-90 130 130)"
                />
                <circle
                  cx="130"
                  cy="130"
                  r="100"
                  fill="none"
                  stroke="rgba(79,142,247,0.4)"
                  strokeWidth="36"
                  strokeDasharray="628"
                  strokeDashoffset="471"
                  strokeLinecap="round"
                  transform="rotate(-90 130 130)"
                />
                <circle cx="130" cy="130" r="72" fill="#111827" />
                <text
                  x="130"
                  y="122"
                  textAnchor="middle"
                  fontFamily="Cormorant Garamond"
                  fontSize="26"
                  fill="#c9a84c"
                  fontWeight="700"
                >
                  63M
                </text>
                <text
                  x="130"
                  y="144"
                  textAnchor="middle"
                  fontFamily="DM Sans"
                  fontSize="11"
                  fill="#8a8c96"
                >
                  Indian SMEs
                </text>
                <text
                  x="130"
                  y="160"
                  textAnchor="middle"
                  fontFamily="DM Sans"
                  fontSize="10"
                  fill="#8a8c96"
                >
                  Untapped
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 5-ROW ANIMATED MARQUEE TILE MATRIX CTA SECTION (from startup-template-sage.vercel.app Module 1001) */}
      <MarqueeTileMatrixCTA
        onStartTrial={() => onNavigate('login', { tab: 'reg' })}
        onOpenCommandCenter={() => onNavigate('dashboard', { screen: 'overview' })}
      />

      {/* MULTI-COLUMN STARTUP FOOTER (from startup-template-sage.vercel.app + UNISELL) */}
      <footer className="bg-[#0b0f1a] border-t border-[#c9a84c]/20 relative z-10">
        <div className="mx-auto w-full max-w-screen-xl px-6 md:px-8 py-14">
          <div className="md:flex md:justify-between gap-8 pb-12 border-b border-white/10">
            <div className="mb-10 md:mb-0 flex flex-col gap-3 max-w-xs">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="font-serif-display text-2xl font-bold tracking-[0.08em] text-[#c9a84c] no-underline"
              >
                UNI<span className="text-[#e8e6e0]">SELL</span>
              </a>
              <p className="text-sm text-[#8a8c96] leading-relaxed">
                AI-Powered Multi-Channel E-Commerce Command Center for 63M Indian MSMEs. List Once, Sell Everywhere.
              </p>
              <div className="text-xs text-[#c9a84c] font-mono-code">✦ UNISELL · Built by Hanish</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
              <div>
                <h2 className="mb-4 text-xs font-mono-code tracking-wider font-semibold text-[#e8e6e0] uppercase">
                  Product
                </h2>
                <ul className="gap-2.5 grid list-none p-0 m-0">
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToSection('features')}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      AI Mapping Agent
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => scrollToSection('pricing')}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      Pricing Plans
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onNavigate('dashboard', { screen: 'overview' })}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      Command Center
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setInfoModal('faq')}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      FAQ
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-xs font-mono-code tracking-wider font-semibold text-[#e8e6e0] uppercase">
                  Community
                </h2>
                <ul className="gap-2.5 grid list-none p-0 m-0">
                  <li>
                    <button
                      type="button"
                      onClick={() => setInfoModal('contact')}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      Seller Discord
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setInfoModal('contact')}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      Twitter / X
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setInfoModal('contact')}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      Enterprise Sales
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-xs font-mono-code tracking-wider font-semibold text-[#e8e6e0] uppercase">
                  Legal
                </h2>
                <ul className="gap-2.5 grid list-none p-0 m-0">
                  <li>
                    <button
                      type="button"
                      onClick={() => setInfoModal('terms')}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setInfoModal('privacy')}
                      className="cursor-pointer text-[#8a8c96] hover:text-[#c9a84c] duration-200 text-sm bg-transparent border-none p-0"
                    >
                      Privacy Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#8a8c96]">
              Copyright © {new Date().getFullYear()} UNISELL. All Rights Reserved.
            </span>
            <div className="flex items-center gap-6 text-xs text-[#8a8c96]">
              <span>Amazon SP-API Ready</span>
              <span>·</span>
              <span>ONDC Protocol v1.2</span>
              <span>·</span>
              <span>ISO 27001 Encrypted</span>
            </div>
          </div>
        </div>
      </footer>

      {/* INFO / CONTACT / FAQ MODAL */}
      {infoModal && (
        <div
          onClick={() => setInfoModal(null)}
          className="fixed inset-0 bg-[#090d18]/85 backdrop-blur-sm flex items-center justify-center z-[2000] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111827] border border-[#c9a84c]/30 rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setInfoModal(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1a2236] border border-white/10 text-[#8a8c96] hover:text-[#c9a84c] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            {infoModal === 'privacy' && (
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#c9a84c] mb-3">
                  Privacy Policy
                </h3>
                <p className="text-sm text-[#8a8c96] leading-relaxed">
                  UNISELL encrypts all seller credentials, marketplace OAuth tokens, and order records using AES-256 encryption. Your catalog and sales metrics are never shared with third-party sellers or external ad networks.
                </p>
              </div>
            )}

            {infoModal === 'terms' && (
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#c9a84c] mb-3">
                  Terms of Service
                </h3>
                <p className="text-sm text-[#8a8c96] leading-relaxed">
                  All UNISELL subscriptions include a 14-day free trial with zero platform lock-in. Sellers retain 100% ownership of product listings, brand assets, and marketplace accounts across Amazon India, Flipkart, Meesho, and ONDC.
                </p>
              </div>
            )}

            {infoModal === 'faq' && (
              <div className="space-y-4">
                <h3 className="font-serif-display text-2xl font-bold text-[#c9a84c]">
                  Frequently Asked Questions
                </h3>
                <div>
                  <div className="text-sm font-semibold text-[#e8e6e0]">
                    How fast is marketplace onboarding?
                  </div>
                  <p className="text-xs text-[#8a8c96] mt-1">
                    Connecting Amazon India, Flipkart, Meesho, and ONDC takes under 2 minutes via 1-click OAuth.
                  </p>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#e8e6e0]">
                    Can I switch between Monthly and Annual plans?
                  </div>
                  <p className="text-xs text-[#8a8c96] mt-1">
                    Yes — switching to Annual billing gives you 2 months free automatically across Uday, Pragati, Udyog, and Samrat plans.
                  </p>
                </div>
              </div>
            )}

            {infoModal === 'contact' && (
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#c9a84c] mb-1">
                  Contact UNISELL Enterprise
                </h3>
                <p className="text-xs text-[#8a8c96] mb-5">
                  Get a custom Udyog/Samrat deployment or schedule a 1-on-1 onboarding call.
                </p>
                {contactSent ? (
                  <div className="p-4 rounded-lg bg-[#3ecf8e]/15 border border-[#3ecf8e]/30 text-[#3ecf8e] text-sm text-center">
                    ✓ Request received! Our enterprise team will reach out within 4 hours.
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#8a8c96] mb-1">Business Email</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="founder@brand.in"
                        className="w-full bg-[#1a2236] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e8e6e0] outline-none focus:border-[#c9a84c]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#8a8c96] mb-1">Store / Brand Name</label>
                      <input
                        type="text"
                        value={contactCompany}
                        onChange={(e) => setContactCompany(e.target.value)}
                        placeholder="Mehta Ethnic House"
                        className="w-full bg-[#1a2236] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-[#e8e6e0] outline-none focus:border-[#c9a84c]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#c9a84c] hover:bg-[#e8c97a] text-[#0b0f1a] font-bold py-3 rounded-lg text-sm cursor-pointer border-none"
                    >
                      Request Enterprise Callback →
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING UNISELL AI ASSISTANT ON LANDING PAGE */}
      <FloatingAIAssistant
        onOpenCommandCenter={() => onNavigate('dashboard', { screen: 'overview' })}
      />
    </div>
  );
};
