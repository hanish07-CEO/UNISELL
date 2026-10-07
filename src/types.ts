export type PageView = 'landing' | 'login' | 'dashboard' | 'offline';

export type DashboardScreen = 'overview' | 'products' | 'inventory' | 'analytics' | 'campaigns';

export type PlatformCode = 'A' | 'F' | 'M' | 'O';

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  status: 'live' | 'draft';
  emoji: string;
  platforms: PlatformCode[];
  aiForecast: string;
  salesRevenue?: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  platform: 'Amazon' | 'Flipkart' | 'Meesho' | 'ONDC';
  amount: number;
  status: 'Delivered' | 'In Transit' | 'Pending' | 'Cancelled';
  date: string;
}

export interface AlertItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  agent: string;
  time: string;
  borderColor: string;
}

export interface ForecastItem {
  id: string;
  product: string;
  detail: string;
  actionLabel: string;
  prompt?: string;
  borderColor: string;
}

export interface CampaignItem {
  id: string;
  name: string;
  categories: string;
  platform: 'Amazon' | 'Flipkart' | 'Meesho' | 'ONDC' | 'Meta Ads';
  spendK: number;
  revenueK: number;
  roas: number;
  status: 'Live' | 'Paused' | 'Ended';
  aiEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

export interface UserProfile {
  name: string;
  email: string;
  businessName: string;
  plan: string;
  emailVerified: boolean;
}
