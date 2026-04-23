import React from 'react';
import { Trophy, Award, ScrollText, Star, Medal } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

// ── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  hackathon: {
    Icon: Trophy,
    label: { en: 'Hackathon', vn: 'Hackathon' },
    iconClass: 'text-amber-500 dark:text-amber-400',
    badgeClass: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 ring-amber-200 dark:ring-amber-800',
  },
  award: {
    Icon: Award,
    label: { en: 'Award', vn: 'Giải thưởng' },
    iconClass: 'text-yellow-500 dark:text-yellow-400',
    badgeClass: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 ring-yellow-200 dark:ring-yellow-800',
  },
  certificate: {
    Icon: ScrollText,
    label: { en: 'Certificate', vn: 'Chứng chỉ' },
    iconClass: 'text-blue-500 dark:text-blue-400',
    badgeClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-blue-200 dark:ring-blue-800',
  },
  recognition: {
    Icon: Star,
    label: { en: 'Recognition', vn: 'Ghi nhận' },
    iconClass: 'text-purple-500 dark:text-purple-400',
    badgeClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 ring-purple-200 dark:ring-purple-800',
  },
  medal: {
    Icon: Medal,
    label: { en: 'Medal', vn: 'Huy chương' },
    iconClass: 'text-orange-500 dark:text-orange-400',
    badgeClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 ring-orange-200 dark:ring-orange-800',
  },
};

const DEFAULT_CONFIG = {
  Icon: Award,
  label: { en: 'Achievement', vn: 'Thành tích' },
  iconClass: 'text-neutral-400 dark:text-neutral-500',
  badgeClass: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 ring-neutral-200 dark:ring-neutral-700',
};

// ── Category definitions (priority order) ────────────────────────────────────
// An item lands in the FIRST category whose `match` returns true.
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
    match: () => true, // catch-all
  },
];

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

// ── Item row ──────────────────────────────────────────────────────────────────
function HighlightRow({ item, lang }) {
  const types = normalizeTypes(item.type);
  const primaryCfg = TYPE_CONFIG[types[0]] ?? DEFAULT_CONFIG;
  const hasLink = Boolean(item.url);

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-start group">
      {/* Year + primary icon */}
      <div className="sm:w-28 shrink-0 flex items-center gap-1.5 pt-0.5">
        <primaryCfg.Icon size={13} className={`shrink-0 ${primaryCfg.iconClass}`} />
        <span className="text-secondary text-sm">{item.year ?? '—'}</span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {hasLink ? (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:text-secondary transition-colors"
            >
              {item.title[lang]}
              <span className="text-secondary text-xs relative top-[1px] group-hover:-translate-y-[1px] group-hover:translate-x-[1px] transition-transform">
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
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Highlights({ highlights }) {
  const { lang } = useLang();

  if (!highlights || highlights.length === 0) return null;

  const groups = categorize(highlights);

  // Only render categories that have at least one item
  const activeCategories = CATEGORIES.filter((c) => groups[c.key].length > 0);

  return (
    <div className="space-y-8">
      {activeCategories.map((cat, catIdx) => (
        <div key={cat.key}>
          {/* Category header — subtle label + rule */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              {cat.label[lang]}
            </span>
            <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
          </div>

          {/* Items in this category */}
          <div className="space-y-5">
            {groups[cat.key].map((item, idx) => (
              <HighlightRow key={idx} item={item} lang={lang} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
