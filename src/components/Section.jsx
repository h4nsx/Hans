import React from 'react';
import { useInView } from '../hooks/useInView';

export default function Section({ title, children }) {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className={`mb-16 transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary mb-8">
        {title}
      </h2>
      {children}
    </section>
  );
}
