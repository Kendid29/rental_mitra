'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import {
  revealVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '@/lib/motion/variants';
import { cn } from '@/lib/utils';

/**
 * Reveal Component
 *
 * Smooth entrance animation for sections, cards, or tables.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={revealVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer Component
 *
 * Staggers children elements with a subtle 40ms interval.
 * Ideal for KPI card grids, vehicle lists, and finance summaries.
 */
export function StaggerContainer({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem Component
 *
 * Must be a direct or indirect child of StaggerContainer.
 */
export function StaggerItem({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
