import { useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import resumeData from '../data/resume.json';

export function useSEO() {
  const { lang } = useLang();

  useEffect(() => {
    const personal = resumeData.personal;
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Build SEO content based on language
    const title = `${personal.name[lang]} (h4nsx) - ${personal.role[lang]}`;
    const description = personal.bio[lang].substring(0, 160); // Keep it around 160 chars for SEO

    // Update Title
    document.title = title;

    // Update Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    // Update Twitter Tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', description);
    }

    // JSON-LD Structured Data for Person
    const schemaScript = document.getElementById('seo-schema');
    if (schemaScript) {
      const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": personal.name[lang],
        "alternateName": ["h4nsx", "Hans", "Võ Tuấn Hùng"],
        "jobTitle": personal.role[lang],
        "description": personal.bio[lang],
        "url": "https://h4nsx.vercel.app/",
        "image": personal.avatarUrl,
        "sameAs": personal.links?.map(link => link.url) || []
      };
      schemaScript.textContent = JSON.stringify(schemaData);
    }

  }, [lang]);
}
