import React from 'react';
import { Brain, Shield, Layers, Check } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const ICON_MAP = {
  brain: Brain,
  shield: Shield,
  layers: Layers,
};

const ICON_COLORS = {
  brain: 'text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 ring-violet-200/60 dark:ring-violet-800/40',
  shield: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 ring-amber-200/60 dark:ring-amber-800/40',
  layers: 'text-sky-500 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 ring-sky-200/60 dark:ring-sky-800/40',
};

export default function Services({ services }) {
  const { lang } = useLang();

  if (!services || services.length === 0) return null;

  return (
    <div className="space-y-6">
      {services.map((service) => {
        const Icon = ICON_MAP[service.icon] || Layers;
        const colorClass = ICON_COLORS[service.icon] || ICON_COLORS.layers;

        return (
          <div
            key={service.id}
            className="group rounded-2xl border border-accent hover:border-secondary/20 transition-all duration-300 p-6"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2.5 rounded-xl ring-1 ring-inset ${colorClass}`}>
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-primary tracking-tight">
                {service.title[lang]}
              </h3>
            </div>

            {/* Description */}
            <p className="text-secondary/90 text-[0.95rem] leading-relaxed mb-5">
              {service.description[lang]}
            </p>

            {/* Highlights grid */}
            {service.highlights?.[lang] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.highlights[lang].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-primary/80">
                    <Check size={14} className="text-green-500 dark:text-green-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
