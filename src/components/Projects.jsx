import React from 'react';
import { useLang } from '../context/LanguageContext';

export default function Projects({ projects }) {
  const { lang } = useLang();

  if (!projects || projects.length === 0) return null;

  // Group projects by year, preserving order
  const grouped = projects.reduce((acc, project) => {
    const yr = project.year ?? '—';
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(project);
    return acc;
  }, {});

  // Unique years in original appearance order
  const years = [...new Set(projects.map((p) => p.year ?? '—'))];

  return (
    <div className="space-y-6">
      {years.map((year) => {
        const group = grouped[year];

        return (
          <div key={year} className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-start">
            {/* Year label — shown once per group, pinned to top */}
            <span className="text-secondary sm:w-28 shrink-0 text-sm pt-0.5">{year}</span>

            {/* All projects for this year */}
            <div className="flex-1 space-y-4">
              {group.map((project, idx) => (
                <div key={idx} className={idx > 0 ? 'pt-4 border-t border-neutral-100 dark:border-neutral-800' : ''}>
                  <a
                    href={project.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 font-medium text-primary hover:text-secondary transition-colors"
                  >
                    {project.name}
                    {project.url && (
                      <span className="text-secondary text-xs relative top-[1px] group-hover:-translate-y-[1px] group-hover:translate-x-[1px] transition-transform">
                        ↗
                      </span>
                    )}
                  </a>
                  <p className="text-secondary text-sm mt-0.5">{project.description[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
