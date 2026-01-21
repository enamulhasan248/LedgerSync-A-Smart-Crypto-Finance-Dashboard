import { useState } from 'react';
import { Globe, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { fetchNews, NewsItem } from '@/lib/api';

const countries = [
  { value: 'us', label: 'USA', flag: '🇺🇸' },
  { value: 'uk', label: 'UK', flag: '🇬🇧' },
  { value: 'jp', label: 'Japan', flag: '🇯🇵' },
  { value: 'bd', label: 'Bangladesh', flag: '🇧🇩' },
];

function NewsCard({ news }: { news: NewsItem }) {
  return (
    <a href={news.url} target="_blank" rel="noopener noreferrer" className="block">
      <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        {/* API currently doesn't provide thumbnails, checking if we want a placeholder or just remove img */}
        {/* <div className="w-20 h-14 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
          News
        </div> */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">{news.title}</h4>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
            <span className="font-medium">{news.source}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(news.published_at), { addSuffix: true })}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{news.summary}</p>
        </div>
      </div>
    </a>
  );
}

export function NewsFeed() {
  const [selectedCountry, setSelectedCountry] = useState('us');

  const { data: news, isLoading } = useQuery({
    queryKey: ['news', selectedCountry],
    queryFn: () => fetchNews(selectedCountry),
  });

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
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading news...</div>
        ) : news && news.length > 0 ? (
          news.map((item, index) => (
            <NewsCard key={index} news={item} />
          ))
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">No news available.</div>
        )}
      </CardContent>
    </Card>
  );
}
