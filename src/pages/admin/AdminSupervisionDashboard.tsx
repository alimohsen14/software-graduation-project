import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    getOverview,
    getStores,
    SupervisionOverview,
    StoreListItem
} from "../../services/adminStoresSupervision.service";
import {
    FiShoppingBag,
    FiCheckCircle,
    FiXCircle,
    FiLoader,
    FiAlertCircle,
    FiRefreshCw,
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function AdminSupervisionDashboard() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Overview Stats State
    const [overviewData, setOverviewData] = useState<SupervisionOverview | null>(null);
    const [overviewLoading, setOverviewLoading] = useState(true);
    const [overviewError, setOverviewError] = useState<string | null>(null);

    // Stores Table State
    const [stores, setStores] = useState<StoreListItem[]>([]);
    const [tableLoading, setTableLoading] = useState(true);
    const [tableError, setTableError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Note: Category options cannot be populated from overview anymore as per strict backend. 
    // We will collect unique categories from the current page as a fallback or custom logic.
    // For now, we will leave it empty or manual input if needed, but per prompt we must not hardcode.
    // We'll gather unique categories from the loaded `stores` as a best-effort "Dynamic" filter.
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

    const limit = 10;

    // Fetch Overview
    const fetchOverview = async () => {
        setOverviewLoading(true);
        setOverviewError(null);
        try {
            const res = await getOverview();
            setOverviewData(res);
        } catch (err) {
            console.error("Failed to load supervision overview", err);
            setOverviewError("Failed to load dashboard data.");
        } finally {
            setOverviewLoading(false);
        }
    };

    // Fetch Stores List
    const fetchStores = useCallback(async () => {
        setTableLoading(true);
        setTableError(null);
        try {
            const res = await getStores(page, limit, statusFilter, categoryFilter, searchQuery);
            setStores(res.stores);
            setTotalPages(res.totalPages);

            // Extract unique categories from current page for filter
            // Ideally backend provides this or we fetch all, but strictly following "NO new endpoints"
            const cats = Array.from(new Set(res.stores.map(s => s.category).filter(Boolean)));
            if (cats.length > 0) {
                setCategoryOptions(prev => Array.from(new Set([...prev, ...cats])));
            }
        } catch (err) {
            console.error("Failed to fetch stores", err);
            setTableError("Unable to load stores list.");
        } finally {
            setTableLoading(false);
        }
    }, [page, statusFilter, categoryFilter, searchQuery, limit]);

    // Initial Overview Fetch
    useEffect(() => {
        fetchOverview();
    }, []);

    // Debounce Search & Fetch Stores
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchStores();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Filter Changes
    useEffect(() => {
        setPage(1);
        fetchStores();
    }, [statusFilter, categoryFilter]);

    // Page Change
    useEffect(() => {
        if (page > 1) fetchStores();
    }, [page]);


    const handleRowClick = (id: number) => {
        navigate(`/admin/supervision/stores/${id}`);
    };

    // Full Page Loading/Error only if overview fails
    if (overviewLoading && !overviewData) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <FiLoader className="w-10 h-10 text-[#4A6F5D] animate-spin" />
                        <p className="text-gray-500 font-medium">Loading supervision intelligence...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (overviewError && !overviewData) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="text-center p-8 bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 max-w-md mx-4">
                        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-xl font-black text-white mb-2">Unavailable</h2>
                        <p className="text-white/60 mb-8">{overviewError}</p>
                        <button
                            onClick={fetchOverview}
                            className="w-full py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600/30 transition flex items-center justify-center gap-2"
                        >
                            <FiRefreshCw /> Retry
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="py-8 px-4 md:px-0">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tight">Supervision Overview</h1>
                    <p className="text-white/60 font-medium">Platform-wide store analytics</p>
                </div>

                {/* COUNT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <MetricCard
                        title="Total Stores"
                        value={overviewData?.totalStores.toString() || "0"}
                        icon={<FiShoppingBag />}
                        color="text-blue-400"
                        bg="bg-blue-400/10 border-blue-400/20"
                    />
                    <MetricCard
                        title="Active Stores"
                        value={overviewData?.activeStores.toString() || "0"}
                        icon={<FiCheckCircle />}
                        color="text-emerald-400"
                        bg="bg-emerald-400/10 border-emerald-400/20"
                    />
                    <MetricCard
                        title="Inactive Stores"
                        value={overviewData?.inactiveStores.toString() || "0"}
                        icon={<FiXCircle />}
                        color="text-red-400"
                        bg="bg-red-400/10 border-red-400/20"
                    />
                    {/* Top Performing Store Card */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Top Performing Store</h3>
                        {overviewData?.topStore ? (
                            <div>
                                <p className="font-black text-lg text-white mb-2 truncate">{overviewData.topStore.storeName}</p>
                                <p className="text-sm font-bold text-emerald-400 mb-1">{overviewData.topStore.revenue.toLocaleString()} ₪</p>
                                <p className="text-xs font-medium text-white/40">{overviewData.topStore.ordersCount} Orders</p>
                            </div>
                        ) : (
                            <p className="text-white/20 text-sm font-medium italic">No sales data available</p>
                        )}
                    </div>
                </div>

                {/* STORES DIRECTORY SECTION */}
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight mb-6">Stores Directory</h2>

                    {/* Filters Bar */}
                    <div className="bg-white/5 backdrop-blur-md rounded-[2rem] shadow-xl border border-white/10 p-5 mb-8 flex flex-col xl:flex-row gap-5 justify-between items-center">
                        <div className="relative w-full xl:max-w-md group">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search store, owner name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-transparent rounded-2xl text-sm font-medium text-white placeholder:text-white/20 focus:bg-white/10 focus:border-emerald-500/30 transition-all outline-none"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                            <div className="relative">
                                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-8 py-4 bg-white/5 border border-transparent rounded-2xl text-sm font-bold text-white/70 focus:bg-white/10 focus:border-emerald-500/30 transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-stone-900">All Categories</option>
                                    {categoryOptions.map(cat => (
                                        <option key={cat} value={cat} className="bg-stone-900">{cat.replace(/_/g, " ")}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex bg-white/5 border border-white/5 rounded-2xl p-1.5 overflow-hidden w-full md:w-auto">
                                {["all", "active", "inactive"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => { setStatusFilter(status); }}
                                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${statusFilter === status
                                            ? status === "active" ? "bg-emerald-600/40 text-white shadow-lg shadow-emerald-900/20"
                                                : status === "inactive" ? "bg-red-600/40 text-white shadow-lg shadow-red-900/20"
                                                    : "bg-white/20 text-white shadow-lg shadow-black/20"
                                            : "text-white/40 hover:text-white/70 hover:bg-white/10"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white/5 backdrop-blur-md rounded-[2rem] shadow-xl border border-white/10 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Store Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Owner Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Owner Email</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Role (Category)</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-32 text-center text-white/40">
                                                <FiLoader className="w-10 h-10 animate-spin mx-auto mb-4 text-emerald-500" />
                                                <p className="font-bold uppercase tracking-widest text-xs">Loading Stores...</p>
                                            </td>
                                        </tr>
                                    ) : tableError ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-32 text-center text-red-400">
                                                <FiAlertCircle className="w-10 h-10 mx-auto mb-4" />
                                                <p className="font-bold uppercase tracking-widest text-xs">{tableError}</p>
                                                <button onClick={fetchStores} className="mt-4 text-emerald-400 font-bold underline">Try Again</button>
                                            </td>
                                        </tr>
                                    ) : stores.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-32 text-center">
                                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white/10">
                                                    <FiShoppingBag className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-lg font-black text-white mb-1">No stores found</h3>
                                                <p className="text-white/30 text-sm font-medium">Try adjusting your search or filters</p>
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
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 shrink-0 border border-white/10 group-hover:bg-white/10 transition-all">
                                                            <FiShoppingBag className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-sm font-black text-white/90 tracking-tight group-hover:text-emerald-400 transition-colors">
                                                            {store.name || "Untitled"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Owner Name */}
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-white/70">
                                                        {store.ownerName || "-"}
                                                    </span>
                                                </td>

                                                {/* Owner Email */}
                                                <td className="px-8 py-6">
                                                    <span className="text-xs text-white/40 font-medium">
                                                        {store.ownerEmail || "-"}
                                                    </span>
                                                </td>

                                                {/* Role (Category) */}
                                                <td className="px-8 py-6">
                                                    <span className="px-2.5 py-1 bg-white/10 rounded-md text-[10px] font-black uppercase tracking-wider text-white/50">
                                                        {(store.category || "Uncategorized").replace(/_/g, " ")}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-8 py-6">
                                                    {store.isActive ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20 uppercase tracking-wide">
                                                            <FiCheckCircle className="w-3 h-3" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-black border border-red-500/20 uppercase tracking-wide">
                                                            <FiXCircle className="w-3 h-3" />
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Created At */}
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-[10px] font-bold text-white/30">
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
                        {!tableLoading && totalPages > 1 && (
                            <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                                    Page <span className="text-white/60">{page}</span> of {totalPages}
                                </p>
                                <div className="flex items-center gap-4">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="p-3 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-emerald-500/50 disabled:opacity-20 transition-all shadow-sm"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="p-3 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-white hover:border-emerald-500/50 disabled:opacity-20 transition-all shadow-sm"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function MetricCard({ title, value, icon, color, bg }: { title: string; value: string; icon: React.ReactNode; color: string; bg?: string }) {
    return (
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] shadow-xl border border-white/10 transition-all hover:shadow-2xl hover:bg-white/10 hover:-translate-y-1">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm border ${bg || "bg-white/5 border-white/10"}`}>
                <span className={color}>{icon}</span>
            </div>
            <p className="text-xs font-black text-white/30 uppercase tracking-[0.1em] mb-2">{title}</p>
            <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        </div>
    );
}
