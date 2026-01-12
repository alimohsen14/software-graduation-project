import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SellerStoreHeader from "../../components/seller/SellerStoreHeader";
import {
  FiPackage,
  FiShoppingBag,
  FiAlertTriangle,
  FiArrowRight,
  FiSettings,
} from "react-icons/fi";

import {
  getStore,
  getProducts,
  getOrders,
  getStockAlerts,
} from "../../services/admin.service";
import { SellerStore } from "../../services/seller.service";

import { useAuth } from "../../context/AuthContext";

export default function AdminMarketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [store, setStore] = useState<SellerStore | null>(null);
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    alerts: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;

    if (!user || !user.isAdmin) {
      navigate("/profile", {
        replace: true,
        state: { error: "Access denied. Admin account required." },
      });
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        // 2. GET /admin/store
        const storeData = await getStore();
        setStore(storeData);

        // 3. GET /admin/store/products
        const products = await getProducts();

        // 4. GET /admin/store/orders
        const orders = await getOrders();

        // 5. GET /admin/store/products/stock-alerts
        const alerts = await getStockAlerts();

        // Calculate pending items count
        const pendingItemsCount = orders.orders.reduce((acc: number, order: any) => {
          return acc + order.items.filter((item: any) => item.status === "PENDING_APPROVAL").length;
        }, 0);

        setStats({
          products: products.length,
          orders: pendingItemsCount,
          alerts: alerts.length,
        });
      } catch (err: any) {
        console.error("Admin dashboard load failed:", err);
        setError(err.response?.data?.message || "Failed to load Official Store data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user, navigate]);

  if (user === undefined || loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-12 max-w-lg shadow-2xl">
          <FiAlertTriangle className="text-red-500 text-6xl mb-6 mx-auto" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Dashboard Error</h2>
          <p className="text-white/60 mb-8 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600/30 transition shadow-lg"
          >
            Retry Loading
          </button>
        </div>
      </div>
    </DashboardLayout>
  );

  if (!user || !user.isAdmin || !store) return null;

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          <SellerStoreHeader
            store={store}
            productCount={stats.products}
            onAddProduct={() => navigate("/admin/products")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <DashboardCard
              title="Settings"
              subtitle="MANAGE STORE INFO"
              icon={<FiSettings size={22} />}
              onClick={() => navigate("/admin/store")}
              variant="purple"
            />

            <DashboardCard
              title={String(stats.products)}
              subtitle="ACTIVE PRODUCTS"
              icon={<FiPackage size={22} />}
              onClick={() => navigate("/admin/products")}
              variant="green"
            />

            <DashboardCard
              title={String(stats.orders)}
              subtitle="PENDING ORDERS"
              icon={<FiShoppingBag size={22} />}
              onClick={() => navigate("/admin/orders")}
              variant="blue"
            />

            <DashboardCard
              title={String(stats.alerts)}
              subtitle="LOW STOCK ALERTS"
              icon={<FiAlertTriangle size={22} />}
              onClick={() => navigate("/admin/stock-alerts")}
              variant="amber"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ---------- CARD COMPONENT ---------- */

type CardVariant = "purple" | "green" | "blue" | "amber";

const VARIANT_STYLES: Record<CardVariant, string> = {
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/20",
  green: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  amber: "bg-amber-500/20 text-amber-400 border-amber-500/20",
};

function DashboardCard({
  title,
  subtitle,
  icon,
  onClick,
  variant,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: CardVariant;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300 group relative overflow-hidden shadow-xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div className={`p-4 rounded-2xl border ${VARIANT_STYLES[variant]} shadow-inner`}>
          {icon}
        </div>
        <FiArrowRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
      <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">{title}</h3>
      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{subtitle}</p>

      {/* Decorative gradient blur */}
      <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${VARIANT_STYLES[variant].split(' ')[0]}`}></div>
    </div>
  );
}
