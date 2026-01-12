import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStores, StoreListItem } from "../../services/adminStoresSupervision.service";
import {
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
    FiShoppingBag,
    FiCheckCircle,
    FiXCircle,
    FiLoader,
    FiAlertCircle,
    FiRefreshCw,
    FiFilter
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function AdminStoresListPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [stores, setStores] = useState<StoreListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Category Options
    // Note: Cannot fetch from overview as per strict backend. 
    // Gathering from loaded stores as best-effort.
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

    const limit = 10;

    const fetchStores = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getStores(page, limit, statusFilter, categoryFilter, searchQuery);
            setStores(res.stores);
            setTotalPages(res.totalPages);

            // Populate unique categories for filter from current page
            const cats = Array.from(new Set(res.stores.map(s => s.category).filter(Boolean)));
            if (cats.length > 0) {
                setCategoryOptions(prev => Array.from(new Set([...prev, ...cats])));
            }
        } catch (err) {
            console.error("Failed to fetch stores", err);
            setError("Unable to load stores at this time.");
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, categoryFilter, searchQuery, limit]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchStores();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Trigger fetch on filter change
    useEffect(() => {
        setPage(1);
        fetchStores();
    }, [statusFilter, categoryFilter]);

    // Trigger on page change (skip if caused by filters which reset to 1)
    useEffect(() => {
        if (page > 1) fetchStores();
    }, [page]);

    const handleRowClick = (id: number) => {
        navigate(`/admin/supervision/stores/${id}`);
    };

    if (error && stores.length === 0) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="text-center p-12 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 max-w-md mx-4 shadow-2xl">
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <FiAlertCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-3">Sync Error</h2>
                        <p className="text-white/50 mb-10 leading-relaxed font-medium">{error}</p>
                        <button
                            onClick={fetchStores}
                            className="w-full py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600/30 transition shadow-lg flex items-center justify-center gap-3"
                        >
                            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
                            Retry Sync
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="py-10 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Stores Directory</h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Manage all platform shops and vendor relations</p>
                </div>

                {/* Filters Bar */}
                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6 mb-10 flex flex-col xl:flex-row gap-6 justify-between items-center shadow-xl">
                    <div className="relative w-full xl:max-w-md group">
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search store, owner name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white/5 border border-transparent rounded-[1.5rem] text-sm font-medium text-white placeholder:text-white/20 focus:bg-white/10 focus:border-emerald-500/30 transition-all outline-none"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                        <div className="relative">
                            <FiFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full md:w-64 pl-14 pr-10 py-4 bg-white/5 border border-transparent rounded-[1.5rem] text-sm font-bold text-white/70 focus:bg-white/10 focus:border-emerald-500/30 transition-all outline-none appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-stone-900">All Categories</option>
                                {categoryOptions.map(cat => (
                                    <option key={cat} value={cat} className="bg-stone-900">{cat.replace(/_/g, " ")}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex bg-white/5 border border-white/5 rounded-[1.5rem] p-1.5 overflow-hidden w-full md:w-auto">
                            {["all", "active", "inactive"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => { setStatusFilter(status); }}
                                    className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status
                                        ? status === "active" ? "bg-emerald-500/20 text-emerald-400 shadow-lg border border-emerald-500/30"
                                            : status === "inactive" ? "bg-red-500/20 text-red-400 shadow-lg border border-red-500/30"
                                                : "bg-white/10 text-white shadow-lg border border-white/20"
                                        : "text-white/20 hover:text-white/40 hover:bg-white/5"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Store Name</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Owner Info</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Role (Category)</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                                                <p className="font-black text-white/20 uppercase tracking-widest text-[10px]">Syncing Directory...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : stores.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-white/5">
                                                <FiShoppingBag size={40} />
                                            </div>
                                            <h3 className="text-xl font-black text-white/40 mb-2 uppercase tracking-tight">No stores found</h3>
                                            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Adjust filters to find matches</p>
                                        </td>
                                    </tr>
                                ) : (
                                    stores.map((store) => (
                                        <tr
                                            key={store.id}
                                            onClick={() => handleRowClick(store.id)}
                                            className="hover:bg-white/5 cursor-pointer transition-all group border-l-4 border-l-transparent hover:border-l-emerald-500"
                                        >
                                            {/* Store Name */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-400 shrink-0 border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all shadow-inner">
                                                        <FiShoppingBag size={20} />
                                                    </div>
                                                    <span className="text-sm font-black text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors">
                                                        {store.name || "Untitled"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Owner Info */}
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-white/70 mb-0.5">
                                                        {store.ownerName || "-"}
                                                    </span>
                                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                                        {store.ownerEmail || "-"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Role (Category) */}
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors">
                                                    {(store.category || "Uncategorized").replace(/_/g, " ")}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-8 py-6">
                                                {store.isActive ? (
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-[9px] font-black border border-emerald-500/20 uppercase tracking-widest">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 text-[9px] font-black border border-red-500/20 uppercase tracking-widest">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>

                                            {/* Created At */}
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                    {new Date(store.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer / Pagination */}
                    {!loading && totalPages > 1 && (
                        <div className="px-8 py-8 bg-white/5 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                                Page <span className="text-white/60">{page}</span> of {totalPages}
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-4 rounded-2xl border border-white/10 bg-white/5 text-white/30 hover:text-white hover:border-emerald-500/50 disabled:opacity-20 transition-all shadow-xl"
                                >
                                    <FiChevronLeft size={20} />
                                </button>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-4 rounded-2xl border border-white/10 bg-white/5 text-white/30 hover:text-white hover:border-emerald-500/50 disabled:opacity-20 transition-all shadow-xl"
                                >
                                    <FiChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
