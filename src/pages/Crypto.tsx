import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { FilterSidebar } from "@/components/market/FilterSidebar";
import { AssetHeader } from "@/components/market/AssetHeader";
import { AssetChart } from "@/components/market/AssetChart";
import { fetchAssets, fetchAssetDetails, Asset } from "@/lib/api";

const mapToMarketAsset = (asset: Asset) => ({
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    price: asset.latest_price || 0,
    changePercent: asset.change_24h || 0,
    change: asset.latest_price ? (asset.latest_price - (asset.latest_price / (1 + (asset.change_24h || 0) / 100))) : 0,
    volume: 'N/A',
    marketCap: 'N/A',
    asset_details: asset
});

export function CryptoContent() {
    const [selectedCrypto, setSelectedCrypto] = useState<any | null>(null);

    const { data: assets = [], isLoading } = useQuery({
        queryKey: ['crypto'],
        queryFn: () => fetchAssets({ type: 'CRYPTO' }),
        refetchInterval: 60000
    });

    const marketAssets = assets.map(mapToMarketAsset);

    // Initialize selection
    useEffect(() => {
        if (marketAssets.length > 0 && !selectedCrypto) {
            setSelectedCrypto(marketAssets[0]);
        } else if (marketAssets.length > 0 && selectedCrypto) {
            const updated = marketAssets.find((a: any) => a.symbol === selectedCrypto.symbol);
            if (updated) setSelectedCrypto(updated);
        }
    }, [assets]);

    const { data: details } = useQuery({
        queryKey: ['assetDetails', selectedCrypto?.id],
        queryFn: () => selectedCrypto?.id ? fetchAssetDetails(selectedCrypto.id) : Promise.resolve(null),
        enabled: !!selectedCrypto?.id
    });

    const displayCrypto = selectedCrypto ? {
        ...selectedCrypto,
        marketCap: details?.market_cap || 'N/A',
        volume: details?.volume || 'N/A'
    } : null;

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-[300px] flex-shrink-0 h-full">
                <FilterSidebar
                    title="Crypto Assets"
                    items={marketAssets}
                    selectedItem={selectedCrypto}
                    onSelect={setSelectedCrypto}
                    isLoading={isLoading}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 bg-background flex flex-col overflow-hidden">
                {displayCrypto ? (
                    <div className="h-full flex flex-col overflow-y-auto">
                        <AssetHeader asset={displayCrypto} />

                        <div className="p-6">
                            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">Price Performance</h3>
                                <div className="h-[450px]">
                                    <AssetChart asset={displayCrypto} isCrypto={true} />
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        {isLoading ? "Loading crypto..." : "Select an asset to view details"}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CryptoPage() {
    return (
        <DashboardLayout fullWidth>
            <CryptoContent />
        </DashboardLayout>
    );
}
