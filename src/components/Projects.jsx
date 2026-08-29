import React, { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

const INITIAL_VISIBLE = 4;

/**
 * Groups projects by year, preserving the order of first appearance.
 * Returns { years: string[], grouped: Record<string, Project[]> }
 */
function groupByYear(projects) {
  const grouped = {};
  const years = [];
  for (const p of projects) {
    const yr = p.year ?? '—';
    if (!grouped[yr]) {
      grouped[yr] = [];
      years.push(yr);
    }
    grouped[yr].push(p);
  }
  return { years, grouped };
}

export default function Projects({ projects }) {
  const { lang } = useLang();
  const t = translations[lang];
  const [expanded, setExpanded] = useState(false);

  if (!projects || projects.length === 0) return null;

  const visible = expanded ? projects : projects.slice(0, INITIAL_VISIBLE);
  const hasMore = projects.length > INITIAL_VISIBLE;

  const { years, grouped } = groupByYear(visible);

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year} className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-start">
          {/* Year label — pinned to top of group */}
          <span className="text-secondary sm:w-40 shrink-0 text-sm tabular-nums pt-1">
            {year}
          </span>

          {/* All projects for this year */}
          <div className="flex-1 space-y-1 w-full">
            {grouped[year].map((project, idx) => (
              <a
                key={idx}
                href={project.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-xl border border-transparent hover:border-accent hover:bg-accent/30 transition-all duration-300 px-4 py-4 -mx-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-primary group-hover:text-secondary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-secondary/90 text-[0.95rem] mt-1.5 leading-relaxed">
                      {project.description[lang]}
                    </p>
                  </div>
                  {project.url && (
                    <span className="text-secondary text-sm mt-1 shrink-0 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300">
                      ↗
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 py-2.5 text-sm font-medium text-secondary hover:text-primary border border-accent hover:border-secondary/30 rounded-xl transition-all duration-300 cursor-pointer"
        >
          {expanded
            ? (t.showLess ?? 'Show less')
            : (t.showMore ?? `Show all ${projects.length} projects`)}
        </button>
      )}
    </div>
  );
}
