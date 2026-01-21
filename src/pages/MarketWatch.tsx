import { useState } from 'react';
import { AssetTable } from '@/components/market/AssetTable';
import { AlertModal } from '@/components/alerts/AlertModal';

const MarketWatch = () => {
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>();

  const handleSetAlert = (symbol: string) => {
    setSelectedSymbol(symbol);
    setAlertModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">Market Watch</h1>
        <p className="text-muted-foreground mt-1">Monitor all your tracked assets across markets</p>
      </div>

      {/* Asset Table */}
      <AssetTable onSetAlert={handleSetAlert} />

      {/* Alert Modal */}
      <AlertModal
        open={alertModalOpen}
        onOpenChange={setAlertModalOpen}
        preselectedSymbol={selectedSymbol}
      />
    </div>
  );
};

export default MarketWatch;
