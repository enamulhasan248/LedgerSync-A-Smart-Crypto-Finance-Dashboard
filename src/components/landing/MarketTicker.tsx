import { TrendingUp, TrendingDown } from 'lucide-react';
import { tickerAssets } from '@/lib/newsData';
import { cn } from '@/lib/utils';

export function MarketTicker() {
  // Duplicate the assets to create seamless loop
  const duplicatedAssets = [...tickerAssets, ...tickerAssets];

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
              ${asset.price.toLocaleString()}
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
