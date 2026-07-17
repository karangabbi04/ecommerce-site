"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Pagination } from "@/types/product";

interface ProductPaginationProps {
    pagination: Pagination;

    onPageChange: (page: number) => void;
}

export default function ProductPagination({
    pagination,
    onPageChange,
}: ProductPaginationProps) {
    return (
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">

            <Button
                variant="outline"
                disabled={!pagination.hasPrevPage}
                onClick={() =>
                    onPageChange(
                        pagination.currentPage - 1
                    )
                }
            >
                <ChevronLeft className="mr-2 h-4 w-4" />

                Previous

            </Button>

            {Array.from({
                length: pagination.totalPages,
            }).map((_, index) => {

                const page = index + 1;

                return (

                    <Button
                        key={page}
                        variant={
                            page === pagination.currentPage
                                ? "default"
                                : "outline"
                        }
                        onClick={() =>
                            onPageChange(page)
                        }
                    >
                        {page}
                    </Button>

                );

            })}

            <Button
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() =>
                    onPageChange(
                        pagination.currentPage + 1
                    )
                }
            >
                Next

                <ChevronRight className="ml-2 h-4 w-4" />

            </Button>

        </div>
    );
}