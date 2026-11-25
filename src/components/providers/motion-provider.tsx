'use client';

import React from 'react';
import { MotionConfig } from 'motion/react';

/**
 * Global Motion Provider for RentalinAja Mitra
 *
 * Automatically respects OS/browser `prefers-reduced-motion` settings.
 * If user has reduced motion enabled, motion transforms are eliminated
 * or reduced to subtle opacity/instant transitions.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
