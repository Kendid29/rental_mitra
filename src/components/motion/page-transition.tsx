'use client';

import React from 'react';
import { motion } from 'motion/react';
import { pageVariants } from '@/lib/motion/variants';
import { cn } from '@/lib/utils';

/**
 * PageTransition Component
 *
 * Smooth, subtle opacity + 6px Y-offset transition when switching pages.
 * Kept fast (~220ms) so users never wait before interacting.
 */
export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn('w-full flex-1', className)}
    >
      {children}
    </motion.div>
  );
}
