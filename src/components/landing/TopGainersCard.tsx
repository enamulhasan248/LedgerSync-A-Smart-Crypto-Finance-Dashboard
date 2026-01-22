import { TrendingUp, Bitcoin, Globe, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { topGainers } from '@/lib/newsData'; // Fallback
import { cn } from '@/lib/utils';
import { MarketTickerItem } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface GainerCardProps {
  type: 'crypto' | 'global' | 'dse';
  title: string;
  data?: MarketTickerItem[];
  isLoading?: boolean;
}

const icons = {
  crypto: Bitcoin,
  global: Globe,
  dse: Building2,
};

const iconColors = {
  crypto: 'text-badge-crypto-foreground bg-badge-crypto',
  global: 'text-badge-global-foreground bg-badge-global',
  dse: 'text-badge-dse-foreground bg-badge-dse',
};

export function TopGainersCard({ type, title, data, isLoading }: GainerCardProps) {
  const Icon = icons[type];

  // If API data is provided, show list. If not, fallback to single mock item (legacy behavior)
  // But strictly, we want to show the LIST of top gainers now.

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If using API data
  if (data && data.length > 0) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', iconColors[type])}>
              <Icon className="w-4 h-4" />
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">{item.symbol}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{item.name}</span>
                  </div>
                  <p className="font-medium text-sm mt-0.5">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <span className="text-financial-positive flex items-center gap-1 font-semibold text-sm">
                  <TrendingUp className="w-3 h-3" />
                  +{item.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback to legacy mock (single item)
  const gainer = topGainers[type];
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', iconColors[type])}>
            <Icon className="w-4 h-4" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">{gainer.symbol}</span>
            <span className="text-financial-positive flex items-center gap-1 font-semibold">
              <TrendingUp className="w-4 h-4" />
              +{gainer.change.toFixed(2)}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{gainer.name}</p>
          <p className="font-medium">${gainer.price.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
