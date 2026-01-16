import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface InfiniteSliderProps {
  children: ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  reverse?: boolean;
}

export function InfiniteSlider({
  children,
  gap = 24,
  speed = 50,
  speedOnHover = 20,
  reverse = false,
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);

    // Clone items for seamless loop
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicatedItem);
    });
  }, []);

  const currentSpeed = isHovered ? speedOnHover : speed;
  const duration = `${100 / (currentSpeed / 50)}s`;

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={scrollerRef}
        className="flex w-max animate-scroll"
        style={{
          gap: `${gap}px`,
          animationDuration: duration,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {children}
      </div>
    </div>
  );
}
