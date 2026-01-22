import { TrendingUp, TrendingDown } from 'lucide-react';
import { tickerAssets } from '@/lib/newsData'; // Fallback
import { cn } from '@/lib/utils';
import { MarketTickerItem } from '@/lib/api';

interface MarketTickerProps {
  data?: MarketTickerItem[];
  isLoading?: boolean;
}

export function MarketTicker({ data, isLoading }: MarketTickerProps) {
  // Use real data if available, otherwise mock data (or empty array)
  // duplicating for infinite scroll effect
  const assetsToDisplay = (data && data.length > 0) ? data : tickerAssets;
  const duplicatedAssets = [...assetsToDisplay, ...assetsToDisplay, ...assetsToDisplay]; // x3 for smooth scrolling

  if (isLoading && !data) {
    return <div className="h-12 border-y border-border bg-card animate-pulse max-w-full"></div>;
  }

  return (
    <div className="bg-card border-y border-border overflow-hidden">
      <div className="animate-ticker flex whitespace-nowrap py-3">
        {duplicatedAssets.map((asset, index) => (
          <div
            key={`${asset.symbol}-${index}`}
            className="inline-flex items-center gap-2 px-6 border-r border-border"
          >
            <span className="font-semibold text-foreground">{asset.symbol}</span>
            <span className="text-muted-foreground text-sm">{asset.name}</span>
            <span className="font-medium text-foreground">
              ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                asset.change >= 0 ? 'text-financial-positive' : 'text-financial-negative'
              )}
            >
              {asset.change >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
