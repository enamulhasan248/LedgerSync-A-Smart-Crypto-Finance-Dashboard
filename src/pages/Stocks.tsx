import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FilterSidebar } from "@/components/market/FilterSidebar";
import { AssetHeader } from "@/components/market/AssetHeader";
import { AssetChart } from "@/components/market/AssetChart";
import { fetchAssets, fetchAssetDetails, Asset } from "@/lib/api";
import { stockExchanges } from "@/data/mockMarketData";

// Transformer to match MarketAsset shape if needed, or update components to use Asset
// MarketAsset has: symbol, name, price, change, changePercent, volume, marketCap
// Asset has: symbol, name, latest_price, change_24h.
// We need to map Asset -> MarketAsset for the components for now.

const mapToMarketAsset = (asset: Asset) => ({
    id: asset.id, // Ensure ID is passed for fetching details
    symbol: asset.symbol,
    name: asset.name,
    price: asset.latest_price || 0,
    // Backend doesn't provide absolute change yet? We have change_24h %?
    // Wait, serializer change_24h calculation: ((current - past)/past)*100. That is percent.
    changePercent: asset.change_24h || 0,
    // Calculate abs change if needed: price - (price / (1 + change/100))
    change: asset.latest_price ? (asset.latest_price - (asset.latest_price / (1 + (asset.change_24h || 0) / 100))) : 0,
    volume: 'N/A', // Not in API yet
    marketCap: 'N/A', // Not in API yet
    asset_details: asset // Keep original for reference
});

export function StocksContent() {
    const [exchange, setExchange] = useState<string>(stockExchanges[0]);
    const [selectedStock, setSelectedStock] = useState<any | null>(null);

    // Determine asset type filter based on exchange
    const assetType = exchange === 'DSE' ? 'STOCK_DSE' : 'STOCK_GLOBAL';

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['stocks', assetType],
        queryFn: () => fetchAssets({ type: assetType }),
        // Refresh every minute
        refetchInterval: 60000
    });

    const marketAssets = assets.map(mapToMarketAsset);

    // Initialize selection
    useEffect(() => {
        if (marketAssets.length > 0 && !selectedStock) {
            setSelectedStock(marketAssets[0]);
        } else if (marketAssets.length > 0 && selectedStock) {
            // Re-select updated version of current stock if it exists, else first
            const updated = marketAssets.find((a: any) => a.symbol === selectedStock.symbol);
            if (updated) setSelectedStock(updated);
            else setSelectedStock(marketAssets[0]);
        }
    }, [assets, exchange]); // Re-run when assets loaded or exchange changes


    const { data: details } = useQuery({
        queryKey: ['assetDetails', selectedStock?.id],
        queryFn: () => selectedStock?.id ? fetchAssetDetails(selectedStock.id) : Promise.resolve(null),
        enabled: !!selectedStock?.id
    });

    const displayStock = selectedStock ? {
        ...selectedStock,
        marketCap: details?.market_cap || 'N/A',
        volume: details?.volume || 'N/A'
    } : null;

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-[300px] flex-shrink-0 h-full border-r border-border">
                <FilterSidebar
                    title="Stocks"
                    items={marketAssets}
                    selectedItem={selectedStock}
                    onSelect={setSelectedStock}
                    filterOptions={stockExchanges}
                    selectedFilter={exchange}
                    onFilterChange={(val) => {
                        setExchange(val);
                        setSelectedStock(null); // Reset selection on exchange switch
                    }}
                    isLoading={isLoading}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 bg-background flex flex-col overflow-hidden">
                {displayStock ? (
                    <div className="h-full flex flex-col overflow-y-auto">
                        <AssetHeader asset={displayStock} />

                        <div className="p-6">
                            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">Price History</h3>
                                <div className="h-[450px]">
                                    <AssetChart asset={displayStock} />
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        {isLoading ? "Loading stocks..." : "Select a stock to view details"}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Stocks() {
    return (
        <DashboardLayout fullWidth>
            <StocksContent />
        </DashboardLayout>
    );
}
