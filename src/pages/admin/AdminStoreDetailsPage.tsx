import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStoreDetails, StrictStoreDetails, activateStore } from "../../services/adminStoresSupervision.service";
import DeactivateStoreModal from "../../components/admin/DeactivateStoreModal";
import SendWarningModal from "../../components/admin/SendWarningModal";
import { toast } from "react-toastify";
import {
    FiArrowLeft,
    FiCheckCircle,
    FiXCircle,
    FiShoppingBag,
    FiTrendingUp,
    FiAward,
    FiPackage,
    FiLoader,
    FiAlertCircle,
    FiRefreshCw,
    FiAlertTriangle,
    FiPower
} from "react-icons/fi";

export default function AdminStoreDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Use Safe State Defaults
    const [store, setStore] = useState<StrictStoreDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modals State
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

    // Action Loading States
    const [activating, setActivating] = useState(false);

    const fetchStore = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getStoreDetails(id);
            if (!data) {
                setError("Store not found or access denied.");
            } else {
                setStore(data);
            }
        } catch (err) {
            console.error("Failed to load store details", err);
            setError("Failed to load store information.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchStore();
    }, [fetchStore]);

    const handleDeactivateSuccess = (reason: string) => {
        if (store) {
            setStore({ ...store, isActive: false });
        }
    };

    const handleActivateStore = async () => {
        if (!store) return;
        if (!window.confirm("Are you sure you want to activate this store? The products will be visible in the marketplace again.")) return;

        setActivating(true);
        try {
            await activateStore(store.id);
            setStore({ ...store, isActive: true });
            toast.success("Store activated successfully");
        } catch (error) {
            console.error("Failed to activate store", error);
            toast.error("Failed to activate store");
        } finally {
            setActivating(false);
        }
    };

    if (loading && !store) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <FiLoader className="w-10 h-10 text-[#4A6F5D] animate-spin" />
                        <p className="text-gray-500 font-medium">Loading store details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !store) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md mx-4">
                        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-xl font-black text-gray-900 mb-2">Unavailable</h2>
                        <p className="text-gray-500 mb-8">{error || "Store data not available"}</p>
                        <button
                            onClick={fetchStore}
                            className="w-full py-4 bg-[#4A6F5D] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#3d5c4d] transition flex items-center justify-center gap-2"
                        >
                            <FiRefreshCw /> Retry
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Safely access properties with contract enforcement
    const { name, isActive, bestSeller, monthlySales, products, orders } = store;

    return (
        <DashboardLayout>
            <div className="py-8 px-4 md:px-0">
                <button
                    onClick={() => navigate("/admin/supervision")}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#4A6F5D] font-black text-[10px] uppercase tracking-[0.2em] mb-8 transition group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </button>

                {/* 1. Header: Store Name & Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">{name}</h1>
                        <div className="flex items-center gap-3">
                            {isActive ? (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100">
                                    <FiCheckCircle size={14} /> Active Store
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100">
                                    <FiXCircle size={14} /> Inactive Store
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isActive ? (
                            <>
                                <button
                                    onClick={() => setIsWarningModalOpen(true)}
                                    className="px-6 py-3 bg-amber-50 text-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-100 transition border border-amber-100 flex items-center gap-2"
                                >
                                    <FiAlertTriangle /> Send Warning
                                </button>
                                <button
                                    onClick={() => setIsDeactivateModalOpen(true)}
                                    className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition border border-red-100 flex items-center gap-2"
                                >
                                    <FiPower /> Deactivate Store
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleActivateStore}
                                disabled={activating}
                                className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-70"
                            >
                                {activating ? <FiLoader className="animate-spin" /> : <><FiPower /> Activate Store</>}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* 2. Best Seller Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <FiAward size={100} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-6 flex items-center gap-2">
                            <FiAward /> Best Selling Product
                        </h3>
                        {bestSeller ? (
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black mb-2 leading-tight">{bestSeller.name}</h2>
                                <p className="text-gray-400 font-medium text-sm">Sold {bestSeller.soldCount} times</p>
                            </div>
                        ) : (
                            <div className="py-8 text-gray-500 font-bold italic text-sm">
                                "No sales yet"
                            </div>
                        )}
                    </div>

                    {/* 3. Monthly Sales Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 text-gray-50 opacity-50">
                            <FiTrendingUp size={100} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4A6F5D] mb-8 flex items-center gap-2">
                            <FiTrendingUp /> Monthly Performance
                        </h3>
                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Items Sold</p>
                                <p className="text-3xl font-black text-gray-900">{monthlySales.soldCount}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Revenue</p>
                                <p className="text-3xl font-black text-gray-900">{monthlySales.revenue.toLocaleString()}₪</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Products List */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <FiPackage className="text-gray-400" /> Store Inventory
                        </h2>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
                            {products.length} Items
                        </span>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        {products.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <FiPackage size={24} />
                                </div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No products listed</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Name</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.map((p: any) => (
                                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-gray-700">{p.name || "Unknown Product"}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-bold text-gray-900">{Number(p.price || 0).toFixed(2)}₪</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{p.stock ?? 0}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Orders List */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <FiShoppingBag className="text-gray-400" /> Recent Orders
                        </h2>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
                            {orders.length} Orders
                        </span>
                    </div>

                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        {orders.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <FiShoppingBag size={24} />
                                </div>
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No orders found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.map((order: any) => (
                                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-black text-gray-900">#{order.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wide">
                                                        {order.status || "PENDING"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-bold text-[#4A6F5D]">{(order.totalPrice ?? 0).toFixed(2)} ₪</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-xs font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {store && (
                    <>
                        <DeactivateStoreModal
                            isOpen={isDeactivateModalOpen}
                            onClose={() => setIsDeactivateModalOpen(false)}
                            onSuccess={handleDeactivateSuccess}
                            storeId={Number(store.id)}
                            storeName={store.name}
                        />
                        <SendWarningModal
                            isOpen={isWarningModalOpen}
                            onClose={() => setIsWarningModalOpen(false)}
                            onSuccess={() => { }} // No state change needed for warning
                            storeId={String(store.id)}
                        />
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
