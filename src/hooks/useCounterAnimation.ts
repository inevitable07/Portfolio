import { useEffect, useRef, useState } from 'react';

interface UseCounterAnimationOptions {
  target: number;
  duration?: number; // ms
  shouldAnimate?: boolean; // trigger animation
  onAnimationComplete?: () => void;
}

/**
 * Hook that animates a counter from 0 to target value.
 * Triggers only when shouldAnimate becomes true.
 * Returns the current animated value.
 */
export function useCounterAnimation({
  target,
  duration = 1000,
  shouldAnimate = false,
  onAnimationComplete,
}: UseCounterAnimationOptions): number {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const prevShouldAnimateRef = useRef(shouldAnimate);

  useEffect(() => {
    // Detect transition from false to true (start/restart animation)
    const shouldStart = shouldAnimate && !prevShouldAnimateRef.current;
    
    if (shouldStart) {
      // Reset animation state
      startTimeRef.current = null;

      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = currentTime;
        }

        const elapsed = currentTime - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function: ease-out
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeProgress * target);

        setDisplayValue(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          setDisplayValue(target);
          startTimeRef.current = null;
          onAnimationComplete?.();
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else if (!shouldAnimate) {
      // Reset when animation is disabled
      setDisplayValue(0);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startTimeRef.current = null;
    }

    prevShouldAnimateRef.current = shouldAnimate;

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [shouldAnimate, target, duration, onAnimationComplete]);

  return displayValue;
}
