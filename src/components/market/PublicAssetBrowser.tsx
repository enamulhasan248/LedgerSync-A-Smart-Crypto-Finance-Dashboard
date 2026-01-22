import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets, fetchAssetDetails, Asset } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { AssetChart } from '@/components/market/AssetChart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PublicAssetBrowserProps {
    type: 'STOCKS' | 'CRYPTO';
    title: string;
}

export function PublicAssetBrowser({ type, title }: PublicAssetBrowserProps) {
    // For stocks, we might want to filter by exchange if needed, but for public view maybe showing all?
    // Or tabs for Global vs DSE if type is STOCKS.
    const [subFilter, setSubFilter] = useState<string>(type === 'STOCKS' ? 'STOCK_GLOBAL' : 'CRYPTO');
    const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['publicAssets', type, subFilter],
        queryFn: () => fetchAssets({ type: subFilter }),
        refetchInterval: 60000
    });

    // Detail query
    const { data: details } = useQuery({
        queryKey: ['assetDetails', selectedAsset?.id],
        queryFn: () => selectedAsset?.id ? fetchAssetDetails(selectedAsset.id) : Promise.resolve(null),
        enabled: !!selectedAsset?.id
    });

    const displayAsset = selectedAsset ? {
        ...selectedAsset,
        marketCap: details?.market_cap || 'N/A',
        volume: details?.volume || 'N/A',
        changePercent: selectedAsset.change_24h, // ensure mapping
        change: selectedAsset.latest_price * (selectedAsset.change_24h / 100) // approx
    } : null;

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">{title}</h1>
                {type === 'STOCKS' && (
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 rounded-md transition-colors ${subFilter === 'STOCK_GLOBAL' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                            onClick={() => setSubFilter('STOCK_GLOBAL')}
                        >
                            Global
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md transition-colors ${subFilter === 'STOCK_DSE' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                            onClick={() => setSubFilter('STOCK_DSE')}
                        >
                            DSE
                        </button>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-muted-foreground">Loading assets...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {assets.map((asset: Asset) => {
                        const isPositive = (asset.change_24h || 0) >= 0;
                        return (
                            <Card
                                key={asset.id}
                                className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                                onClick={() => setSelectedAsset(asset)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="truncate pr-2">
                                        <CardTitle className="text-sm font-medium">
                                            {asset.symbol}
                                        </CardTitle>
                                        <p className="text-xs text-muted-foreground truncate">{asset.name}</p>
                                    </div>
                                    {isPositive ? <ArrowUp className="h-4 w-4 text-emerald-500" /> : <ArrowDown className="h-4 w-4 text-rose-500" />}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ${asset.latest_price ? asset.latest_price.toLocaleString() : '0.00'}
                                    </div>
                                    <p className={`text-xs ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {isPositive ? '+' : ''}{asset.change_24h}%
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{selectedAsset?.name} ({selectedAsset?.symbol})</DialogTitle>
                    </DialogHeader>
                    {displayAsset && (
                        <div className="py-4">
                            <div className="flex gap-6 mb-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="text-xl font-bold">${displayAsset.latest_price}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Market Cap</p>
                                    <p className="text-xl font-bold">{displayAsset.marketCap}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Volume</p>
                                    <p className="text-xl font-bold">{displayAsset.volume}</p>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <AssetChart asset={displayAsset} isCrypto={type === 'CRYPTO'} />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
