import { TrendingUp, Bitcoin, Globe, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { topGainers } from '@/lib/newsData';
import { cn } from '@/lib/utils';

interface GainerCardProps {
  type: 'crypto' | 'global' | 'dse';
  title: string;
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

export function TopGainersCard({ type, title }: GainerCardProps) {
  const gainer = topGainers[type];
  const Icon = icons[type];

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
