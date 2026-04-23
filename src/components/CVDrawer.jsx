import React, { useEffect, useState } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

/**
 * CVDrawer
 *
 * Props:
 *  cvUrl   — object { en: string, vn: string }  (URLs to the two CV PDFs)
 *  isOpen  — boolean
 *  onClose — () => void
 */
export default function CVDrawer({ cvUrl, isOpen, onClose }) {
  const { lang: siteLang } = useLang();
  const t = translations[siteLang];

  // Active CV language — defaults to the current site language
  const [cvLang, setCvLang] = useState(siteLang);

  // Sync to site language whenever the drawer opens
  useEffect(() => {
    if (isOpen) setCvLang(siteLang);
  }, [isOpen, siteLang]);

  // Determine which languages actually have a URL
  const hasEn = Boolean(cvUrl?.en);
  const hasVn = Boolean(cvUrl?.vn);
  const hasBoth = hasEn && hasVn;
  const hasAny = hasEn || hasVn;

  // Resolve which URL is active — fall back to any available language
  const requestedUrl = cvUrl?.[cvLang] || '';
  const isFallback = !requestedUrl && hasAny;
  const fallbackLang = !requestedUrl ? (hasEn ? 'en' : 'vn') : null;
  const activeUrl = requestedUrl || cvUrl?.en || cvUrl?.vn || '';
  const fileName = activeUrl.split('/').pop()?.split('?')[0] || 'cv.pdf';

  /**
   * Converts any supported share URL into a safe iframe embed URL.
   *
   * Google Drive  → /preview  (avoids X-Frame-Options block)
   * Dropbox       → ?raw=1    (direct binary link, embeddable)
   * Cloudinary    → as-is     (raw upload URLs work directly)
   * Everything else → as-is
   */
  function toEmbedUrl(url) {
    if (!url) return '';

    // Google Drive: convert /view or /edit → /preview
    const gdMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (gdMatch) return `https://drive.google.com/file/d/${gdMatch[1]}/preview`;

    // Dropbox: swap ?dl=0 with ?raw=1
    if (url.includes('dropbox.com')) return url.replace(/[?&]dl=0/, '').replace('dropbox.com', 'dl.dropboxusercontent.com');

    return url;
  }

  const embedUrl = toEmbedUrl(activeUrl);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!hasAny) return null;

  // ── Fallback notice banner ─────────────────────────────────────────────────
  const FallbackNotice = () => isFallback ? (
    <div className="mx-5 mt-3 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
      <span className="text-amber-500 dark:text-amber-400 text-sm leading-none mt-[1px] shrink-0">⚠</span>
      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
        {t.cvFallbackNotice
          ? t.cvFallbackNotice
              .replace('{requested}', cvLang.toUpperCase())
              .replace('{shown}', (fallbackLang ?? '').toUpperCase())
          : `${cvLang.toUpperCase()} CV is not available yet. Showing ${(fallbackLang ?? '').toUpperCase()} version instead.`
        }
      </p>
    </div>
  ) : null;

  // ── Shared lang pill toggle (used in both desktop + mobile) ──────────────
  const LangPills = () => hasBoth ? (
    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-md p-0.5">
      {['en', 'vn'].map((l) => (
        <button
          key={l}
          onClick={() => setCvLang(l)}
          className={[
            'px-2.5 py-1 rounded text-xs font-medium transition-all',
            cvLang === l
              ? 'bg-white dark:bg-neutral-700 text-primary shadow-sm'
              : 'text-secondary hover:text-primary',
          ].join(' ')}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP — right slide panel  (hidden on mobile)
      ══════════════════════════════════════════════════════════════ */}
      <aside
        aria-label="CV Preview"
        className={[
          'fixed top-0 right-0 z-50 h-full w-[480px] max-w-[90vw]',
          'hidden sm:flex flex-col',
          'bg-white dark:bg-[#1a1a18] shadow-2xl',
          'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header bar: title + lang toggle + close */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800 shrink-0 gap-3">
          <span className="text-sm font-medium text-primary shrink-0">
            {t.cvPreview ?? 'CV Preview'}
          </span>

          <LangPills />

          <button
            onClick={onClose}
            aria-label="Close CV preview"
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-secondary hover:text-primary transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Fallback notice */}
        <FallbackNotice />

        {/* PDF iframe — re-mounts when URL changes */}
        <div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-900">
          {isOpen && embedUrl && (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={`CV (${cvLang.toUpperCase()})`}
              className="w-full h-full border-none"
              allow="autoplay"
            />
          )}
        </div>

        {/* Footer: download button */}
        <div className="shrink-0 px-5 py-4 border-t border-neutral-100 dark:border-neutral-800">
          <a
            href={activeUrl}
            download={fileName}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-primary dark:bg-[#e8e8e6] text-white dark:text-[#111110] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={14} />
            {t.downloadCV} ({(isFallback ? fallbackLang : cvLang)?.toUpperCase()})
          </a>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE — bottom sheet  (visible only on small screens)
      ══════════════════════════════════════════════════════════════ */}
      <div
        aria-label="CV options"
        className={[
          'fixed bottom-0 left-0 right-0 z-50',
          'flex sm:hidden flex-col',
          'bg-white dark:bg-[#1a1a18] rounded-t-2xl shadow-2xl',
          'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>

        {/* Title + lang toggle + close */}
        <div className="flex items-center justify-between px-5 py-3 gap-3">
          <span className="text-sm font-medium text-primary shrink-0">
            {t.cvPreview ?? 'CV Preview'}
          </span>
          <LangPills />
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-secondary hover:text-primary transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Fallback notice */}
        <FallbackNotice />

        {/* Note */}
        <p className="px-5 pb-3 text-xs text-secondary leading-relaxed">
          {t.cvMobileNote ?? 'PDF preview is not supported on mobile. Open it in your browser or download directly.'}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 px-5 pb-8">
          <a
            href={activeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-primary hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink size={14} />
            {t.openInBrowser ?? 'Open in Browser'} ({(isFallback ? fallbackLang : cvLang)?.toUpperCase()})
          </a>
          <a
            href={activeUrl}
            download={fileName}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary dark:bg-[#e8e8e6] text-white dark:text-[#111110] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={14} />
            {t.downloadCV} ({(isFallback ? fallbackLang : cvLang)?.toUpperCase()})
          </a>
        </div>
      </div>
    </>
  );
}
