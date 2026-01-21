import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockAssets } from '@/lib/mockData';
import { Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedSymbol?: string;
}

export function AlertModal({ open, onOpenChange, preselectedSymbol }: AlertModalProps) {
  const [selectedAsset, setSelectedAsset] = useState(preselectedSymbol || '');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const asset = mockAssets.find(a => a.symbol === selectedAsset);
    if (!asset || !targetPrice) return;

    toast({
      title: 'Alert Created',
      description: `You'll be notified when ${selectedAsset} goes ${condition} $${targetPrice}`,
    });

    onOpenChange(false);
    setSelectedAsset('');
    setTargetPrice('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Create Price Alert
          </DialogTitle>
          <DialogDescription>
            Set up an alert to be notified when an asset reaches your target price.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="asset">Select Asset</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Choose an asset" />
              </SelectTrigger>
              <SelectContent>
                {mockAssets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.symbol}>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{asset.symbol}</span>
                      <span className="text-muted-foreground">- {asset.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={(v) => setCondition(v as 'above' | 'below')}>
              <SelectTrigger id="condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-positive" />
                    Price goes above
                  </span>
                </SelectItem>
                <SelectItem value="below">
                  <span className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-negative" />
                    Price goes below
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Target Price (USD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedAsset || !targetPrice}>
              Create Alert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
