import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref and a boolean `inView`.
 * Once the element scrolls into the viewport it stays `true` (fire-once).
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
