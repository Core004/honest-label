'use client';
import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import useMeasure from 'react-use-measure';

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const currentSpeedRef = useRef(speed);
  const [isHovered, setIsHovered] = useState(false);

  const startAnimation = useCallback(() => {
    const size = direction === 'horizontal' ? width : height;

    // Don't start animation if size is not measured yet
    if (size <= 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;
    const currentSpeed = currentSpeedRef.current;

    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    // Stop any existing animation
    if (controlsRef.current) {
      controlsRef.current.stop();
    }

    // Get current position and calculate remaining distance
    const currentPos = translation.get();
    let startFrom = from;
    let animDuration = duration;

    // If we're in the middle of animation, continue from current position
    if (currentPos !== 0 && currentPos !== from) {
      startFrom = currentPos;
      const remainingDistance = Math.abs(to - currentPos);
      animDuration = remainingDistance / currentSpeed;
    }

    controlsRef.current = animate(translation, [startFrom, to], {
      ease: 'linear',
      duration: animDuration,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
      onRepeat: () => {
        translation.set(from);
      },
    });
  }, [width, height, gap, direction, reverse, translation]);

  // Start/restart animation when size changes or speed changes
  useEffect(() => {
    const size = direction === 'horizontal' ? width : height;
    if (size > 0) {
      startAnimation();
    }

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, [width, height, startAnimation, direction]);

  // Handle hover speed changes
  useEffect(() => {
    if (speedOnHover) {
      currentSpeedRef.current = isHovered ? speedOnHover : speed;
      startAnimation();
    }
  }, [isHovered, speed, speedOnHover, startAnimation]);

  const hoverProps = speedOnHover
    ? {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      }
    : {};

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className='flex w-max'
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
