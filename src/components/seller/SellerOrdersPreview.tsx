import React from "react";
import { FiShoppingBag, FiPackage } from "react-icons/fi";

type Props = {
    orders: any[];
};

export default function SellerOrdersPreview({ orders }: Props) {
    const pendingOrders = orders.filter((o) => o.status === "PENDING");

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FiShoppingBag className="w-5 h-5 text-[#4A6F5D]" />
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                    <span className="bg-[#4A6F5D] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {orders.length}
                    </span>
                </div>
                {pendingOrders.length > 0 && (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                        {pendingOrders.length} pending
                    </span>
                )}
            </div>

            {orders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No orders yet</p>
                    <p className="text-gray-400 text-sm">Orders will appear here when customers purchase your products</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr className="text-gray-400 text-xs font-bold uppercase">
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Items</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.customerName || "Customer"}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.itemCount || 1} items</td>
                                    <td className="px-6 py-4 font-bold text-[#4A6F5D]">{order.total?.toFixed(2)}₪</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === "PAID"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : order.status === "SHIPPED"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "PENDING"
                                                            ? "bg-amber-100 text-amber-700"
                                                            : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
