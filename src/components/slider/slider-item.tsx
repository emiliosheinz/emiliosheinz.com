"use client";

import { motion } from "motion/react";

type ItemProps = { children: React.ReactNode };

export function SliderItem({ children }: ItemProps) {
  return <motion.div className="flex">{children}</motion.div>;
}
