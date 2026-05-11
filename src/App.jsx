import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { LanguageProvider, useLang } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { translations } from './data/translations';
import resumeData from './data/resume.json';

// Components
import Header from './components/Header';
import Section from './components/Section';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Highlights from './components/Highlights';
import Footer from './components/Footer';

// ── Date sort helper ────────────────────────────────────────────────────────
// Converts "Jul 2025" → 202507  |  "2025" → 202500  |  "" / null → 0
const MONTHS = { Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12 };
function parseDateToNum(str) {
  if (!str) return 0;
  const parts = str.trim().split(' ');
  const year = parseInt(parts.length === 2 ? parts[1] : parts[0], 10) || 0;
  const month = parts.length === 2 ? (MONTHS[parts[0]] ?? 0) : 0;
  return year * 100 + month;
}

function byNewest(getDate) {
  return (a, b) => parseDateToNum(getDate(b)) - parseDateToNum(getDate(a));
}

function Resume() {
  const { lang } = useLang();
  const t = translations[lang];

  // Pre-sorted copies — newest first, original JSON never mutated
  const experience = (resumeData.experience ?? [])
    .slice()
    .sort(byNewest((j) => j.startDate ?? j.startYear ?? ''));

  const projects = (resumeData.projects ?? [])
    .slice()
    .sort(byNewest((p) => p.year ?? ''));

  const highlights = (resumeData.highlights ?? [])
    .slice()
    .sort(byNewest((h) => h.year ?? ''));

  return (
    <div className="min-h-screen py-12 px-5 sm:px-8 md:px-12 flex flex-col items-center selection:bg-neutral-200 dark:selection:bg-neutral-700">
      <div className="w-full max-w-[620px]">

        <Header personal={resumeData.personal} />

        <main>
          <Section title={t.about}>
            <p className="text-primary text-[1.03rem]">{resumeData.personal.bio[lang]}</p>
          </Section>

          <div className="section-divider" />

          <Section title={t.experience}>
            <Experience experience={experience} />
          </Section>

          {projects.length > 0 && (
            <>
              <div className="section-divider" />
              <Section title={t.projects}>
                <Projects projects={projects} />
              </Section>
            </>
          )}

          {highlights.length > 0 && (
            <>
              <div className="section-divider" />
              <Section title={t.highlights}>
                <Highlights highlights={highlights} />
              </Section>
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Resume />
        <SpeedInsights />
      </LanguageProvider>
    </ThemeProvider>
  );
}
