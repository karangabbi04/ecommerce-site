"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAdminCategories } from "@/hooks/queries/use-admin-categories";
import type { AdminCategory } from "@/hooks/queries/use-admin-categories";
import { useDeleteCategory } from "@/hooks/mutations/use-delete-category";
import { Button } from "@/components/ui/button";
import { ActionModal } from "@/components/admin/dashboard/QuickAction/action-model";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
});

export default function CategoriesPage() {
    const { data: categories = [], isLoading, isError, error } = useAdminCategories();
    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<AdminCategory | null>(null);
    const deleteCategory = useDeleteCategory();

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;

        try {
            await deleteCategory.mutateAsync(categoryToDelete.id);
            toast.success(`${categoryToDelete.name} category deleted.`);
            setCategoryToDelete(null);
        } catch (deleteError) {
            toast.error(
                deleteError instanceof Error ? deleteError.message : "Could not delete category.",
            );
        }
    };

    return (
        <main className="space-y-6 p-4 md:p-6">
            <header className="flex flex-wrap items-end justify-between gap-2 border-b pb-5">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Catalog</p>
                    <h1 className="mt-1 text-2xl font-semibold tracking-normal">Categories</h1>
                </div>
               
                <Button
                    className="w-full shrink-0 sm:w-auto"
                    onClick={() => setIsAddCategoryOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add category
                </Button>
            </header>
            <ActionModal
                isOpen={isAddCategoryOpen}
                onClose={() => setIsAddCategoryOpen(false)}
                action="create-category"
            />
            <AlertDialog
                open={categoryToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !deleteCategory.isPending) setCategoryToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {categoryToDelete?.name}. Products in this category may prevent deletion.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteCategory.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteCategory}
                            disabled={deleteCategory.isPending}
                        >
                            {deleteCategory.isPending ? "Deleting..." : "Delete category"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
             <p className="text-sm text-muted-foreground">
                    {isLoading ? "Loading categories" : `${categories.length} categories`}
                </p>
            {isError ? (
                <p role="alert" className="py-8 text-center text-sm text-destructive">
                    {error instanceof Error ? error.message : "Could not load categories."}
                </p>
            ) : (
                <div className="overflow-hidden rounded-md border bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/40 hover:bg-muted/40">
                                <TableHead className="h-11 pl-4">Category</TableHead>
                                <TableHead className="h-11">Products</TableHead>
                                <TableHead className="h-11">Created</TableHead>
                                <TableHead className="h-11 pr-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        Loading categories...
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="py-4 pl-4">
                                            <div className="font-medium">{category.name}</div>
                                            <div className="mt-0.5 text-xs text-muted-foreground">
                                                {category.slug}
                                            </div>
                                        </TableCell>
                                        <TableCell className="tabular-nums">{category.productCount}</TableCell>
                                        <TableCell>
                                            {dateFormatter.format(new Date(category.createdAt))}
                                        </TableCell>
                                        <TableCell className="pr-4">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Edit ${category.name} category (coming soon)`}
                                                    title="Edit category (coming soon)"
                                                    disabled
                                                >
                                                    <Pencil />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Delete ${category.name} category`}
                                                    title="Delete category"
                                                    onClick={() => setCategoryToDelete(category)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </main>
    );
}
