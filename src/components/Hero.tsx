import React from 'react';
import { motion } from 'motion/react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ArrowRight, ShieldCheck, Truck, Building2, MapPin, Globe } from 'lucide-react';
import { UZBEKISTAN_REGIONS, ALL_REGIONS_LABEL, getRegionalHubInfo } from '../utils/translations';
import { Hero3DScene } from './Hero3DScene';

export const Hero: React.FC = () => {
  const { t, language, setActiveView, setSearchTerm, selectedRegion, setSelectedRegion } = useMarketplace();
  const hubInfo = getRegionalHubInfo(selectedRegion);

  const quickSearchTags = [
    { label: 'Sement M400', query: 'Sement' },
    { label: 'Bekobod Armatura', query: 'Armatura' },
    { label: "Pishiq G'isht", query: "G'isht" },
    { label: 'Rossiya Taxtasi', query: 'Taxta' },
    { label: 'Gazoblok D600', query: 'Gazoblok' },
    { label: 'Knauf Rotband', query: 'Rotband' }
  ];

  return (
    <section className="relative bg-[#173B32] text-white overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Subtle architectural blueprint grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Heading and CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-5 sm:space-y-6"
          >
            {/* Tagline kicker dynamically reflects region (clean static indicator) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/75 border border-emerald-800/80 text-emerald-200 text-xs font-medium max-w-full overflow-hidden">
              <MapPin className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              <span className="font-bold text-amber-300 shrink-0">
                {selectedRegion === ALL_REGIONS_LABEL ? "O'zbekiston bo'ylab 14 ta viloyat" : selectedRegion}
              </span>
              <span className="text-emerald-500 hidden sm:inline">·</span>
              <span className="text-neutral-300 truncate hidden sm:inline">{hubInfo.localHeadline}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading text-white leading-tight">
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActiveView('catalog')}
                className="px-6 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#173B32] font-bold text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer group active:scale-98"
              >
                <span>{t.heroCtaCatalog}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('wholesale')}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all border border-white/20 cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>{language === 'uz' ? 'Ulgurji / Tender (B2B)' : 'Оптовый Заказ'}</span>
              </button>

              <button
                onClick={() => setActiveView('calculators')}
                className="px-4 py-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 font-medium text-sm transition-all border border-emerald-700/60 cursor-pointer flex items-center gap-1.5 active:scale-98"
              >
                <span className="text-amber-400 font-bold">📐</span>
                <span>{language === 'uz' ? 'Kalkulyator' : 'Калькулятор'}</span>
              </button>
            </div>

            {/* Quick search tags */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-neutral-400 font-medium">Ko‘p qidirilayotgan:</span>
              {quickSearchTags.map(tag => (
                <button
                  key={tag.label}
                  onClick={() => {
                    setSearchTerm(tag.query);
                    setActiveView('catalog');
                  }}
                  className="px-2.5 py-1 rounded-md bg-emerald-900/60 hover:bg-emerald-900 text-neutral-200 hover:text-white transition-colors cursor-pointer border border-emerald-800/50"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* All 14 Regions Quick Selector */}
            <div className="pt-1">
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Viloyatlar bo‘yicha tezkor o‘tish (14 ta viloyat):</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => {
                    setSelectedRegion(ALL_REGIONS_LABEL);
                    setActiveView('catalog');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    selectedRegion === ALL_REGIONS_LABEL
                      ? 'bg-[#F59E0B] text-[#173B32] shadow-xs'
                      : 'bg-emerald-950/80 hover:bg-emerald-900 text-neutral-200 border border-emerald-800/60'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  <span>Barcha viloyatlar</span>
                </button>
                {UZBEKISTAN_REGIONS.map(reg => {
                  const shortName = reg.replace(' viloyati', '').replace(' shahri', '');
                  const isActive = selectedRegion === reg;
                  return (
                    <button
                      key={reg}
                      onClick={() => {
                        setSelectedRegion(reg);
                        setActiveView('catalog');
                      }}
                      className={`px-2 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#F59E0B] text-[#173B32] font-bold shadow-xs'
                          : 'bg-emerald-950/60 hover:bg-emerald-900 text-neutral-300 border border-emerald-800/50'
                      }`}
                      title={reg}
                    >
                      {shortName}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive WebGL 3D Architectural Pavilion + Hub Strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-3"
          >
            <Hero3DScene regionLabel={selectedRegion} />

            {/* Clean Regional Logistics & Verified Dealers Summary Bar below 3D viewport (zero occlusion) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#0f2721]/90 border border-emerald-800/70 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {selectedRegion === ALL_REGIONS_LABEL
                      ? (language === 'uz' ? '14 viloyatga tezkor logistika' : 'Доставка по 14 регионам')
                      : hubInfo.hubName}
                  </div>
                  <div className="text-[11px] text-emerald-200/80 truncate">
                    {hubInfo.deliveryRadiusNote}
                  </div>
                </div>
              </div>

              <div className="bg-[#0f2721]/90 border border-emerald-800/70 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">100% Rasmiy Zavod & Dilerlar</div>
                  <div className="text-[11px] text-emerald-200/80 truncate">GOST sertifikat · 20 020 50 68</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="mt-10 pt-8 border-t border-emerald-900 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left tabular-nums">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] font-heading">
              {t.heroStats.products}
            </div>
            <div className="text-xs text-neutral-300 font-medium">
              {t.heroStats.productsLabel}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {t.heroStats.sellers}
            </div>
            <div className="text-xs text-neutral-300 font-medium">
              {t.heroStats.sellersLabel}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {t.heroStats.regions}
            </div>
            <div className="text-xs text-neutral-300 font-medium">
              {t.heroStats.regionsLabel}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F59E0B] font-heading">
              {t.heroStats.delivery}
            </div>
            <div className="text-xs text-neutral-300 font-medium">
              {t.heroStats.deliveryLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
