import React from 'react';

export default function Section({ title, children }) {
  return (
    <section className="mb-16">
      <h2 className="text-lg font-medium mb-6">{title}</h2>
      {children}
    </section>
  );
}
