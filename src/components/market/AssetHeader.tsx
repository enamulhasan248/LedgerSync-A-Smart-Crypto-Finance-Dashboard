import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketAsset } from "@/data/mockMarketData";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AssetHeaderProps {
    asset: MarketAsset;
}

export function AssetHeader({ asset }: AssetHeaderProps) {
    const [isWatchlisted, setIsWatchlisted] = useState(false);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-border bg-card">
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{asset.name}</h1>
                    <span className="text-muted-foreground font-medium">({asset.symbol})</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold tracking-tight">
                        ${asset.price.toFixed(2)}
                    </span>
                    <Badge
                        variant={asset.change >= 0 ? "default" : "destructive"}
                        className={cn(
                            "text-base px-2 py-0.5",
                            asset.change >= 0
                                ? "bg-financial-positive/10 text-financial-positive hover:bg-financial-positive/20"
                                : "bg-financial-negative/10 text-financial-negative hover:bg-financial-negative/20"
                        )}
                    >
                        {asset.change >= 0 ? "+" : ""}
                        {asset.change.toFixed(2)} ({asset.changePercent.toFixed(2)}%)
                    </Badge>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block space-y-1">
                    <div className="text-sm text-muted-foreground">Volume</div>
                    <div className="font-medium">{asset.volume}</div>
                </div>
                <div className="text-right hidden md:block space-y-1 mr-4">
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                    <div className="font-medium">{asset.marketCap}</div>
                </div>

                <Button
                    variant={isWatchlisted ? "secondary" : "outline"}
                    onClick={() => setIsWatchlisted(!isWatchlisted)}
                    className="gap-2"
                >
                    <Star className={cn("w-4 h-4", isWatchlisted && "fill-yellow-400 text-yellow-400")} />
                    {isWatchlisted ? "Watchlisted" : "Add to Watchlist"}
                </Button>
            </div>
        </div>
    );
}
