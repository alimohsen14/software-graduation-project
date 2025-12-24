import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SIgnupPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { GoogleRedirectHandler } from "./pages/GoogleRedirectHandler";
import PalestineAIPage from "./pages/PalestineAIPage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Sop3DPage from "./pages/Soap3DPage";
import AdminMarketPage from "./pages/admin/AdminMarketPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import UserOrderDetailsPage from "./pages/UserOrderDetailsPage";
import MarketplacePage from "./pages/MarketplacePage";
import StorePage from "./pages/StorePage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/google-redirect" element={<GoogleRedirectHandler />} />
          <Route path="/palestine-ai" element={<PalestineAIPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/product/:id" element={<ProductDetailsPage />} />
          <Route path="/soap3d" element={<Sop3DPage />} />
          <Route path="/admin/market" element={<AdminMarketPage />} />
          <Route path="/orders" element={<UserOrdersPage />} />
          <Route path="/orders/:id" element={<UserOrderDetailsPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/product/:id" element={<ProductDetailsPage />} />
          <Route path="/store/:id" element={<StorePage />} />
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          <Route path="/seller" element={<SellerDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}


