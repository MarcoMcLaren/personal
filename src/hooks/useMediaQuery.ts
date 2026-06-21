import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query. SSR-safe and updates on change.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Convenience wrappers for the breakpoints used across the site. */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
export const useHasFinePointer = () =>
  useMediaQuery('(hover: hover) and (pointer: fine)');
