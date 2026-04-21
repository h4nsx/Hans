import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { useTypingEffect } from '../hooks/useTypingEffect';
import LangToggle from './LangToggle';
import ThemeToggle from './ThemeToggle';
import CVDrawer from './CVDrawer';

export default function Header({ personal }) {
  const { lang } = useLang();
  const t = translations[lang];
  const { displayed, isDone } = useTypingEffect(personal.name[lang], 65);
  const [cvOpen, setCvOpen] = useState(false);

  return (
    <>
      <header className="mb-16">
        {/* Row 1: Avatar + Toggles */}
        <div className="flex items-center justify-between mb-5">
          <img
            src={personal.avatarUrl}
            alt={personal.name[lang]}
            className="w-[72px] h-[72px] rounded-full object-cover"
          />
          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Row 2: Name with typing animation */}
        <h1 className="text-2xl font-semibold mb-1 tracking-tight">
          {displayed}
          <span className={`cursor-blink${isDone ? ' done' : ''}`} />
        </h1>

        {/* Row 3: Availability badge */}
        {personal.availability?.available && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm text-secondary">
              {personal.availability.status[lang]}
            </span>
          </div>
        )}

        {/* Row 4: Role + Location */}
        <p className="text-secondary text-base mb-5">
          {personal.role[lang]} · {personal.location}
        </p>

        {/* Row 5: Links + View CV */}
        <div className="flex flex-wrap items-center gap-2">
          {personal.links?.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors px-3 py-1.5 rounded-md text-xs font-medium text-secondary dark:text-neutral-400"
            >
              {link.name} ↗
            </a>
          ))}

          {personal.cvUrl && (
            <button
              id="cv-preview-btn"
              onClick={() => setCvOpen(true)}
              className="inline-flex items-center gap-1.5 bg-primary dark:bg-[#e8e8e6] text-white dark:text-[#111110] hover:opacity-90 transition-opacity px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer"
            >
              <FileText size={12} />
              {t.viewCV ?? 'View CV'}
            </button>
          )}
        </div>
      </header>

      {/* CV Drawer — portal-like, outside header flow */}
      <CVDrawer
        cvUrl={personal.cvUrl}
        isOpen={cvOpen}
        onClose={() => setCvOpen(false)}
      />
    </>
  );
}
