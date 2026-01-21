import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Globe, Palette, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your LedgerSync experience</p>
      </div>

      {/* Notification Settings */}
      <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
            </div>
            <Switch id="push" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Get daily digest via email</p>
            </div>
            <Switch id="email" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound">Sound Alerts</Label>
              <p className="text-sm text-muted-foreground">Play sound for important alerts</p>
            </div>
            <Switch id="sound" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5" />
            Display
          </CardTitle>
          <CardDescription>Customize the appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Default Currency</Label>
              <p className="text-sm text-muted-foreground">Display prices in this currency</p>
            </div>
            <Select defaultValue="usd">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
                <SelectItem value="bdt">BDT (৳)</SelectItem>
                <SelectItem value="jpy">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Default Timeframe</Label>
              <p className="text-sm text-muted-foreground">Chart default view</p>
            </div>
            <Select defaultValue="7d">
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="w-5 h-5" />
            Regional
          </CardTitle>
          <CardDescription>Language and timezone preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">Interface language</p>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Timezone</Label>
              <p className="text-sm text-muted-foreground">For accurate market hours</p>
            </div>
            <Select defaultValue="dhaka">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                <SelectItem value="tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                <SelectItem value="new_york">America/New_York</SelectItem>
                <SelectItem value="london">Europe/London</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
          <CardDescription>Keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="2fa">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </div>
            <Switch id="2fa" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="session">Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
            </div>
            <Switch id="session" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
