import React, { useState } from 'react';
import { Download, ExternalLink, Sparkles, X, Check } from 'lucide-react';

interface IIMGLogoProps {
  variant?: 'stacked' | 'horizontal' | 'icon-only' | 'hero';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  showTagline?: boolean;
  interactive?: boolean;
  className?: string;
}

export const IIMGLogo: React.FC<IIMGLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true,
  showTagline = false,
  interactive = false,
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Size dimensions for emblem image
  const sizeMap = {
    xs: { img: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    sm: { img: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
    md: { img: 'w-11 h-11', text: 'text-lg', sub: 'text-[11px]' },
    lg: { img: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs' },
    xl: { img: 'w-24 h-24', text: 'text-3xl', sub: 'text-sm' },
    hero: { img: 'w-40 h-40 sm:w-48 sm:h-48', text: 'text-4xl sm:text-5xl', sub: 'text-base sm:text-lg' },
  };

  const currentSize = sizeMap[size];

  const handleCopyAssetUrl = () => {
    const url = window.location.origin + '/iimg-logo.jpg';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/iimg-logo.jpg';
    link.download = 'IIMG-Official-Logo.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const emblemImage = (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform duration-300 ${currentSize.img}`}
    >
      <img
        src="/iimg-logo.jpg"
        alt="IIMG - Indian Institute of Management Guwahati Emblem"
        className="w-full h-full object-contain rounded-xl bg-white p-0.5"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback if image fails
          const target = e.currentTarget;
          target.onerror = null;
          target.src = '/assets/images/iimg_logo_1788635303648.jpg';
        }}
      />
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <div
        className={`inline-flex items-center justify-center ${interactive ? 'cursor-pointer' : ''} ${className}`}
        onClick={interactive ? () => setShowModal(true) : undefined}
        title="IIMG Official Emblem - Click to inspect"
      >
        {emblemImage}
      </div>
    );
  }

  // STACKED VARIANT: Logo on top, IIMG prominently below it (Exact user request)
  if (variant === 'stacked') {
    return (
      <>
        <div
          className={`flex flex-col items-center text-center ${interactive ? 'cursor-pointer group' : ''} ${className}`}
          onClick={interactive ? () => setShowModal(true) : undefined}
        >
          {/* Emblem */}
          <div className="relative p-1.5 rounded-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
            <div className={`relative ${currentSize.img}`}>
              <img
                src="/iimg-logo.jpg"
                alt="IIMG Logo"
                className="w-full h-full object-contain rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* IIMG text typography below emblem */}
          <div className="mt-2.5 flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span
                className={`font-serif font-black tracking-wider text-emerald-900 dark:text-emerald-300 ${currentSize.text}`}
                style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
              >
                IIMG
              </span>
            </div>

            {showSubtitle && (
              <span className={`font-medium tracking-wide text-slate-700 dark:text-slate-300 uppercase ${currentSize.sub}`}>
                Indian Institute of Management Guwahati
              </span>
            )}

            {showTagline && (
              <span className="text-[10px] tracking-widest text-amber-700 dark:text-amber-400 font-semibold uppercase mt-0.5">
                Where Knowledge Flows, Leadership Rises
              </span>
            )}
          </div>
        </div>

        {/* Brand inspection modal */}
        {showModal && renderBrandModal()}
      </>
    );
  }

  // HERO VARIANT: Large centerpiece for portal welcoming or official presentations
  if (variant === 'hero') {
    return (
      <>
        <div
          className={`flex flex-col items-center text-center p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl ${interactive ? 'cursor-pointer group' : ''} ${className}`}
          onClick={interactive ? () => setShowModal(true) : undefined}
        >
          <div className="relative p-3 rounded-3xl bg-gradient-to-br from-amber-100/40 via-white to-emerald-100/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-emerald-950/20 border border-amber-200/60 dark:border-amber-900/40 shadow-inner mb-4">
            <div className={`relative ${currentSize.img}`}>
              <img
                src="/iimg-logo.jpg"
                alt="IIMG Official Logo"
                className="w-full h-full object-contain drop-shadow-md rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* BELOW THE LOGO WRITE IIMG */}
          <h1
            className="text-4xl sm:text-5xl font-serif font-black tracking-widest text-emerald-950 dark:text-emerald-200"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
          >
            IIMG
          </h1>

          <div className="h-0.5 w-16 bg-gradient-to-r from-amber-400 via-emerald-600 to-amber-400 my-2 rounded-full" />

          <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Indian Institute of Management Guwahati
          </p>
          <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-400 tracking-widest uppercase mt-1">
            Where Knowledge Flows, Leadership Rises
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Official Brand Identity
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Logo
            </button>
          </div>
        </div>

        {showModal && renderBrandModal()}
      </>
    );
  }

  // HORIZONTAL VARIANT: (Used in Navbar and Header)
  return (
    <>
      <div
        className={`flex items-center gap-2.5 ${interactive ? 'cursor-pointer group' : ''} ${className}`}
        onClick={interactive ? () => setShowModal(true) : undefined}
      >
        {emblemImage}

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif font-black tracking-wider text-emerald-950 dark:text-emerald-200 ${currentSize.text} leading-none`}
              style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
            >
              IIMG
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              Guwahati
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`font-medium tracking-tight text-slate-600 dark:text-slate-400 ${currentSize.sub} leading-tight truncate max-w-[200px] sm:max-w-xs`}
            >
              Indian Institute of Management
            </span>
          )}

          {showTagline && (
            <span className="text-[9px] text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase">
              Where Knowledge Flows, Leadership Rises
            </span>
          )}
        </div>
      </div>

      {showModal && renderBrandModal()}
    </>
  );

  function renderBrandModal() {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={() => setShowModal(false)}
      >
        <div
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Showcase */}
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-3xl bg-gradient-to-b from-amber-50/50 via-white to-emerald-50/40 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-md mb-4 max-w-[220px]">
              <img
                src="/iimg-logo.jpg"
                alt="IIMG Logo Emblem"
                className="w-48 h-48 object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Below this write IIMG */}
            <h2
              className="text-4xl font-serif font-black tracking-widest text-emerald-950 dark:text-emerald-200"
              style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
            >
              IIMG
            </h2>
            <div className="h-0.5 w-14 bg-amber-500 my-1.5 rounded-full" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Indian Institute of Management Guwahati
            </p>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 tracking-wider uppercase mt-0.5">
              Where Knowledge Flows, Leadership Rises
            </p>

            {/* Emblem Symbolism Breakdown */}
            <div className="mt-5 text-left w-full space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                Logo Symbolism &amp; Architecture
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                <span><strong>The Open Book:</strong> Foundation of rigorous academic knowledge, research excellence, and management scholarship.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                <span><strong>The Brahmaputra River:</strong> Powerful flowing river representing dynamic progress, perseverance, and fluid intellect.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                <span><strong>The Golden Flame:</strong> Leadership torch of wisdom, ethical enterprise, and illuminated vision.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 mt-1 shrink-0" />
                <span><strong>Assamese Gamusa &amp; Jaapi Arch:</strong> Traditional geometric folk motifs celebrating Assam&apos;s cultural heritage and hospitality.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download High-Res Logo
              </button>
              <button
                onClick={handleCopyAssetUrl}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <ExternalLink className="w-4 h-4" />}
                {copied ? 'Logo Link Copied!' : 'Copy Asset Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
