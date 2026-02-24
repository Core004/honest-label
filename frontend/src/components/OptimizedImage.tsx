import { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Skip lazy loading for above-fold images */
  priority?: boolean;
  /** Called on error */
  onError?: () => void;
  /** Fallback content when image fails to load */
  fallback?: React.ReactNode;
  /** Responsive sizes attribute (e.g. "(max-width: 768px) 100vw, 50vw") */
  sizes?: string;
  /** Intrinsic width to prevent layout shift */
  width?: number;
  /** Intrinsic height to prevent layout shift */
  height?: number;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  priority = false,
  onError,
  fallback,
  sizes,
  width,
  height,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  const handleError = useCallback(() => {
    setError(true);
    onError?.();
  }, [onError]);

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      onError={handleError}
      className={className}
      sizes={sizes}
      width={width}
      height={height}
    />
  );
}
