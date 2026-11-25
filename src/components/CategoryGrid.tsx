import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ArrowRight } from 'lucide-react';
import { Tilt3DCard, SpatialReveal } from './Motion3D';

export const CategoryGrid: React.FC = () => {
  const { categories, language, openCategory, setActiveView } = useMarketplace();

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#173B32] font-heading">
            {language === 'uz' ? 'Qurilish Materiallari Toifalari' : 'Категории Строительных Материалов'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {language === 'uz'
              ? 'Poydevordan to tomgacha barcha bosqichlar uchun materiallar'
              : 'Материалы для всех этапов строительства от фундамента до кровли'}
          </p>
        </div>
        <button
          onClick={() => setActiveView('catalog')}
          className="text-xs sm:text-sm font-semibold text-[#173B32] hover:text-[#235246] flex items-center gap-1 group cursor-pointer"
        >
          <span>{language === 'uz' ? 'Barchasi' : 'Все'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {categories.map((category, idx) => {
          const name = language === 'uz' ? category.nameUz : category.nameRu;

          return (
            <SpatialReveal key={category.id} delay={Math.min(idx * 0.04, 0.25)}>
              <Tilt3DCard
                intensity={9}
                onClick={() => openCategory(category.id)}
                className="group bg-white rounded-2xl border border-neutral-200/80 hover:border-[#173B32]/40 hover:shadow-xl transition-shadow duration-300 p-3.5 flex flex-col justify-between cursor-pointer"
              >
                {/* Category Image with Z-pop depth */}
                <div
                  className="aspect-4/3 rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-emerald-950/10 to-neutral-100"
                  style={{ transform: 'translateZ(14px)' }}
                >
                  <img
                    src={category.image}
                    alt={name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Title & Count */}
                <div style={{ transform: 'translateZ(20px)' }}>
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#173B32] transition-colors line-clamp-2">
                    {name}
                  </h3>
                  <div className="mt-1 text-[11px] text-neutral-400 tabular-nums">
                    {category.itemCount} {language === 'uz' ? 'tovar' : 'товаров'}
                  </div>
                </div>
              </Tilt3DCard>
            </SpatialReveal>
          );
        })}
      </div>
    </section>
  );
};
