import React, { useState } from 'react';
import { Trophy, Award, ScrollText, Star, Medal } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

// ── Type config (refined color accents) ──────────────────────────────────────
const TYPE_CONFIG = {
  hackathon: {
    Icon: Trophy,
    label: { en: 'Hackathon', vn: 'Hackathon' },
    iconClass: 'text-amber-500 dark:text-amber-400',
    badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-amber-200/60 dark:ring-amber-800/40',
  },
  award: {
    Icon: Award,
    label: { en: 'Award', vn: 'Giải thưởng' },
    iconClass: 'text-yellow-500 dark:text-yellow-400',
    badgeClass: 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 ring-yellow-200/60 dark:ring-yellow-800/40',
  },
  certificate: {
    Icon: ScrollText,
    label: { en: 'Certificate', vn: 'Chứng chỉ' },
    iconClass: 'text-sky-500 dark:text-sky-400',
    badgeClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 ring-sky-200/60 dark:ring-sky-800/40',
  },
  recognition: {
    Icon: Star,
    label: { en: 'Recognition', vn: 'Ghi nhận' },
    iconClass: 'text-violet-500 dark:text-violet-400',
    badgeClass: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 ring-violet-200/60 dark:ring-violet-800/40',
  },
  medal: {
    Icon: Medal,
    label: { en: 'Medal', vn: 'Huy chương' },
    iconClass: 'text-orange-500 dark:text-orange-400',
    badgeClass: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 ring-orange-200/60 dark:ring-orange-800/40',
  },
};

const DEFAULT_CONFIG = {
  Icon: Award,
  label: { en: 'Achievement', vn: 'Thành tích' },
};

// ── Category definitions (priority order) ────────────────────────────────────
const CATEGORIES = [
  {
    key: 'competitions',
    label: { en: 'Competitions', vn: 'Cuộc thi' },
    Icon: Trophy,
    match: (types) => types.includes('hackathon'),
  },
  {
    key: 'certifications',
    label: { en: 'Certifications', vn: 'Chứng chỉ' },
    Icon: ScrollText,
    match: (types) => types.includes('certificate'),
  },
  {
    key: 'recognition',
    label: { en: 'Recognition', vn: 'Ghi nhận' },
    Icon: Star,
    match: () => true,
  },
];

const INITIAL_VISIBLE_PER_CATEGORY = 3;

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizeTypes(raw) {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function categorize(highlights) {
  const groups = Object.fromEntries(CATEGORIES.map((c) => [c.key, []]));
  for (const item of highlights) {
    const types = normalizeTypes(item.type);
    const cat = CATEGORIES.find((c) => c.match(types));
    if (cat) groups[cat.key].push(item);
  }
  return groups;
}

// ── Item row (no year column — rendered by the group) ─────────────────────────
function HighlightRow({ item, lang }) {
  const types = normalizeTypes(item.type);
  const hasLink = Boolean(item.url);

  return (
    <div className="group rounded-xl px-4 py-3 -mx-4 hover:bg-accent/30 transition-all duration-300">
      <div className="flex flex-wrap items-center gap-2">
        {hasLink ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:text-secondary transition-colors"
          >
            {item.title[lang]}
            <span className="text-secondary text-xs relative top-[1px] opacity-0 group-hover:opacity-100 group-hover:-translate-y-[1px] group-hover:translate-x-[1px] transition-all duration-300">
              ↗
            </span>
          </a>
        ) : (
          <span className="font-medium text-primary">{item.title[lang]}</span>
        )}

        {types.map((t) => {
          const c = TYPE_CONFIG[t] ?? DEFAULT_CONFIG;
          return (
            <span
              key={t}
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[0.7rem] font-medium ring-1 ring-inset ${c.badgeClass}`}
            >
              {c.label[lang]}
            </span>
          );
        })}
      </div>

      {item.issuer?.[lang] && (
        <p className="text-secondary text-sm mt-0.5">{item.issuer[lang]}</p>
      )}
    </div>
  );
}

/**
 * Groups items by year, preserving order of first appearance.
 */
function groupByYear(items) {
  const grouped = {};
  const years = [];
  for (const item of items) {
    const yr = item.year ?? '—';
    if (!grouped[yr]) {
      grouped[yr] = [];
      years.push(yr);
    }
    grouped[yr].push(item);
  }
  return { years, grouped };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Highlights({ highlights }) {
  const { lang } = useLang();
  const t = translations[lang];
  const [expandedCats, setExpandedCats] = useState({});

  if (!highlights || highlights.length === 0) return null;

  const groups = categorize(highlights);
  const activeCategories = CATEGORIES.filter((c) => groups[c.key].length > 0);

  function toggleCategory(key) {
    setExpandedCats((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-8">
      {activeCategories.map((cat) => {
        const items = groups[cat.key];
        const isExpanded = expandedCats[cat.key];
        const hasMore = items.length > INITIAL_VISIBLE_PER_CATEGORY;
        const visible = isExpanded ? items : items.slice(0, INITIAL_VISIBLE_PER_CATEGORY);

        const { years, grouped: yearGroups } = groupByYear(visible);

        return (
          <div key={cat.key}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
                {cat.label[lang]}
              </span>
              <div className="flex-1 h-px bg-accent" />
            </div>

            {/* Year-grouped items */}
            <div className="space-y-5">
              {years.map((year) => {
                // Pick the primary icon from the first item in this year group
                const firstTypes = normalizeTypes(yearGroups[year][0].type);
                const primaryCfg = TYPE_CONFIG[firstTypes[0]] ?? DEFAULT_CONFIG;

                return (
                  <div key={year} className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-start">
                    {/* Year + icon — shown once per year group */}
                    <div className="sm:w-40 shrink-0 flex items-center gap-1.5 pt-1">
                      <primaryCfg.Icon size={13} className={`shrink-0 ${primaryCfg.iconClass}`} />
                      <span className="text-secondary text-sm tabular-nums">{year}</span>
                    </div>

                    {/* Items in this year */}
                    <div className="flex-1 space-y-1 w-full">
                      {yearGroups[year].map((item, idx) => (
                        <HighlightRow key={idx} item={item} lang={lang} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show more / less */}
            {hasMore && (
              <button
                onClick={() => toggleCategory(cat.key)}
                className="mt-3 text-sm font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                {isExpanded
                  ? (t.showLess ?? 'Show less')
                  : (t.showMore ?? `Show all ${items.length}`)}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

