"use client";

import { useCallback, useState } from "react";

type UseQuantityOptions = {
  initialQuantity?: number;
  min?: number;
  max?: number;
};

export function useQuantity({
  initialQuantity = 1,
  min = 1,
  max = 99,
}: UseQuantityOptions = {}) {
  const [Quantity, setQuantity] = useState(initialQuantity);

  
  const increment = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, max));
  }, [max]);

  
  const decrement = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, min));
  }, [min]);

  const updateQuantity = useCallback(
    (value: number) => {
      if (Number.isNaN(value)) return;

      const safeValue = Math.min(Math.max(value, min), max);

      setQuantity(safeValue);
    },
    [min, max]
  );

  
  const resetQuantity = useCallback(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const canIncrement = Quantity < max;
  const canDecrement = Quantity > min;

  return {
    Quantity,

    increment,
    decrement,

    updateQuantity,
    resetQuantity,

    canIncrement,
    canDecrement,
  };
}

export type UseQuantityReturn = ReturnType<
  typeof useQuantity
>;