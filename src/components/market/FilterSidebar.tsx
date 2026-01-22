import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MarketAsset } from "@/data/mockMarketData";

interface FilterSidebarProps {
    title: string;
    items: MarketAsset[];
    selectedItem: MarketAsset | null;
    onSelect: (item: MarketAsset) => void;
    filterOptions?: string[];
    selectedFilter?: string;
    onFilterChange?: (value: string) => void;
    isLoading?: boolean;
}

export function FilterSidebar({
    title,
    items,
    selectedItem,
    onSelect,
    filterOptions,
    selectedFilter,
    onFilterChange,
    isLoading
}: FilterSidebarProps) {
    return (
        <div className="w-full h-full flex flex-col bg-card border-r border-border">
            <div className="p-4 border-b border-border space-y-4">
                <h2 className="font-semibold text-lg">{title}</h2>

                {filterOptions && onFilterChange && (
                    <Select value={selectedFilter} onValueChange={onFilterChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Exchange" />
                        </SelectTrigger>
                        <SelectContent>
                            {filterOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9" />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {items.map((item) => (
                        <button
                            key={item.symbol}
                            onClick={() => onSelect(item)}
                            className={cn(
                                "w-full flex items-center justify-between p-3 rounded-md transition-colors text-left",
                                selectedItem?.symbol === item.symbol
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-muted/50"
                            )}
                        >
                            <div>
                                <div className="font-medium">{item.symbol}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-[120px]">
                                    {item.name}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">${item.price.toFixed(2)}</div>
                                <div
                                    className={cn(
                                        "text-xs",
                                        item.change >= 0 ? "text-financial-positive" : "text-financial-negative"
                                    )}
                                >
                                    {item.change >= 0 ? "+" : ""}
                                    {item.changePercent.toFixed(2)}%
                                </div>
                            </div>
                        </button>
                    ))}
                    {items.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No assets found
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
