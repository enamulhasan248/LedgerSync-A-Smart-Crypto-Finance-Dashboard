import { Bitcoin, Globe, Building2 } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets, Asset } from '@/lib/api';

const Dashboard = () => {
  const { data: assets } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: () => fetchAssets(),
  });

  const stats = {
    crypto: assets?.filter((a: Asset) => a.asset_type === 'CRYPTO').length || 0,
    global: assets?.filter((a: Asset) => a.asset_type === 'STOCK_GLOBAL').length || 0,
    dse: assets?.filter((a: Asset) => a.asset_type === 'STOCK_DSE').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your multi-market assets in real-time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Cryptocurrency"
          count={stats.crypto}
          icon={Bitcoin}
          iconColor="text-badge-crypto-foreground"
          iconBgColor="bg-badge-crypto"
          delay={0}
        />
        <SummaryCard
          title="Global Markets"
          count={stats.global}
          icon={Globe}
          iconColor="text-badge-global-foreground"
          iconBgColor="bg-badge-global"
          delay={100}
        />
        <SummaryCard
          title="Dhaka Stock Exchange"
          count={stats.dse}
          icon={Building2}
          iconColor="text-badge-dse-foreground"
          iconBgColor="bg-badge-dse"
          delay={200}
        />
      </div>

      {/* Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart />
        </div>
        <div>
          {/* ActivityFeed currently uses mocks. Leaving as is or TODO update when API has activity */}
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
