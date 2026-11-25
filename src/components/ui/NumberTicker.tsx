'use client';

import React, { useEffect, useState } from 'react';

export function NumberTicker({
  value,
  duration = 1000,
  formatter,
  className,
}: {
  value: number;
  duration?: number;
  formatter?: (val: number) => string;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const startValue = 0;
    const endValue = value;

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
