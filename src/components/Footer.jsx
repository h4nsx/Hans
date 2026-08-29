import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import resumeData from '../data/resume.json';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';
import { useInView } from '../hooks/useInView';

export default function Footer() {
  const { lang } = useLang();
  const t = translations[lang];
  const { ref, inView } = useInView();

  const emailLink = resumeData.personal.links?.find((l) =>
    l.url.startsWith('mailto:'),
  );

  return (
    <footer ref={ref} className="mt-10 pb-16">
      <div className="section-divider" />

      {/* CTA Section */}
      <div
        className={`text-center py-10 transition-all duration-700 ease-out ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary mb-3">
          {t.ctaTitle ?? "Let's build something together."}
        </p>
        <p className="text-secondary text-base mb-8 max-w-md mx-auto">
          {t.ctaDescription ??
            "Have a project in mind or looking for a technical co-founder? I'd love to hear from you."}
        </p>

        {emailLink && (
          <a
            href={emailLink.url}
            className="group inline-flex items-center gap-2 bg-primary text-background px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t.ctaButton ?? 'Get in touch'}
            <ArrowUpRight
              size={16}
              className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </a>
        )}
      </div>

      {/* Signature */}
      <div className="flex flex-col items-center gap-2 pt-6">
        <img
          src="https://res.cloudinary.com/do5jy6iqh/image/upload/v1776751283/Hans_Sign_a197wi.png"
          alt={`${resumeData.personal.name[lang]} signature`}
          className="h-20 sm:h-24 w-auto signature-img"
        />
        <p className="font-script text-[1.6rem] leading-none text-primary tracking-wide">
          {resumeData.personal.name[lang]}
        </p>
        <p className="text-xs text-secondary tabular-nums mt-1">
          © 2025
        </p>
      </div>
    </footer>
  );
}
