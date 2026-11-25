'use client';

import React, { useEffect, useState, useRef } from 'react';

export function NumberTicker({
  value,
  duration = 800,
  formatter,
  className,
}: {
  value: number;
  duration?: number;
  formatter?: (val: number) => string;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) {
        setDisplayValue(value);
        prevValueRef.current = value;
        return;
      }
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const startValue = prevValueRef.current;
    const endValue = value;

    if (startValue === endValue) return;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return (
    <span className={className}>
      {formatter ? formatter(displayValue) : displayValue.toLocaleString('id-ID')}
    </span>
  );
}
