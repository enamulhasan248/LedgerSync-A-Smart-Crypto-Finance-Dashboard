import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { MarketTicker } from '@/components/landing/MarketTicker';
import { TopGainersCard } from '@/components/landing/TopGainersCard';
import { NewsFeed } from '@/components/landing/NewsFeed';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <MarketTicker />
      
      <main className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Market Highlights */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Top Gainers</h2>
            <TopGainersCard type="crypto" title="Crypto" />
            <TopGainersCard type="global" title="Global Stock" />
            <TopGainersCard type="dse" title="DSE Stock" />
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
