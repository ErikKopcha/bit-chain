'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface TableLoadingBarProps {
  isLoading: boolean;
  className?: string;
}

export function TableLoadingBar({ isLoading, className }: TableLoadingBarProps) {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const initialRender = useRef(true);
  const loadingStartTime = useRef<number | null>(null);
  const minLoadingDuration = 3500; // Increased for a slower, smoother animation

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (isLoading) {
        setVisible(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setOpacity(1);
          });
        });
        loadingStartTime.current = Date.now();
      }
      return;
    }

    let timerId: NodeJS.Timeout;

    if (isLoading) {
      // Show the loading bar with smooth fade in
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpacity(1);
        });
      });
      loadingStartTime.current = Date.now();
    } else if (!isLoading && loadingStartTime.current !== null) {
      // Calculate remaining time to ensure minimum animation duration
      const elapsedTime = Date.now() - loadingStartTime.current;
      const remainingTime = Math.max(0, minLoadingDuration - elapsedTime);

      // Keep the bar visible for the minimum duration
      timerId = setTimeout(() => {
        // Fade out smoothly
        setOpacity(0);

        // Wait for fade out transition before removing from DOM
        timerId = setTimeout(() => {
          setVisible(false);
          loadingStartTime.current = null;
        }, 800); // Increased for smoother fade-out
      }, remainingTime);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isLoading]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={cn('fixed top-0 left-0 w-full overflow-hidden', 'h-[2px]', className)}
      style={{
        opacity,
        transition: 'opacity 1000ms ease-in-out',
      }}
    >
      <Progress indeterminate className="h-full rounded-none border-none" />
    </div>
  );
}
