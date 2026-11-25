'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { cardHoverVariants } from '@/lib/motion/variants';

export interface MotionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

/**
 * MotionCard Component
 *
 * Premium SaaS card with optional subtle hover elevation and border transition.
 * Only applies interactive motion if `interactive` prop is true.
 */
export function MotionCard({
  children,
  className,
  interactive = false,
  ...props
}: MotionCardProps) {
  if (!interactive) {
    return (
      <div
        className={cn(
          'bg-white rounded-xl border border-slate-200/80 shadow-xs transition-colors duration-150',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={cn(
        'bg-white rounded-xl border border-slate-200/80 shadow-xs transition-colors duration-150 hover:border-slate-300 hover:shadow-sm cursor-pointer',
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
