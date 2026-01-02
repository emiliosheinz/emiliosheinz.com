"use client";

import { motion } from "motion/react";
import type { ItemProps } from "./slider.types";

export function Item({ children }: ItemProps) {
  return <motion.div className="flex">{children}</motion.div>;
}
