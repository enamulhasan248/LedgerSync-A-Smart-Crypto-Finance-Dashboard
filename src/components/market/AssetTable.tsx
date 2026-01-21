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
import { mockAssets } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetTableProps {
  onSetAlert?: (symbol: string) => void;
}

export function AssetTable({ onSetAlert }: AssetTableProps) {
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
              {mockAssets.map((asset, index) => (
                <TableRow 
                  key={asset.id}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-bold">{asset.symbol}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.name}</TableCell>
                  <TableCell>
                    <AssetTypeBadge type={asset.type} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {asset.currency === 'USD' && '$'}
                    {asset.currency === 'JPY' && '¥'}
                    {asset.currency === 'BDT' && '৳'}
                    {asset.currentPrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={cn(
                      'flex items-center justify-end gap-1 font-medium',
                      asset.change24h >= 0 ? 'text-positive' : 'text-negative'
                    )}>
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
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
