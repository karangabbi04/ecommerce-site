"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { productSchema, ProductSchemaType } from "@/validations/addProduct.validation";
import ProductCategorySelect from "./productCategorySelect";
import ImageUpload from "@/components/comman/image-uplaod/imageUplaod";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Hooks (Tumhare actual hooks ke naam ke hisab se adjust kar lena)
import { useCreateProduct } from "@/hooks/mutations/use-addProduct";
// import { useUpdateProduct } from "@/hooks/mutations/use-editProduct"; 

type ProductFormInitialData = Omit<ProductSchemaType, "category" | "images"> & {
  id: string;
  category?: { id: string; name: string } | string | null;
  images?: unknown[];
};

interface ProductFormProps {
  initialData?: ProductFormInitialData | null;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ProductForm({ initialData, onSuccess, onClose }: ProductFormProps = {}) {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const createProduct = useCreateProduct();
  // const updateProduct = useUpdateProduct(); // ✅ Update hook uncomment karna

  const isEditMode = !!initialData; // ✅ Check karo ki ye Edit mode hai ya Create
  const normalizedCategory =
    typeof initialData?.category === "string"
      ? initialData.category
      : initialData?.category?.id ?? "";

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? {
      // ✅ Edit Mode: Existing data se fill karo
      ...initialData,
      category: normalizedCategory,
      // Images ko handle karne ke liye (agar backend URLs bhejta hai)
      images: Array.isArray(initialData.images) ? initialData.images.filter((image) => image instanceof File || typeof image === "string") as File[] : [],
    } : {
      // ✅ Create Mode: Empty values
      name: "",
      description: "",
      category: "",
      images: [],
      price: 0,
      stock: 0,
      status: "DRAFT",
      tag: "",
    },
  });

  async function onSubmit(values: ProductSchemaType) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("price", String(values.price));
      formData.append("stock", String(values.stock));
      formData.append("status", values.status);
      formData.append("tag", values.tag);

      // ✅ Image Handling: Sirf NEW files ko hi append karo (Existing URLs ko ignore karo)
      if (values.images && Array.isArray(values.images)) {
        values.images.forEach((file: any) => {
          if (file instanceof File) {
            formData.append("images", file);
          }
        });
      }

      if (isEditMode && initialData) {
        // ✅ UPDATE API CALL
        // await updateProduct.mutateAsync({ id: initialData.id, data: formData });
        
        // Mock for now:
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Product updated successfully!");
      } else {
        // ✅ CREATE API CALL
        await createProduct.mutateAsync(formData);
        toast.success("Product created successfully!");
      }

      form.reset(values); // Form ko updated values ke saath reset karo

      // ✅ SMART CHECK (Modal vs Standalone Page)
      if (onClose && onSuccess) {
        onSuccess();
        onClose();
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("PRODUCT SAVE ERROR:", error);
      toast.error(isEditMode ? "Failed to update product" : "Failed to create product");
    }
  }

  return (
    <Form {...form}>
      {!onClose && (
        <h1
          className={
            isSuccess
              ? "mb-4 rounded-md bg-green-100 px-3 py-2 text-2xl font-bold text-green-700"
              : "mb-4 text-2xl font-bold"
          }
        >
          {isSuccess 
            ? (isEditMode ? "Product Updated Successfully" : "Product Created Successfully") 
            : (isEditMode ? "Edit Product" : "Add Product")}
        </h1>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          console.log("Form validation errors:", error);
          toast.error("Please fix the errors in the form.");
        })}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            {/* Note: Ensure ProductCategorySelect uses useFormContext or accepts value/onChange */}
            <ProductCategorySelect />
          </div>



          <div>
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      type="number"
                      placeholder="₹ 500"
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => 
                        field.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  {/* ✅ Helpful hint in edit mode */}
                  {isEditMode && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current price: ₹{initialData?.price} • Enter new price to update
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      type="number"
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="Tag" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product details..." className="w-full min-h-25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <ImageUpload
              control={form.control}
              name="images"
              label="Product Images"
              description={isEditMode ? "Add new images or keep existing ones." : "Upload high-quality product images."}
              maxFiles={5}
              maxFileSize={5 * 1024 * 1024}
            />
          </div>
        </div>

        {/* Mobile-First Button Layout */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createProduct.isPending} // Ya isPending agar update hook use kar rahe ho
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={createProduct.isPending}
            className="w-full sm:w-auto"
          >
            {createProduct.isPending 
              ? "Saving..." 
              : (isEditMode ? "Update Product" : "Create Product")}
          </Button>
        </div>
      </form>
    </Form>
  );
}