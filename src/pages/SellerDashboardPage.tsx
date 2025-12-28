import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
    getMyStore,
    getMyProducts,
    getMyOrders,
    getStockAlerts,
    SellerStore,
} from "../services/seller.service";
import SellerStoreHeader from "../components/seller/SellerStoreHeader";
import { FiPackage, FiShoppingBag, FiAlertCircle, FiAlertTriangle, FiArrowRight, FiSettings } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
// ... imports

export default function SellerDashboardPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({ products: 0, orders: 0, alerts: 0 });
    const [loadingStats, setLoadingStats] = useState(true);
    const [dashboardStore, setDashboardStore] = useState<any>(user?.store);

    useEffect(() => {
        if (user?.store) {
            setDashboardStore(user.store);
        }
    }, [user?.store]);

    // Get store from global auth as initial
    const store = dashboardStore;

    useEffect(() => {
        const fetchStats = async () => {
            if (!store) {
                setLoadingStats(false);
                return;
            }

            const token = localStorage.getItem("accessToken");
            if (!token) return;

            try {
                // Fetch store explicitly to ensure we have the logo (profile might omit it)
                const storeData = await getMyStore();
                if (storeData) {
                    setDashboardStore((prev: any) => ({
                        ...prev,
                        ...storeData,
                        id: storeData.id,
                        name: storeData.name,
                        logo: storeData.logo
                    }));
                }

                const [productsData, ordersResponse, alertsData] = await Promise.all([
                    getMyProducts(),
                    getMyOrders(),
                    getStockAlerts()
                ]);
                setStats({
                    products: productsData.length,
                    orders: ordersResponse.totalOrders ?? 0,
                    alerts: alertsData.length
                });
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoadingStats(false);
            }
        };

        if (!authLoading) {
            fetchStats();
        }
    }, [authLoading, store]);

    // Strictly check for approved Seller status
    const isApprovedSeller = store?.type === 'SELLER';

    useEffect(() => {
        if (!authLoading && !isApprovedSeller) {
            // Redirect if not an approved seller
            // Option: Redirect to profile OR show restricted access
            navigate('/profile', { state: { error: "You must be an approved seller to access the dashboard." } });
        }
    }, [authLoading, isApprovedSeller, navigate]);

    if (authLoading || !store) { // Wait for auth or if store is null (will redirect)
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    // Double check to prevent render flash before redirect
    if (!isApprovedSeller) return null;

    // Remaining logic for stats...

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                <div className="max-w-7xl mx-auto space-y-8">
                    <SellerStoreHeader
                        store={store}
                        productCount={stats.products}
                        onAddProduct={() => navigate("/seller/products")}
                    />

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Store Settings Card */}
                        <div
                            onClick={() => navigate("/seller/store")}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <FiSettings className="w-6 h-6 text-purple-600" />
                                </div>
                                <FiArrowRight className="text-gray-300 group-hover:text-purple-600 transition" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1f2933]">Settings</h3>
                            <p className="text-gray-500 text-sm">Manage Store Info</p>
                        </div>
                        {/* Products Card */}
                        <div
                            onClick={() => navigate("/seller/products")}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 rounded-xl">
                                    <FiPackage className="w-6 h-6 text-[#4A6F5D]" />
                                </div>
                                <FiArrowRight className="text-gray-300 group-hover:text-[#4A6F5D] transition" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1f2933]">{stats.products}</h3>
                            <p className="text-gray-500 text-sm">Active Products</p>
                        </div>

                        {/* Orders Card */}
                        <div
                            onClick={() => navigate("/seller/orders")}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <FiShoppingBag className="w-6 h-6 text-blue-600" />
                                </div>
                                <FiArrowRight className="text-gray-300 group-hover:text-blue-600 transition" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1f2933]">{stats.orders}</h3>
                            <p className="text-gray-500 text-sm">Total Orders</p>
                        </div>

                        {/* Alerts Card */}
                        <div
                            onClick={() => navigate("/seller/stock-alerts")}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-amber-50 rounded-xl">
                                    <FiAlertTriangle className="w-6 h-6 text-amber-600" />
                                </div>
                                <FiArrowRight className="text-gray-300 group-hover:text-amber-600 transition" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1f2933]">{stats.alerts}</h3>
                            <p className="text-gray-500 text-sm">Low Stock Alerts</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
