import { ArrowRight, BarChart3, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in">
            Track the World's Markets.{' '}
            <span className="text-primary">Sync Your Ledger.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up">
            Monitor cryptocurrency, global stocks, and Dhaka Stock Exchange in one unified dashboard. 
            Real-time prices, smart alerts, and powerful analytics at your fingertips.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 animate-slide-up">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in">
            <div className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium">Real-time Data</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium">Smart Alerts</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium">Secure</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
