/**
 * Centralized Motion Transitions & Easings for RentalinAja Mitra
 *
 * Designed with a Premium SaaS aesthetic (Linear, Stripe, Raycast).
 * Prioritizes subtlety, smoothness, responsiveness, and performance.
 */

// Custom cubic-bezier curves tuned for professional SaaS software
export const EASINGS = {
  // Ultra-smooth exponential deceleration (signature Linear / Stripe feel)
  saas: [0.16, 1, 0.3, 1] as const,
  // Standard natural deceleration
  easeOut: [0, 0, 0.2, 1] as const,
  // Snappy deceleration for micro-interactions (buttons, pills, badges)
  snappy: [0.25, 1, 0.5, 1] as const,
  // Smooth symmetric acceleration/deceleration
  easeInOut: [0.4, 0, 0.2, 1] as const,
};

// Durations in seconds (kept under 300ms to avoid blocking operational workflow)
export const DURATIONS = {
  instant: 0.08,
  micro: 0.15,
  fast: 0.2,
  normal: 0.25,
  sheet: 0.3,
  stagger: 0.04,
};

// Reusable transition presets for Motion components
export const TRANSITIONS = {
  // Page enter transition: fast & subtle
  page: {
    duration: DURATIONS.normal,
    ease: EASINGS.saas,
  },
  // Section / card reveal
  reveal: {
    duration: DURATIONS.normal,
    ease: EASINGS.saas,
  },
  // Dialog / Modal enter
  modal: {
    duration: DURATIONS.fast,
    ease: EASINGS.saas,
  },
  // Sheet / Drawer slide
  sheet: {
    duration: DURATIONS.sheet,
    ease: EASINGS.saas,
  },
  // Dropdown / Popover / Tooltip
  dropdown: {
    duration: DURATIONS.micro,
    ease: EASINGS.snappy,
  },
  // Micro-interactions (hover, active press)
  micro: {
    duration: DURATIONS.micro,
    ease: EASINGS.easeOut,
  },
  // Stagger timing preset
  stagger: (staggerDelay = DURATIONS.stagger, delayChildren = 0.02) => ({
    staggerChildren: staggerDelay,
    delayChildren,
  }),
};
