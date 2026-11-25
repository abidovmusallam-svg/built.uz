import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SellerTab, Product, OrderStatus, UnitType } from '../types';
import { formatPrice, UZBEKISTAN_REGIONS } from '../utils/translations';
import { BuiltLogo } from './BuiltLogo';
import { PortalSwitcherButton } from './PortalSwitcher';
import { Tilt3DCard, PanelTransition3D } from './Motion3D';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  BarChart3,
  Store,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  Menu,
  X,
  PhoneCall
} from 'lucide-react';

export const SellerDashboardView: React.FC = () => {
  const {
    currentSeller,
    currentUser,
    isSellerActive,
    isSeller,
    sellerTab,
    setSellerTab,
    sellerProducts,
    sellerOrders,
    addSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    updateSellerOrderStatus,
    setActiveView,
    addToast
  } = useMarketplace();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [prodForm, setProdForm] = useState({
    titleUz: '',
    titleRu: '',
    categoryId: 'cement-dry-mix',
    price: 50000,
    oldPrice: 55000,
    unit: 'qop' as UnitType,
    minOrder: 1,
    stock: 100,
    brand: '',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    descriptionUz: '',
    descriptionRu: '',
    isWholesale: true,
    wholesaleMinQty: 20,
    wholesalePrice: 47000,
    inStock: true
  });

  // Strict RBAC Guard
  if (!isSeller || !currentSeller) {
    return (
      <div className="min-h-screen bg-[#0f2721] flex items-center justify-center p-6">
        <Tilt3DCard intensity={5} className="bg-white rounded-3xl border border-neutral-200 p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 font-heading mb-2">
            Ruxsat berilmagan (Kirish taqiqlangan)
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed mb-6">
            Sotuv portaliga faqat administrator tomonidan tasdiqlangan va taklif qilingan sotuvchilar kirishi mumkin.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveView('seller-login')}
              className="w-full py-2.5 rounded-xl bg-[#173B32] text-white font-semibold text-xs cursor-pointer"
            >
              Sotuvchi sifatida kirish
            </button>
            <button
              onClick={() => setActiveView('home')}
              className="w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-700 text-xs hover:bg-neutral-50 cursor-pointer"
            >
              Do‘konga qaytish
            </button>
          </div>
        </Tilt3DCard>
      </div>
    );
  }

  // Suspended Guard
  if (!isSellerActive) {
    return (
      <div className="min-h-screen bg-[#0f2721] flex items-center justify-center p-6">
        <Tilt3DCard intensity={5} className="bg-white rounded-3xl border border-rose-200 p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 font-heading mb-2">
            Hisobingiz vaqtincha to‘xtatilgan
          </h2>
          <p className="text-xs text-neutral-600 leading-relaxed mb-6">
            Hurmatli <strong>{currentSeller.storeName}</strong> ma’muriyati, sotuvchi profilingiz administrator tomonidan bloklangan.
          </p>
          <button
            onClick={() => setActiveView('home')}
            className="w-full py-2.5 rounded-xl bg-[#173B32] text-white font-semibold text-xs cursor-pointer"
          >
            Do‘konga qaytish
          </button>
        </Tilt3DCard>
      </div>
    );
  }

  const totalSalesRevenue = sellerOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, ord) => {
      const sellerItemTotal = ord.items
        .filter(item => item.sellerId === currentSeller.id)
        .reduce((s, i) => s + i.price * i.quantity, 0);
      return sum + sellerItemTotal;
    }, 0);

  const pendingOrdersCount = sellerOrders.filter(o => o.status === 'pending').length;
  const lowStockCount = sellerProducts.filter(p => p.stock < 50).length;
  const commissionDeducted = Math.round(totalSalesRevenue * 0.035);
  const netProceeds = totalSalesRevenue - commissionDeducted;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.titleUz || !prodForm.price) return;

    if (editingProduct) {
      updateSellerProduct(editingProduct.id, {
        titleUz: prodForm.titleUz,
        titleRu: prodForm.titleRu || prodForm.titleUz,
        price: prodForm.price,
        oldPrice: prodForm.oldPrice,
        unit: prodForm.unit,
        minOrder: prodForm.minOrder,
        stock: prodForm.stock,
        brand: prodForm.brand || 'Standart',
        image: prodForm.image,
        descriptionUz: prodForm.descriptionUz,
        descriptionRu: prodForm.descriptionRu || prodForm.descriptionUz,
        inStock: prodForm.inStock
      });
      setEditingProduct(null);
    } else {
      addSellerProduct({
        titleUz: prodForm.titleUz,
        titleRu: prodForm.titleRu || prodForm.titleUz,
        categoryId: prodForm.categoryId,
        price: prodForm.price,
        oldPrice: prodForm.oldPrice,
        unit: prodForm.unit,
        minOrder: prodForm.minOrder,
        stock: prodForm.stock,
        brand: prodForm.brand || 'Standart',
        image: prodForm.image,
        images: [prodForm.image],
        specifications: [
          { labelUz: 'Ishlab chiqaruvchi', labelRu: 'Производитель', value: "O'zbekiston" },
          { labelUz: 'Sertifikat', labelRu: 'Сертификат', value: 'GOST standart' }
        ],
        isWholesale: prodForm.isWholesale,
        wholesaleTiers: prodForm.isWholesale
          ? [{ minQty: prodForm.wholesaleMinQty, discountPrice: prodForm.wholesalePrice }]
          : [],
        inStock: prodForm.inStock,
        descriptionUz: prodForm.descriptionUz,
        descriptionRu: prodForm.descriptionRu || prodForm.descriptionUz,
        weightKg: 10
      });
    }

    setIsAddModalOpen(false);
  };

  const navGroups: {
    title: string;
    items: {
      id: SellerTab;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: number | string;
    }[];
  }[] = [
    {
      title: 'Boshqaruv',
      items: [
        { id: 'dashboard', label: 'Sotuv paneli', icon: LayoutDashboard },
        { id: 'orders', label: 'Buyurtmalar', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined }
      ]
    },
    {
      title: 'Katalog & Ombor',
      items: [
        { id: 'products', label: 'Mahsulotlarim', icon: Package, badge: sellerProducts.length },
        { id: 'inventory', label: 'Ombor & Qoldiq', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} kam` : undefined }
      ]
    },
    {
      title: 'Moliya & Do‘kon',
      items: [
        { id: 'reports', label: 'Savdo hisobotlari', icon: BarChart3 },
        { id: 'store_settings', label: 'Do‘kon sozlamalari', icon: Store }
      ]
    }
  ];

  const activeNavLabel =
    navGroups.flatMap(g => g.items).find(i => i.id === sellerTab)?.label || 'Sotuv paneli';

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#112A24] text-white">
      <div className="p-5 border-b border-emerald-900/70 flex items-center justify-between">
        <BuiltLogo size="sm" variant="light" />
        <button
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:bg-emerald-900/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Store Identity Card */}
      <div className="p-4 border-b border-emerald-900/70">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60">
          <img
            src={currentSeller.logo}
            alt={currentSeller.storeName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-xl object-cover border border-emerald-700 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{currentSeller.storeName}</div>
            <div className="text-[10px] text-emerald-300 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">FAOL DILER · INN {currentSeller.inn}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {navGroups.map(group => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
              {group.title}
            </div>
            {group.items.map(tab => {
              const Icon = tab.icon;
              const isActive = sellerTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSellerTab(tab.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F59E0B] text-[#173B32] font-bold shadow-md'
                      : 'text-emerald-100/80 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </span>
                  {tab.badge !== undefined && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tabular-nums ${
                      isActive ? 'bg-[#173B32] text-[#F59E0B]' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Footer */}
      <div className="p-4 border-t border-emerald-900/70 space-y-2">
        <button
          onClick={() => setActiveView('home')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-xs font-semibold text-emerald-100 border border-emerald-800/60 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Xaridor vitrinasiga o‘tish</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-300/80">
          <PhoneCall className="w-3 h-3 text-[#F59E0B]" />
          <span>Diler qo‘llab-quvvatlash: 20 020 50 68</span>
        </div>
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

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Workspace Bar */}
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
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                SOTUVCHI WORKSPACE PORTALI · {currentUser.fullName}
              </div>
              <h1 className="text-base sm:text-lg font-bold font-heading text-neutral-900 truncate">
                {activeNavLabel}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#173B32] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yangi tovar</span>
            </button>
            <PortalSwitcherButton variant="dark" compact />
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <PanelTransition3D panelKey={sellerTab}>
              {/* TAB 1: DASHBOARD */}
              {sellerTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        Jami Savdo Hajmi
                      </span>
                      <div className="text-2xl font-extrabold text-[#173B32] mt-1 font-heading tabular-nums">
                        {formatPrice(totalSalesRevenue)}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">Komissiyadan oldin</div>
                    </Tilt3DCard>

                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        Kutilayotgan Buyurtmalar
                      </span>
                      <div className="text-2xl font-extrabold text-[#F59E0B] mt-1 font-heading tabular-nums">
                        {pendingOrdersCount} ta
                      </div>
                      <div className="text-xs text-amber-700 font-medium mt-1">Qabul qilishni kutmoqda</div>
                    </Tilt3DCard>

                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        Faol Mahsulotlarim
                      </span>
                      <div className="text-2xl font-extrabold text-neutral-900 mt-1 font-heading tabular-nums">
                        {sellerProducts.length} ta
                      </div>
                      <div className="text-xs text-emerald-700 font-medium mt-1">Katalogda ko‘rinmoqda</div>
                    </Tilt3DCard>

                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        Sof Daromad (Net)
                      </span>
                      <div className="text-2xl font-extrabold text-emerald-800 mt-1 font-heading tabular-nums">
                        {formatPrice(netProceeds)}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">3.5% bozor to‘lovi chegirilgan</div>
                    </Tilt3DCard>
                  </div>

                  {lowStockCount > 0 && (
                    <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-900">
                            Omborda qoldig‘i oz qolgan mahsulotlar ({lowStockCount} ta)
                          </h4>
                          <p className="text-[11px] text-amber-700 mt-0.5">
                            Buyurtmalar to‘xtab qolmasligi uchun qoldiqni o‘z vaqtida yangilang.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSellerTab('inventory')}
                        className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-100 cursor-pointer shrink-0"
                      >
                        Qoldiqni to‘ldirish
                      </button>
                    </div>
                  )}

                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-neutral-900 font-heading">
                        So‘nggi Buyurtmalar (Faqat sizning tovarlaringiz)
                      </h3>
                      <button
                        onClick={() => setSellerTab('orders')}
                        className="text-xs text-[#173B32] font-semibold hover:underline cursor-pointer"
                      >
                        Barcha buyurtmalar ({sellerOrders.length}) →
                      </button>
                    </div>

                    {sellerOrders.length === 0 ? (
                      <div className="py-8 text-center text-xs text-neutral-400">Hozircha buyurtmalar yo‘q</div>
                    ) : (
                      <div className="divide-y divide-neutral-100">
                        {sellerOrders.slice(0, 4).map(ord => {
                          const myItems = ord.items.filter(i => i.sellerId === currentSeller.id);
                          const mySubtotal = myItems.reduce((s, i) => s + i.price * i.quantity, 0);

                          return (
                            <div key={ord.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-neutral-900 font-mono">{ord.trackingCode}</span>
                                  <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-800">
                                    {ord.status.toUpperCase()}
                                  </span>
                                </div>
                                <div className="text-neutral-500 mt-0.5">
                                  Xaridor: <strong>{ord.customerName}</strong> ({ord.customerPhone}) · {myItems.length} ta mahsulotingiz
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right tabular-nums">
                                  <div className="font-bold text-[#173B32]">{formatPrice(mySubtotal)}</div>
                                  <div className="text-[10px] text-neutral-400">
                                    {ord.deliveryType === 'delivery' ? 'Yetkazish' : 'Ombordan olish'}
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSellerTab('orders')}
                                  className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-[11px] cursor-pointer"
                                >
                                  Boshqarish
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS */}
              {sellerTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 font-heading">
                        Mening Mahsulotlarim ({sellerProducts.length} ta)
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Faqat sizning do‘koningizga tegishli tovarlar ro‘yxati.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsAddModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#173B32] hover:bg-[#235246] text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                    >
                      <Plus className="w-4 h-4 text-[#F59E0B]" />
                      <span>Yangi tovar qo‘shish</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-4">Tovar</th>
                            <th className="p-4">Narxi / Birlik</th>
                            <th className="p-4">Ulgurji Narx</th>
                            <th className="p-4">Qoldiq</th>
                            <th className="p-4">Holat</th>
                            <th className="p-4 text-right">Amallar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {sellerProducts.map(prod => (
                            <tr key={prod.id} className="hover:bg-neutral-50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={prod.image}
                                    alt={prod.titleUz}
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-neutral-900 line-clamp-1">{prod.titleUz}</div>
                                    <div className="text-[11px] text-neutral-400">{prod.brand} · Min. {prod.minOrder} {prod.unit}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 tabular-nums">
                                <div className="font-bold text-[#173B32]">{formatPrice(prod.price)}</div>
                                <div className="text-[10px] text-neutral-400">/{prod.unit}</div>
                              </td>
                              <td className="p-4 tabular-nums">
                                {prod.wholesaleTiers && prod.wholesaleTiers.length > 0 ? (
                                  <span className="text-emerald-700 font-semibold">
                                    {formatPrice(prod.wholesaleTiers[0].discountPrice)} ({prod.wholesaleTiers[0].minQty}+ {prod.unit})
                                  </span>
                                ) : (
                                  <span className="text-neutral-400">-</span>
                                )}
                              </td>
                              <td className="p-4 tabular-nums">
                                <span className={`font-bold ${prod.stock < 50 ? 'text-amber-600' : 'text-neutral-900'}`}>
                                  {prod.stock} {prod.unit}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  prod.inStock ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                                }`}>
                                  {prod.inStock ? 'Sotuvda' : 'Yashirilgan'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => updateSellerProduct(prod.id, { inStock: !prod.inStock })}
                                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                                    title={prod.inStock ? 'Vaqtincha yashirish' : 'Sotuvga chiqarish'}
                                  >
                                    {prod.inStock ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => deleteSellerProduct(prod.id)}
                                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                    title="O‘chirish"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INVENTORY QUICK STOCK */}
              {sellerTab === 'inventory' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 font-heading">
                      Ombor va Qoldiq Boshqaruvi ({sellerProducts.length} ta tovar)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Ombordagi zaxira miqdorini bir bosishda oshiring yoki yangilang.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sellerProducts.map(prod => (
                      <Tilt3DCard key={prod.id} intensity={5} className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.titleUz} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-neutral-900 truncate">{prod.titleUz}</div>
                            <div className="text-[11px] text-neutral-500">{prod.brand}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                          <span className="text-xs text-neutral-500">Joriy qoldiq:</span>
                          <span className={`text-sm font-extrabold tabular-nums ${prod.stock < 50 ? 'text-amber-600' : 'text-[#173B32]'}`}>
                            {prod.stock} {prod.unit}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateSellerProduct(prod.id, { stock: prod.stock + 50, inStock: true })}
                            className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer"
                          >
                            +50 {prod.unit} qo‘shish
                          </button>
                          <button
                            onClick={() => updateSellerProduct(prod.id, { stock: prod.stock + 200, inStock: true })}
                            className="flex-1 py-2 rounded-xl bg-[#173B32] hover:bg-[#235246] text-white text-xs font-bold cursor-pointer"
                          >
                            +200 {prod.unit}
                          </button>
                        </div>
                      </Tilt3DCard>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ORDERS */}
              {sellerTab === 'orders' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 font-heading">
                      Kelib Tushgan Buyurtmalar ({sellerOrders.length} ta)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Xaridorlar tomonidan rasmiylashtirilgan tovarlar buyurtmalari.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {sellerOrders.map(order => {
                      const myItems = order.items.filter(i => i.sellerId === currentSeller.id);

                      return (
                        <div key={order.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-neutral-900 font-mono text-sm">{order.trackingCode}</span>
                              <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-50 text-emerald-800">
                                {order.status.toUpperCase()}
                              </span>
                              <span className="text-neutral-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-neutral-500 text-[11px]">Holat:</span>
                              <select
                                value={order.status}
                                onChange={e => updateSellerOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800 outline-none"
                              >
                                <option value="pending">Kutilmoqda (Pending)</option>
                                <option value="confirmed">Tasdiqlash (Confirmed)</option>
                                <option value="preparing">Tayyorlanmoqda (Preparing)</option>
                                <option value="dispatched">Yo‘lda (Dispatched)</option>
                                <option value="delivered">Yetkazildi (Delivered)</option>
                                <option value="cancelled">Bekor qilish (Cancelled)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                              <div className="font-semibold text-neutral-500 uppercase text-[10px] mb-2">
                                Buyurtma qilingan tovarlaringiz:
                              </div>
                              <div className="space-y-2">
                                {myItems.map(item => (
                                  <div key={item.productId} className="flex items-center gap-3">
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold text-neutral-900 truncate">{item.title}</div>
                                      <div className="text-neutral-500 text-[11px] tabular-nums">
                                        {item.quantity} {item.unit} × {formatPrice(item.price)}
                                      </div>
                                    </div>
                                    <div className="font-bold text-[#173B32] tabular-nums">
                                      {formatPrice(item.price * item.quantity)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1.5 text-xs text-neutral-700">
                              <div className="font-bold text-neutral-900 mb-1">
                                Yetkazib berish ma’lumotlari:
                              </div>
                              <div>Qabul qiluvchi: <strong>{order.customerName}</strong></div>
                              <div>Telefon: <strong className="text-[#173B32]">{order.customerPhone}</strong></div>
                              <div>
                                Manzil: {order.deliveryAddress.region}, {order.deliveryAddress.district}, {order.deliveryAddress.street}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: FINANCIAL REPORTS */}
              {sellerTab === 'reports' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-xs font-semibold text-neutral-500 uppercase">Jami Sotuvlar</span>
                      <div className="text-2xl font-bold text-[#173B32] mt-1 tabular-nums">{formatPrice(totalSalesRevenue)}</div>
                      <div className="text-xs text-neutral-400 mt-1">Ushbu oy davomida</div>
                    </Tilt3DCard>

                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-xs font-semibold text-neutral-500 uppercase">Bozor Komissiyasi (3.5%)</span>
                      <div className="text-2xl font-bold text-rose-600 mt-1 tabular-nums">-{formatPrice(commissionDeducted)}</div>
                      <div className="text-xs text-neutral-400 mt-1">BUILT xizmat haqi</div>
                    </Tilt3DCard>

                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-xs font-semibold text-neutral-500 uppercase">Sof Tushum (Net)</span>
                      <div className="text-2xl font-bold text-emerald-800 mt-1 tabular-nums">{formatPrice(netProceeds)}</div>
                      <div className="text-xs text-emerald-700 font-medium mt-1">Keyingi to‘lov: 1-sana</div>
                    </Tilt3DCard>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 font-heading mb-2">
                      Bank Rekvizitlari va Shartnoma
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
                      Barcha to‘lovlar har 10 kunda yoki oy boshida rasmiy hisob-faktura asosida bank hisob raqamingizga o‘tkaziladi.
                    </p>
                    <div className="mt-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1 font-mono">
                      <div>INN / STIR: <strong>{currentSeller.inn}</strong></div>
                      <div>Do‘kon nomi: <strong>{currentSeller.storeName}</strong></div>
                      <div>Hisob-kitob holati: <span className="text-emerald-700 font-bold">FAOL (Shartnoma imzolangan)</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: STORE SETTINGS */}
              {sellerTab === 'store_settings' && (
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 max-w-2xl space-y-4 text-xs">
                  <h3 className="text-base font-bold text-neutral-900 font-heading">
                    Do‘kon Profili va Aloqa Ma’lumotlari
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Do‘kon nomi</label>
                      <input
                        type="text"
                        disabled
                        value={currentSeller.storeName}
                        className="w-full p-2.5 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Viloyat / Hudud</label>
                      <select
                        defaultValue={currentSeller.region}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32] bg-white font-semibold text-neutral-800"
                      >
                        {UZBEKISTAN_REGIONS.map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Ombor manzili</label>
                      <input
                        type="text"
                        defaultValue={currentSeller.address}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Mijozlar uchun telefon</label>
                      <input
                        type="text"
                        defaultValue={currentSeller.phone}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Do‘kon tavsifi</label>
                      <textarea
                        defaultValue={currentSeller.description}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32] h-24"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => addToast('success', 'Sozlamalar saqlandi', "Do'kon ma'lumotlari muvaffaqiyatli yangilandi.")}
                        className="px-5 py-2.5 rounded-xl bg-[#173B32] text-white font-bold text-xs cursor-pointer"
                      >
                        O‘zgarishlarni saqlash
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </PanelTransition3D>
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL: ADD PRODUCT FORM */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 font-heading">
                {editingProduct ? 'Tovarni Tahrirlash' : 'Yangi Tovar Qo‘shish'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tovar nomi (O‘zbek tilida) *</label>
                <input
                  type="text"
                  required
                  value={prodForm.titleUz}
                  onChange={e => setProdForm({ ...prodForm, titleUz: e.target.value })}
                  placeholder="Masalan: Bekobod Armaturasi 12 mm A500C"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Toifasi *</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={e => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                  >
                    <option value="cement-dry-mix">Sement va Quruq Qorishmalar</option>
                    <option value="rebar-metal">Armatura va Metall Prokati</option>
                    <option value="bricks-blocks">G‘isht va Bloklar</option>
                    <option value="timber-wood">Yog‘och va Taxta</option>
                    <option value="paint-varnish">Bo‘yoqlar va Pardozlash</option>
                    <option value="plumbing-pipes">Santexnika va Quvurlar</option>
                    <option value="electrical">Elektr va Yoritish</option>
                    <option value="tiles-granite">Plitka va Keramogranit</option>
                    <option value="insulation">Izolyatsiya</option>
                    <option value="tools-hardware">Asboblar va Uskunalar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">O‘lchov birligi *</label>
                  <select
                    value={prodForm.unit}
                    onChange={e => setProdForm({ ...prodForm, unit: e.target.value as UnitType })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                  >
                    <option value="qop">qop</option>
                    <option value="dona">dona</option>
                    <option value="metr">metr</option>
                    <option value="m²">m²</option>
                    <option value="m³">m³</option>
                    <option value="tonna">tonna</option>
                    <option value="kg">kg</option>
                    <option value="litr">litr</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Narxi (so‘m) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={e => setProdForm({ ...prodForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Qoldiq *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={e => setProdForm({ ...prodForm, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Min. buyurtma</label>
                  <input
                    type="number"
                    value={prodForm.minOrder}
                    onChange={e => setProdForm({ ...prodForm, minOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-800">Ulgurji xaridlar uchun maxsus narx</span>
                  <input
                    type="checkbox"
                    checked={prodForm.isWholesale}
                    onChange={e => setProdForm({ ...prodForm, isWholesale: e.target.checked })}
                    className="w-4 h-4 accent-[#173B32]"
                  />
                </div>
                {prodForm.isWholesale && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-neutral-500 block mb-1">Min. miqdor:</span>
                      <input
                        type="number"
                        value={prodForm.wholesaleMinQty}
                        onChange={e => setProdForm({ ...prodForm, wholesaleMinQty: parseInt(e.target.value) || 10 })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-neutral-500 block mb-1">Ulgurji narx (so‘m):</span>
                      <input
                        type="number"
                        value={prodForm.wholesalePrice}
                        onChange={e => setProdForm({ ...prodForm, wholesalePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Rasm havolasi (URL)</label>
                <input
                  type="url"
                  value={prodForm.image}
                  onChange={e => setProdForm({ ...prodForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Tavsifi</label>
                <textarea
                  value={prodForm.descriptionUz}
                  onChange={e => setProdForm({ ...prodForm, descriptionUz: e.target.value })}
                  placeholder="Material sifati va GOST standarti haqida..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32] h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B32] text-white font-bold hover:bg-[#235246] cursor-pointer"
                >
                  Saqlash va Joylash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
