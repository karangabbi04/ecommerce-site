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

  // Agar images hi nahi hain, toh fallback dikhao
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-[2rem] border border-border bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No Image Available</span>
      </div>
    );
  }

  return (
    <section
      aria-label="Product Gallery"
      className="rounded-[2rem] border border-border bg-background p-2 shadow-sm lg:p-3"
    >
      <div className="grid gap-3 lg:grid-cols-[88px_1fr]">
        
        {/* ---------------------------------------------------------------- */}
        {/* 1. Desktop Thumbnail List (Left Side) */}
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
                  // Fixed size for desktop thumbnails to prevent layout shift
                  "w-[88px] h-[88px] shrink-0", 
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
                  // object-cover ensures the thumbnail fills the square without stretching
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </button>
            );
          })}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 2. Main Image (Right Side on Desktop, Top on Mobile) */}
        {/* ---------------------------------------------------------------- */}
        <div
          onMouseEnter={zoomIn}
          onMouseLeave={zoomOut}
          className="relative overflow-hidden rounded-3xl border border-border bg-muted"
        >
          {/* aspect-square ensures the container is always a perfect square, preventing layout jumps */}
          <div className="relative aspect-square w-full">
            <Image
              src={activeImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className={cn(
                // object-contain ensures the ENTIRE product is visible, no matter its original size
                "object-contain p-4 transition-transform duration-500 ease-out",
                isZoomed && "scale-125 cursor-zoom-in" // Thoda zyada zoom for better effect
              )}
            />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 3. Mobile Thumbnail List (Bottom Scroll) */}
      {/* ---------------------------------------------------------------- */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 lg:hidden scrollbar-hide">
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
                  // Fixed square size for mobile thumbnails (80x80px)
                  "w-20 h-20", 
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
                  // object-cover prevents stretching on mobile
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}