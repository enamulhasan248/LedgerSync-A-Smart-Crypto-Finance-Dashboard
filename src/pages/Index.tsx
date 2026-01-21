import { Bitcoin, Globe, Building2 } from 'lucide-react';
import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { PriceChart } from '@/components/dashboard/PriceChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { getSummaryStats } from '@/lib/mockData';

const Dashboard = () => {
  const stats = getSummaryStats();

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
          count={stats.crypto.count}
          icon={Bitcoin}
          iconColor="text-badge-crypto-foreground"
          iconBgColor="bg-badge-crypto"
          delay={0}
        />
        <SummaryCard
          title="Global Markets"
          count={stats.global.count}
          icon={Globe}
          iconColor="text-badge-global-foreground"
          iconBgColor="bg-badge-global"
          delay={100}
        />
        <SummaryCard
          title="Dhaka Stock Exchange"
          count={stats.dse.count}
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
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
