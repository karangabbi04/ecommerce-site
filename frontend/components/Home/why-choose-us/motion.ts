// components/home/why-choose-us/motion.ts

import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export const cardFade: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export const defaultViewport = {
  once: true,
  amount: 0.3,
};

export const defaultTransition = {
  duration: 0.6,
  ease: "easeOut",
};