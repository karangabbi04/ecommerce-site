"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    PRODUCT_CATEGORIES,
    SORT_OPTIONS,
} from "@/constants/products-constants";

interface ProductFiltersProps {
    search: string;
    category: string;
    sort: string;

    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSortChange: (value: string) => void;
}

export default function ProductFilters({
    search,
    category,
    sort,
    onSearchChange,
    onCategoryChange,
    onSortChange,
}: ProductFiltersProps) {
    console.log(search)
    return (
        <section className="mb-10 space-y-6">

            <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">

                {/* Search */}

                {/* <div className="relative">

                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        placeholder="Search products..."
                        onChange={(e) =>
                            onSearchChange(e.target.value)
                        }
                        className="pl-10"
                    />

                </div> */}

                {/* Category */}

                <div className="flex flex-wrap gap-2">

                    {PRODUCT_CATEGORIES.map((item) => (

                        <Badge
                            key={item}
                            onClick={() =>
                                onCategoryChange(item)
                            }
                            variant={
                                category === item
                                    ? "default"
                                    : "secondary"
                            }
                            className="cursor-pointer rounded-full px-4 py-2"
                        >
                            {item}
                        </Badge>

                    ))}

                </div>

                {/* Sort */}

                <div className="flex items-center gap-2">

                    <SlidersHorizontal className="h-4 w-4" />

                    <Select
                        value={sort}
                        onValueChange={onSortChange}
                    >
                        <SelectTrigger className="w-[220px]">

                            <SelectValue />

                        </SelectTrigger>

                        <SelectContent>

                            {SORT_OPTIONS.map((item) => (

                                <SelectItem
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </SelectItem>

                            ))}

                        </SelectContent>

                    </Select>

                </div>

            </div>

        </section>
    );
}