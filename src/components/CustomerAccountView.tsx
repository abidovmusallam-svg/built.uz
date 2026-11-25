import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice, getRegionalHubInfo } from '../utils/translations';
import { OrderStatus } from '../types';
import { BuiltLogo } from './BuiltLogo';
import { PortalSwitcherButton } from './PortalSwitcher';
import { Tilt3DCard, PanelTransition3D } from './Motion3D';
import {
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  Menu,
  X,
  PhoneCall,
  Truck,
  CheckCircle2,
  Package
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    orders,
    favorites,
    products,
    cancelOrder,
    addToCart,
    toggleFavorite,
    currentUser,
    setActiveView,
    selectedRegion,
    cartCount
  } = useMarketplace();

  const hubInfo = getRegionalHubInfo(selectedRegion);
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'addresses' | 'profile'>('orders');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  const getStatusStep = (status: OrderStatus): number => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'preparing': return 3;
      case 'dispatched': return 4;
      case 'delivered': return 5;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const statusSteps = [
    { label: 'Kutilmoqda', desc: 'Qabul qilindi' },
    { label: 'Tasdiqlandi', desc: 'Sotuvchi tasdiqladi' },
    { label: 'Tayyorlanmoqda', desc: 'Omborda yuklanmoqda' },
    { label: 'Yo‘lda', desc: 'Ob\'ektga bormoqda' },
    { label: 'Yetkazildi', desc: 'Qabul qilindi' }
  ];

  const navItems = [
    { id: 'orders', label: 'Buyurtmalarim', icon: ShoppingBag, badge: orders.length },
    { id: 'favorites', label: 'Sevimli tovarlar', icon: Heart, badge: favorites.length },
    { id: 'addresses', label: 'Ob’ekt manzillari', icon: MapPin },
    { id: 'profile', label: 'Profil sozlamalari', icon: User }
  ] as const;

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#122D26] text-white">
      <div className="p-5 border-b border-emerald-900/70 flex items-center justify-between">
        <BuiltLogo size="sm" variant="light" />
        <button
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:bg-emerald-900/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 border-b border-emerald-900/70">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-[#173B32] flex items-center justify-center font-extrabold text-sm shrink-0">
            {currentUser.fullName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{currentUser.fullName}</div>
            <div className="text-[11px] text-emerald-300 truncate">{currentUser.phone}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
          Xaridor Kabineti
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileNavOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F59E0B] text-[#173B32] shadow-md font-bold'
                  : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </span>
              {'badge' in item && item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tabular-nums ${
                  isActive ? 'bg-[#173B32] text-[#F59E0B]' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-emerald-900/70 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
            Tezkor O‘tish
          </div>
          <button
            onClick={() => setActiveView('cart')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white cursor-pointer"
          >
            <span className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4 text-[#F59E0B]" />
              <span>Savatcham</span>
            </span>
            {cartCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-[#F59E0B] text-[#173B32] text-[10px] font-extrabold tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('home')}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Do‘konga qaytish</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-emerald-900/70 text-[11px] text-emerald-200/80">
        <div className="flex items-center gap-1.5 font-bold text-white mb-0.5">
          <PhoneCall className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>20 020 50 68</span>
        </div>
        <div className="truncate text-[10px] text-emerald-300/70">{hubInfo.hubName}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6F1] flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen shadow-xl z-20">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-neutral-950/60" onClick={() => setMobileNavOpen(false)} />
          <div className="relative w-72 max-w-[85vw] h-full z-10 shadow-2xl">
            {SidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Standalone Customer Portal Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-neutral-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200 cursor-pointer"
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                SHAXSIY XARIDOR PORTALI
              </div>
              <h1 className="text-base sm:text-lg font-bold font-heading text-neutral-900 truncate">
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView('home')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Do‘kon vitrinasi</span>
            </button>
            <PortalSwitcherButton variant="dark" />
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* 3D KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Tilt3DCard intensity={6} className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Jami Buyurtmalar
                </span>
                <Package className="w-4 h-4 text-[#173B32]" />
              </div>
              <div className="text-2xl font-extrabold text-[#173B32] mt-1 font-heading tabular-nums">
                {orders.length} ta
              </div>
              <div className="text-xs text-neutral-500 mt-1">Faol va bajarilgan</div>
            </Tilt3DCard>

            <Tilt3DCard intensity={6} className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Umumiy Xaridlar
                </span>
                <Truck className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-2xl font-extrabold text-neutral-900 mt-1 font-heading tabular-nums">
                {formatPrice(totalSpent)}
              </div>
              <div className="text-xs text-emerald-700 font-medium mt-1">Barcha obyektlar bo‘yicha</div>
            </Tilt3DCard>

            <Tilt3DCard intensity={6} className="bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Sevimli Materiallar
                </span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-extrabold text-neutral-900 mt-1 font-heading tabular-nums">
                {favorites.length} ta
              </div>
              <div className="text-xs text-neutral-500 mt-1">{selectedRegion}</div>
            </Tilt3DCard>
          </div>

          <AnimatePresence mode="wait">
            <PanelTransition3D panelKey={activeTab}>
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-5">
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                      <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-neutral-900 mb-1">Buyurtmalar mavjud emas</h3>
                      <p className="text-xs text-neutral-500 mb-4">Katalogdan kerakli materiallarni tanlang</p>
                      <button
                        onClick={() => setActiveView('catalog')}
                        className="px-4 py-2 bg-[#173B32] text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Katalogga o‘tish
                      </button>
                    </div>
                  ) : (
                    orders.map(order => {
                      const currentStep = getStatusStep(order.status);
                      const isCancelled = order.status === 'cancelled';

                      return (
                        <div
                          key={order.id}
                          className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-6"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 text-xs">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <span className="font-extrabold text-neutral-900 font-mono text-sm">
                                  {order.trackingCode}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                                    isCancelled
                                      ? 'bg-rose-50 text-rose-700'
                                      : 'bg-emerald-50 text-emerald-800'
                                  }`}
                                >
                                  {order.status.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-neutral-400 text-[11px] mt-1">
                                Rasmiylashtirilgan: {new Date(order.createdAt).toLocaleString()}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right tabular-nums">
                                <div className="font-extrabold text-[#173B32] text-base">
                                  {formatPrice(order.total)}
                                </div>
                                <div className="text-[11px] text-neutral-500">
                                  {order.deliveryType === 'delivery' ? 'Yetkazib berish bilan' : 'Ombordan olib ketish'}
                                </div>
                              </div>

                              {order.status === 'pending' && (
                                <button
                                  onClick={() => cancelOrder(order.id)}
                                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                                >
                                  Bekor qilish
                                </button>
                              )}
                            </div>
                          </div>

                          {!isCancelled && (
                            <div className="py-2">
                              <div className="text-xs font-bold text-neutral-800 mb-3 uppercase tracking-wider">
                                Kuzatuv holati:
                              </div>
                              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                                {statusSteps.map((step, idx) => {
                                  const stepNumber = idx + 1;
                                  const isDone = currentStep >= stepNumber;
                                  const isCurrent = currentStep === stepNumber;

                                  return (
                                    <div key={idx} className="space-y-1.5">
                                      <div
                                        className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-colors ${
                                          isDone
                                            ? 'bg-[#173B32] text-white shadow-xs'
                                            : 'bg-neutral-100 text-neutral-400'
                                        } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                                      >
                                        {isDone ? '✓' : stepNumber}
                                      </div>
                                      <div className={`font-bold ${isDone ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                        {step.label}
                                      </div>
                                      <div className="text-[10px] text-neutral-400 hidden sm:block">
                                        {step.desc}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="pt-4 border-t border-neutral-100 space-y-3">
                            <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                              Buyurtma tarkibi ({order.items.length} ta tovar):
                            </div>
                            <div className="divide-y divide-neutral-100 text-xs">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <div className="font-semibold text-neutral-900 truncate">{item.title}</div>
                                      <div className="text-neutral-400 text-[11px]">
                                        Sotuvchi: {item.sellerName}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0 tabular-nums">
                                    <div className="font-bold text-neutral-900">
                                      {formatPrice(item.price * item.quantity)}
                                    </div>
                                    <div className="text-[11px] text-neutral-500">
                                      {item.quantity} {item.unit} × {formatPrice(item.price)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-neutral-600">
                            <div>
                              Manzil: <strong>{order.deliveryAddress.region}, {order.deliveryAddress.district}, {order.deliveryAddress.street}</strong>
                            </div>
                            <div>
                              To‘lov: <strong className="uppercase">{order.paymentMethod}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: FAVORITES */}
              {activeTab === 'favorites' && (
                <div>
                  {favoriteProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center text-xs text-neutral-500">
                      Sevimlilar ro‘yxatida hozircha hech narsa yo‘q
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteProducts.map(prod => (
                        <Tilt3DCard key={prod.id} intensity={6} className="bg-white p-4 rounded-2xl border border-neutral-200 flex flex-col justify-between shadow-xs">
                          <div className="flex gap-3">
                            <img src={prod.image} alt={prod.titleUz} referrerPolicy="no-referrer" className="w-16 h-16 rounded-xl object-cover border border-neutral-200 shrink-0" />
                            <div>
                              <h4 className="font-bold text-neutral-900 text-xs line-clamp-2">{prod.titleUz}</h4>
                              <div className="font-extrabold text-[#173B32] text-sm mt-1 tabular-nums">{formatPrice(prod.price)} / {prod.unit}</div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-100">
                            <button
                              onClick={() => addToCart(prod, prod.minOrder || 1)}
                              className="flex-1 py-2 bg-[#173B32] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5 text-[#F59E0B]" />
                              <span>Savatga</span>
                            </button>
                            <button
                              onClick={() => toggleFavorite(prod.id)}
                              className="p-2 border border-neutral-200 text-rose-600 rounded-xl hover:bg-rose-50 cursor-pointer"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </Tilt3DCard>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DYNAMIC REGIONAL ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <Tilt3DCard intensity={6} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-neutral-900 text-sm">Qurilish ob’ekti #1 (Faol hudud)</strong>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">STANDART</span>
                    </div>
                    <p className="text-neutral-700 font-semibold">{hubInfo.region}</p>
                    <p className="text-neutral-600">{hubInfo.hubAddress}</p>
                    <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between">
                      <span>Terminal: {hubInfo.pickupWarehouse}</span>
                      <span className="font-bold text-[#173B32]">20 020 50 68</span>
                    </div>
                  </Tilt3DCard>

                  <Tilt3DCard intensity={6} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-neutral-900 text-sm">Logistika Markazi</strong>
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" />24/7 FAOL
                      </span>
                    </div>
                    <p className="text-neutral-700 font-semibold">{hubInfo.hubName}</p>
                    <p className="text-neutral-600">{hubInfo.deliveryRadiusNote}</p>
                    <div className="pt-2 border-t border-neutral-100 text-[11px] text-emerald-700 font-medium">
                      Hududni asosiy vitrinada o‘zgartirish orqali barcha omborlar avtomatik yangilanadi.
                    </div>
                  </Tilt3DCard>
                </div>
              )}

              {/* TAB 4: PROFILE */}
              {activeTab === 'profile' && (
                <div className="max-w-xl bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 text-xs">
                  <h3 className="font-bold text-neutral-900 text-sm">Shaxsiy ma’lumotlar</h3>
                  <div>
                    <label className="block text-neutral-500 mb-1">F.I.Sh.</label>
                    <input type="text" defaultValue={currentUser.fullName} className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50" disabled />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1">Telefon raqam</label>
                    <input type="text" defaultValue={currentUser.phone} className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50" disabled />
                  </div>
                  <div>
                    <label className="block text-neutral-500 mb-1">Tanlangan viloyat</label>
                    <input type="text" value={selectedRegion} className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-50" disabled />
                  </div>
                </div>
              )}
            </PanelTransition3D>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
