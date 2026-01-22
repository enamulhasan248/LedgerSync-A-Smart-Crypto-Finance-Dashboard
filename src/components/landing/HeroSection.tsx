import { useQuery } from '@tanstack/react-query';
import { fetchTopHeadlines } from '@/lib/api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

export function HeroSection() {
  const { data: headlines, isLoading } = useQuery({
    queryKey: ['top-headlines'],
    queryFn: fetchTopHeadlines,
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-10 lg:py-16">
      <div className="container flex justify-center">
        {isLoading ? (
          <div className="w-full max-w-[85%] lg:max-w-[70%] h-[300px] md:h-[400px]">
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ) : (
          <Carousel className="w-full max-w-[85%] lg:max-w-[70%]" opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {headlines?.map((item, index) => (
                <CarouselItem key={index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden group cursor-pointer"
                  >
                    {/* Background Image or Fallback Gradient */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80" />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Text Content */}
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                      <span className="inline-block px-2 py-1 rounded bg-primary/90 text-primary-foreground text-xs font-semibold mb-3">
                        {item.source}
                      </span>
                      <h2 className="text-xl md:text-3xl font-bold text-white leading-tight line-clamp-2 md:line-clamp-3">
                        {item.title}
                      </h2>
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
