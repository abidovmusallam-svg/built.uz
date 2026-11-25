import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatPrice } from '../utils/translations';
import {
  Home,
  Search,
  ShoppingCart,
  User,
  ArrowLeft,
  Code,
  Bell,
  ChevronRight,
  Rotate3D,
  Smartphone
} from 'lucide-react';
import { BuiltLogo } from './BuiltLogo';
import { PortalSwitcherButton } from './PortalSwitcher';

export const MobileCompanionView: React.FC = () => {
  const {
    products,
    categories,
    cart,
    cartCount,
    cartTotal,
    currentUser,
    setActiveView,
    openProductDetail
  } = useMarketplace();

  const [mobileTab, setMobileTab] = useState<'home' | 'search' | 'favorites' | 'cart' | 'profile'>('home');
  const [showCodeInspector, setShowCodeInspector] = useState(false);
  const [presetAngle, setPresetAngle] = useState<'center' | 'left' | 'right'>('center');

  const stageRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 24 });

  const baseRotateY = presetAngle === 'left' ? -18 : presetAngle === 'right' ? 18 : 0;
  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [baseRotateY - 12, baseRotateY + 12]);

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = stageRef.current.getBoundingClientRect();
    mouseX.set(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
    mouseY.set(Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)));
  };

  const sampleRNCode = `// BUILT Mobile Companion App (React Native & Expo)
// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { HomeScreen, CatalogScreen, CartScreen, OrdersScreen, ProfileScreen } from './src/screens';
import { BuiltProvider } from './src/context/BuiltContext';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <BuiltProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#173B32',
            tabBarInactiveTintColor: '#8E9A92',
            headerStyle: { backgroundColor: '#173B32' },
            headerTintColor: '#FFFFFF',
          }}
        >
          <Tab.Screen name="Bosh sahifa" component={HomeScreen} />
          <Tab.Screen name="Katalog" component={CatalogScreen} />
          <Tab.Screen name="Savat" component={CartScreen} />
          <Tab.Screen name="Buyurtmalar" component={OrdersScreen} />
          <Tab.Screen name="Kabinet" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </BuiltProvider>
  );
}`;

  return (
    <div className="min-h-screen bg-[#0c1e19] text-white flex flex-col">
      {/* Standalone Studio Top Bar */}
      <header className="sticky top-0 z-30 bg-[#102922] border-b border-emerald-900/70 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BuiltLogo size="sm" variant="light" showSubtitle={false} />
            <div className="h-5 w-px bg-emerald-800 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold font-heading text-white">
                  BUILT Mobile 3D Studiya
                </h1>
                <span className="hidden sm:inline-block bg-emerald-900/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-700/60">
                  iOS & Android
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/70 hidden sm:block">
                Smartfonlar uchun interaktiv 3D mobil ilova simulyatori
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCodeInspector(!showCodeInspector)}
              className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/70 text-xs font-bold text-emerald-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>{showCodeInspector ? '3D Telefon' : 'Expo Kodi'}</span>
            </button>

            <button
              onClick={() => setActiveView('home')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Do‘konga qaytish</span>
            </button>

            <PortalSwitcherButton variant="light" compact />
          </div>
        </div>
      </header>

      {/* Main Studio Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col items-center justify-center">
        {showCodeInspector ? (
          <div className="w-full bg-[#151e1b] text-emerald-300 rounded-3xl p-6 font-mono text-xs overflow-x-auto shadow-2xl border border-emerald-800/60">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-900 text-emerald-300/70 mb-4">
              <span>React Native + Expo App Architecture (`mobile/App.tsx`)</span>
              <span className="text-[#F59E0B] font-bold">Native Ready</span>
            </div>
            <pre className="text-neutral-200 leading-relaxed">{sampleRNCode}</pre>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-6">
            {/* 3D Angle Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-[#122b24] border border-emerald-800/70 p-1.5 rounded-2xl">
              <div className="flex items-center gap-1.5 px-2.5 text-[11px] text-emerald-200 font-semibold">
                <Rotate3D className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>3D Ko‘rish burchagi:</span>
              </div>
              {([
                { id: 'left', label: 'Chap (-18°)' },
                { id: 'center', label: 'Markaz (0°)' },
                { id: 'right', label: 'O‘ng (+18°)' }
              ] as const).map(angle => (
                <button
                  key={angle.id}
                  onClick={() => setPresetAngle(angle.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    presetAngle === angle.id
                      ? 'bg-[#F59E0B] text-[#173B32]'
                      : 'text-emerald-100 hover:bg-emerald-900/70'
                  }`}
                >
                  {angle.label}
                </button>
              ))}
            </div>

            {/* 3D Interactive Device Stage */}
            <div
              ref={stageRef}
              onMouseMove={handleStageMouseMove}
              onMouseLeave={() => {
                mouseX.set(0.5);
                mouseY.set(0.5);
              }}
              className="perspective-1400 py-4 flex justify-center w-full"
            >
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d'
                }}
                animate={{ rotateY: baseRotateY }}
                transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                className="w-[340px] sm:w-[375px] h-[740px] sm:h-[770px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-black rounded-[50px] p-3 shadow-[0_35px_80px_rgba(0,0,0,0.65)] border-4 border-neutral-700/80 relative flex flex-col will-change-transform"
              >
                {/* 3D Side Hardware Buttons */}
                <div className="hidden sm:block absolute -left-2 top-28 w-1.5 h-10 bg-neutral-700 rounded-l-md" />
                <div className="hidden sm:block absolute -left-2 top-44 w-1.5 h-14 bg-neutral-700 rounded-l-md" />
                <div className="hidden sm:block absolute -right-2 top-36 w-1.5 h-16 bg-neutral-700 rounded-r-md" />

                {/* Dynamic Island */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                </div>

                {/* Inner Phone Screen */}
                <div className="w-full h-full bg-[#F8F9F6] text-neutral-900 rounded-[40px] overflow-hidden flex flex-col relative z-20">
                  {/* Status Bar */}
                  <div className="pt-3 px-6 pb-1 flex justify-between text-[11px] font-bold bg-[#173B32] text-white">
                    <span>09:41</span>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-[#173B32] text-white px-4 py-3 flex items-center justify-between">
                    <BuiltLogo size="sm" variant="light" showSubtitle={false} />
                    <Bell className="w-4 h-4 text-emerald-300" />
                  </div>

                  {/* Screen Body */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {mobileTab === 'home' && (
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-2.5 border border-neutral-200 flex items-center gap-2 text-xs text-neutral-400 shadow-xs">
                          <Search className="w-4 h-4" />
                          <span>Sement, g‘isht, armatura...</span>
                        </div>

                        <div className="bg-gradient-to-r from-[#173B32] to-[#235246] text-white p-3.5 rounded-2xl shadow-xs">
                          <span className="text-[10px] font-bold text-[#F59E0B] uppercase">B2B Ulgurji</span>
                          <h4 className="font-bold text-xs mt-0.5">To‘g‘ridan-to‘g‘ri dilerlar narxida</h4>
                          <p className="text-[10px] text-neutral-300 mt-1">Ob’ektgacha yetkazib berish bilan</p>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-neutral-800 mb-2">Toifalar</div>
                          <div className="grid grid-cols-4 gap-2">
                            {categories.slice(0, 4).map(cat => (
                              <div key={cat.id} className="bg-white p-2 rounded-xl border border-neutral-200 text-center">
                                <img src={cat.image} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover mx-auto mb-1" />
                                <div className="text-[9px] font-bold text-neutral-800 truncate">{cat.nameUz}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-neutral-800 mb-2">Ommabop mahsulotlar</div>
                          <div className="space-y-2">
                            {products.slice(0, 4).map(p => (
                              <div
                                key={p.id}
                                onClick={() => openProductDetail(p.id)}
                                className="bg-white p-2.5 rounded-xl border border-neutral-200 flex items-center gap-2.5 shadow-xs cursor-pointer hover:border-[#173B32]/40 transition-colors"
                              >
                                <img src={p.image} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-lg object-cover border border-neutral-200 shrink-0" />
                                <div className="flex-1 min-w-0 text-xs">
                                  <h5 className="font-bold text-neutral-900 truncate">{p.titleUz}</h5>
                                  <div className="text-[10px] text-neutral-500">{p.brand}</div>
                                  <div className="font-extrabold text-[#173B32] text-xs mt-0.5 tabular-nums">
                                    {formatPrice(p.price)} / {p.unit}
                                  </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-neutral-400" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {mobileTab === 'search' && (
                      <div className="space-y-3">
                        <div className="bg-white rounded-xl p-2.5 border border-neutral-200 flex items-center gap-2 text-xs">
                          <Search className="w-4 h-4 text-neutral-400" />
                          <input type="text" placeholder="Qidiruv..." className="w-full outline-none text-xs" />
                        </div>
                        <div className="text-xs text-neutral-500">Barcha toifalar bo‘yicha 25 000+ mahsulot</div>
                      </div>
                    )}

                    {mobileTab === 'cart' && (
                      <div className="space-y-3 text-xs">
                        <h3 className="font-bold text-neutral-900">Savatcha ({cartCount} ta)</h3>
                        {cart.length === 0 ? (
                          <div className="text-center py-10 text-neutral-400">Savatcha bo‘sh</div>
                        ) : (
                          <div className="space-y-2">
                            {cart.map(item => (
                              <div key={item.product.id} className="bg-white p-2.5 rounded-xl border border-neutral-200 flex justify-between">
                                <div>
                                  <div className="font-bold text-neutral-900">{item.product.titleUz}</div>
                                  <div className="text-[11px] text-neutral-500">{item.quantity} {item.product.unit}</div>
                                </div>
                                <div className="font-bold text-[#173B32] tabular-nums">{formatPrice(item.activePrice * item.quantity)}</div>
                              </div>
                            ))}
                            <div className="pt-2 border-t font-bold flex justify-between tabular-nums">
                              <span>Jami:</span>
                              <span className="text-[#173B32]">{formatPrice(cartTotal)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {mobileTab === 'profile' && (
                      <div className="space-y-3 text-xs">
                        <div className="bg-white p-4 rounded-xl border border-neutral-200 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#173B32] text-white flex items-center justify-center font-bold">
                            {currentUser.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-neutral-900">{currentUser.fullName}</div>
                            <div className="text-neutral-500">{currentUser.phone}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Tab Bar */}
                  <div className="bg-white border-t border-neutral-200 px-3 py-2 flex items-center justify-around text-[10px] font-medium text-neutral-500 shrink-0">
                    <button
                      onClick={() => setMobileTab('home')}
                      className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileTab === 'home' ? 'text-[#173B32] font-bold' : ''}`}
                    >
                      <Home className="w-4 h-4" />
                      <span>Bosh sahifa</span>
                    </button>

                    <button
                      onClick={() => setMobileTab('search')}
                      className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileTab === 'search' ? 'text-[#173B32] font-bold' : ''}`}
                    >
                      <Search className="w-4 h-4" />
                      <span>Qidiruv</span>
                    </button>

                    <button
                      onClick={() => setMobileTab('cart')}
                      className={`flex flex-col items-center gap-0.5 relative cursor-pointer ${mobileTab === 'cart' ? 'text-[#173B32] font-bold' : ''}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-[#F59E0B] text-[#173B32] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                      <span>Savat</span>
                    </button>

                    <button
                      onClick={() => setMobileTab('profile')}
                      className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileTab === 'profile' ? 'text-[#173B32] font-bold' : ''}`}
                    >
                      <User className="w-4 h-4" />
                      <span>Profil</span>
                    </button>
                  </div>

                  <div className="pb-1 pt-1 bg-white flex justify-center">
                    <div className="w-28 h-1 bg-neutral-300 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
