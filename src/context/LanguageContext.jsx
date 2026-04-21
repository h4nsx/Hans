import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

function getInitialLang() {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  if (urlLang === 'vn') return 'vn';
  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'vn' : 'en'));

  // Sync lang to URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('lang', lang);
    window.history.replaceState({}, '', `?${params.toString()}`);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
