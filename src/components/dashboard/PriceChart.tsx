import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets, fetchAssetHistory, Asset } from '@/lib/api';
import { format } from 'date-fns';

type TimeFrame = '24h' | '7d';

export function PriceChart() {
  const [timeframe, setTimeframe] = useState<TimeFrame>('24h');
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  // Fetch all assets to populate the selector
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  // Set default selected asset when assets are loaded
  useEffect(() => {
    if (assets && assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id.toString());
    }
  }, [assets, selectedAssetId]);

  // Fetch history for the selected asset
  const { data: historyData, isLoading } = useQuery({
    queryKey: ['history', selectedAssetId, timeframe],
    queryFn: () => fetchAssetHistory(parseInt(selectedAssetId), timeframe),
    enabled: !!selectedAssetId,
    refetchInterval: 60000,
  });

  // Format data for Recharts
  const chartData = useMemo(() => {
    if (!historyData) return [];
    return historyData.map(point => ({
      time: point.timestamp, // Keep original for detailed tooltip if needed
      displayTime: timeframe === '24h'
        ? format(new Date(point.timestamp), 'HH:mm')
        : format(new Date(point.timestamp), 'MMM dd'),
      price: parseFloat(point.price.toString()),
    })).reverse(); // API might return new -> old, we want old -> new for chart usually (check API sort order)
    // Actually API ViewSet .filter(). Filter preserves default ordering? 
    // Model ordering is '-timestamp' (newest first). Recharts needs oldest first (left to right).
    // So .reverse() is correct.
  }, [historyData, timeframe]);

  const selectedAsset = assets?.find(a => a.id.toString() === selectedAssetId);

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <CardTitle className="text-lg font-semibold">Price History</CardTitle>
          <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent>
              {assets?.map((asset: Asset) => (
                <SelectItem key={asset.id} value={asset.id.toString()}>
                  {asset.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as TimeFrame)}>
          <TabsList className="h-8">
            <TabsTrigger value="24h" className="text-xs px-3">24h</TabsTrigger>
            <TabsTrigger value="7d" className="text-xs px-3">7d</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">Loading history...</div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
                <XAxis
                  dataKey="displayTime"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
                  dy={10}
                  interval="preserveStartEnd"
                  minTickGap={30}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
                  tickFormatter={(value) => selectedAsset?.asset_type === 'CRYPTO' && value < 1 ? value.toFixed(4) : value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`}
                  dx={-10}
                  domain={['auto', 'auto']} // Auto scale y-axis
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(214, 32%, 91%)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: 'hsl(222, 47%, 11%)', fontWeight: 600 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
                  labelFormatter={(label) => label} // Could format full date here
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">No data available for this timeframe</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
