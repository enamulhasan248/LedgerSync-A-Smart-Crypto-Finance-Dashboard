import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Asset } from '@/lib/api';

// Helper to map API type to badge keys if needed, 
// or just match the lowercased strings we are passing from AssetTable
type BadgeKey = 'crypto' | 'stock_global' | 'stock_dse';

interface AssetTypeBadgeProps {
  type: string; // Accepting string to be flexible with what comes from AssetTable
}

const badgeConfig: Record<string, { label: string; className: string }> = {
  crypto: {
    label: 'Crypto',
    className: 'bg-badge-crypto text-badge-crypto-foreground hover:bg-badge-crypto/90',
  },
  stock_global: { // Updated key
    label: 'Global Stock',
    className: 'bg-badge-global text-badge-global-foreground hover:bg-badge-global/90',
  },
  stock_dse: { // Updated key
    label: 'DSE Stock',
    className: 'bg-badge-dse text-badge-dse-foreground hover:bg-badge-dse/90',
  },
  // Fallback for old keys or potential mismatches
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
  // Ensure type is lowercase to match keys
  const normalizedType = type.toLowerCase();
  const config = badgeConfig[normalizedType] || badgeConfig['crypto']; // Default to crypto if unknown

  return (
    <Badge className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  );
}
