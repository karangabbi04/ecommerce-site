"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function Confetti() {
  useEffect(() => {
    const duration = 1800;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        startVelocity: 28,
        spread: 55,
        ticks: 120,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 2,
        startVelocity: 28,
        spread: 55,
        ticks: 120,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return null;
}