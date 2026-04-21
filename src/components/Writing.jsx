import React from 'react';

export default function Writing({ writing }) {
  if (!writing || writing.length === 0) return null;

  return (
    <div className="space-y-6">
      {writing.map((article, idx) => (
        <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-start">
          <span className="text-secondary sm:w-28 shrink-0 text-sm mt-0.5">{article.year}</span>

          <div className="flex-1">
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1 font-medium text-primary hover:text-secondary transition-colors"
            >
              {article.title}
              <span className="text-secondary text-xs relative top-[1px] group-hover:-translate-y-[1px] group-hover:translate-x-[1px] transition-transform">
                ↗
              </span>
            </a>
            <p className="text-secondary text-sm mt-0.5">{article.publication}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
