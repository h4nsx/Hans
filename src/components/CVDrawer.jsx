import React, { useEffect, useRef } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../data/translations';

export default function CVDrawer({ cvUrl, isOpen, onClose }) {
  const { lang } = useLang();
  const t = translations[lang];
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!cvUrl) return null;

  const fileName = cvUrl.split('/').pop() || 'cv.pdf';

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={[
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* ══════════════════════════════════
          DESKTOP — right slide panel
          (hidden on mobile via hidden sm:flex)
      ════════════════════════════════════ */}
      <aside
        ref={drawerRef}
        aria-label="CV Preview"
        className={[
          'fixed top-0 right-0 z-50 h-full w-[480px] max-w-[90vw]',
          'hidden sm:flex flex-col',
          'bg-surface dark:bg-[#1a1a18] shadow-2xl',
          'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-accent dark:border-[#2a2a28] shrink-0">
          <span className="text-sm font-medium text-primary">{t.cvPreview ?? 'CV Preview'}</span>
          <button
            onClick={onClose}
            aria-label="Close CV preview"
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-secondary hover:text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* PDF iframe */}
        <div className="flex-1 overflow-hidden">
          {isOpen && (
            <iframe
              src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              title="CV"
              className="w-full h-full border-none"
            />
          )}
        </div>

        {/* Download button */}
        <div className="shrink-0 px-5 py-4 border-t border-accent dark:border-[#2a2a28]">
          <a
            href={cvUrl}
            download={fileName}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-primary dark:bg-[#e8e8e6] text-white dark:text-[#111110] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={14} />
            {t.downloadCV}
          </a>
        </div>
      </aside>

      {/* ══════════════════════════════════
          MOBILE — bottom sheet
          (visible only on small screens via flex sm:hidden)
      ════════════════════════════════════ */}
      <div
        aria-label="CV options"
        className={[
          'fixed bottom-0 left-0 right-0 z-50',
          'flex sm:hidden flex-col',
          'bg-surface dark:bg-[#1a1a18] rounded-t-2xl shadow-2xl',
          'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-accent dark:bg-[#2a2a28]" />
        </div>

        {/* Title + close */}
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-sm font-medium text-primary">{t.cvPreview ?? 'CV Preview'}</span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-secondary hover:text-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Info note */}
        <p className="px-5 pb-3 text-xs text-secondary leading-relaxed">
          {t.cvMobileNote ?? 'PDF preview is not supported on mobile. You can open it in your browser or download it directly.'}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 px-5 pb-8">
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-accent dark:border-[#2a2a28] text-sm font-medium text-primary hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink size={14} />
            {t.openInBrowser ?? 'Open in Browser'}
          </a>
          <a
            href={cvUrl}
            download={fileName}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary dark:bg-[#e8e8e6] text-white dark:text-[#111110] text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download size={14} />
            {t.downloadCV}
          </a>
        </div>
      </div>
    </>
  );
}
