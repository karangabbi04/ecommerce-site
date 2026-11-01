// app/admin/products/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Plus, Filter, X, Search, AlertTriangle, Package, IndianRupee } from "lucide-react";
import Image from "next/image";
import { isAxiosError } from "axios";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

// Custom Components
import { ColumnConfig, DataTable } from "@/components/data-table/DataTable";
import { useDebounce } from "@/hooks/useDebounce";     
import {
  useAdminProducts,
  useCategories,
  useUpdateProductStatus,
} from "@/hooks/queries/use-products";
import { ActionModal } from "@/components/admin/dashboard/QuickAction/action-model";
import type { ModalAction } from "@/components/admin/dashboard/QuickAction/types";
import ProductForm from "@/components/admin/addproduct/ProductForm";
import { QuickPriceUpdate } from "@/components/admin/addproduct/quick-price-update";

// --- Types ---
export interface Product {
  tag: string;
  description: string;
  id: string;
  sku?: string;
  name: string;
  category: { id: string; name: string } | null;
  price: number | string;
  oldPrice?: number | string | null;
  stock: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  createdAt: string;
  images?: { url: string }[];
}

interface FilterState {
  search: string;
  category: string;
  status: string;
  lowStock: boolean;
  sort: "newest" | "oldest" | "price_asc" | "price_desc";
}

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [priceUpdateProduct, setPriceUpdateProduct] = useState<Product | null>(null);
  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "ALL",
    status: "ALL",
    lowStock: false,
    sort: "newest",
  });

  // Debounce search to avoid spamming API
  const debouncedSearch = useDebounce(filters.search, 500);

  const queryParams = useMemo(() => ({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: filters.category !== "ALL" ? filters.category : undefined,
    status: filters.status !== "ALL" ? filters.status : undefined,
    stockStatus: filters.lowStock ? "LOW_STOCK" : undefined,
    sort: filters.sort,
  }), [page, limit, debouncedSearch, filters.category, filters.status, filters.lowStock, filters.sort]);
  const productsQuery = useAdminProducts(queryParams);
  const categoriesQuery = useCategories();
  const updateProductStatus = useUpdateProductStatus();
  const products: Product[] = productsQuery.data?.products ?? [];
  const pagination = productsQuery.data?.pagination;
  const isLoading = productsQuery.isLoading;

  const handleStatusChange = async (product: Product) => {
    const nextStatus = product.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";

    try {
      await updateProductStatus.mutateAsync({
        productId: product.id,
        status: nextStatus,
      });
      toast.success(`${product.name} is now ${nextStatus.toLowerCase()}.`);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(message || "Could not update product status.");
    }
  };

  // --- Handlers ---
  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "ALL",
      status: "ALL",
      lowStock: false,
      sort: "newest",
    });
    setPage(1);
  };

  const isFilterActive = 
    filters.category !== "ALL" || 
    filters.lowStock || 
    filters.status !== "ALL" ||
    filters.sort !== "newest" ||
    filters.search;

  // --- Table Columns Configuration ---
  const columns: ColumnConfig<Product>[] = [
    {
      header: "Product Name",
      cell: (row) => (
        <div className="flex min-w-20 items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-md border bg-muted">
            {row.images?.[0]?.url ? (
              <Image
                src={row.images[0].url}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <Package className="size-5" aria-hidden="true" />
              </div>
            )}
          </div>
          <span className="font-semibold text-sm">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (row) => row.category?.name ?? "Uncategorized",
      className: "hidden md:table-cell ", // Hide on mobile
    },
    {
      header: "Price",
      cell: (row) => <span className="font-medium">₹{Number(row.price).toFixed(2)}</span>,
    },
    {
      header: "old price ",
      cell: (row) =>
        row.oldPrice !== undefined && row.oldPrice !== null && row.oldPrice !== "" ? (
          <span className="font-medium">₹{Number(row.oldPrice).toFixed(2)}</span>
        ) : null,
    },
    {
      header: "Stock",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span className={row.stock < 10 ? "text-red-600 font-bold" : "text-green-600"}>
            {row.stock}
          </span>
          {row.stock < 10 && <AlertTriangle className="h-4 w-4 text-red-500" />}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const variants = {
          ACTIVE: "default",
          DRAFT: "secondary",
          ARCHIVED: "destructive",
        } as const;
        const nextStatus = row.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";
        const isUpdating =
          updateProductStatus.isPending &&
          updateProductStatus.variables?.productId === row.id;

        return (
          <button
            type="button"
            onClick={() => void handleStatusChange(row)}
            disabled={isUpdating}
            aria-label={`${row.name}: change status to ${nextStatus.toLowerCase()}`}
            title={`Click to ${nextStatus === "ACTIVE" ? "activate" : "archive"}`}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
          >
            <Badge variant={variants[row.status]} className="cursor-pointer capitalize">
              {isUpdating ? "Updating..." : row.status.toLowerCase()}
            </Badge>
          </button>
        );
      },
      className: "hidden sm:table-cell", // Hide on very small screens
    },
 {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2 justify-center">
          {/* ✅ SOLUTION 2: Quick Price Update Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPriceUpdateProduct(row);
              setIsPriceModalOpen(true);
            }}
            className="h-8 px-2"
            title="Quick Price Update"
          >
            <IndianRupee className="h-4 w-4" />
          </Button>

          {/* ✅ SOLUTION 1: Full Edit Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingProduct(row);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
   <div className="p-3 md:p-6 w-full max-w-7xl mx-auto space-y-4 md:space-y-6">
  {/* 1. Header Section */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div className="min-w-0"> {/* min-w-0 prevents text overflow on zoom */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">
        Products
      </h1>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        Manage your inventory, track stock, and update details.
      </p>
    </div>
    <Button 
      className="w-full sm:w-auto shrink-0" // shrink-0 prevents button from squishing
      onClick={() => setIsEditModalOpen(true)}
    >
      <Plus className="mr-2 h-4 w-4" /> Add Product
    </Button>
  </div>

  {/* 2. Filters Section */}
  <Card className="border-dashed">
    <CardContent className="p-3 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </h3>
        {isFilterActive && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters} 
            className="h-8 text-xs shrink-0"
          >
            <X className="mr-1 h-3 w-3" /> Clear All
          </Button>
        )}
      </div>

      {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search name or SKU..."
            className="pl-9 h-10 w-full"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Category Select */}
        <Select 
          value={filters.category} 
          onValueChange={(val) => handleFilterChange("category", val)}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            {(categoriesQuery.data ?? []).map((category: { id: string; name: string }) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Select */}
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Select */}
        <Select
          value={filters.sort}
          onValueChange={(value: FilterState["sort"]) => handleFilterChange("sort", value)}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Sort products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="price_asc">Price: low to high</SelectItem>
            <SelectItem value="price_desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Low Stock Toggle */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
        <Checkbox
          id="lowStock"
          checked={filters.lowStock}
          onCheckedChange={(checked) => handleFilterChange("lowStock", checked === true)}
          className="shrink-0"
        />
        <label
          htmlFor="lowStock"
          className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2 select-none"
        >
          <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
          <span>Show only low stock items (&lt; 10 units)</span>
        </label>
      </div>
    </CardContent>
  </Card>

  {/* 3. Data Table Section (Wrapped for Horizontal Scroll on Mobile) */}
  <div className="w-full overflow-x-auto rounded-md border">
    <DataTable<Product>
      data={products}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No products found matching your filters."
      isSelectable={true}
      scrollable
      selectedRowIds={selectedIds}
      onSelectionChange={setSelectedIds}
      getRowId={(row) => row.id}
    />
  </div>

  {productsQuery.isError && (
    <p role="alert" className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
      {productsQuery.error instanceof Error
        ? productsQuery.error.message
        : "Failed to load products."}
    </p>
  )}

  {/* 4. Pagination (Made wrap-friendly for small screens) */}
  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-md border bg-background px-3 py-3 md:px-4 md:py-3 w-full">
    <p className="text-sm text-muted-foreground text-center sm:text-left">
      Page {pagination?.currentPage ?? page} of {pagination?.totalPages ?? 1}
      {pagination ? ` · ${pagination.totalProducts} products` : ""}
    </p>
    <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!pagination?.hasPrevPage || isLoading}
        onClick={() => setPage((current) => Math.max(1, current - 1))}
        className="flex-1 sm:flex-none"
      >
        Previous
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!pagination?.hasNextPage || isLoading}
        onClick={() => setPage((current) => current + 1)}
        className="flex-1 sm:flex-none"
      >
        Next
      </Button>
    </div>
  </div>
  
  {/* Modals (Unchanged, they are usually responsive by default) */}
  <ActionModal
    isOpen={isEditModalOpen}
    onClose={() => {
      setIsEditModalOpen(false);
      setEditingProduct(null);
    }}
    action={editingProduct ? "edit-product" : "create-product"}
  >
    <ProductForm
      initialData={
        editingProduct
          ? ({
              ...editingProduct,
              category: editingProduct.category?.id ?? "",
              description: editingProduct.description ?? "",
              tag: editingProduct.tag ?? "",
              images: [],
              price: Number(editingProduct.price) || 0,
              stock: Number(editingProduct.stock) || 0,
              status: editingProduct.status ?? "DRAFT",
            } as any)
          : undefined
      }
      onSuccess={() => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
      }}
      onClose={() => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
      }}
    />
  </ActionModal>

  {priceUpdateProduct && (
    <QuickPriceUpdate
      isOpen={isPriceModalOpen}
      onClose={() => {
        setIsPriceModalOpen(false);
        setPriceUpdateProduct(null);
      }}
      product={{
        id: priceUpdateProduct.id,
        name: priceUpdateProduct.name,
        currentPrice: Number(priceUpdateProduct.price) || 0,
      }}
      onSuccess={() => {}}
    />
  )}
</div>
  )
}