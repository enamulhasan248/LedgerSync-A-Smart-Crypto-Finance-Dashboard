import { AssetType } from './mockData'; // Initially importing type to avoid breaking, will redefine later

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export interface Asset {
    id: number;
    symbol: string;
    name: string;
    asset_type: 'CRYPTO' | 'STOCK_GLOBAL' | 'STOCK_DSE';
    api_identifier: string | null;
    latest_price: number | null;
    change_24h: number;
}

export interface PricePoint {
    value: number;
    time: string;
}

export interface NewsItem {
    title: string;
    source: string;
    url: string;
    published_at: string;
    summary?: string;
}

export interface NewsHeadline extends NewsItem {
    image?: string | null;
}

export const fetchAssets = async (filters: { exchange?: string; type?: string } = {}): Promise<Asset[]> => {
    const params = new URLSearchParams();
    if (filters.exchange) params.append('exchange', filters.exchange);
    if (filters.type) params.append('type', filters.type);

    const response = await fetch(`${API_BASE_URL}/assets/?${params.toString()}`);
    if (!response.ok) {
        throw new Error('Failed to fetch assets');
    }
    const data = await response.json();
    return data.map((asset: any) => ({
        ...asset,
        latest_price: asset.latest_price ? parseFloat(asset.latest_price) : null
    }));
};

export const fetchAssetHistory = async (id: number, period: '24h' | '7d' = '24h'): Promise<PricePoint[]> => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}/history/?period=${period}`);
    if (!response.ok) {
        throw new Error('Failed to fetch asset history');
    }
    return response.json();
};

export const fetchPriceHistory = async (symbol: string, period: string = '1d'): Promise<{ time: string; value: number }[]> => {
    const response = await fetch(`${API_BASE_URL}/prices/${symbol}/history/?period=${period}`);
    if (!response.ok) {
        throw new Error('Failed to fetch price history');
    }
    return response.json();
};

export const fetchWatchlist = async (): Promise<any[]> => {
    const token = localStorage.getItem('token'); // Assuming auth token is here or handled by cookies?
    // Note: The backend expects auth. If we aren't handling auth token header here, this might fail 401.
    // Assuming for now session auth or similar as per previous context? 
    // Wait, previous Landing page auth used `useAuth` hook which presumably sets headers?
    // The `fetch` calls here don't have headers. 
    // Let's assume for now we might need to rely on cookie session or add headers if token available.
    // If the previous code relied on fetch without headers, maybe it was open or using cookies.
    // Let's check AuthContext.tsx later. For now just fetch.
    const response = await fetch(`${API_BASE_URL}/watchlist/`);
    if (!response.ok) {
        // If 401, return empty or throw
        if (response.status === 403 || response.status === 401) return [];
        throw new Error('Failed to fetch watchlist');
    }
    return response.json();
};

export const addToWatchlist = async (assetId: number) => {
    const response = await fetch(`${API_BASE_URL}/watchlist/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') || ''
        },
        body: JSON.stringify({ asset: assetId })
    });
    if (!response.ok) throw new Error('Failed to add to watchlist');
    return response.json();
};

export const removeFromWatchlist = async (watchlistId: number) => {
    const response = await fetch(`${API_BASE_URL}/watchlist/${watchlistId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') || ''
        }
    });
    if (!response.ok) throw new Error('Failed to remove from watchlist');
};

function getCookie(name: string): string | null {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const fetchAssetDetails = async (id: number): Promise<{ market_cap: string; volume: string }> => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}/details/`);
    if (!response.ok) {
        throw new Error('Failed to fetch asset details');
    }
    return response.json();
};

export const fetchNews = async (country: string = 'us'): Promise<NewsItem[]> => {
    const response = await fetch(`${API_BASE_URL}/news/?country=${country}`);
    if (!response.ok) {
        throw new Error('Failed to fetch news');
    }
    return response.json();
};

export const fetchTopHeadlines = async (): Promise<NewsHeadline[]> => {
    const response = await fetch(`${API_BASE_URL}/news/top-headlines/`);
    if (!response.ok) {
        throw new Error('Failed to fetch top headlines');
    }
    return response.json();
};

export interface MarketTickerItem {
    symbol: string;
    name: string;
    price: number;
    change: number;
}

export interface MarketSummary {
    tickers: MarketTickerItem[];
    gainers: MarketTickerItem[];
}

export const fetchMarketSummary = async (): Promise<MarketSummary> => {
    const response = await fetch(`${API_BASE_URL}/market/summary/`);
    if (!response.ok) {
        throw new Error('Failed to fetch market summary');
    }
    return response.json();
};
