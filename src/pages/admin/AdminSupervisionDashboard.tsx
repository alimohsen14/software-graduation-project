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
                    <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md mx-4">
                        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h2 className="text-xl font-black text-gray-900 mb-2">Unavailable</h2>
                        <p className="text-gray-500 mb-8">{overviewError}</p>
                        <button
                            onClick={fetchOverview}
                            className="w-full py-4 bg-[#4A6F5D] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#3d5c4d] transition flex items-center justify-center gap-2"
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
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Supervision Overview</h1>
                    <p className="text-gray-500 font-medium">Platform-wide store analytics</p>
                </div>

                {/* COUNT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <MetricCard
                        title="Total Stores"
                        value={overviewData?.totalStores.toString() || "0"}
                        icon={<FiShoppingBag />}
                        color="bg-blue-50 text-blue-600"
                    />
                    <MetricCard
                        title="Active Stores"
                        value={overviewData?.activeStores.toString() || "0"}
                        icon={<FiCheckCircle />}
                        color="bg-emerald-50 text-emerald-600"
                    />
                    <MetricCard
                        title="Inactive Stores"
                        value={overviewData?.inactiveStores.toString() || "0"}
                        icon={<FiXCircle />}
                        color="bg-red-50 text-red-600"
                    />
                    {/* Top Performing Store Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Top Performing Store</h3>
                        {overviewData?.topStore ? (
                            <div>
                                <p className="font-black text-lg text-gray-900 mb-2 truncate">{overviewData.topStore.storeName}</p>
                                <p className="text-sm font-bold text-[#4A6F5D] mb-1">{overviewData.topStore.revenue.toLocaleString()} ₪</p>
                                <p className="text-xs font-medium text-gray-500">{overviewData.topStore.ordersCount} Orders</p>
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm font-medium italic">No sales data available</p>
                        )}
                    </div>
                </div>

                {/* STORES DIRECTORY SECTION */}
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Stores Directory</h2>

                    {/* Filters Bar */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-5 mb-8 flex flex-col xl:flex-row gap-5 justify-between items-center">
                        <div className="relative w-full xl:max-w-md group">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4A6F5D] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search store, owner name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-[#4A6F5D] focus:ring-4 focus:ring-[#4A6F5D]/5 transition-all outline-none"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                            <div className="relative">
                                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-8 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-gray-700 focus:bg-white focus:border-[#4A6F5D] focus:ring-4 focus:ring-[#4A6F5D]/5 transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">All Categories</option>
                                    {categoryOptions.map(cat => (
                                        <option key={cat} value={cat}>{cat.replace(/_/g, " ")}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex bg-gray-50 border border-transparent rounded-2xl p-1.5 overflow-hidden w-full md:w-auto">
                                {["all", "active", "inactive"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => { setStatusFilter(status); }}
                                        className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${statusFilter === status
                                            ? status === "active" ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                                : status === "inactive" ? "bg-red-600 text-white shadow-md shadow-red-200"
                                                    : "bg-[#4A6F5D] text-white shadow-md shadow-[#4A6F5D]/10"
                                            : "text-gray-400 hover:text-gray-600 hover:bg-white"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Store Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Owner Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Owner Email</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Role (Category)</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-32 text-center text-gray-400">
                                                <FiLoader className="w-10 h-10 animate-spin mx-auto mb-4 text-[#4A6F5D]" />
                                                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Loading Stores...</p>
                                            </td>
                                        </tr>
                                    ) : tableError ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-32 text-center text-red-500">
                                                <FiAlertCircle className="w-10 h-10 mx-auto mb-4" />
                                                <p className="font-bold uppercase tracking-widest text-xs">{tableError}</p>
                                                <button onClick={fetchStores} className="mt-4 text-[#4A6F5D] font-bold underline">Try Again</button>
                                            </td>
                                        </tr>
                                    ) : stores.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-32 text-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-200">
                                                    <FiShoppingBag className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-lg font-black text-gray-900 mb-1">No stores found</h3>
                                                <p className="text-gray-400 text-sm font-medium">Try adjusting your search or filters</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        stores.map((store) => (
                                            <tr
                                                key={store.id}
                                                onClick={() => handleRowClick(store.id)}
                                                className="hover:bg-[#f8faf8] cursor-pointer transition-all group border-l-4 border-l-transparent hover:border-l-[#4A6F5D]"
                                            >
                                                {/* Store Name */}
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#4A6F5D] shrink-0 border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                                            <FiShoppingBag className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-sm font-black text-gray-900 tracking-tight group-hover:text-[#4A6F5D] transition-colors">
                                                            {store.name || "Untitled"}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Owner Name */}
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-gray-600">
                                                        {store.ownerName || "-"}
                                                    </span>
                                                </td>

                                                {/* Owner Email */}
                                                <td className="px-8 py-6">
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        {store.ownerEmail || "-"}
                                                    </span>
                                                </td>

                                                {/* Role (Category) */}
                                                <td className="px-8 py-6">
                                                    <span className="px-2.5 py-1 bg-gray-100 rounded-md text-[10px] font-black uppercase tracking-wider text-gray-500">
                                                        {(store.category || "Uncategorized").replace(/_/g, " ")}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-8 py-6">
                                                    {store.isActive ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100 uppercase tracking-wide">
                                                            <FiCheckCircle className="w-3 h-3" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-black border border-red-100 uppercase tracking-wide">
                                                            <FiXCircle className="w-3 h-3" />
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Created At */}
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-[10px] font-bold text-gray-400">
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
                            <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                    Page <span className="text-gray-900">{page}</span> of {totalPages}
                                </p>
                                <div className="flex items-center gap-4">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="p-3 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-900 hover:border-[#4A6F5D] disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="p-3 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-gray-900 hover:border-[#4A6F5D] disabled:opacity-30 transition-all shadow-sm"
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

function MetricCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm ${color}`}>
                {icon}
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.1em] mb-2">{title}</p>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
        </div>
    );
}
