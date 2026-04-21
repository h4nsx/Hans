import React from 'react';
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

function Resume() {
  const { lang } = useLang();
  const t = translations[lang];

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
            <Experience experience={resumeData.experience} />
          </Section>

          {resumeData.projects?.length > 0 && (
            <>
              <div className="section-divider" />
              <Section title={t.projects}>
                <Projects projects={resumeData.projects} />
              </Section>
            </>
          )}

          {resumeData.highlights?.length > 0 && (
            <>
              <div className="section-divider" />
              <Section title={t.highlights}>
                <Highlights highlights={resumeData.highlights} />
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
      </LanguageProvider>
    </ThemeProvider>
  );
}
