import { useState } from 'react';
import { Globe, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockNewsByCountry, NewsItem } from '@/lib/newsData';
import { formatDistanceToNow } from 'date-fns';

const countries = [
  { value: 'USA', label: 'USA', flag: '🇺🇸' },
  { value: 'UK', label: 'UK', flag: '🇬🇧' },
  { value: 'Japan', label: 'Japan', flag: '🇯🇵' },
  { value: 'Bangladesh', label: 'Bangladesh', flag: '🇧🇩' },
];

function NewsCard({ news }: { news: NewsItem }) {
  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <img
        src={news.thumbnail}
        alt=""
        className="w-20 h-14 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm leading-tight line-clamp-2">{news.headline}</h4>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
          <span className="font-medium">{news.source}</span>
          <span>•</span>
          <span>{formatDistanceToNow(news.timestamp, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}

export function NewsFeed() {
  const [selectedCountry, setSelectedCountry] = useState('USA');
  const news = mockNewsByCountry[selectedCountry] || [];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Financial News
          </CardTitle>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[160px]">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  <span className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </CardContent>
    </Card>
  );
}
