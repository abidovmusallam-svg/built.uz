import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMarketplace } from '../context/MarketplaceContext';
import { BuiltLogo } from './BuiltLogo';
import { Tilt3DCard } from './Motion3D';
import {
  ShoppingBag,
  User,
  Store,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  X,
  LayoutGrid
} from 'lucide-react';

interface PortalSwitcherButtonProps {
  variant?: 'dark' | 'light';
  compact?: boolean;
}

export const PortalSwitcherModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { activeView, setActiveView, switchRoleQuick } = useMarketplace();

  const portals = [
    {
      id: 'storefront',
      title: 'Bozor & Do‘kon (Storefront)',
      subtitle: 'Xaridorlar vitrinasi, katalog, kalkulyator, B2B tender va savatcha',
      badge: 'ASOSIY VITRINA',
      icon: ShoppingBag,
      accent: 'from-emerald-600 to-[#173B32]',
      isActive: [
        'home',
        'catalog',
        'product-detail',
        'cart',
        'checkout',
        'calculators',
        'wholesale',
        'about',
        'contact',
        'faq'
      ].includes(activeView),
      onSelect: () => {
        switchRoleQuick('customer');
        setActiveView('home');
        onClose();
      }
    },
    {
      id: 'account',
      title: 'Xaridor Kabineti',
      subtitle: 'Buyurtmalar kuzatuvi, sevimlilar, saqlangan ob’ekt manzillari',
      badge: 'MIJOZ PORTALI',
      icon: User,
      accent: 'from-teal-600 to-emerald-900',
      isActive: activeView === 'account',
      onSelect: () => {
        switchRoleQuick('customer');
        setActiveView('account');
        onClose();
      }
    },
    {
      id: 'seller',
      title: 'Sotuvchi Paneli (Diler)',
      subtitle: 'Mustaqil diler kabineti: tovarlar CRUD, ombor qoldig‘i, buyurtmalar va moliya',
      badge: 'SELLER WORKSPACE',
      icon: Store,
      accent: 'from-amber-500 to-amber-700',
      isActive: activeView === 'seller-dashboard',
      onSelect: () => {
        switchRoleQuick('seller');
        setActiveView('seller-dashboard');
        onClose();
      }
    },
    {
      id: 'admin',
      title: 'Super Admin Paneli',
      subtitle: 'Markaziy boshqaruv: sotuvchilar taklifi, komissiyalar, payout va audit jurnali',
      badge: 'ENTERPRISE CORE',
      icon: ShieldCheck,
      accent: 'from-slate-700 to-slate-900',
      isActive: activeView === 'admin-dashboard',
      onSelect: () => {
        switchRoleQuick('admin');
        setActiveView('admin-dashboard');
        onClose();
      }
    },
    {
      id: 'mobile',
      title: 'Mobil Ilova 3D Studiya',
      subtitle: 'iOS va Android Expo ilovasining interaktiv 3D smartfon simulyatori',
      badge: 'MOBILE COMPANION',
      icon: Smartphone,
      accent: 'from-[#235246] to-[#0f2721]',
      isActive: activeView === 'mobile-companion',
      onSelect: () => {
        setActiveView('mobile-companion');
        onClose();
      }
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-neutral-950/75 flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20, rotateX: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1400 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#F8F9F6] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 my-auto"
          >
            <div className="flex items-center justify-between pb-5 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <BuiltLogo size="sm" variant="dark" showSubtitle={false} />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold font-heading text-[#173B32]">
                    Alohida Panellar Tizimi
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Har bir panel mustaqil ishchi muhit sifatida alohida ochiladi
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                aria-label="Yopish"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
              {portals.map(portal => {
                const Icon = portal.icon;
                return (
                  <Tilt3DCard key={portal.id} intensity={7}>
                    <button
                      onClick={portal.onSelect}
                      className={`w-full h-full text-left p-5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer bg-white shadow-xs ${
                        portal.isActive
                          ? 'border-[#173B32] ring-2 ring-[#173B32]/20'
                          : 'border-neutral-200 hover:border-[#173B32]/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${portal.accent} text-white flex items-center justify-center shadow-md`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            portal.isActive
                              ? 'bg-[#F59E0B] text-[#173B32]'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {portal.isActive ? 'JORIY PANEL' : portal.badge}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-neutral-900 font-heading">
                          {portal.title}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                          {portal.subtitle}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#173B32]">
                        <span>{portal.isActive ? 'Faol ishlamoqda' : 'Panelni ochish'}</span>
                        <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                      </div>
                    </button>
                  </Tilt3DCard>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PortalSwitcherButton: React.FC<PortalSwitcherButtonProps> = ({
  variant = 'dark',
  compact = false
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
          compact ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
        } ${
          variant === 'light'
            ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            : 'bg-[#173B32] hover:bg-[#235246] text-white shadow-xs'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span>Panellar</span>
      </button>

      <PortalSwitcherModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};
