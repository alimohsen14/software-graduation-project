import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getOrderById, OrderResponse } from "../services/order.service";
import { FiArrowLeft, FiPackage, FiMapPin, FiPhone, FiMail, FiAlertCircle } from "react-icons/fi";

export default function UserOrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                const data = await getOrderById(Number(id));
                setOrder(data);
            } catch (err) {
                console.error("Failed to load order", err);
                setError("Failed to load order details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const getStatusDisplay = () => {
        if (!order) return null;

        switch (order.adminStatus) {
            case "ADMIN_PENDING":
                return (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-amber-700 font-medium">
                            <FiPackage className="w-5 h-5" />
                            Waiting for admin approval
                        </div>
                        <p className="text-amber-600 text-sm mt-1">
                            Your order is being reviewed. You will be notified once it's approved.
                        </p>
                    </div>
                );
            case "ADMIN_APPROVED":
                return (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-700 font-medium">
                            <FiPackage className="w-5 h-5" />
                            Approved – preparing for delivery
                        </div>
                        <p className="text-green-600 text-sm mt-1">
                            Your order has been approved and is being prepared for shipping.
                        </p>
                    </div>
                );
            case "ADMIN_REJECTED":
                return (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-red-700 font-medium">
                            <FiAlertCircle className="w-5 h-5" />
                            Rejected
                        </div>
                        {order.rejectionReason && (
                            <p className="text-red-600 text-sm mt-2">
                                <span className="font-medium">Reason:</span> {order.rejectionReason}
                            </p>
                        )}
                        <div className="mt-4 pt-4 border-t border-red-200">
                            <p className="text-red-600 text-sm">
                                If you have any questions, please contact us at{" "}
                                <a
                                    href="mailto:support@yourstore.com"
                                    className="font-medium underline"
                                >
                                    support@yourstore.com
                                </a>
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Loading order details...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !order) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-red-600">{error || "Order not found"}</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                <div className="max-w-3xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate("/orders")}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 font-medium text-sm transition"
                    >
                        <FiArrowLeft size={16} />
                        Back to Orders
                    </button>

                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-[#1F2933]">
                                Order #{order.id}
                            </h1>
                            <span className="text-2xl font-bold text-[#4A6F5D]">
                                {order.total.toFixed(2)}₪
                            </span>
                        </div>

                        {/* Status Display */}
                        {getStatusDisplay()}
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
                        <h2 className="font-bold text-[#1F2933] mb-4">Order Items</h2>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {item.product?.name || "Product"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                        <h2 className="font-bold text-[#1F2933] mb-4">Delivery Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-gray-600">
                                <FiMapPin className="w-4 h-4 text-[#4A6F5D]" />
                                <span>{order.city}, {order.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <FiPhone className="w-4 h-4 text-[#4A6F5D]" />
                                <span>{order.phone}</span>
                            </div>
                            {order.user?.email && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FiMail className="w-4 h-4 text-[#4A6F5D]" />
                                    <span>{order.user.email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
