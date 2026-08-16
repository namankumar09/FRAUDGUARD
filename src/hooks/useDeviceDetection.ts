import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile vs desktop environment based on:
 * 1. Viewport width (< 768px breakpoint)
 * 2. User agent string (iOS / Android / mobile devices)
 * Dynamically re-checks on window resize and orientation change.
 */
export function useDeviceDetection() {
  const checkIsMobile = (): boolean => {
    if (typeof window === 'undefined') return false;

    // Check viewport width (< 768px)
    const isNarrowViewport = window.innerWidth < 768;

    // Check user agent string
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    // If viewport is narrow (<768px), it's always treated as mobile layout.
    // If user agent is mobile device, also treat as mobile unless width is significantly desktop-wide.
    return isNarrowViewport || (isMobileUserAgent && window.innerWidth < 1024);
  };

  const [isMobile, setIsMobile] = useState<boolean>(checkIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return { isMobile, isDesktop: !isMobile };
}
