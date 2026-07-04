"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseAutoPlayProps {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  length: number;
  delay?: number;
}

export function useAutoPlay({
  activeIndex,
  setActiveIndex,
  length,
  delay = 3200,
}: UseAutoPlayProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % length);
    }, delay);
  }, [delay, length, setActiveIndex]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    start();
  }, [start]);

  const reset = useCallback(() => {
    pause();
    start();
  }, [pause, start]);

  useEffect(() => {
    start();

    return pause;
  }, [start, pause]);

  return {
    pause,
    resume,
    reset,
  };
}