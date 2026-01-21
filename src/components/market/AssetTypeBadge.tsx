import { AssetType } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AssetTypeBadgeProps {
  type: AssetType;
}

const badgeConfig: Record<AssetType, { label: string; className: string }> = {
  crypto: {
    label: 'Crypto',
    className: 'bg-badge-crypto text-badge-crypto-foreground hover:bg-badge-crypto/90',
  },
  global: {
    label: 'Global Stock',
    className: 'bg-badge-global text-badge-global-foreground hover:bg-badge-global/90',
  },
  dse: {
    label: 'DSE Stock',
    className: 'bg-badge-dse text-badge-dse-foreground hover:bg-badge-dse/90',
  },
};

export function AssetTypeBadge({ type }: AssetTypeBadgeProps) {
  const config = badgeConfig[type];
  
  return (
    <Badge className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  );
}
