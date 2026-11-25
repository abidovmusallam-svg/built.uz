import React from 'react';
import { AnimatePresence } from 'motion/react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { PanelTransition3D } from './components/Motion3D';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView, CheckoutView } from './components/CartAndCheckout';
import { CustomerAccountView } from './components/CustomerAccountView';
import { SellerDashboardView } from './components/SellerDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { MobileCompanionView } from './components/MobileCompanionView';
import { SellerLoginView, ActivateInviteView, AccessDeniedView } from './components/SellerAuthModals';
import { AboutView, ContactView, FAQView } from './components/StaticPages';
import { CalculatorsView } from './components/CalculatorsView';
import { WholesaleQuotationView } from './components/WholesaleQuotationView';

const STOREFRONT_VIEWS = new Set([
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
]);

const MainContent: React.FC = () => {
  const { activeView } = useMarketplace();
  const isStorefront = STOREFRONT_VIEWS.has(activeView);

  return (
    <>
      {isStorefront ? (
        /* STANDALONE PANEL 1: CUSTOMER STOREFRONT MARKETPLACE */
        <div className="min-h-screen flex flex-col bg-[#F8F9F6] text-[#202622]">
          <Header />
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <PanelTransition3D panelKey={activeView}>
                {activeView === 'home' && <HomeView />}
                {activeView === 'catalog' && <CatalogView />}
                {activeView === 'product-detail' && <ProductDetailView />}
                {activeView === 'cart' && <CartView />}
                {activeView === 'checkout' && <CheckoutView />}
                {activeView === 'calculators' && <CalculatorsView />}
                {activeView === 'wholesale' && <WholesaleQuotationView />}
                {activeView === 'about' && <AboutView />}
                {activeView === 'contact' && <ContactView />}
                {activeView === 'faq' && <FAQView />}
              </PanelTransition3D>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      ) : (
        /* COMPLETELY SEPARATE STANDALONE WORKSPACE PANELS (No Storefront Header/Footer) */
        <AnimatePresence mode="wait">
          <PanelTransition3D panelKey={activeView} className="min-h-screen">
            {activeView === 'account' && <CustomerAccountView />}
            {activeView === 'seller-dashboard' && <SellerDashboardView />}
            {activeView === 'admin-dashboard' && <AdminDashboardView />}
            {activeView === 'mobile-companion' && <MobileCompanionView />}
            {activeView === 'seller-login' && <SellerLoginView />}
            {activeView === 'activate-invite' && <ActivateInviteView />}
            {activeView === 'access-denied' && <AccessDeniedView />}
          </PanelTransition3D>
        </AnimatePresence>
      )}

      <ToastContainer />
    </>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainContent />
    </MarketplaceProvider>
  );
}
