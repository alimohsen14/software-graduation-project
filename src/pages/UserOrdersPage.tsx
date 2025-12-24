import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getMyOrders, OrderResponse } from "../services/order.service";
import { FiPackage, FiChevronRight } from "react-icons/fi";

export default function UserOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setError("Please log in to view your orders");
                setLoading(false);
                return;
            }

            try {
                const data = await getMyOrders(token);
                setOrders(data);
            } catch (err) {
                console.error("Failed to load orders", err);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getAdminStatusBadge = (status: string) => {
        const base = "px-3 py-1 rounded-full text-xs font-bold ";
        if (status === "ADMIN_APPROVED") return base + "bg-green-100 text-green-700";
        if (status === "ADMIN_REJECTED") return base + "bg-red-100 text-red-700";
        return base + "bg-amber-100 text-amber-700";
    };

    const getAdminStatusText = (status: string) => {
        if (status === "ADMIN_APPROVED") return "Approved";
        if (status === "ADMIN_REJECTED") return "Rejected";
        return "Pending";
    };

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-[#1F2933] mb-6">My Orders</h1>

                    {loading ? (
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <p className="text-gray-500">Loading orders...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                            <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No orders yet</p>
                            <button
                                onClick={() => navigate("/shop")}
                                className="mt-4 px-6 py-2 bg-[#4A6F5D] text-white rounded-lg font-medium hover:bg-[#3d5c4d] transition"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <button
                                    key={order.id}
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                    className="w-full bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition text-left flex items-center justify-between"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-[#1F2933]">
                                                Order #{order.id}
                                            </span>
                                            <span className={getAdminStatusBadge(order.adminStatus)}>
                                                {getAdminStatusText(order.adminStatus)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {order.items.length} item(s) • {order.total.toFixed(2)}₪
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {order.city}, {order.address}
                                        </p>
                                    </div>
                                    <FiChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
