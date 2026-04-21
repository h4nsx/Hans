import React from 'react';
import resumeData from '../data/resume.json';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="mt-10 pb-12">
      <div className="section-divider" />
      <div className="flex flex-col items-center gap-2 pt-2">
        {/* Signature logo */}
        <img
          src="https://res.cloudinary.com/do5jy6iqh/image/upload/v1776751283/Hans_Sign_a197wi.png"
          alt={`${resumeData.personal.name[lang]} signature`}
          className="h-20 sm:h-24 w-auto signature-img"
        />

        {/* Name in script font */}
        <p className="font-script text-[1.6rem] leading-none text-primary tracking-wide">
          {resumeData.personal.name[lang]}
        </p>

        {/* Year */}
        <p className="text-xs text-secondary tabular-nums mt-1">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
