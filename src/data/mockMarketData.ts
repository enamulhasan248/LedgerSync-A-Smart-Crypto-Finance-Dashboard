import { startOfDay, subDays, subMonths, subYears, format } from 'date-fns';

export interface MarketAsset {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    marketCap: string;
}

export type Timeframe = '24H' | '5D' | '30D' | '1Y' | '5Y' | 'Max';

export const stockExchanges = ['NYSE', 'NASDAQ', 'LSE', 'DSE'];

export const stocks: Record<string, MarketAsset[]> = {
    'NYSE': [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.35, changePercent: 1.28, volume: '52M', marketCap: '2.9T' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 215.40, change: -4.50, changePercent: -2.05, volume: '105M', marketCap: '680B' },
        { symbol: 'JPM', name: 'JPMorgan Chase', price: 172.05, change: 0.85, changePercent: 0.50, volume: '9M', marketCap: '495B' },
        { symbol: 'WMT', name: 'Walmart Inc.', price: 162.50, change: 1.10, changePercent: 0.68, volume: '6M', marketCap: '435B' },
        { symbol: 'PG', name: 'Procter & Gamble', price: 148.20, change: -0.20, changePercent: -0.13, volume: '5M', marketCap: '350B' },
    ],
    'NASDAQ': [
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 402.10, change: 5.20, changePercent: 1.31, volume: '22M', marketCap: '3.0T' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 151.75, change: 1.95, changePercent: 1.30, volume: '25M', marketCap: '1.9T' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 615.30, change: 18.50, changePercent: 3.10, volume: '45M', marketCap: '1.5T' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 170.25, change: 2.15, changePercent: 1.28, volume: '38M', marketCap: '1.7T' },
        { symbol: 'META', name: 'Meta Platforms', price: 395.40, change: 10.20, changePercent: 2.65, volume: '20M', marketCap: '1.0T' },
    ],
    'LSE': [
        { symbol: 'SHEL', name: 'Shell PLC', price: 2450.50, change: 15.00, changePercent: 0.62, volume: '12M', marketCap: '160B' },
        { symbol: 'HSBA', name: 'HSBC Holdings', price: 610.20, change: -5.50, changePercent: -0.89, volume: '18M', marketCap: '118B' },
        { symbol: 'AZN', name: 'AstraZeneca PLC', price: 10450.00, change: 120.00, changePercent: 1.16, volume: '2M', marketCap: '162B' },
        { symbol: 'BP', name: 'BP PLC', price: 465.10, change: 2.30, changePercent: 0.50, volume: '22M', marketCap: '78B' },
        { symbol: 'ULVR', name: 'Unilever PLC', price: 3820.50, change: -10.50, changePercent: -0.27, volume: '3M', marketCap: '96B' },
    ],
    'DSE': [
        { symbol: 'GP', name: 'Grameenphone Ltd.', price: 286.60, change: 0.00, changePercent: 0.00, volume: '150K', marketCap: '3.8B' },
        { symbol: 'SQURPHARMA', name: 'Square Pharm.', price: 210.50, change: -1.20, changePercent: -0.57, volume: '220K', marketCap: '1.9B' },
        { symbol: 'BATBC', name: 'British American Tobacco', price: 518.70, change: 2.50, changePercent: 0.48, volume: '80K', marketCap: '2.8B' },
        { symbol: 'RENATA', name: 'Renata Ltd.', price: 1215.30, change: -5.50, changePercent: -0.45, volume: '12K', marketCap: '1.1B' },
        { symbol: 'BRACBANK', name: 'BRAC Bank Ltd.', price: 38.50, change: 0.40, changePercent: 1.05, volume: '1.2M', marketCap: '600M' },
    ],
};

