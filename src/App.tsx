import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";

import { HomePage } from "./pages/HomePage";

import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { GoogleRedirectHandler } from "./pages/GoogleRedirectHandler";

import PalestineAIPage from "./pages/PalestineAIPage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

import AdminMarketPage from "./pages/admin/AdminMarketPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminStockAlertsPage from "./pages/admin/AdminStockAlertsPage";
import AdminStorePage from "./pages/admin/AdminStorePage";
import SellerRequestsPage from "./pages/admin/SellerRequestsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSupervisionDashboard from "./pages/admin/AdminSupervisionDashboard";
import AdminStoresListPage from "./pages/admin/AdminStoresListPage";
import AdminStoreDetailsPage from "./pages/admin/AdminStoreDetailsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import Soap3DPage from "./pages/Soap3DPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserOrderDetailsPage from "./pages/UserOrderDetailsPage";
import MarketplacePage from "./pages/MarketplacePage";
import StorePage from "./pages/StorePage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerProductsPage from "./pages/SellerProductsPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import SellerStockAlertsPage from "./pages/SellerStockAlertsPage";
import ManageMyShopPage from "./pages/seller/ManageMyShopPage";

import HeritageHomePage from "./pages/heritage/HeritageHomePage";
import CitiesPage from "./pages/heritage/CitiesPage";
import CityDetailsPage from "./pages/heritage/CityDetailsPage";
import IndustriesPage from "./pages/heritage/IndustriesPage";
import IndustryDetailsPage from "./pages/heritage/IndustryDetailsPage";
import TraditionsHomePage from "./pages/heritage/TraditionsHomePage";
import WeddingStagesPage from "./pages/heritage/WeddingStagesPage";
import WeddingStageDetailsPage from "./pages/heritage/WeddingStageDetailsPage";
import CondolenceDetailsPage from "./pages/traditions/CondolenceDetailsPage";
import FoodsPage from "./pages/heritage/FoodsPage";
import FoodDetailsPage from "./pages/heritage/FoodDetailsPage";
import ClothesPage from "./pages/heritage/customs/ClothesPage";
import ClothesDetailsPage from "./pages/heritage/customs/ClothesDetailsPage";
import SoapStoryHero from "./pages/soap-story/SoapStoryHero";
import SoapPage from "./pages/soap-story/SoapPage";
import SoapBuildingsPage from "./pages/soap-story/SoapBuildingsPage";

import RequireAuth from "./components/auth/RequireAuth";
import PublicOnly from "./components/auth/PublicOnly";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import CartDrawer from "./components/cart/CartDrawer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ToastContainer theme="dark" position="top-right" autoClose={3000} />
          <CartProvider>
            <CartDrawer />
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<HomePage />} />

              {/* PUBLIC ONLY (Redirect to home if logged in) */}
              <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />

              <Route path="/forgot-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
              <Route path="/reset-password" element={<PublicOnly><ResetPasswordPage /></PublicOnly>} />
              <Route path="/google-redirect" element={<PublicOnly><GoogleRedirectHandler /></PublicOnly>} />

              {/* PROTECTED ROUTES */}
              <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
              <Route path="/orders" element={<RequireAuth><UserOrdersPage /></RequireAuth>} />
              <Route path="/orders/:id" element={<RequireAuth><UserOrderDetailsPage /></RequireAuth>} />
              <Route path="/palestine-ai" element={<RequireAuth><PalestineAIPage /></RequireAuth>} />
              <Route path="/become-seller" element={<RequireAuth><BecomeSellerPage /></RequireAuth>} />

              {/* PUBLIC SHOP & 3D */}
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/product/:id" element={<ProductDetailsPage />} />
              <Route path="/soap-3d" element={<Soap3DPage />} />

              {/* ADMIN */}
              <Route path="/admin/market" element={<RequireAuth><AdminMarketPage /></RequireAuth>} />
              <Route path="/admin/products" element={<RequireAuth><AdminProductsPage /></RequireAuth>} />
              <Route path="/admin/orders" element={<RequireAuth><AdminOrdersPage /></RequireAuth>} />
              <Route path="/admin/stock-alerts" element={<RequireAuth><AdminStockAlertsPage /></RequireAuth>} />
              <Route path="/admin/store" element={<RequireAuth><AdminStorePage /></RequireAuth>} />
              <Route path="/admin/seller-requests" element={<RequireAuth><SellerRequestsPage /></RequireAuth>} />
              <Route path="/admin/analytics" element={<RequireAuth><AdminAnalyticsPage /></RequireAuth>} />

              {/* ADMIN SUPERVISION */}
              <Route path="/admin/supervision" element={<RequireAuth><AdminSupervisionDashboard /></RequireAuth>} />
              <Route path="/admin/supervision/stores" element={<RequireAuth><AdminStoresListPage /></RequireAuth>} />
              <Route path="/admin/supervision/stores/:id" element={<RequireAuth><AdminStoreDetailsPage /></RequireAuth>} />
              <Route path="/admin/reports" element={<RequireAuth><AdminReportsPage /></RequireAuth>} />

              {/* SELLER */}
              <Route path="/seller" element={<RequireAuth><SellerDashboardPage /></RequireAuth>} />
              <Route path="/seller/products" element={<RequireAuth><SellerProductsPage /></RequireAuth>} />
              <Route path="/seller/orders" element={<RequireAuth><SellerOrdersPage /></RequireAuth>} />
              <Route path="/seller/stock-alerts" element={<RequireAuth><SellerStockAlertsPage /></RequireAuth>} />
              <Route path="/seller/store" element={<RequireAuth><ManageMyShopPage /></RequireAuth>} />

              {/* PUBLIC MARKET */}
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/product/:id" element={<ProductDetailsPage />} />
              <Route path="/store/:storeId" element={<StorePage />} />

              {/* HERITAGE LIBRARY (PUBLIC) */}
              <Route path="/heritage" element={<HeritageHomePage />} />
              <Route path="/heritage/cities" element={<CitiesPage />} />
              <Route path="/heritage/cities/:id" element={<CityDetailsPage />} />
              <Route path="/heritage/industries" element={<IndustriesPage />} />
              <Route path="/heritage/industries/:id" element={<IndustryDetailsPage />} />
              <Route path="/heritage/traditions" element={<TraditionsHomePage />} />
              <Route path="/heritage/traditions/wedding" element={<WeddingStagesPage />} />
              <Route path="/heritage/traditions/wedding/:id" element={<WeddingStageDetailsPage />} />
              <Route path="/traditions/condolence" element={<CondolenceDetailsPage />} />
              <Route path="/heritage/foods" element={<FoodsPage />} />
              <Route path="/heritage/foods/:id" element={<FoodDetailsPage />} />
              <Route path="/heritage/customs/clothes" element={<ClothesPage />} />
              <Route path="/heritage/customs/clothes/:id" element={<ClothesDetailsPage />} />
              <Route path="/soap-story" element={<SoapStoryHero />} />
              <Route path="/soap-page" element={<SoapPage />} />
              <Route path="/soap-buildings" element={<SoapBuildingsPage />} />
            </Routes>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}