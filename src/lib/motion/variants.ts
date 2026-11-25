/**
 * Centralized Motion Variants for RentalinAja Mitra
 *
 * Fully supports reduced-motion via standard Motion variants.
 */

import { Variants } from 'motion/react';
import { TRANSITIONS, EASINGS, DURATIONS } from './transitions';

// Page Transition Variants (subtle opacity + 6px Y offset)
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.page,
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: DURATIONS.micro,
      ease: EASINGS.easeOut,
    },
  },
};

// Stagger Container for KPI Cards, Grids, and Lists
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: TRANSITIONS.stagger(0.04, 0.02),
  },
};

// Item in a Stagger Container
export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.normal,
      ease: EASINGS.saas,
    },
  },
};

// Section / Card Reveal Variants
export const revealVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: TRANSITIONS.reveal,
  },
};

// Modal Backdrop & Content Variants
export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.micro, ease: EASINGS.easeOut },
  },
};

export const modalContentVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    y: 8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: TRANSITIONS.modal,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: { duration: DURATIONS.micro, ease: EASINGS.easeOut },
  },
};

// Sheet / Drawer Variants
export const sheetBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: DURATIONS.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: DURATIONS.micro },
  },
};

export const sheetRightVariants: Variants = {
  initial: { x: '100%' },
  animate: {
    x: 0,
    transition: TRANSITIONS.sheet,
  },
  exit: {
    x: '100%',
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeOut },
  },
};

export const sheetLeftVariants: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: 0,
    transition: TRANSITIONS.sheet,
  },
  exit: {
    x: '-100%',
    transition: { duration: DURATIONS.fast, ease: EASINGS.easeOut },
  },
};

// Dropdown / Popover Variants
export const dropdownVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: -4,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: TRANSITIONS.dropdown,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -4,
    transition: { duration: DURATIONS.micro, ease: EASINGS.easeOut },
  },
};

// Tooltip Variants
export const tooltipVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.12, ease: EASINGS.snappy },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.08, ease: EASINGS.easeOut },
  },
};

// Interactive Card Variants
export const cardHoverVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: -2,
    transition: { duration: DURATIONS.micro, ease: EASINGS.saas },
  },
  tap: {
    y: 0,
    scale: 0.995,
    transition: { duration: 0.08 },
  },
};

// Button press variant
export const buttonTapVariant = {
  scale: 0.98,
  transition: { duration: 0.08 },
};
