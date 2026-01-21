import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  delay?: number;
}

export function SummaryCard({ title, count, icon: Icon, iconColor, iconBgColor, delay = 0 }: SummaryCardProps) {
  return (
    <Card 
      className="overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{count}</p>
            <p className="text-xs text-muted-foreground mt-1">assets tracked</p>
          </div>
          <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', iconBgColor)}>
            <Icon className={cn('w-7 h-7', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
