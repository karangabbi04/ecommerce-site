"use client";
import { aiService } from "@/services/ai.service";

import { useEffect, useMemo, useState } from "react";
import { productService } from "@/services/product.service";

const categories = [
  "Glassware",
  "Decor",
  "Lighting",
  "Tableware",
  "Gift Items",
  "Wall Art",
];

const tagsList = [
  "Best Seller",
  "New Arrival",
  "Trending",
  "Limited Edition",
  "Eco Friendly",
  "Handmade",
];

const MAX_IMAGES = 6;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

type ProductForm = {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  stock: string;
  category: string;
  tags: string[];
  images: File[];
  isFeatured: boolean;
};

const initialFormState: ProductForm = {
  name: "",
  description: "",
  longDescription: "",
  price: "",
  stock: "",
  category: "",
  tags: [],
  images: [],
  isFeatured: false,
};

export default function AddProductPage() {
  const [form, setForm] = useState<ProductForm>(initialFormState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const imagePreviews = useMemo(() => {
    return form.images.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  }, [form.images]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [imagePreviews]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    setError("");
    setSuccess("");

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess("");

    const selectedFiles = Array.from(e.target.files ?? []);

    if (!selectedFiles.length) return;

    const invalidFile = selectedFiles.find((file) => {
      return !allowedImageTypes.includes(file.type) || file.size > MAX_IMAGE_SIZE;
    });

    if (invalidFile) {
      setError("Only JPG, PNG, and WEBP images under 5MB are allowed.");
      e.target.value = "";
      return;
    }

    setForm((prev) => {
      const nextImages = [...prev.images, ...selectedFiles];

      if (nextImages.length > MAX_IMAGES) {
        setError(`You can upload maximum ${MAX_IMAGES} images.`);
        return prev;
      }

      return {
        ...prev,
        images: nextImages,
      };
    });

    e.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const toggleTag = (tag: string) => {
    setError("");
    setSuccess("");

    setForm((prev) => {
      const alreadySelected = prev.tags.includes(tag);

      return {
        ...prev,
        tags: alreadySelected
          ? prev.tags.filter((selectedTag) => selectedTag !== tag)
          : [...prev.tags, tag],
      };
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (form.name.trim().length < 3) {
      return "Product name must be at least 3 characters.";
    }

    if (!form.description.trim()) {
      return "Short description is required.";
    }

    if (form.description.trim().length < 10) {
      return "Short description must be at least 10 characters.";
    }

    if (!form.longDescription.trim()) {
      return "Full description is required.";
    }

    if (!form.price || Number(form.price) <= 0) {
      return "Valid price is required.";
    }

    if (!form.stock || Number(form.stock) < 0) {
      return "Valid stock is required.";
    }

    if (!Number.isInteger(Number(form.stock))) {
      return "Stock must be a whole number.";
    }

    if (!form.category) {
      return "Category is required.";
    }

    if (!form.images.length) {
      return "At least one product image is required.";
    }

    return "";
  };

  const resetForm = () => {
    setForm(initialFormState);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("longDescription", form.longDescription.trim());
      formData.append("price", String(Number(form.price)));
      formData.append("stock", String(Number(form.stock)));
      formData.append("category", form.category);
      formData.append("isFeatured", String(form.isFeatured));

      form.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });

      form.images.forEach((image) => {
        formData.append("images", image);
      });

      const result = await productService.createProduct(formData);

      console.log("Product creation result:", result);

      setSuccess("Product created successfully.");
      setForm(initialFormState);
    } catch (err) {
      console.error("Create product failed:", err);
      setError("Product create nahi ho paya. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleEnhanceDescription = async () => {
  setError("");
  setSuccess("");

  if (!form.name.trim()) {
    setError("AI use karne ke liye product name required hai.");
    return;
  }

  if (!form.description.trim()) {
    setError("Pehle rough short description likho.");
    return;
  }

  try {
    setIsEnhancing(true);

    const result = await aiService.enhanceProductDescription({
      name: form.name,
      description: form.description,
      category: form.category,
      tags: form.tags,
    });

    setForm((prev) => ({
      ...prev,
      description: result.description,
      // longDescription: result.longDescription,
      tags: result.suggestedTags?.length ? result.suggestedTags : prev.tags,
    }));

    setSuccess("AI  successfuly enhanced the product description.");
  } catch (err) {
    console.error("AI enhance failed:", err);
    setError(err instanceof Error ? err.message : "AI enhancement failed.");
  } finally {
    setIsEnhancing(false);
  }
};

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5f5f7] via-white to-[#f5f5f7] p-6 text-zinc-950">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Admin Product
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Add New Product
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 md:text-base">
            Create a product with details, pricing, stock, tags, category and images.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-2xl shadow-zinc-900/10 backdrop-blur-2xl md:p-8"
        >
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                Product Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Bottle Glass Set"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 outline-none transition focus:border-zinc-950"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold"
              >
                Short Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Small product summary shown on product cards"
                value={form.description}
                onChange={handleChange}
                className="min-h-24 w-full rounded-xl border border-zinc-200 bg-white p-3 outline-none transition focus:border-zinc-950"
              />
            </div>

            <div className="md:col-span-2">
             
              <button
              type="button"
              onClick={handleEnhanceDescription}
              disabled={isEnhancing}
              className=" rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEnhancing ? "Enhancing..." : "Enhance with AI"}
            </button>
            </div>

            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-semibold">
                Price
              </label>

              <input
                id="price"
                type="number"
                name="price"
                min="0"
                placeholder="799"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 outline-none transition focus:border-zinc-950"
              />
            </div>

            <div>
              <label htmlFor="stock" className="mb-2 block text-sm font-semibold">
                Stock
              </label>

              <input
                id="stock"
                type="number"
                name="stock"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 outline-none transition focus:border-zinc-950"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-semibold">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 outline-none transition focus:border-zinc-950"
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-5 w-5 accent-zinc-950"
                />

                <span className="font-medium">Mark as Featured Product</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Tags</label>

              <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                {tagsList.map((tag) => {
                  const selected = form.tags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        selected
                          ? "bg-zinc-950 text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      {selected ? "✓ " : ""}
                      {tag}
                    </button>
                  );
                })}
              </div>

              {form.tags.length > 0 ? (
                <p className="mt-2 text-sm text-zinc-500">
                  Selected: {form.tags.join(", ")}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="images" className="mb-2 block text-sm font-semibold">
                Upload Images
              </label>

              <input
                id="images"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageUpload}
                className="w-full rounded-xl border border-dashed border-zinc-300 bg-white p-4"
              />

              <p className="mt-2 text-xs text-zinc-500">
                PNG, JPG, WEBP allowed. Max {MAX_IMAGES} images. Max 5MB each.
              </p>
            </div>
          </div>

          {imagePreviews.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((image, index) => (
                <div
                  key={image.url}
                  className="group relative overflow-hidden rounded-xl shadow-sm"
                >
                  <img
                    src={image.url}
                    alt={`Product preview ${index + 1}`}
                    className="h-24 w-24 object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white transition hover:bg-black"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="w-full rounded-full border border-zinc-300 bg-white py-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 md:w-44"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-zinc-950 py-4 text-sm font-semibold text-white shadow-xl shadow-zinc-950/15 transition hover:scale-[1.01] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Product..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}