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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A6F5D]"></div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <FiAlertTriangle className="text-red-500 text-5xl mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Error</h2>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#4A6F5D] text-white rounded-lg hover:bg-[#3d5c4d] transition"
        >
          Retry Loading
        </button>
      </div>
    </DashboardLayout>
  );

  if (!user || !user.isAdmin || !store) return null;

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <SellerStoreHeader
            store={store}
            productCount={stats.products}
            onAddProduct={() => navigate("/admin/products")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Settings"
              subtitle="Manage Store Info"
              icon={<FiSettings />}
              onClick={() => navigate("/admin/store")}
              variant="purple"
            />

            <DashboardCard
              title={String(stats.products)}
              subtitle="Active Products"
              icon={<FiPackage />}
              onClick={() => navigate("/admin/products")}
              variant="green"
            />

            <DashboardCard
              title={String(stats.orders)}
              subtitle="Pending Orders"
              icon={<FiShoppingBag />}
              onClick={() => navigate("/admin/orders")}
              variant="blue"
            />

            <DashboardCard
              title={String(stats.alerts)}
              subtitle="Low Stock Alerts"
              icon={<FiAlertTriangle />}
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
  purple: "bg-purple-50 text-purple-600",
  green: "bg-green-50 text-green-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
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
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${VARIANT_STYLES[variant]}`}>
          {icon}
        </div>
        <FiArrowRight className="text-gray-300 group-hover:text-gray-700 transition" />
      </div>
      <h3 className="text-2xl font-bold text-[#1f2933]">{title}</h3>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}
