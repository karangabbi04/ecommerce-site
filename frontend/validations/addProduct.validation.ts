import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be minimum 3 characters"),

  description: z.string().refine((value) => {
    const text = value.replace(/<[^>]*>/g, "");
    return text.length >= 10;
  }, {
    message: "Description must contain minimum 20 characters",
  }),

  status: z.enum(["DRAFT", "ACTIVE","ARCHIVED"], {
  error: "Status must be DRAFT or ARCHIVED OR ACTIVE",
}),

  category: z
    .string()
    .min(1, "Category is required"),

  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),

  price: z.number().positive("Price must be greater than zero"),

  stock: z.number().min(0, "Stock cannot be negative"),
  tag: z.string().min(1, "Tag is required"),
});

export type ProductSchemaType = z.infer<typeof productSchema>;