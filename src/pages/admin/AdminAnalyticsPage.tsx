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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-4 rounded-xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-extrabold text-[#1F2933] mt-1">{value}</h3>
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
                    <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="h-80 bg-white rounded-2xl shadow-sm"></div>
                        <div className="h-80 bg-white rounded-2xl shadow-sm"></div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <FiAlertCircle className="text-red-500 text-6xl mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Analytics Error</h2>
                    <p className="text-gray-600 mt-2">{error}</p>
                    <button
                        onClick={() => fetchData()}
                        className="mt-6 px-6 py-2 bg-[#4A6F5D] text-white rounded-lg hover:bg-[#3d5c4d] transition"
                    >
                        Retry
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // Chart Data (Safe Transformation)
    const donutData = [
        { name: "Sellers", value: globalData.sellersCount || 0 },
        { name: "Regular Users", value: globalData.regularUsersCount || 0 }
    ];
    const COLORS = ["#4A6F5D", "#A3B18A"];

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
                        <h1 className="text-3xl font-extrabold text-[#1F2933]">Platform Analytics</h1>
                        <p className="text-gray-500 mt-1">Global user trends and distribution demographics.</p>
                    </div>

                    {/* KPI Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPICard
                            title="Total Users"
                            value={globalData.totalUsers || 0}
                            icon={<FiUsers size={24} />}
                            color="bg-blue-50 text-blue-600"
                        />
                        <KPICard
                            title="Sellers Count"
                            value={globalData.sellersCount || 0}
                            icon={<FiUserCheck size={24} />}
                            color="bg-emerald-50 text-emerald-600"
                        />
                        <KPICard
                            title="Regular Users"
                            value={globalData.regularUsersCount || 0}
                            icon={<FiUserPlus size={24} />}
                            color="bg-purple-50 text-purple-600"
                        />
                        <KPICard
                            title="Seller Ratio"
                            value={`${((globalData.sellerRatio || 0) * 100).toFixed(1)}%`}
                            icon={<FiActivity size={24} />}
                            color="bg-amber-50 text-amber-600"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Donut Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">User Role Distribution</h3>
                            <div className="h-64 flex flex-col items-center justify-center">
                                {donutData.every(d => d.value === 0) ? (
                                    <div className="text-gray-400 text-sm">No distribution data available</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={donutData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {donutData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Age Ranges (Bar) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Users by Age Range</h3>
                            <div className="h-64 flex flex-col items-center justify-center">
                                {ageData.length === 0 ? (
                                    <div className="text-gray-400 text-sm">No age data recorded</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ageData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                            <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                            <Tooltip cursor={{ fill: '#F9FAFB' }} />
                                            <Bar dataKey="count" fill="#4A6F5D" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Country Chart (Bar) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Users by Country</h3>
                            <div className="h-80 flex flex-col items-center justify-center">
                                {countryData.length === 0 ? (
                                    <div className="text-gray-400 text-sm">No geographic data available</div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={countryData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }} />
                                            <Tooltip cursor={{ fill: '#F9FAFB' }} />
                                            <Bar dataKey="value" fill="#6B7280" radius={[0, 6, 6, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Users Table Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-gray-50 bg-gray-50/30">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Platform Users</h3>
                                    <p className="text-gray-500 text-sm mt-1">Detailed directory for analysis.</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    {/* Search */}
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search name/email..."
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A6F5D] outline-none transition w-full sm:w-64"
                                        />
                                    </div>

                                    {/* Role Filter */}
                                    <div className="relative">
                                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                                            className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A6F5D] outline-none appearance-none transition"
                                        >
                                            <option value="">All Roles</option>
                                            <option value="user">USER</option>
                                            <option value="seller">SELLER</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Region</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Age</th>
                                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Joined At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading user rows...</td>
                                        </tr>
                                    ) : (Array.isArray(usersList.data) ? usersList.data : []).length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found match the criteria.</td>
                                        </tr>
                                    ) : (Array.isArray(usersList.data) ? usersList.data : []).map((u: any) => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-bold text-gray-800">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 font-medium">{u.country || "Unknown"}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-sm text-gray-600">{u.age || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${u.role === "SELLER"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="text-xs text-gray-400 font-medium">
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
                            <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                                <div className="text-xs text-gray-400 font-medium">
                                    Showing {(Array.isArray(usersList.data) ? usersList.data : []).length} of {usersList.meta?.total || 0} users
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition"
                                    >
                                        <FiChevronLeft size={16} />
                                    </button>
                                    <span className="text-sm font-bold text-gray-600 px-2">{page} / {totalPages}</span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition"
                                    >
                                        <FiChevronRight size={16} />
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
