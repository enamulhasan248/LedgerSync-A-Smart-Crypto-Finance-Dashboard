import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchPriceHistory } from "@/lib/api";

interface AssetChartProps {
    asset: any; // Using any for now to facilitate transition, or map the type
    isCrypto?: boolean;
}

type Timeframe = '24H' | '5D' | '30D' | '1Y' | '5Y' | 'Max';
const timeframes: Timeframe[] = ['24H', '5D', '30D', '1Y', '5Y', 'Max'];

const periodMap: Record<Timeframe, string> = {
    '24H': '1d',
    '5D': '5d',
    '30D': '1mo',
    '1Y': '1y',
    '5Y': '5y',
    'Max': 'max'
};

export function AssetChart({ asset }: AssetChartProps) {
    const [timeframe, setTimeframe] = useState<Timeframe>('24H');

    // Fetch real history data
    const { data: chartData = [] } = useQuery({
        queryKey: ['assetHistory', asset.symbol, timeframe],
        queryFn: () => fetchPriceHistory(asset.symbol, periodMap[timeframe]),
        // Don't refetch history too often unless 24h
        refetchInterval: timeframe === '24H' ? 60000 : false
    });

    // Check change valid number for color
    const change = asset.changePercent || 0; // Use percentage for color determination
    const isPositive = change >= 0;
    const gradientId = `colorGradient-${asset.symbol}`;

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="pb-4 px-0">
                <Tabs
                    defaultValue="24H"
                    value={timeframe}
                    onValueChange={(v) => setTimeframe(v as Timeframe)}
                    className="w-full"
                >
                    <TabsList>
                        {timeframes.map((tf) => (
                            <TabsTrigger key={tf} value={tf}>
                                {tf}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent className="px-0 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={isPositive ? "#10B981" : "#EF4444"}
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={isPositive ? "#10B981" : "#EF4444"}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'gray' }}
                            minTickGap={30}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'gray' }}
                            width={60}
                            tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
                                            <p className="text-sm font-medium text-popover-foreground mb-1">{label}</p>
                                            <p className="text-lg font-bold text-foreground">
                                                ${Number(payload[0].value).toFixed(2)}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? "#10B981" : "#EF4444"}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
