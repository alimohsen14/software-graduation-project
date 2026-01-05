import React from "react";
import { FiX, FiPackage, FiMapPin, FiPhone, FiMail, FiUser } from "react-icons/fi";

type OrderItem = {
    quantity: number;
    product: {
        name: string;
    };
};

type AdminOrderDetails = {
    id: string;
    customerName: string;
    customerEmail?: string;
    phone: string;
    city: string;
    address: string;
    products: string;
    items: OrderItem[];
    total?: number;
    status: string;
    adminStatus: string;
    rejectionReason?: string;
};

type Props = {
    order: AdminOrderDetails;
    onClose: () => void;
};

export default function OrderDetailsModal({ order, onClose }: Props) {
    const getAdminStatusBadge = (status: string) => {
        const base = "px-3 py-1 rounded-full text-xs font-bold ";
        if (status === "ADMIN_APPROVED") return base + "bg-green-100 text-green-700";
        if (status === "ADMIN_REJECTED") return base + "bg-red-100 text-red-700";
        return base + "bg-amber-100 text-amber-700";
    };

    const getAdminStatusText = (status: string) => {
        if (status === "ADMIN_APPROVED") return "Approved – sent to delivery";
        if (status === "ADMIN_REJECTED") return "Rejected";
        return "Pending Approval";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FiPackage className="w-5 h-5 text-[#4A6F5D]" />
                        <h2 className="text-lg font-bold text-gray-900">Order #{order.id}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Status */}
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold mb-2">Status</p>
                        <span className={getAdminStatusBadge(order.adminStatus)}>
                            {getAdminStatusText(order.adminStatus)}
                        </span>
                        {order.adminStatus === "ADMIN_REJECTED" && order.rejectionReason && (
                            <p className="text-sm text-red-600 mt-2">
                                <span className="font-medium">Reason:</span> {order.rejectionReason}
                            </p>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold mb-3">Customer Details</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-3 text-gray-700">
                                <FiUser className="w-4 h-4 text-[#4A6F5D]" />
                                <span className="font-medium">{order.customerName}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <FiPhone className="w-4 h-4 text-[#4A6F5D]" />
                                <span>{order.phone}</span>
                            </div>
                            {order.customerEmail && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FiMail className="w-4 h-4 text-[#4A6F5D]" />
                                    <span>{order.customerEmail}</span>
                                </div>
                            )}
                            <div className="flex items-start gap-3 text-gray-600">
                                <FiMapPin className="w-4 h-4 text-[#4A6F5D] mt-0.5" />
                                <span>{order.city}, {order.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold mb-3">Order Items</p>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700">{item.product?.name || "Product"}</span>
                                        <span className="text-gray-500">x{item.quantity}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">{order.products}</p>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Total</span>
                            <span className="text-xl font-bold text-[#4A6F5D]">{(order.total ?? 0).toFixed(2)}₪</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
