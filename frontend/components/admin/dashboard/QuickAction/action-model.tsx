// components/modals/action-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CategoryForm } from "./forms/category-form";
import ProductForm from "@/components/admin/addproduct/ProductForm";

import type { ActionModalProps, ModalAction } from "./types";

const ACTION_CONFIG: Record<
  ModalAction,
  { title: string; description: string }
> = {
  "create-category": {
    title: "Create Category",
    description: "Add a new product category to organize your inventory",
  },
  "create-product": {
    title: "Add Product",
    description: "Add a new product with all details",
  },
  "edit-product": {
    title: "Edit Product",
    description: "Update product details and inventory information",
  },
  "create-variant": {
    title: "Add Product Variant",
    description: "Create a new variant for existing product",
  },
  "create-supplier": {
    title: "Add Supplier",
    description: "Register a new supplier in the system",
  },
  "create-brand": {
    title: "Add Brand",
    description: "Register a new brand for your products",
  },
};

export function ActionModal({
  isOpen,
  onClose,
  action,
  onSuccess,
  children,
}: ActionModalProps) {
  if (!action) return null;

  const config = ACTION_CONFIG[action];

  const renderForm = () => {
    if (children) return <>{children}</>;

    switch (action) {
      case "create-category":
        return <CategoryForm onSuccess={onSuccess} onClose={onClose} />;
      case "create-product":
      case "edit-product":
        return <ProductForm onSuccess={onSuccess} onClose={onClose} />;
      case "create-variant":
    //     return <VariantForm onSuccess={onSuccess} onClose={onClose} />;
    //   case "create-supplier":
    //     return <SupplierForm onSuccess={onSuccess} onClose={onClose} />;
    //   case "create-brand":
    //     return <BrandForm onSuccess={onSuccess} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          sm:max-w-150 
          max-h-[90vh] 
          overflow-y-auto 
          p-0 
          sm:p-6
          gap-0
        "
      >
        {/* Header - Mobile optimized */}
        <DialogHeader className="px-4 sm:px-0 pt-6 pb-4 sm:pb-6 border-b sm:border-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-4 sm:px-0 py-4 sm:py-0">{renderForm()}</div>
      </DialogContent>
    </Dialog>
  );
}