export type AssetType = 'crypto' | 'global' | 'dse';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  currentPrice: number;
  change24h: number;
  currency: string;
}

export interface PricePoint {
  time: string;
  price: number;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: Date;
  type: 'alert' | 'info' | 'success';
}

export const mockAssets: Asset[] = [
  // Crypto
  { id: '1', symbol: 'BTC', name: 'Bitcoin', type: 'crypto', currentPrice: 67234.56, change24h: 2.34, currency: 'USD' },
  { id: '2', symbol: 'ETH', name: 'Ethereum', type: 'crypto', currentPrice: 3456.78, change24h: -1.23, currency: 'USD' },
  { id: '3', symbol: 'SOL', name: 'Solana', type: 'crypto', currentPrice: 178.45, change24h: 5.67, currency: 'USD' },
  { id: '4', symbol: 'BNB', name: 'Binance Coin', type: 'crypto', currentPrice: 567.89, change24h: 0.89, currency: 'USD' },
  
  // Global Stocks
  { id: '5', symbol: 'AAPL', name: 'Apple Inc.', type: 'global', currentPrice: 189.45, change24h: 1.12, currency: 'USD' },
  { id: '6', symbol: 'MSFT', name: 'Microsoft Corp.', type: 'global', currentPrice: 378.92, change24h: -0.45, currency: 'USD' },
  { id: '7', symbol: '7203.T', name: 'Toyota Motor', type: 'global', currentPrice: 2845.00, change24h: 0.78, currency: 'JPY' },
  { id: '8', symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'global', currentPrice: 875.34, change24h: 3.45, currency: 'USD' },
  
  // DSE Stocks
  { id: '9', symbol: 'GP', name: 'Grameenphone Ltd.', type: 'dse', currentPrice: 385.60, change24h: -0.32, currency: 'BDT' },
  { id: '10', symbol: 'SQURPHARMA', name: 'Square Pharma Ltd.', type: 'dse', currentPrice: 234.50, change24h: 1.87, currency: 'BDT' },
  { id: '11', symbol: 'BEXIMCO', name: 'Beximco Ltd.', type: 'dse', currentPrice: 156.75, change24h: -2.15, currency: 'BDT' },
  { id: '12', symbol: 'BRACBANK', name: 'BRAC Bank Ltd.', type: 'dse', currentPrice: 42.30, change24h: 0.45, currency: 'BDT' },
];

export const generatePriceHistory = (basePrice: number, days: number): PricePoint[] => {
  const data: PricePoint[] = [];
  let price = basePrice * 0.9;
  
  const now = new Date();
  const interval = days === 1 ? 1 : days <= 7 ? 4 : 24; // hours between points
  const points = days === 1 ? 24 : days <= 7 ? 42 : 30;
  
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60 * 60 * 1000);
    const volatility = (Math.random() - 0.5) * 0.05;
    price = price * (1 + volatility);
    price = Math.max(price, basePrice * 0.7);
    price = Math.min(price, basePrice * 1.3);
    
    data.push({
      time: days === 1 
        ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(price * 100) / 100,
    });
  }
  
  return data;
};

export const mockActivities: Activity[] = [
  { id: '1', message: 'BTC crossed $67,000 threshold', timestamp: new Date(Date.now() - 5 * 60 * 1000), type: 'alert' },
  { id: '2', message: 'ETH price dropped below $3,500', timestamp: new Date(Date.now() - 15 * 60 * 1000), type: 'alert' },
  { id: '3', message: 'GP stock showing unusual volume', timestamp: new Date(Date.now() - 45 * 60 * 1000), type: 'info' },
  { id: '4', message: 'AAPL earnings report positive', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), type: 'success' },
  { id: '5', message: 'SQURPHARMA up 1.87% today', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), type: 'success' },
];

export const getSummaryStats = () => ({
  crypto: {
    count: mockAssets.filter(a => a.type === 'crypto').length,
    totalValue: mockAssets.filter(a => a.type === 'crypto').reduce((sum, a) => sum + a.currentPrice, 0),
  },
  global: {
    count: mockAssets.filter(a => a.type === 'global').length,
    totalValue: mockAssets.filter(a => a.type === 'global').reduce((sum, a) => sum + a.currentPrice, 0),
  },
  dse: {
    count: mockAssets.filter(a => a.type === 'dse').length,
    totalValue: mockAssets.filter(a => a.type === 'dse').reduce((sum, a) => sum + a.currentPrice, 0),
  },
});
