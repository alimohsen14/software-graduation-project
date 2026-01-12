import React, { useEffect, useState, useCallback } from "react";
import {
    FiUsers,
    FiUserCheck,
    FiUserPlus,
    FiActivity,
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle
} from "react-icons/fi";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
    getAnalyticsGlobal,
    getAnalyticsUsersList,
    GlobalAnalytics,
    AnalyticsUser,
    UsersListResponse
} from "../../services/admin.service";

/* ---------- KPI CARD COMPONENT ---------- */

interface KPICardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

const KPICard = ({ title, value, icon, color }: KPICardProps) => (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/10 flex items-center gap-4 transition-all hover:bg-white/10 hover:-translate-y-0.5">
        <div className={`p-4 rounded-xl shadow-sm border ${color.replace("bg-", "bg-opacity-20 bg-").replace("text-", "border-opacity-20 border-")}`}>
            <span className={color.split(" ")[1]}>{icon}</span>
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{title}</p>
            <h3 className="text-2xl font-black text-white mt-1">{value}</h3>
        </div>
    </div>
);

/* ---------- MAIN PAGE COMPONENT ---------- */

export default function AdminAnalyticsPage() {
    const [globalData, setGlobalData] = useState<GlobalAnalytics>({
        totalUsers: 0,
        sellersCount: 0,
        regularUsersCount: 0,
        sellerRatio: 0,
        usersByCountry: [],
        usersByAgeRange: []
    });
    const [usersList, setUsersList] = useState<UsersListResponse>({
        data: [],
        meta: { page: 1, limit: 10, total: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Table Filters State
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("");

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAnalyticsGlobal();
            if (data) {
                setGlobalData({
                    totalUsers: data.totalUsers || 0,
                    sellersCount: data.sellersCount || 0,
                    regularUsersCount: data.regularUsersCount || 0,
                    sellerRatio: data.sellerRatio || 0,
                    usersByCountry: Array.isArray(data.usersByCountry) ? data.usersByCountry : [],
                    usersByAgeRange: Array.isArray(data.usersByAgeRange) ? data.usersByAgeRange : []
                });
            }
        } catch (err: any) {
            console.error("Failed to load global analytics:", err);
            setError(err.response?.data?.message || "Failed to load analytics data.");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        try {
            setTableLoading(true);
            const res = await getAnalyticsUsersList({
                page,
                limit,
                search: searchTerm,
                role: roleFilter,
                country: countryFilter
            });
            setUsersList({
                data: Array.isArray(res?.data) ? res.data : [],
                meta: res?.meta || { page, limit, total: 0 }
            });
        } catch (err) {
            console.error("Failed to load users list:", err);
            setUsersList(prev => ({ ...prev, data: [] }));
        } finally {
            setTableLoading(false);
        }
    }, [page, limit, searchTerm, roleFilter, countryFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-8 space-y-8 animate-pulse">
                    <div className="h-8 w-64 bg-white/5 rounded-lg"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-80 bg-white/5 rounded-2xl border border-white/10"></div>
                        <div className="h-80 bg-white/5 rounded-2xl border border-white/10"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 max-w-lg shadow-2xl">
                        <FiAlertCircle className="text-red-500 text-6xl mb-6 mx-auto" />
                        <h2 className="text-2xl font-black text-white">Analytics Error</h2>
                        <p className="text-white/60 mt-4 px-6">{error}</p>
                        <button
                            onClick={() => fetchData()}
                            className="mt-8 px-10 py-4 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600/30 transition shadow-lg"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Chart Data (Safe Transformation)
    const donutData = [
        { name: "Sellers", value: globalData.sellersCount || 0 },
        { name: "Regular Users", value: globalData.regularUsersCount || 0 }
    ];
    const COLORS = ["#10b981", "#8b5cf6"]; // Emerald and Purple for roles

    const countryData = (Array.isArray(globalData.usersByCountry) ? globalData.usersByCountry : []).map(c => ({
        name: c.country,
        value: c.count
    }));

    const ageData = (Array.isArray(globalData.usersByAgeRange) ? globalData.usersByAgeRange : []).map(a => ({
        range: a.range,
        count: a.count
    }));

    const totalPages = Math.ceil((usersList.meta?.total || 0) / limit);

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Platform Analytics</h1>
                        <p className="text-white/50 mt-1 font-medium">Global user trends and distribution demographics.</p>
                    </div>

                    {/* KPI Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPICard
                            title="Total Users"
                            value={globalData.totalUsers || 0}
                            icon={<FiUsers size={24} />}
                            color="bg-blue-400 text-blue-400"
                        />
                        <KPICard
                            title="Sellers Count"
                            value={globalData.sellersCount || 0}
                            icon={<FiUserCheck size={24} />}
                            color="bg-emerald-400 text-emerald-400"
                        />
                        <KPICard
                            title="Regular Users"
                            value={globalData.regularUsersCount || 0}
                            icon={<FiUserPlus size={24} />}
                            color="bg-purple-400 text-purple-400"
                        />
                        <KPICard
                            title="Seller Ratio"
                            value={`${((globalData.sellerRatio || 0) * 100).toFixed(1)}%`}
                            icon={<FiActivity size={24} />}
                            color="bg-amber-400 text-amber-400"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Donut Chart */}
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                            <h3 className="text-lg font-black text-white mb-6">User Role Distribution</h3>
                            <div className="h-64 flex flex-col items-center justify-center">
                                {donutData.every(d => d.value === 0) ? (
                                    <div className="text-white/20 text-sm italic">No distribution data available</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={donutData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {donutData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.6} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                            <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{value}</span>} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Age Ranges (Bar) */}
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                            <h3 className="text-lg font-black text-white mb-6">Users by Age Range</h3>
                            <div className="h-64 flex flex-col items-center justify-center">
                                {ageData.length === 0 ? (
                                    <div className="text-white/20 text-sm italic">No age data recorded</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ageData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                            <Bar dataKey="count" fill="#10b981" fillOpacity={0.4} radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Country Chart (Bar) */}
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl lg:col-span-2">
                            <h3 className="text-lg font-black text-white mb-6">Users by Country</h3>
                            <div className="h-80 flex flex-col items-center justify-center">
                                {countryData.length === 0 ? (
                                    <div className="text-white/20 text-sm italic">No geographic data available</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={countryData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700 }} />
                                            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                            <Bar dataKey="value" fill="#ffffff" fillOpacity={0.1} radius={[0, 6, 6, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Users Table Section */}
                    <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-xl overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-white/5 bg-white/5">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Platform Users</h3>
                                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-1">Detailed directory for analysis</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    {/* Search */}
                                    <div className="relative group">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search name/email..."
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                            className="pl-12 pr-6 py-3.5 bg-white/5 border border-transparent rounded-2xl text-sm font-medium text-white placeholder:text-white/20 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition w-full sm:w-72"
                                        />
                                    </div>

                                    {/* Role Filter */}
                                    <div className="relative">
                                        <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                                            className="pl-12 pr-10 py-3.5 bg-white/5 border border-transparent rounded-2xl text-sm font-bold text-white/70 focus:bg-white/10 focus:border-emerald-500/30 outline-none appearance-none transition cursor-pointer"
                                        >
                                            <option value="" className="bg-stone-900">All Roles</option>
                                            <option value="user" className="bg-stone-900">USER</option>
                                            <option value="seller" className="bg-stone-900">SELLER</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-white/30 uppercase tracking-widest">User</th>
                                        <th className="px-8 py-5 text-left text-[10px] font-black text-white/30 uppercase tracking-widest">Region</th>
                                        <th className="px-8 py-5 text-center text-[10px] font-black text-white/30 uppercase tracking-widest">Age</th>
                                        <th className="px-8 py-5 text-center text-[10px] font-black text-white/30 uppercase tracking-widest">Role</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-white/30 uppercase tracking-widest">Joined At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Syncing directory...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (Array.isArray(usersList.data) ? usersList.data : []).length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-24 text-center">
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white/10">
                                                    <FiUsers size={32} />
                                                </div>
                                                <p className="text-white/20 text-sm font-medium">No matches in current directory</p>
                                            </td>
                                        </tr>
                                    ) : (Array.isArray(usersList.data) ? usersList.data : []).map((u: any) => (
                                        <tr key={u.id} className="hover:bg-white/5 transition-all group">
                                            <td className="px-8 py-5">
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{u.name}</div>
                                                    <div className="text-[11px] text-white/30 font-medium">{u.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-xs text-white/60 font-medium uppercase tracking-wide">{u.country || "Unknown"}</div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <div className="text-xs text-white/60 font-bold">{u.age || "-"}</div>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase border ${u.role === "SELLER"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                                <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                                    Page <span className="text-white/60">{page}</span> of {totalPages}
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 shadow-sm disabled:opacity-20 hover:text-white hover:border-emerald-500/50 transition-all"
                                    >
                                        <FiChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 shadow-sm disabled:opacity-20 hover:text-white hover:border-emerald-500/50 transition-all"
                                    >
                                        <FiChevronRight size={18} />
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
