'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis Smooth Scroll Provider for RentalinAja Mitra
 *
 * Optimized specifically for SaaS dashboards:
 * - Natural momentum without feeling sluggish or slippery
 * - Full support for prefers-reduced-motion (bypasses Lenis if enabled)
 * - Auto-scrolls to top on Next.js route navigation
 * - Does NOT hijack nested scroll containers (tables, modal bodies, sheets)
 *   due to `[data-lenis-prevent]` attributes.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Check if the user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Do not initialize smooth scroll if user prefers reduced motion
      return;
    }

    // Initialize Lenis with SaaS-tuned configuration
    const lenis = new Lenis({
      duration: 0.85, // Snappy 850ms duration (natural and responsive)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false, // Leave native touch scrolling intact on mobile/tablets
      autoRaf: false, // We control requestAnimationFrame manually for clean teardown
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  // Reset scroll position on route changes
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </LenisContext.Provider>
  );
}
