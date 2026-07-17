"use client";

import { useCallback, useMemo, useState } from "react";

import {
  clampImageIndex,
  getActiveImage,
  type ProductImage,
} from "../utils/productUtils";

type UseProductGalleryProps = {
  images?: ProductImage[];
  fallbackImage?: string;
};

export function useProductGallery({
  images = [],
  fallbackImage = "/placeholder.png",
}: UseProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  
  const activeImage = useMemo(
    () => getActiveImage(images, selectedImageIndex, fallbackImage),
    [images, selectedImageIndex, fallbackImage]
  );

  const selectImage = useCallback(
    (index: number) => {
      const validIndex = clampImageIndex(index, images.length);

      setSelectedImageIndex(validIndex);
      setIsZoomed(false);
    },
    [images.length]
  );

  
  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev >= images.length - 1 ? 0 : prev + 1
    );

    setIsZoomed(false);
  }, [images.length]);

  
  const previousImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev <= 0 ? images.length - 1 : prev - 1
    );

    setIsZoomed(false);
  }, [images.length]);


  const zoomIn = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const zoomOut = useCallback(() => {
    setIsZoomed(false);
  }, []);

  
  const resetGallery = useCallback(() => {
    setSelectedImageIndex(0);
    setIsZoomed(false);
  }, []);

  return {
    activeImage,

    selectedImageIndex,
    isZoomed,

    selectImage,
    nextImage,
    previousImage,

    zoomIn,
    zoomOut,

    resetGallery,
  };
}