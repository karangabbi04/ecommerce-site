"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="flex justify-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.15,
          type: "spring",
          stiffness: 220,
          damping: 16,
        }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
      >
        <CheckCircle2 className="h-14 w-14 text-green-600" />
      </motion.div>
    </motion.div>
  );
}