"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

import { useProductGallery } from "@/hooks/UseProductGallery";
import { type ProductImage } from "../../utils/productUtils";

type ProductGalleryProps = {
  productName: string;
  images: ProductImage[];
};

export default function ProductGallery({
  productName,
  images,
}: ProductGalleryProps) {
  const {
    activeImage,
    selectedImageIndex,
    isZoomed,
    selectImage,
    zoomIn,
    zoomOut,
  } = useProductGallery({
    images,
  });

  return (
    <section
      aria-label="Product Gallery"
      className="rounded-[2rem] border border-border bg-background p-4 shadow-sm lg:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[88px_1fr]">
        {/* ---------------------------------------------------------------- */}
        {/* Desktop Thumbnail List */}
        {/* ---------------------------------------------------------------- */}
        <div className="hidden lg:flex lg:flex-col lg:gap-3">
          {images.map((image, index) => {
            const isActive = selectedImageIndex === index;

            return (
              <button
                key={image.id ?? index}
                type="button"
                onClick={() => selectImage(index)}
                aria-label={`View image ${index + 1}`}
                className={cn(
                  "group relative overflow-hidden rounded-xl border transition-all duration-200",
                  isActive
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/60"
                )}
              >
                <Image
                  src={image.url}
                  alt={`${productName} thumbnail ${index + 1}`}
                  width={88}
                  height={88}
                  className="aspect-square h-[88px] w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </button>
            );
          })}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Main Image */}
        {/* ---------------------------------------------------------------- */}
        <div
          onMouseEnter={zoomIn}
          onMouseLeave={zoomOut}
          className="relative overflow-hidden rounded-3xl border border-border bg-muted"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={activeImage}
              alt={productName}
              fill
              priority
              sizes="(max-width:768px) 100vw, 50vw"
              className={cn(
                "object-contain p-6 transition-transform duration-500",
                isZoomed && "scale-110"
              )}
            />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Mobile Thumbnail List */}
      {/* ---------------------------------------------------------------- */}
      {images.length > 1 && (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2 lg:hidden">
          {images.map((image, index) => {
            const isActive = selectedImageIndex === index;

            return (
              <button
                key={image.id ?? index}
                type="button"
                onClick={() => selectImage(index)}
                aria-label={`View image ${index + 1}`}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-xl border transition-all",
                  isActive
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                )}
              >
                <Image
                  src={image.url}
                  alt={`${productName} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}