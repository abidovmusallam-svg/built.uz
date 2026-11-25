import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Hero } from './Hero';
import { CategoryGrid } from './CategoryGrid';
import { ProductCard } from './ProductCard';
import { VerifiedSellersSection } from './VerifiedSellersSection';
import { PromotionalBanners } from './PromotionalBanners';
import {
  ShieldCheck,
  Truck,
  FileCheck2,
  Award,
  ArrowRight,
  Star,
  Quote,
  Building
} from 'lucide-react';
import { Tilt3DCard, SpatialReveal } from './Motion3D';

export const HomeView: React.FC = () => {
  const { products, setActiveView, language, t } = useMarketplace();

  // Featured and best-selling products
  const popularProducts = products.filter(p => p.featured || p.rating >= 4.8).slice(0, 8);
  const discountedProducts = products.filter(p => p.discountPercent && p.discountPercent > 0).slice(0, 4);

  const testimonials = [
    {
      name: "Akmal Rahimov",
      role: "Bosh muhandis, 'Toshkent Modern Qurilish'",
      text: "Ob'ektimiz uchun Ohangaron sement va Bekobod armaturasini bevosita diler narxida xarid qildik. Isuzu transporti bilan belgilangan vaqtda yetkazib berildi. Hujjatlar QQS bilan to'liq rasmiylashtirildi.",
      rating: 5
    },
    {
      name: "Davron Usmonov",
      role: "Kottejlar qurilish ustasi (Prorab)",
      text: "Narxlarni solishtirish juda qulay. Ilgari bozorma-bozor aylanib 2 kun vaqt yo'qotardik, endi BUILT orqali 15 daqiqada butun partiyani rasmiylashtiramiz.",
      rating: 5
    },
    {
      name: "Javohir Qosimov",
      role: "Xususiy uy quruvchi",
      text: "Sement va g'ishtni zakaz qildik. Damas Laboda tez olib kelishdi, haydovchining o'ziga naqd pul to'ladik. Xizmat sifati a'lo darajada!",
      rating: 5
    }
  ];

  return (
    <div className="space-y-4">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Categories Grid */}
      <CategoryGrid />

      {/* 3. Popular Construction Materials */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#173B32] font-heading">
              {language === 'uz' ? 'Ommabop Qurilish Materiallari' : 'Популярные Материалы'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Eng ko‘p talab qilinadigan sement, armatura, g‘isht va yog‘och mahsulotlari
            </p>
          </div>
          <button
            onClick={() => setActiveView('catalog')}
            className="text-xs sm:text-sm font-semibold text-[#173B32] hover:text-[#235246] flex items-center gap-1 group cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Promotional Banners */}
      <PromotionalBanners />

      {/* 5. Discounted Products */}
      {discountedProducts.length > 0 && (
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 text-xs font-bold mb-1">
                <span>Maxsus Takliflar</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#173B32] font-heading">
                Chegirmadagi Materiallar
              </h2>
            </div>
            <button
              onClick={() => setActiveView('catalog')}
              className="text-xs sm:text-sm font-semibold text-[#173B32] hover:text-[#235246] flex items-center gap-1 group cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {discountedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Verified Sellers & Factories */}
      <VerifiedSellersSection />

      {/* 7. Marketplace Advantages (Nega BUILT?) */}
      <section className="py-12 bg-[#F1F3ED]/80 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold font-heading text-[#173B32]">
              {t.advantages.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2">
              {t.advantages.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: t.advantages.adv1Title, desc: t.advantages.adv1Desc, bg: 'bg-emerald-50 text-[#173B32]' },
              { icon: Truck, title: t.advantages.adv2Title, desc: t.advantages.adv2Desc, bg: 'bg-amber-50 text-[#F59E0B]' },
              { icon: FileCheck2, title: t.advantages.adv3Title, desc: t.advantages.adv3Desc, bg: 'bg-emerald-50 text-[#173B32]' },
              { icon: Award, title: t.advantages.adv4Title, desc: t.advantages.adv4Desc, bg: 'bg-amber-50 text-[#F59E0B]' }
            ].map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <SpatialReveal key={idx} delay={idx * 0.06}>
                  <Tilt3DCard intensity={7} className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className={`w-12 h-12 rounded-xl ${adv.bg} flex items-center justify-center mb-4`} style={{ transform: 'translateZ(18px)' }}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-neutral-900 font-heading mb-1.5">
                        {adv.title}
                      </h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {adv.desc}
                      </p>
                    </div>
                  </Tilt3DCard>
                </SpatialReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold font-heading text-[#173B32]">
            Quruvchilar va Prorablar Fikri
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            O'zbekistonning turli viloyatlaridagi quruvchilarimiz BUILT haqida nima deydi?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <SpatialReveal key={idx} delay={idx * 0.07}>
              <Tilt3DCard intensity={6} className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <div className="font-bold text-xs text-neutral-900">{item.name}</div>
                  <div className="text-[11px] text-neutral-400">{item.role}</div>
                </div>
              </Tilt3DCard>
            </SpatialReveal>
          ))}
        </div>
      </section>
    </div>
  );
};
