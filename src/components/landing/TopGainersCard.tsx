import { TrendingUp, Bitcoin, Globe, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { topGainers } from '@/lib/newsData'; // Fallback
import { cn } from '@/lib/utils';
import { MarketTickerItem } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

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

// Start low, end high for positive change. Randomize slightly.
const generateSparklineData = (change: number) => {
  const points = [];
  let current = 100;
  const trend = change > 0 ? 1 : -1;
  for (let i = 0; i < 7; i++) {
    current += (Math.random() - 0.2) * 5 + (trend * 2);
    points.push({ value: current });
  }
  return points;
};

export function TopGainersCard({ type, title, data, isLoading }: GainerCardProps) {
  const Icon = icons[type];

  // If API data is provided, show list. If not, fallback to single mock item (legacy behavior)
  // But strictly, we want to show the LIST of top gainers now.

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-md border-white/10">
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
      <Card className="hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 bg-card/50 backdrop-blur-md border-white/10">
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
            {data.map((item, idx) => {
              const sparkData = generateSparklineData(item.change);
              const isPositive = item.change >= 0;
              return (
                <div key={idx} className="flex items-center justify-between border-b border-border/50 last:border-0 pb-2 last:pb-0">
                  <div className="w-[30%]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-foreground">{item.symbol}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">{item.name}</span>
                    </div>
                    <p className="font-medium text-sm mt-0.5 text-foreground">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>

                  {/* Sparkline */}
                  <div className="h-[40px] w-[30%]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparkData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={isPositive ? '#34d399' : '#fb7185'}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <span className={cn("flex items-center gap-1 font-semibold text-sm", isPositive ? 'text-emerald-400' : 'text-rose-400')}>
                    <TrendingUp className="w-3 h-3" />
                    {item.change > 0 ? '+' : ''}{item.change.toFixed(2)}%
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback to legacy mock (single item)
  const gainer = topGainers[type];
  const sparkData = generateSparklineData(gainer.change);
  const isPositive = gainer.change >= 0;

  return (
    <Card className="hover:-translate-y-1 hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 bg-card/50 backdrop-blur-md border-white/10">
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
            <span className="font-bold text-lg text-foreground">{gainer.symbol}</span>
            <span className={cn("flex items-center gap-1 font-semibold", isPositive ? 'text-emerald-400' : 'text-rose-400')}>
              <TrendingUp className="w-4 h-4" />
              {gainer.change > 0 ? '+' : ''}{gainer.change.toFixed(2)}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{gainer.name}</p>
          <div className="flex justify-between items-end">
            <p className="font-medium text-foreground">${gainer.price.toLocaleString()}</p>
            <div className="h-[40px] w-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isPositive ? '#34d399' : '#fb7185'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
