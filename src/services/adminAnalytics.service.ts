import api from "../lib/api";

export interface GlobalMetrics {
    totalRevenue: number;
    totalOrders: number;
    totalSales: number;
    averageOrderValue: number;
}

export interface RevenueTrend {
    date: string;
    revenue: number;
    orders: number;
}

export interface CategoryMetric {
    category: string;
    revenue: number;
    salesCount: number;
    activeStores: number;
}

export const getGlobalAnalytics = async (): Promise<GlobalMetrics> => {
    const res = await api.get<GlobalMetrics>("/admin/analytics/global");
    return {
        totalRevenue: res.data?.totalRevenue ?? 0,
        totalOrders: res.data?.totalOrders ?? 0,
        totalSales: res.data?.totalSales ?? 0,
        averageOrderValue: res.data?.averageOrderValue ?? 0,
    };
};

export const getRevenueTrends = async (granularity: "daily" | "monthly" = "daily"): Promise<RevenueTrend[]> => {
    const res = await api.get<RevenueTrend[]>(`/admin/analytics/trends?granularity=${granularity}`);
    return (res.data ?? []).map((trend) => ({
        date: trend.date ?? "-",
        revenue: trend.revenue ?? 0,
        orders: trend.orders ?? 0,
    }));
};

export const getCategoryAnalytics = async (): Promise<CategoryMetric[]> => {
    const res = await api.get<CategoryMetric[]>("/admin/analytics/categories");
    return (res.data ?? []).map((cat) => ({
        category: cat.category ?? "-",
        revenue: cat.revenue ?? 0,
        salesCount: cat.salesCount ?? 0,
        activeStores: cat.activeStores ?? 0,
    }));
};
