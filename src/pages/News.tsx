import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Reusing NewsFeed logic but parameterizing country content?
// Current NewsFeed fetches 'us' hardcoded or via internal state.
// Let's create a new component for the page content.

function NewsContent() {
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Financial News</h1>
            <Tabs defaultValue="us" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-4">
                    <TabsTrigger value="us">US</TabsTrigger>
                    <TabsTrigger value="gb">UK</TabsTrigger>
                    <TabsTrigger value="jp">Japan</TabsTrigger>
                    <TabsTrigger value="bd">BD</TabsTrigger>
                </TabsList>

                <NewsSection country="us" />
                <NewsSection country="gb" />
                <NewsSection country="jp" />
                <NewsSection country="bd" />
            </Tabs>
        </div>
    );
}

function NewsSection({ country }: { country: string }) {
    const { data: news = [], isLoading } = useQuery({
        queryKey: ['news', country],
        queryFn: () => fetchNews(country),
        staleTime: 300000 // 5 mins
    });

    return (
        <TabsContent value={country} className="mt-6">
            {isLoading ? (
                <div className="text-muted-foreground">Loading news...</div>
            ) : news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item: any, idx: number) => (
                        <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                            <article className="h-full border border-border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card">
                                {item.image && (
                                    <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4" />
                                )}
                                <div className="text-sm text-muted-foreground mb-2">
                                    {item.source} • {new Date(item.published_at).toLocaleDateString()}
                                </div>
                                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                {item.summary && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                                        {item.summary}
                                    </p>
                                )}
                            </article>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="text-muted-foreground">No news available for this region.</div>
            )}
        </TabsContent>
    );
}

// Public Page Export
export default function NewsPage() {
    return (
        <PublicLayout>
            <NewsContent />
        </PublicLayout>
    );
}

// Dashboard Version Export (if needed)
export function DashboardNewsPage() {
    return (
        <DashboardLayout>
            <NewsContent />
        </DashboardLayout>
    );
}
