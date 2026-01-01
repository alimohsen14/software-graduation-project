import React from 'react';
import { FiX, FiUser, FiPhone, FiMapPin, FiCalendar, FiHome } from 'react-icons/fi';
import { SellerOrder } from '../../services/seller.service';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: SellerOrder | null;
}

export default function OrderDetailsModal({
    isOpen,
    onClose,
    order
}: OrderDetailsModalProps) {
    if (!isOpen || !order) return null;

    // Delivery Source of Truth: Order fields (Strictly from backend)
    // Data Mapping: Robust Fallback Strategy
    // 1. Order Delivery Details (Primary Source)
    // 2. Nested Order Object (Potential Backend Structure)
    // 3. Customer Profile (Fallback for old orders)
    const displayPhone = order.phone || (order as any).order?.phone || order.customer?.phone || 'N/A';
    const displayCity = order.city || (order as any).order?.city || order.customer?.city || 'N/A';
    const displayAddress = order.address || (order as any).order?.address || order.customer?.address || 'N/A';

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Order Customer Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <FiUser size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Customer Name</p>
                                {/* Name (Customer profile name is still fine for Identity) */}
                                <p className="text-sm font-medium text-gray-900">{order.customer?.name || 'Guest Customer'}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <FiPhone size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Phone Number</p>
                                <p className="text-sm font-medium text-gray-900">{displayPhone}</p>
                            </div>
                        </div>

                        {/* City */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <FiMapPin size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">City</p>
                                <p className="text-sm font-medium text-gray-900">{displayCity}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                <FiHome size={18} />
                            </div>
                            <div className="">
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Address</p>
                                <p className="text-sm font-medium text-gray-900 leading-relaxed">{displayAddress}</p>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-start gap-3 pt-4 border-t border-gray-50">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                                <FiCalendar size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Order Placed On</p>
                                <p className="text-sm font-medium text-gray-900">{formattedDate}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3 text-sm font-medium text-white bg-[#1d2d1f] hover:bg-[#2a3f2d] rounded-xl transition shadow-lg shadow-gray-200"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}
