import React, { useEffect, useState } from "react";
import { getMyOrders, OrderResponse, mockPayment } from "../../services/order.service";
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function MyOrders() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [payingOrderId, setPayingOrderId] = useState<number | null>(null);

    const safeNumber = (value?: number) => typeof value === "number" ? value : 0;

    const fetchOrders = async () => {
        try {
            const data = await getMyOrders();
            // Sort by newest first
            setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error("Failed to load orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleRetryPayment = async (orderId: number) => {
        setPayingOrderId(orderId);
        try {
            await mockPayment(orderId);
            await fetchOrders(); // Refresh status
            alert("Payment successful!");
        } catch (error) {
            console.error("Payment retry failed", error);
            alert("Payment failed. Please try again.");
        } finally {
            setPayingOrderId(null);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiPackage className="text-gray-400" size={24} />
                </div>
                <h3 className="text-gray-900 font-bold text-lg">No orders yet</h3>
                <p className="text-gray-500 mt-1">When you buy something, it will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1F2933]">My Orders</h2>

            <div className="grid gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Order Header */}
                        <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Order #{order.id}</p>
                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-lg font-bold text-[#1F2933]">{safeNumber(order.total).toFixed(2)}₪</p>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getContentForStatus(order.status).class}`}>
                                    {getContentForStatus(order.status).label}
                                </div>
                            </div>

                            {/* Retry Payment Button */}
                            {order.status === "PENDING" && (
                                <button
                                    onClick={() => handleRetryPayment(order.id)}
                                    disabled={payingOrderId === order.id}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#4A6F5D] text-white text-sm font-bold rounded-lg hover:bg-[#3d5c4d] disabled:opacity-50"
                                >
                                    {payingOrderId === order.id ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <FiRefreshCw /> Pay Now
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="p-4 sm:p-6 space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-100 last:border-0">
                                    <div className="flex gap-4 flex-1">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                            {item.product.image ? (
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400"><FiPackage /></div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                                            <p className="text-sm text-gray-500">Store: {item.store.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-medium">Qty: {item.quantity}</span>
                                                <span className="text-sm text-gray-400">|</span>
                                                <span className="text-sm font-bold text-[#4A6F5D]">{safeNumber(item.price).toFixed(2)}₪</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item Status */}
                                    <div className="sm:text-right flex flex-col justify-center">
                                        <ItemStatusBadge status={item.status} />

                                        {/* Refund Info */}
                                        {item.refund && (
                                            <div className="mt-2 text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">
                                                <p className="font-bold flex items-center gap-1">
                                                    <FiAlertCircle size={10} /> Refunded: {safeNumber(item.refund.amount).toFixed(2)}₪
                                                </p>
                                                <p className="opacity-75">{item.refund.reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment Info Footer */}
                        {order.payments && order.payments.length > 0 && (
                            <div className="bg-gray-50 p-4 text-xs text-gray-500 border-t border-gray-200">
                                <p className="font-bold mb-1">Payment History:</p>
                                {order.payments.map(p => (
                                    <div key={p.id} className="flex justify-between max-w-sm">
                                        <span>{new Date(p.createdAt).toLocaleString()}</span>
                                        <span className={p.status === 'SUCCESS' ? 'text-green-600 font-medium' : 'text-red-600'}>
                                            {p.status} ({safeNumber(p.amount).toFixed(2)}₪)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getContentForStatus(status: string) {
    switch (status) {
        case "PAID":
        case "COMPLETED":
        case "SHIPPED":
            return { label: status, class: "bg-green-100 text-green-700 border-green-200" };
        case "PENDING":
            return { label: "Unpaid", class: "bg-yellow-100 text-yellow-700 border-yellow-200" };
        case "CANCELED":
            return { label: "Canceled", class: "bg-red-100 text-red-700 border-red-200" };
        default:
            return { label: status, class: "bg-gray-100 text-gray-700 border-gray-200" };
    }
}

function ItemStatusBadge({ status }: { status: string }) {
    let colorClass = "bg-gray-100 text-gray-600";
    let icon = null;
    let label = status;

    if (status === "APPROVED" || status === "SHIPPED" || status === "DELIVERED") {
        colorClass = "bg-green-100 text-green-700";
        icon = <FiCheckCircle size={14} />;
    } else if (status === "REJECTED") {
        colorClass = "bg-red-100 text-red-700";
        icon = <FiXCircle size={14} />;
        label = "Rejected";
    } else if (status === "PENDING_APPROVAL") {
        colorClass = "bg-blue-50 text-blue-600";
        icon = <FiClock size={14} />;
        label = "Waiting Approval";
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${colorClass}`}>
            {icon}
            {label}
        </span>
    );
}
