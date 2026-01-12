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
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-white/30 font-black uppercase tracking-widest text-[10px]">Syncing store details...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !store) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center p-12 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 max-w-md mx-4 shadow-2xl">
                        <FiAlertCircle className="w-20 h-20 text-red-500 mx-auto mb-8 opacity-50" />
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Unavailable</h2>
                        <p className="text-white/50 mb-10 leading-relaxed font-medium">{error || "Store data not available"}</p>
                        <button
                            onClick={fetchStore}
                            className="w-full py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600/30 transition shadow-lg flex items-center justify-center gap-3"
                        >
                            <FiRefreshCw size={18} /> Retry
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
            <div className="py-10 px-6 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate("/admin/supervision")}
                    className="flex items-center gap-3 text-white/30 hover:text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] mb-10 transition group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Directory
                </button>

                {/* 1. Header: Store Name & Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">{name}</h1>
                        <div className="flex items-center gap-4">
                            {isActive ? (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    Active Platform Member
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                    Restricted Access
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isActive ? (
                            <>
                                <button
                                    onClick={() => setIsWarningModalOpen(true)}
                                    className="px-8 py-4 bg-amber-500/10 text-amber-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-amber-500/20 transition border border-amber-500/20 flex items-center gap-2 shadow-lg"
                                >
                                    <FiAlertTriangle size={16} /> Send Warning
                                </button>
                                <button
                                    onClick={() => setIsDeactivateModalOpen(true)}
                                    className="px-8 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition border border-red-500/20 flex items-center gap-2 shadow-lg"
                                >
                                    <FiPower size={16} /> Deactivate Store
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleActivateStore}
                                disabled={activating}
                                className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition shadow-xl shadow-emerald-500/20 flex items-center gap-3 disabled:opacity-70"
                            >
                                {activating ? <FiLoader className="animate-spin" size={16} /> : <><FiPower size={16} /> Activate Store</>}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* 2. Best Seller Card */}
                    <div className="bg-stone-900/40 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden shadow-2xl group">
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <FiAward size={240} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-8 flex items-center gap-3">
                            <FiAward size={16} /> Top Performance
                        </h3>
                        {bestSeller ? (
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-white mb-3 tracking-tight uppercase leading-none">{bestSeller.name}</h2>
                                <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest bg-white/5 py-1 px-3 rounded-lg w-fit">
                                    Sold {bestSeller.soldCount} units
                                </p>
                            </div>
                        ) : (
                            <div className="py-12 text-white/10 font-black uppercase tracking-widest text-sm italic">
                                NO SALES DATA RECORDED
                            </div>
                        )}
                    </div>

                    {/* 3. Monthly Sales Card */}
                    <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden shadow-2xl group">
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <FiTrendingUp size={240} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-10 flex items-center gap-3">
                            <FiTrendingUp size={16} /> 30-Day Velocity
                        </h3>
                        <div className="grid grid-cols-2 gap-10 relative z-10">
                            <div>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-3">Item Count</p>
                                <p className="text-4xl font-black text-white tracking-tighter">{monthlySales.soldCount}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-3">Total Revenue</p>
                                <p className="text-4xl font-black text-white tracking-tighter">{monthlySales.revenue.toLocaleString()}₪</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Products List */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4 uppercase">
                            <FiPackage className="text-white/20" size={24} /> Store Inventory
                        </h2>
                        <span className="text-[10px] font-black text-white/40 bg-white/5 px-4 py-2 rounded-xl border border-white/5 tracking-widest uppercase">
                            {products.length} catalog items
                        </span>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                        {products.length === 0 ? (
                            <div className="py-24 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white/5 border border-white/5 shadow-inner">
                                    <FiPackage size={32} />
                                </div>
                                <p className="text-white/20 font-black text-[10px] uppercase tracking-widest">No products in this catalog</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 border-b border-white/5">
                                        <tr>
                                            <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Product Information</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Unit Price</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Stock Level</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {products.map((p: any) => (
                                            <tr key={p.id} className="hover:bg-white/5 transition-all group">
                                                <td className="px-10 py-5">
                                                    <span className="text-sm font-black text-white/80 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{p.name || "Unknown Product"}</span>
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <span className="text-sm font-bold text-white/60 tracking-tight">{Number(p.price || 0).toFixed(2)}₪</span>
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${p.stock > 10
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                        }`}>
                                                        {p.stock ?? 0} units
                                                    </span>
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
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8 px-4">
                        <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4 uppercase">
                            <FiShoppingBag className="text-white/20" size={24} /> Recent Transactions
                        </h2>
                        <span className="text-[10px] font-black text-white/40 bg-white/5 px-4 py-2 rounded-xl border border-white/5 tracking-widest uppercase">
                            {orders.length} platform orders
                        </span>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                        {orders.length === 0 ? (
                            <div className="py-24 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white/5 border border-white/5 shadow-inner">
                                    <FiShoppingBag size={32} />
                                </div>
                                <p className="text-white/20 font-black text-[10px] uppercase tracking-widest">Transaction history is empty</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 border-b border-white/5">
                                        <tr>
                                            <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Order Identifier</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">Current Status</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Transaction Total</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest text-right">Fulfillment Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {orders.map((order: any) => (
                                            <tr key={order.id} className="hover:bg-white/5 transition-all group">
                                                <td className="px-10 py-5">
                                                    <span className="text-xs font-black text-white/40 group-hover:text-white transition-colors tracking-widest">#{order.id}</span>
                                                </td>
                                                <td className="px-10 py-5">
                                                    <span className="px-3 py-1.5 rounded-xl bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-widest border border-white/5 group-hover:bg-white/10 transition-colors">
                                                        {order.status || "PENDING"}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <span className="text-sm font-black text-emerald-400 tracking-tight">{(order.totalPrice ?? 0).toFixed(2)} ₪</span>
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
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
