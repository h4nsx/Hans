import React from 'react';
import { useLang } from '../context/LanguageContext';

export default function LangToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-0 rounded-full border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs font-medium"
      aria-label="Toggle language"
    >
      <span
        className={`px-3 py-1.5 transition-colors ${
          lang === 'en'
            ? 'bg-primary dark:bg-[#e8e8e6] text-white dark:text-[#111110]'
            : 'text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-neutral-200'
        }`}
      >
        EN
      </span>
      <span
        className={`px-3 py-1.5 transition-colors ${
          lang === 'vn'
            ? 'bg-primary dark:bg-[#e8e8e6] text-white dark:text-[#111110]'
            : 'text-secondary dark:text-neutral-400 hover:text-primary dark:hover:text-neutral-200'
        }`}
      >
        VN
      </span>
    </button>
  );
}
