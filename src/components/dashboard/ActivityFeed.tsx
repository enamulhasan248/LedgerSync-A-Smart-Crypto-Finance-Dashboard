import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Info, CheckCircle } from 'lucide-react';
import { mockActivities, Activity } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'alert':
      return Bell;
    case 'info':
      return Info;
    case 'success':
      return CheckCircle;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'alert':
      return 'text-orange-500 bg-orange-500/10';
    case 'info':
      return 'text-blue-500 bg-blue-500/10';
    case 'success':
      return 'text-positive bg-positive/10';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

export function ActivityFeed() {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockActivities.map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colorClass = getActivityColor(activity.type);
          
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-slide-in"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', colorClass)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
