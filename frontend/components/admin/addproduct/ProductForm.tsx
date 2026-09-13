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
import { SelectTrigger,Select,SelectValue,SelectContent, SelectItem} from "@/components/ui/select";
import { useCreateProduct } from "@/hooks/mutations/use-addProduct";
export default function ProductForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const createProduct = useCreateProduct();

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
    setIsSuccess(false);

    try {
      console.log("FORM VALUES:", values);

      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("price", String(values.price));
      formData.append("stock", String(values.stock));
      formData.append("status", values.status);
      formData.append("tag", values.tag);

      values.images.forEach((file) => {
        formData.append("images", file);
      });

      await createProduct.mutateAsync(formData);

      setIsSuccess(true);
      toast.success("Product created successfully");
      console.log("Product created successfully");

      form.reset();
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      toast.error("Something went wrong");
    }
  }

  

  return (

	
    <Form {...form}>
      <h1
        className={
          isSuccess
            ? "mb-4 rounded-md bg-green-100 px-3 py-2 text-2xl font-bold text-green-700"
            : "mb-4 text-2xl font-bold"
        }
      >
        {isSuccess ? "Product Created Successfully" : "Add Product"}
      </h1>

      <form onSubmit={form.handleSubmit(onSubmit,
		(error) => {
			console.log("Form validation errors:", error);
			toast.error("Please fix the errors in the form.");
		}
	  )} className="space-y-6">
		<div className=" grid grid-cols-1 gap-2 md:grid-cols-2">

       <div className=" gap-6 ">
		 <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input className="w-full" placeholder="product name " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
		</div>
		<div className="">
		<ProductCategorySelect />

		</div>

        
		

		<div className="">

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input className="w-full" type="number" value={field.value === 0 ? "" : field.value} onChange={(e) =>
    field.onChange(
      e.target.value === "" ? 0 : Number(e.target.value)
    )
  } />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
		</div>
		

		<div className="">

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input className="w-full" type="number" value={field.value === 0 ? "" : field.value} onChange={(e) =>
    field.onChange(
      e.target.value === "" ? 0 : Number(e.target.value)
    )
  } />
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
              <FormLabel>status</FormLabel>
              <FormControl>
				<Select  onValueChange={field.onChange} value={field.value}>
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

		<div className=" gap-6 ">
		 <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>tag</FormLabel>
              <FormControl>
                <Input className="w-full" placeholder="tag  " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
		</div>

		</div>
		<div>

			<div className="">
			<FormField
			control={form.control}
			name="description"
			render={({ field }) => (
				<FormItem>
				<FormLabel>Description</FormLabel>
				<FormControl>
					<Textarea placeholder="Product details..." className="w-full" {...field} />
				</FormControl>
				<FormMessage />
				</FormItem>
			)}
			/>
		</div>

		<div className="">
      <ImageUpload
      control={form.control}
      name="images"
      label="Product Images"
      description="Upload high-quality product images."
      maxFiles={5}
      maxFileSize={5 * 1024 * 1024}
    />
		</div>

		
		</div>

        <Button type="submit" disabled={createProduct.isPending}>
          {createProduct.isPending ? "Saving..." : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}