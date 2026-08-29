import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useLang } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { translations } from './data/translations';
import resumeData from './data/resume.json';
import { useSEO } from './hooks/useSEO';

// Components
import Header from './components/Header';
import Section from './components/Section';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Highlights from './components/Highlights';
import Services from './components/Services';
import Footer from './components/Footer';

// ── Date sort helper ────────────────────────────────────────────────────────
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

// ── Tab switcher ────────────────────────────────────────────────────────────
function TabSwitcher({ activeTab, onTabChange }) {
  const { lang } = useLang();
  const t = translations[lang];

  const tabs = [
    { key: 'resume', label: t.tabResume },
    { key: 'services', label: t.tabServices },
  ];

  return (
    <div className="flex items-center bg-accent/50 rounded-xl p-1 mb-10">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer ${
            activeTab === tab.key
              ? 'bg-background text-primary shadow-sm'
              : 'text-secondary hover:text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Intro loader ────────────────────────────────────────────────────────────
function IntroLoader({ onComplete }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('hold'), 600);
    const exitTimer = setTimeout(() => setPhase('exit'), 1400);
    const doneTimer = setTimeout(() => onComplete(), 2100);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === 'exit'
          ? 'opacity-0 -translate-y-6'
          : 'opacity-100 translate-y-0'
      }`}
    >
      <div
        className={`text-center transition-all duration-600 ease-out ${
          phase === 'enter'
            ? 'opacity-0 translate-y-4'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary">
          {resumeData.personal.name.en}
        </p>
        <p className="text-sm text-secondary mt-2 tracking-wide">
          {resumeData.personal.role.en}
        </p>
      </div>
    </div>
  );
}

// ── Resume tab content ──────────────────────────────────────────────────────
function ResumeContent({ lang, t }) {
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
    <>
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
    </>
  );
}

// ── Services tab content ────────────────────────────────────────────────────
function ServicesContent({ lang, t }) {
  const services = resumeData.services ?? [];

  return (
    <>
      <Section title={t.services}>
        <p className="text-secondary/90 text-[0.95rem] leading-relaxed mb-8">
          {t.servicesCta}
        </p>
        <Services services={services} />
      </Section>

      {/* Show relevant projects as proof */}
      {(resumeData.projects ?? []).length > 0 && (
        <>
          <div className="section-divider" />
          <Section title={t.projects}>
            <Projects
              projects={(resumeData.projects ?? [])
                .slice()
                .sort(byNewest((p) => p.year ?? ''))}
            />
          </Section>
        </>
      )}
    </>
  );
}

// ── Resume page ─────────────────────────────────────────────────────────────
function Resume() {
  const { lang } = useLang();
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState('resume');

  return (
    <div className="min-h-screen py-12 px-5 sm:px-8 md:px-12 flex flex-col items-center selection:bg-neutral-200 dark:selection:bg-neutral-700">
      <div className="w-full max-w-[620px]">

        <Header personal={resumeData.personal} />

        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        <main>
          <div
            key={activeTab}
            className="animate-fade-in"
          >
            {activeTab === 'resume' ? (
              <ResumeContent lang={lang} t={t} />
            ) : (
              <ServicesContent lang={lang} t={t} />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

// ── App root ────────────────────────────────────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent loaded={loaded} onComplete={handleComplete} />
      </LanguageProvider>
    </ThemeProvider>
  );
}

function AppContent({ loaded, onComplete }) {
  // Activate SEO optimizations
  useSEO();

  return (
    <>
      {!loaded && <IntroLoader onComplete={onComplete} />}
      <div
        className={`transition-opacity duration-700 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Resume />
      </div>
    </>
  );
}

