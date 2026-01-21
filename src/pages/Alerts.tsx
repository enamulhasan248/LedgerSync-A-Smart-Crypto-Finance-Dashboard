import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/alerts/AlertModal';
import { Bell, Plus, Trash2 } from 'lucide-react';

interface Alert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  targetPrice: number;
  createdAt: Date;
}

// Mock saved alerts
const mockAlerts: Alert[] = [
  { id: '1', symbol: 'BTC', condition: 'above', targetPrice: 70000, createdAt: new Date() },
  { id: '2', symbol: 'ETH', condition: 'below', targetPrice: 3000, createdAt: new Date() },
  { id: '3', symbol: 'AAPL', condition: 'above', targetPrice: 200, createdAt: new Date() },
];

const Alerts = () => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Price Alerts</h1>
          <p className="text-muted-foreground mt-1">Manage your price notifications</p>
        </div>
        <Button onClick={() => setAlertModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Alert
        </Button>
      </div>

      {/* Alerts List */}
      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <Card className="animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No alerts set</p>
              <p className="text-muted-foreground text-sm mt-1">
                Create your first price alert to get notified
              </p>
              <Button onClick={() => setAlertModalOpen(true)} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Create Alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert, index) => (
            <Card 
              key={alert.id} 
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{alert.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      Alert when price goes {alert.condition} ${alert.targetPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(alert.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Alert Modal */}
      <AlertModal open={alertModalOpen} onOpenChange={setAlertModalOpen} />
    </div>
  );
};

export default Alerts;
