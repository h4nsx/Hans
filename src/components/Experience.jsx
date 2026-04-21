import React from 'react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function Experience({ experience }) {
  const { lang } = useLang();
  const t = translations[lang];

  if (!experience || experience.length === 0) return null;

  /**
   * Parses a date string like "Jul 2025" → { month: "Jul", year: "2025" }
   * Falls back gracefully for bare year strings like "2025".
   */
  function parseDate(str) {
    if (!str || str.trim() === '') return null;
    const parts = str.trim().split(' ');
    if (parts.length === 2) return { month: parts[0], year: parts[1] };
    return { month: null, year: parts[0] }; // bare year fallback
  }

  /**
   * Builds the display strings for the date range:
   *
   * Same year  →  mobile: "Jul — Aug 2025"
   *            →  desktop left: "Jul — Aug"  right: "2025"
   *
   * Cross year →  mobile: "Jul 2024 — Aug 2025"
   *            →  desktop left: "Jul 2024"   right: "Aug 2025"
   *
   * Ongoing    →  mobile: "Jul 2025 — Now"
   *            →  desktop left: "Jul 2025"   right: "Now"
   */
  function formatRange(job) {
    const start = parseDate(job.startDate ?? job.startYear);
    const rawEnd = job.endDate ?? job.endYear ?? '';
    const isOngoing = !rawEnd || rawEnd.trim() === '';
    const end = isOngoing ? null : parseDate(rawEnd);

    const sameYear = !isOngoing && end && start && start.year === end.year;

    let mobile, desktopLeft, desktopRight;

    if (isOngoing) {
      mobile = `${start.month ? `${start.month} ` : ''}${start.year} — ${t.present}`;
      desktopLeft = `${start.month ? `${start.month} ` : ''}${start.year}`;
      desktopRight = t.present;
    } else if (sameYear) {
      // Collapse the year: "Jul — Aug 2025"
      const startLabel = start.month ?? start.year;
      const endLabel = end.month ?? end.year;
      mobile = `${startLabel} — ${endLabel} ${start.year}`;
      desktopLeft = `${startLabel} — ${endLabel}`;
      desktopRight = start.year;
    } else {
      const startLabel = `${start.month ? `${start.month} ` : ''}${start.year}`;
      const endLabel = end ? `${end.month ? `${end.month} ` : ''}${end.year}` : '';
      mobile = `${startLabel} — ${endLabel}`;
      desktopLeft = startLabel;
      desktopRight = endLabel;
    }

    return { mobile, desktopLeft, desktopRight, isOngoing };
  }

  return (
    <div className="space-y-8">
      {experience.map((job, idx) => {
        const { mobile, desktopLeft, desktopRight, isOngoing } = formatRange(job);

        return (
          <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-start">
            {/* ── Date range column ── */}
            <div className="text-secondary sm:w-28 shrink-0 flex items-center gap-1.5">
              {/* Pulsing dot for ongoing jobs */}
              {isOngoing && (
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                </span>
              )}

              {/* Mobile: single inline string */}
              <span className="sm:hidden text-sm">{mobile}</span>

              {/* Desktop: left / right spread */}
              <span className="hidden sm:flex sm:w-full sm:items-center sm:justify-between text-sm">
                <span>{desktopLeft}</span>
                <span className="opacity-50">{desktopRight}</span>
              </span>
            </div>

            {/* ── Job detail column ── */}
            <div className="flex-1">
              <h3 className="group inline-flex items-center gap-1 font-medium text-primary cursor-pointer">
                <a href={job.url} target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">
                  {job.role[lang]} {t.at} {job.company}
                </a>
                {job.url && (
                  <span className="text-secondary text-xs relative top-[1px] group-hover:-translate-y-[1px] group-hover:translate-x-[1px] group-hover:text-primary transition-transform">
                    ↗
                  </span>
                )}
              </h3>
              {job.location && (
                <p className="text-secondary text-[0.95rem] mt-0.5">{job.location}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
