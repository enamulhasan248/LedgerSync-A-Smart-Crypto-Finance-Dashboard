import { AssetType } from './mockData'; // Initially importing type to avoid breaking, will redefine later

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
    price: number;
    timestamp: string;
}

export interface NewsItem {
    title: string;
    source: string;
    url: string;
    published_at: string;
    summary: string;
}

export const fetchAssets = async (): Promise<Asset[]> => {
    const response = await fetch(`${API_BASE_URL}/assets/`);
    if (!response.ok) {
        throw new Error('Failed to fetch assets');
    }
    return response.json();
};

export const fetchAssetHistory = async (id: number, period: '24h' | '7d' = '24h'): Promise<PricePoint[]> => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}/history/?period=${period}`);
    if (!response.ok) {
        throw new Error('Failed to fetch asset history');
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
