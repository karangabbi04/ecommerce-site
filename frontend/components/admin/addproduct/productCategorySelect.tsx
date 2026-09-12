"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSchemaType } from "@/validations/addProduct.validation";
import { useCategories } from "@/hooks/queries/use-category";

export default function ProductCategorySelect() {
  const form = useFormContext<ProductSchemaType>();
  const { data: categories, isLoading } = useCategories();
  
  console.log("categories", categories);

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>

          <FormControl>
            <Select  onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full"> 
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : (
                  categories?.data?.map((category: any) => (
                    <SelectItem  key={category.id} value={category.id} className="mt-2">
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}