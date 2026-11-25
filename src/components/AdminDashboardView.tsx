import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useMarketplace } from '../context/MarketplaceContext';
import { AdminTab, Seller } from '../types';
import { formatPrice, UZBEKISTAN_REGIONS } from '../utils/translations';
import { BuiltLogo } from './BuiltLogo';
import { PortalSwitcherButton } from './PortalSwitcher';
import { Tilt3DCard, PanelTransition3D } from './Motion3D';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  Percent,
  CreditCard,
  BarChart3,
  ClipboardList,
  Settings,
  UserPlus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Filter,
  Clock,
  Phone,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    sellers,
    users,
    categories,
    products,
    orders,
    auditLogs,
    invitations,
    payouts,
    commissionRate,
    setCommissionRate,
    createSellerInvitation,
    revokeInvitation,
    updateSellerStatus,
    currentUser,
    setActiveView,
    addToast
  } = useMarketplace();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    storeName: '',
    phone: '+998 ',
    email: '',
    username: '',
    region: 'Namangan viloyati'
  });
  const [createdInviteResult, setCreatedInviteResult] = useState<any | null>(null);

  const [sellerToSuspend, setSellerToSuspend] = useState<Seller | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');

  const [sellerSearch, setSellerSearch] = useState('');
  const [sellerStatusFilter, setSellerStatusFilter] = useState<string>('all');
  const [sellerRegionFilter, setSellerRegionFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const platformRevenue = Math.round(totalGMV * (commissionRate / 100));
  const activeSellersCount = sellers.filter(s => s.status === 'active').length;
  const pendingInvitesCount = invitations.filter(i => i.status === 'pending').length;

  const handleCreateInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.fullName || !inviteForm.storeName || !inviteForm.phone || !inviteForm.username) {
      addToast('error', "Maydonlar to'ldirilmadi", "Iltimos, barcha majburiy maydonlarni to'ldiring");
      return;
    }
    const newInvite = createSellerInvitation(inviteForm);
    setCreatedInviteResult(newInvite);
    setInviteForm({
      fullName: '',
      storeName: '',
      phone: '+998 ',
      email: '',
      username: '',
      region: 'Namangan viloyati'
    });
  };

  const handleConfirmSuspension = () => {
    if (sellerToSuspend) {
      updateSellerStatus(sellerToSuspend.id, 'suspended', suspensionReason || 'Administrator qarori');
      setSellerToSuspend(null);
      setSuspensionReason('');
    }
  };

  const filteredSellers = sellers.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(sellerSearch.toLowerCase()) ||
      s.storeName.toLowerCase().includes(sellerSearch.toLowerCase()) ||
      s.region.toLowerCase().includes(sellerSearch.toLowerCase()) ||
      s.phone.includes(sellerSearch);
    const matchesStatus = sellerStatusFilter === 'all' || s.status === sellerStatusFilter;
    const matchesRegion = sellerRegionFilter === 'all' || s.region === sellerRegionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const filteredProducts = products.filter(p =>
    p.titleUz.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sellerName.toLowerCase().includes(productSearch.toLowerCase())
  );

  const navGroups = [
    {
      title: 'Boshqaruv',
      items: [
        { id: 'dashboard' as AdminTab, label: 'Asosiy Dashboard', icon: LayoutDashboard },
        { id: 'orders' as AdminTab, label: 'Buyurtmalar', icon: ShoppingBag, badge: orders.length }
      ]
    },
    {
      title: 'Hamkorlar & Katalog',
      items: [
        { id: 'sellers' as AdminTab, label: 'Sotuvchilar (Taklif)', icon: Store, badge: pendingInvitesCount > 0 ? pendingInvitesCount : undefined },
        { id: 'customers' as AdminTab, label: 'Xaridorlar', icon: Users },
        { id: 'products' as AdminTab, label: 'Mahsulotlar', icon: Package }
      ]
    },
    {
      title: 'Moliya & Tahlil',
      items: [
        { id: 'commissions' as AdminTab, label: 'Komissiyalar', icon: Percent },
        { id: 'payouts' as AdminTab, label: 'To‘lovlar (Payouts)', icon: CreditCard },
        { id: 'reports' as AdminTab, label: 'Hisobotlar', icon: BarChart3 }
      ]
    },
    {
      title: 'Xavfsizlik',
      items: [
        { id: 'audit' as AdminTab, label: 'Audit Jurnali', icon: ClipboardList, badge: auditLogs.length },
        { id: 'settings' as AdminTab, label: 'Tizim Sozlamalari', icon: Settings }
      ]
    }
  ];

  const activeNavLabel =
    navGroups.flatMap(g => g.items).find(i => i.id === adminTab)?.label || 'Dashboard';

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0f241f] text-white">
      <div className="p-5 border-b border-emerald-900/70 flex items-center justify-between">
        <BuiltLogo size="sm" variant="light" />
        <button
          onClick={() => setMobileNavOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:bg-emerald-900/60"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Super Admin Identity */}
      <div className="p-4 border-b border-emerald-900/70">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/60">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#F59E0B] flex items-center justify-center border border-amber-500/40 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{currentUser.fullName}</div>
            <div className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider">SUPER ADMIN CORE</div>
          </div>
        </div>
      </div>

      {/* Sidebar Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {navGroups.map(group => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
              {group.title}
            </div>
            {group.items.map(tab => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setAdminTab(tab.id);
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

      {/* Exit */}
      <div className="p-4 border-t border-emerald-900/70">
        <button
          onClick={() => setActiveView('home')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-xs font-semibold text-emerald-100 border border-emerald-800/60 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Do‘kon vitrinasiga o‘tish</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6F1] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0 sticky top-0 h-screen shadow-xl z-20">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Header */}
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
                MARKAZIY BOSHQARUV PORTALI (SUPER ADMIN)
              </div>
              <h1 className="text-base sm:text-lg font-bold font-heading text-neutral-900 truncate">
                {activeNavLabel}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setCreatedInviteResult(null);
                setIsInviteModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#173B32] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Sotuvchi taklifi</span>
            </button>
            <PortalSwitcherButton variant="dark" compact />
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <PanelTransition3D panelKey={adminTab}>
              {/* TAB 1: DASHBOARD */}
              {adminTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Platforma GMV</span>
                      <div className="text-2xl font-extrabold text-[#173B32] mt-1 font-heading tabular-nums">
                        {formatPrice(totalGMV)}
                      </div>
                      <div className="text-xs text-emerald-700 font-medium mt-1">Barcha buyurtmalar summasi</div>
                    </Tilt3DCard>

                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        Komissiya ({commissionRate}%)
                      </span>
                      <div className="text-2xl font-extrabold text-[#F59E0B] mt-1 font-heading tabular-nums">
                        {formatPrice(platformRevenue)}
                      </div>
                      <div className="text-xs text-neutral-500 font-medium mt-1">Platforma sof daromadi</div>
                    </Tilt3DCard>

                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Faol Sotuvchilar</span>
                      <div className="text-2xl font-extrabold text-neutral-900 mt-1 font-heading tabular-nums">
                        {activeSellersCount} <span className="text-sm font-normal text-neutral-400">/ {sellers.length}</span>
                      </div>
                      <div className="text-xs text-amber-600 font-medium mt-1">{pendingInvitesCount} ta taklif jarayonda</div>
                    </Tilt3DCard>

                    <Tilt3DCard intensity={6} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Jami Mahsulotlar</span>
                      <div className="text-2xl font-extrabold text-neutral-900 mt-1 font-heading tabular-nums">
                        {products.length} ta
                      </div>
                      <div className="text-xs text-emerald-700 font-medium mt-1">Barcha dilerlar bazasida</div>
                    </Tilt3DCard>
                  </div>

                  {/* Invitation Quick Launcher */}
                  <div className="bg-gradient-to-r from-[#173B32] to-[#235246] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Majburiy Qoida: Sotuvchilar faqat taklif orqali ulanadi</span>
                      </div>
                      <h3 className="text-lg font-bold font-heading">
                        Yangi sotuvchi kompaniyani ro‘yxatdan o‘tkazish
                      </h3>
                      <p className="text-xs text-neutral-200 max-w-2xl mt-1 leading-relaxed">
                        Administrator sotuvchi ma’lumotlarini kiritib, xavfsiz taklif tokeni va parol o‘rnatish havolasini taqdim etadi.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCreatedInviteResult(null);
                        setIsInviteModalOpen(true);
                      }}
                      className="px-5 py-3 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#173B32] font-bold text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Yangi sotuvchi qo‘shish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-neutral-900 font-heading">So‘nggi Buyurtmalar</h4>
                        <button
                          onClick={() => setAdminTab('orders')}
                          className="text-xs text-[#173B32] font-semibold hover:underline cursor-pointer"
                        >
                          Barchasi ({orders.length}) →
                        </button>
                      </div>
                      <div className="divide-y divide-neutral-100">
                        {orders.slice(0, 4).map(ord => (
                          <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-neutral-900 font-mono">{ord.trackingCode}</div>
                              <div className="text-neutral-500">{ord.customerName} · {ord.items.length} xil tovar</div>
                            </div>
                            <div className="text-right tabular-nums">
                              <div className="font-bold text-[#173B32]">{formatPrice(ord.total)}</div>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                                {ord.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-neutral-900 font-heading">Xavfsizlik va Audit Jurnali</h4>
                        <button
                          onClick={() => setAdminTab('audit')}
                          className="text-xs text-[#173B32] font-semibold hover:underline cursor-pointer"
                        >
                          Barchasi ({auditLogs.length}) →
                        </button>
                      </div>
                      <div className="divide-y divide-neutral-100">
                        {auditLogs.slice(0, 4).map(log => (
                          <div key={log.id} className="py-3 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-neutral-800 font-mono">{log.action}</span>
                              <span className="text-[10px] text-neutral-400 tabular-nums">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-neutral-600 mt-0.5 text-[11px] line-clamp-1">{log.details}</p>
                            <div className="text-[10px] text-neutral-400 mt-1">
                              Bajaruvchi: <strong className="text-neutral-700">{log.performedBy}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SELLERS */}
              {adminTab === 'sellers' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 font-heading">
                        Sotuvchilar Boshqaruvi va Verifikatsiya
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Faqat administrator ruxsati bilan yaratilgan rasmiy dilerlar va zavodlar ro‘yxati
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setCreatedInviteResult(null);
                        setIsInviteModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#173B32] hover:bg-[#235246] text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                    >
                      <UserPlus className="w-4 h-4 text-[#F59E0B]" />
                      <span>Yangi sotuvchi qo‘shish</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={sellerSearch}
                        onChange={e => setSellerSearch(e.target.value)}
                        placeholder="Do‘kon nomi, vakil ismi yoki telefon..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 outline-none focus:border-[#173B32]"
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Filter className="w-4 h-4 text-neutral-400 hidden sm:block" />
                      <select
                        value={sellerStatusFilter}
                        onChange={e => setSellerStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-700 outline-none"
                      >
                        <option value="all">Barcha holatlar</option>
                        <option value="active">Faol (Active)</option>
                        <option value="invited">Taklif yuborilgan</option>
                        <option value="suspended">Bloklangan</option>
                      </select>
                      <select
                        value={sellerRegionFilter}
                        onChange={e => setSellerRegionFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-700 outline-none"
                      >
                        <option value="all">Barcha viloyatlar ({sellers.length})</option>
                        {UZBEKISTAN_REGIONS.map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {invitations.filter(i => i.status === 'pending').length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-amber-900 text-xs font-bold mb-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Kutilayotgan takliflar</span>
                      </div>
                      <div className="divide-y divide-amber-100">
                        {invitations.filter(i => i.status === 'pending').map(inv => (
                          <div key={inv.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div>
                              <strong className="text-neutral-900">{inv.storeName}</strong> ({inv.fullName}) · {inv.phone}
                              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                                Taklif kodi: <span className="bg-amber-200/80 px-1.5 py-0.5 rounded font-bold text-neutral-800">{inv.inviteToken}</span>
                                {' '}· Login: <strong>{inv.username}</strong>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard?.writeText(inv.inviteToken);
                                  addToast('success', 'Nusxalandi', `Taklif kodi: ${inv.inviteToken}`);
                                }}
                                className="px-2.5 py-1 rounded bg-white text-neutral-700 border border-neutral-200 text-[11px] hover:bg-neutral-50 cursor-pointer"
                              >
                                Nusxalash
                              </button>
                              <button
                                onClick={() => revokeInvitation(inv.id)}
                                className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 text-[11px] hover:bg-rose-100 cursor-pointer"
                              >
                                Bekor qilish
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-4">Do‘kon / Kompaniya</th>
                            <th className="p-4">Mas’ul Vakil & Aloqa</th>
                            <th className="p-4">INN / Hudud</th>
                            <th className="p-4">Tovarlar & Savdo</th>
                            <th className="p-4">Holat</th>
                            <th className="p-4 text-right">Boshqaruv</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {filteredSellers.map(seller => {
                            const isSuspended = seller.status === 'suspended';
                            const isActive = seller.status === 'active';

                            return (
                              <tr key={seller.id} className="hover:bg-neutral-50/80 transition-colors">
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={seller.logo}
                                      alt={seller.storeName}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shrink-0"
                                    />
                                    <div>
                                      <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                                        <span>{seller.storeName}</span>
                                        {seller.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                      </div>
                                      <div className="text-[11px] text-neutral-400 font-mono">
                                        @{seller.username}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-neutral-700">
                                  <div className="font-medium">{seller.name}</div>
                                  <div className="text-neutral-500 text-[11px] flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3 text-neutral-400" />
                                    <span>{seller.phone}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-neutral-600">
                                  <div>INN: <strong className="text-neutral-900 font-mono">{seller.inn}</strong></div>
                                  <div className="text-neutral-400 text-[11px]">{seller.region}</div>
                                </td>
                                <td className="p-4 tabular-nums">
                                  <div className="font-semibold text-neutral-900">{seller.productsCount} ta tovar</div>
                                  <div className="text-[11px] text-neutral-500">{seller.totalSalesCount} ta bitim</div>
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                                      isActive
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                        : isSuspended
                                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                                    }`}
                                  >
                                    {isActive ? 'Faol' : isSuspended ? 'Bloklangan' : 'Taklif qilingan'}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    {isSuspended ? (
                                      <button
                                        onClick={() => updateSellerStatus(seller.id, 'active')}
                                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <Unlock className="w-3.5 h-3.5" />
                                        <span>Faollashtirish</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => setSellerToSuspend(seller)}
                                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold flex items-center gap-1 cursor-pointer"
                                      >
                                        <Lock className="w-3.5 h-3.5" />
                                        <span>To‘xtatish</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOMERS */}
              {adminTab === 'customers' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 font-heading">
                      Tizim Foydalanuvchilari ({users.length} ta)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Xaridorlar, faol dilerlar va administrator akkauntlari ro‘yxati
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(u => (
                      <Tilt3DCard key={u.id} intensity={5} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#173B32] text-white flex items-center justify-center font-bold">
                              {u.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-neutral-900">{u.fullName}</div>
                              <div className="text-[11px] text-neutral-500 font-mono">@{u.username}</div>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-neutral-100 text-[10px] font-bold uppercase text-neutral-700">
                            {u.role}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-600 flex justify-between">
                          <span>{u.phone}</span>
                          <span className={u.status === 'active' ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                            {u.status.toUpperCase()}
                          </span>
                        </div>
                      </Tilt3DCard>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PRODUCTS */}
              {adminTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200">
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 font-heading">
                        Tovar Moderatsiyasi ({products.length} ta)
                      </h3>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Barcha sotuvchilar tomonidan joylangan tovarlar ustidan markaziy nazorat
                      </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        placeholder="Tovar yoki brend qidirish..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map(product => (
                      <Tilt3DCard key={product.id} intensity={5} className="bg-white p-4 rounded-2xl border border-neutral-200 flex gap-3">
                        <img
                          src={product.image}
                          alt={product.titleUz}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover border border-neutral-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-neutral-900 line-clamp-1">{product.titleUz}</h5>
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            Sotuvchi: <strong className="text-neutral-800">{product.sellerName}</strong>
                          </div>
                          <div className="text-xs font-bold text-[#173B32] mt-1 tabular-nums">
                            {formatPrice(product.price)} / {product.unit}
                          </div>
                          <div className="text-[10px] text-neutral-400 mt-0.5 tabular-nums">
                            Qoldiq: {product.stock} {product.unit}
                          </div>
                        </div>
                      </Tilt3DCard>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: AUDIT */}
              {adminTab === 'audit' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 font-heading">
                      Xavfsizlik va Audit Jurnali
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Barcha admin va sotuvchi harakatlari to‘liq qayd etiladi.
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-4">Amal</th>
                            <th className="p-4">Bajaruvchi</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Tafsilotlar</th>
                            <th className="p-4">Daraja</th>
                            <th className="p-4">Vaqt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {auditLogs.map(log => (
                            <tr key={log.id} className="hover:bg-neutral-50/80">
                              <td className="p-4 font-mono font-bold text-neutral-900">{log.action}</td>
                              <td className="p-4 text-neutral-700 font-medium">{log.performedBy}</td>
                              <td className="p-4">
                                <span className="uppercase text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                                  {log.performerRole}
                                </span>
                              </td>
                              <td className="p-4 text-neutral-600 max-w-md">{log.details}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    log.severity === 'warning'
                                      ? 'bg-amber-100 text-amber-800'
                                      : log.severity === 'critical'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {log.severity.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-4 text-neutral-400 text-[11px] whitespace-nowrap tabular-nums">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: COMMISSIONS */}
              {adminTab === 'commissions' && (
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 max-w-2xl space-y-4">
                  <h3 className="text-base font-bold text-neutral-900 font-heading">
                    Marketplace Komissiya Stavkalari
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Platforma har bir savdo bitimidan olinadigan komissiya ulushini belgilaydi.
                  </p>

                  <div className="pt-3 border-t border-neutral-100 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1 tabular-nums">
                        Bozor komissiyasi stavkasi: {commissionRate}%
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={commissionRate}
                        onChange={e => setCommissionRate(parseFloat(e.target.value))}
                        className="w-full accent-[#173B32]"
                      />
                      <div className="flex justify-between text-[11px] text-neutral-400 mt-1 tabular-nums">
                        <span>1.0%</span>
                        <span className="font-bold text-[#173B32]">{commissionRate}%</span>
                        <span>10.0%</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1 tabular-nums">
                      <div>Jami savdo hajmi: <strong>{formatPrice(totalGMV)}</strong></div>
                      <div>Platforma daromadi: <strong className="text-emerald-700">{formatPrice(platformRevenue)}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: PAYOUTS */}
              {adminTab === 'payouts' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 font-heading">
                      Sotuvchilarga To‘lovlar (Payouts)
                    </h3>
                  </div>

                  <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="p-4">Sotuvchi Do‘kon</th>
                            <th className="p-4">Davr</th>
                            <th className="p-4">Jami Savdo</th>
                            <th className="p-4">Komissiya</th>
                            <th className="p-4">Sof To‘lov</th>
                            <th className="p-4">Holat</th>
                            <th className="p-4">Bank Hisob Raqami</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {payouts.map(p => (
                            <tr key={p.id} className="hover:bg-neutral-50">
                              <td className="p-4 font-bold text-neutral-900">{p.sellerName}</td>
                              <td className="p-4 text-neutral-600">{p.period}</td>
                              <td className="p-4 font-medium tabular-nums">{formatPrice(p.totalSales)}</td>
                              <td className="p-4 text-rose-600 font-medium tabular-nums">-{formatPrice(p.commissionAmount)}</td>
                              <td className="p-4 font-bold text-emerald-800 tabular-nums">{formatPrice(p.netPayout)}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  p.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {p.status === 'paid' ? 'To‘langan' : 'Kutilmoqda'}
                                </span>
                              </td>
                              <td className="p-4 text-[11px] text-neutral-500 font-mono">{p.bankAccount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: ORDERS */}
              {adminTab === 'orders' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 font-heading">
                      Platforma Buyurtmalari ({orders.length} ta)
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm text-neutral-900 font-bold font-mono">{order.trackingCode}</strong>
                            <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700">
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-600 mt-1">
                            Xaridor: <strong>{order.customerName}</strong> ({order.customerPhone})
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">
                            Manzil: {order.deliveryAddress.region}, {order.deliveryAddress.district}, {order.deliveryAddress.street}
                          </div>
                        </div>

                        <div className="text-right tabular-nums">
                          <div className="text-base font-bold text-[#173B32]">{formatPrice(order.total)}</div>
                          <div className="text-[11px] text-neutral-400">
                            Yetkazish: {formatPrice(order.deliveryFee)} · {order.deliveryVehicle || 'Do‘kondan'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: REPORTS & CATEGORIES */}
              {(adminTab === 'reports' || adminTab === 'categories') && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                    <h3 className="text-base font-bold text-neutral-900 font-heading">
                      Toifalar va Savdo Tahlili ({categories.length} ta toifa)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => (
                      <Tilt3DCard key={cat.id} intensity={5} className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center gap-3">
                        <img src={cat.image} alt={cat.nameUz} referrerPolicy="no-referrer" className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-neutral-900">{cat.nameUz}</div>
                          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 tabular-nums">{cat.itemCount} ta mahsulot</div>
                        </div>
                      </Tilt3DCard>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: SETTINGS */}
              {adminTab === 'settings' && (
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 max-w-2xl space-y-4 text-xs">
                  <h3 className="text-base font-bold text-neutral-900 font-heading">
                    BUILT Platforma Markaziy Sozlamalari
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                      <div className="text-neutral-500">Aloqa markazi</div>
                      <div className="text-sm font-bold text-[#173B32] mt-1">20 020 50 68</div>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                      <div className="text-neutral-500">Korporativ pochta</div>
                      <div className="text-sm font-bold text-[#173B32] mt-1">info@built.uz</div>
                    </div>
                  </div>
                  <button
                    onClick={() => addToast('success', 'Saqlandi', 'Tizim parametrlari yangilandi')}
                    className="px-4 py-2.5 rounded-xl bg-[#173B32] text-white font-bold cursor-pointer"
                  >
                    Parametrlarni saqlash
                  </button>
                </div>
              )}
            </PanelTransition3D>
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL 1: CREATE SELLER INVITATION */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="text-base font-bold text-neutral-900 font-heading">
                  Yangi Sotuvchi Taklif Qilish
                </h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {createdInviteResult ? (
              <div className="py-4 space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                  <div className="font-bold text-sm mb-1">Taklif muvaffaqiyatli yaratildi!</div>
                  <p>Ushbu taklif kodi orqali sotuvchi tizimga kirib parolini o‘rnatadi.</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                  <div>Do‘kon nomi: <strong>{createdInviteResult.storeName}</strong></div>
                  <div>Mas’ul shaxs: <strong>{createdInviteResult.fullName}</strong></div>
                  <div>Login: <strong className="font-mono">{createdInviteResult.username}</strong></div>
                  <div className="pt-2 border-t border-neutral-200">
                    <span className="text-neutral-500 block mb-1">Taklif kodi:</span>
                    <div className="p-2 rounded bg-amber-100/70 border border-amber-300 font-mono font-bold text-sm text-[#173B32] text-center select-all">
                      {createdInviteResult.inviteToken}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(createdInviteResult.inviteToken);
                      addToast('success', 'Nusxalandi', "Taklif kodi nusxalandi!");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F59E0B] text-[#173B32] font-bold text-xs cursor-pointer"
                  >
                    Kodni nusxalash
                  </button>
                  <button
                    onClick={() => {
                      setIsInviteModalOpen(false);
                      setCreatedInviteResult(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#173B32] text-white font-bold text-xs cursor-pointer"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateInviteSubmit} className="py-4 space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Do‘kon nomi *</label>
                  <input
                    type="text"
                    required
                    value={inviteForm.storeName}
                    onChange={e => setInviteForm({ ...inviteForm, storeName: e.target.value })}
                    placeholder="Masalan: Bekobod Metall Markazi"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Viloyat *</label>
                  <select
                    value={inviteForm.region}
                    onChange={e => setInviteForm({ ...inviteForm, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32] bg-white font-semibold text-neutral-800"
                  >
                    {UZBEKISTAN_REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Vakil F.I.Sh. *</label>
                  <input
                    type="text"
                    required
                    value={inviteForm.fullName}
                    onChange={e => setInviteForm({ ...inviteForm, fullName: e.target.value })}
                    placeholder="Sardor Toirov"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Telefon *</label>
                    <input
                      type="text"
                      required
                      value={inviteForm.phone}
                      onChange={e => setInviteForm({ ...inviteForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Login *</label>
                    <input
                      type="text"
                      required
                      value={inviteForm.username}
                      onChange={e => setInviteForm({ ...inviteForm, username: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 outline-none focus:border-[#173B32]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-semibold cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#173B32] text-white font-bold hover:bg-[#235246] cursor-pointer"
                  >
                    Taklif yaratish
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM SUSPENSION */}
      {sellerToSuspend && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-2 text-rose-600 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold font-heading text-neutral-900">
                Sotuvchini to‘xtatish (Bloklash)
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              Haqiqatan ham <strong>{sellerToSuspend.storeName}</strong> sotuvchi hisobini bloklamoqchimisiz?
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Sabab:</label>
              <textarea
                value={suspensionReason}
                onChange={e => setSuspensionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs outline-none focus:border-rose-500 h-20"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSellerToSuspend(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleConfirmSuspension}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
              >
                Ha, bloklash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
