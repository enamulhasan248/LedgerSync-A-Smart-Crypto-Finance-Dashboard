export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: Date;
  thumbnail: string;
}

export const mockNewsByCountry: Record<string, NewsItem[]> = {
  USA: [
    { id: '1', headline: 'Fed Signals Potential Rate Cuts as Inflation Cools', source: 'Bloomberg', timestamp: new Date(Date.now() - 30 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=60&fit=crop' },
    { id: '2', headline: 'Tech Stocks Rally on Strong Earnings Reports', source: 'CNBC', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=100&h=60&fit=crop' },
    { id: '3', headline: 'Tesla Announces New Battery Technology Breakthrough', source: 'Reuters', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1617886322168-72b886573c35?w=100&h=60&fit=crop' },
    { id: '4', headline: 'S&P 500 Reaches New All-Time High Amid Optimism', source: 'WSJ', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=60&fit=crop' },
  ],
  UK: [
    { id: '1', headline: 'Bank of England Holds Interest Rates Steady', source: 'Financial Times', timestamp: new Date(Date.now() - 45 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&h=60&fit=crop' },
    { id: '2', headline: 'FTSE 100 Gains as Energy Stocks Surge', source: 'The Guardian', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=100&h=60&fit=crop' },
    { id: '3', headline: 'UK Housing Market Shows Signs of Recovery', source: 'BBC News', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=60&fit=crop' },
    { id: '4', headline: 'London Tech Startups Attract Record Investment', source: 'The Telegraph', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=60&fit=crop' },
  ],
  Japan: [
    { id: '1', headline: 'Nikkei 225 Breaks Historic Record Amid Yen Weakness', source: 'Nikkei Asia', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=100&h=60&fit=crop' },
    { id: '2', headline: 'Toyota Reports Strong Q4 Earnings, EV Sales Up 40%', source: 'Japan Times', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1617886322168-72b886573c35?w=100&h=60&fit=crop' },
    { id: '3', headline: 'Bank of Japan Maintains Ultra-Low Interest Rates', source: 'Reuters Japan', timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=100&h=60&fit=crop' },
    { id: '4', headline: 'Sony Expands Gaming Division with New Acquisitions', source: 'Bloomberg Japan', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=100&h=60&fit=crop' },
  ],
  Bangladesh: [
    { id: '1', headline: 'Grameenphone Q4 Profits Surge 15% on Data Revenue', source: 'The Daily Star', timestamp: new Date(Date.now() - 30 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=60&fit=crop' },
    { id: '2', headline: 'DSE Index Crosses 7,000 Points for First Time', source: 'Dhaka Tribune', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=100&h=60&fit=crop' },
    { id: '3', headline: 'Square Pharma Expands Export to 50 Countries', source: 'The Financial Express', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=60&fit=crop' },
    { id: '4', headline: 'Bangladesh Bank Revises Forex Policy for Exporters', source: 'Prothom Alo', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=100&h=60&fit=crop' },
    { id: '5', headline: 'BEXIMCO Announces Major Investment in Green Energy', source: 'The Business Standard', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=100&h=60&fit=crop' },
  ],
};

export const tickerAssets = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67234.56, change: 2.34 },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change: -1.23 },
  { symbol: 'AAPL', name: 'Apple', price: 189.45, change: 1.12 },
  { symbol: 'GP', name: 'Grameenphone', price: 385.60, change: -0.32 },
  { symbol: 'TSLA', name: 'Tesla', price: 248.50, change: 3.87 },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.92, change: 0.89 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 875.34, change: 4.56 },
];

export const topGainers = {
  crypto: { symbol: 'SOL', name: 'Solana', price: 178.45, change: 8.67 },
  global: { symbol: 'NVDA', name: 'NVIDIA', price: 875.34, change: 4.56 },
  dse: { symbol: 'SQURPHARMA', name: 'Square Pharma', price: 234.50, change: 3.87 },
};
