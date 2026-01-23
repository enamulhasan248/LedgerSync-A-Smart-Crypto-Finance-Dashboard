import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetTypeBadge } from './AssetTypeBadge';
import { TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets, Asset } from '@/lib/api';

interface AssetTableProps {
  onSetAlert?: (symbol: string) => void;
}

export function AssetTable({ onSetAlert }: AssetTableProps) {
  const { data: assets, isLoading, error } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: () => fetchAssets(),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) return <div>Loading assets...</div>;
  if (error) return <div>Error loading assets</div>;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">All Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h Change</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets?.map((asset: Asset, index: number) => (
                <TableRow
                  key={asset.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-bold">{asset.symbol}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.name}</TableCell>
                  <TableCell>
                    {/* Mapping API type to Badge type if necessary, or update Badge to accept API type */}
                    <AssetTypeBadge type={asset.asset_type.toLowerCase() as any} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {/* Assuming USD for simplicity or based on type */}
                    ${asset.latest_price ? asset.latest_price.toLocaleString() : '0.00'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={cn(
                      'flex items-center justify-end gap-1 font-medium',
                      (asset.change_24h || 0) >= 0 ? 'text-positive' : 'text-negative'
                    )}>
                      {(asset.change_24h || 0) >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {(asset.change_24h || 0) >= 0 ? '+' : ''}{asset.change_24h?.toFixed(2) || '0.00'}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSetAlert?.(asset.symbol)}
                      className="gap-1"
                    >
                      <Bell className="w-3 h-3" />
                      Set Alert
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
