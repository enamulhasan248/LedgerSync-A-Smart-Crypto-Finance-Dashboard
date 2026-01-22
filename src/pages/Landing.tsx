import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { MarketTicker } from '@/components/landing/MarketTicker';
import { TopGainersCard } from '@/components/landing/TopGainersCard';
import { NewsFeed } from '@/components/landing/NewsFeed';
import { useQuery } from '@tanstack/react-query';
import { fetchMarketSummary } from '@/lib/api';

const Landing = () => {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['market-summary'],
    queryFn: fetchMarketSummary,
    refetchInterval: 60000, // Refresh every minute
  });

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <MarketTicker data={marketData?.tickers} isLoading={isLoading} />

      <main className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Market Highlights */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Top Gainers</h2>
            {/* We pass the whole list, the component can filter or display top items */}
            {/* For now, let's pass the global gainers to the Global card, and maybe filter for Crypto if we have it */}
            <TopGainersCard
              type="global"
              title="Top Market Movers"
              data={marketData?.gainers}
              isLoading={isLoading}
            />
            {/* Keeping others as placeholders or removing if we don't have data? 
                The prompt implies connecting them. Since we only have one real list, 
                let's assume we replace the 3 cards with one big list or just use the Global one.
                I'll comment out the others to avoid confusion with fake data.
            */}
            {/* <TopGainersCard type="crypto" title="Crypto" />
             <TopGainersCard type="dse" title="DSE Stock" /> */}
          </div>

          {/* Right Column - News Feed */}
          <div className="lg:col-span-2">
            <NewsFeed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
