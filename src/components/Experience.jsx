import React from 'react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function Experience({ experience }) {
  const { lang } = useLang();
  const t = translations[lang];

  if (!experience || experience.length === 0) return null;

  // ── Month localization ──────────────────────────────────────────────────
  const MONTH_VN = {
    Jan: 'Tháng 1', Feb: 'Tháng 2', Mar: 'Tháng 3', Apr: 'Tháng 4',
    May: 'Tháng 5', Jun: 'Tháng 6', Jul: 'Tháng 7', Aug: 'Tháng 8',
    Sep: 'Tháng 9', Oct: 'Tháng 10', Nov: 'Tháng 11', Dec: 'Tháng 12',
  };

  /** Translate an English month abbreviation based on current lang. */
  function localizeMonth(month) {
    if (!month) return null;
    return lang === 'vn' ? (MONTH_VN[month] ?? month) : month;
  }

  /** Format a localized "month year" string.  EN: "Aug 2026"  VN: "Tháng 8 - 2026" */
  function formatMonthYear(month, year) {
    const m = localizeMonth(month);
    if (!m) return year;
    return lang === 'vn' ? `${m} - ${year}` : `${m} ${year}`;
  }

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

  function formatRange(job) {
    const start = parseDate(job.startDate ?? job.startYear);
    const rawEnd = job.endDate ?? job.endYear ?? '';
    const isOngoing = !rawEnd || /^(present|now)/i.test(rawEnd.trim());
    const end = isOngoing ? null : parseDate(rawEnd);

    const sameYear = !isOngoing && end && start && start.year === end.year;

    let mobile, desktopLeft, desktopRight;

    if (isOngoing) {
      mobile = `${formatMonthYear(start.month, start.year)} — ${t.present}`;
      desktopLeft = formatMonthYear(start.month, start.year);
      desktopRight = t.present;
    } else if (sameYear) {
      // Collapse the year:  EN: "Jul — Aug 2025"  VN: "Tháng 7 — Tháng 8 - 2025"
      const sm = localizeMonth(start.month) ?? start.year;
      const em = localizeMonth(end.month) ?? end.year;
      mobile = lang === 'vn'
        ? `${sm} — ${em} - ${start.year}`
        : `${sm} — ${em} ${start.year}`;
      desktopLeft = `${sm} — ${em}`;
      desktopRight = start.year;
    } else {
      const startLabel = formatMonthYear(start.month, start.year);
      const endLabel = end ? formatMonthYear(end.month, end.year) : '';
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
            <div className="text-secondary sm:w-40 shrink-0 flex items-center gap-1.5">
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
                  {job.role[lang]} {t.at} {typeof job.company === 'object' ? job.company[lang] : job.company}
                </a>
                {job.url && (
                  <span className="text-secondary text-xs relative top-[1px] group-hover:-translate-y-[1px] group-hover:translate-x-[1px] group-hover:text-primary transition-transform">
                    ↗
                  </span>
                )}
              </h3>
              {job.location && (
                <p className="text-secondary text-[0.95rem] mt-0.5">{typeof job.location === 'object' ? job.location[lang] : job.location}</p>
              )}
              {job.description && job.description[lang] && (
                <ul className="mt-3 space-y-2 list-disc list-outside ml-4 text-secondary/90 text-[0.95rem] leading-relaxed">
                  {job.description[lang].map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