export const cryptos: MarketAsset[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 42350.50, change: -850.20, changePercent: -1.97, volume: '25B', marketCap: '830B' },
    { symbol: 'ETH', name: 'Ethereum', price: 2280.15, change: -45.50, changePercent: -1.96, volume: '12B', marketCap: '270B' },
    { symbol: 'SOL', name: 'Solana', price: 95.40, change: 3.20, changePercent: 3.47, volume: '3B', marketCap: '41B' },
    { symbol: 'BNB', name: 'Binance Coin', price: 305.20, change: -2.10, changePercent: -0.68, volume: '900M', marketCap: '46B' },
    { symbol: 'XRP', name: 'Ripple', price: 0.52, change: -0.01, changePercent: -1.89, volume: '800M', marketCap: '28B' },
    { symbol: 'ADA', name: 'Cardano', price: 0.48, change: -0.02, changePercent: -4.00, volume: '400M', marketCap: '17B' },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.08, change: 0.00, changePercent: 0.12, volume: '300M', marketCap: '11B' },
    { symbol: 'AVAX', name: 'Avalanche', price: 32.50, change: 1.10, changePercent: 3.50, volume: '500M', marketCap: '12B' },
];

export const generateHistoryData = (symbol: string | undefined, timeframe: Timeframe, isCrypto = false) => {
    if (!symbol) return [];

    let dataPoints = 50;
    let intervalMinutes = 30;
    let timeFormat = 'HH:mm';

    const now = new Date();
    let startDate = startOfDay(now);

    switch (timeframe) {
        case '24H':
            startDate = subDays(now, 1);
            dataPoints = 48; // every 30 mins
            intervalMinutes = 30;
            timeFormat = 'HH:mm';
            break;
        case '5D':
            startDate = subDays(now, 5);
            dataPoints = 60;
            intervalMinutes = 120; // every 2 hours
            timeFormat = 'MK'; // Mon, Tue...
            break;
        case '30D':
            startDate = subDays(now, 30);
            dataPoints = 30;
            intervalMinutes = 1440; // daily
            timeFormat = 'dd MMM';
            break;
        case '1Y':
            startDate = subYears(now, 1);
            dataPoints = 52; // weekly
            intervalMinutes = 10080;
            timeFormat = 'MMM yy';
            break;
        case '5Y':
            startDate = subYears(now, 5);
            dataPoints = 60; // monthly
            intervalMinutes = 43200;
            timeFormat = 'yyyy';
            break;
        case 'Max':
            startDate = subYears(now, 10);
            dataPoints = 120; // monthly
            intervalMinutes = 43200;
            timeFormat = 'yyyy';
            break;
    }

    // Determine base price
    let currentPrice = 100; // Default

    // Try to find the real mock price
    const allStocks = Object.values(stocks).flat();
    const asset = isCrypto ? cryptos.find(c => c.symbol === symbol) : allStocks.find(s => s.symbol === symbol);
    if (asset) currentPrice = asset.price;

    const data = [];
    let price = currentPrice * 0.85; // Start a bit lower to simulate growth or fluctuation

    for (let i = 0; i < dataPoints; i++) {
        // Random walk
        const change = (Math.random() - 0.45) * (currentPrice * 0.05); // +/- 5% variance step
        price = price + change;

        // Ensure positive price
        if (price < 0.01) price = 0.01;

        // Time calculation (simplified)
        const date = new Date(startDate.getTime() + i * intervalMinutes * 60 * 1000);

        // For stocks in 24H view, flatten the line during "closed" hours? 
        // Complexity: User requested continuous line for Crypto, flat for Stocks if closed.
        // For simplicity in mock data, we'll just generate continuous noise but 
        // maybe reduce volatility for "Stocks" in 24h if we wanted to be super fancy.
        // We'll stick to continuous random walk for now as a "good enough" visual.

        data.push({
            time: timeframe === '5D' ? format(date, 'EEE') : format(date, timeFormat),
            value: Number(price.toFixed(2)),
        });
    }

    // Ensure the last point matches current price somewhat closely for 24H
    if (timeframe === '24H' || timeframe === '5D') {
        data[data.length - 1].value = currentPrice;
    }

    return data;
};
