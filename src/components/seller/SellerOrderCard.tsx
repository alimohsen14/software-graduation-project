import React from 'react';
import { SellerOrder } from '../../services/seller.service';
import { FiCheck, FiX, FiPackage, FiCalendar, FiClock, FiEye } from 'react-icons/fi';
import OrderItemStatusBadge from './OrderItemStatusBadge';

interface SellerOrderCardProps {
    order: SellerOrder;
    onApprove: (itemId: number) => Promise<void>;
    onReject: (itemId: number) => void; // Changes to void as it just opens modal
    onShowDetails: () => void;
}

export default function SellerOrderCard({ order, onApprove, onReject, onShowDetails }: SellerOrderCardProps) {
    const [processingItems, setProcessingItems] = React.useState<number[]>([]);

    const handleApproveClick = async (itemId: number) => {
        if (processingItems.includes(itemId)) return;
        setProcessingItems(prev => [...prev, itemId]);
        try {
            await onApprove(itemId);
        } finally {
            setProcessingItems(prev => prev.filter(id => id !== itemId));
        }
    };

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = new Date(order.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* Header */}
            <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-[#4A6F5D]/10 rounded-xl">
                        <FiPackage className="text-[#4A6F5D] w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#1d2d1f]">
                            Order #{order.orderId}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                <FiCalendar size={13} /> {formattedDate}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                                <FiClock size={13} /> {formattedTime}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={onShowDetails}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-xs font-bold text-[#1d2d1f] rounded-xl border border-gray-200 hover:border-[#1d2d1f] transition-all hover:bg-gray-50"
                    >
                        <FiEye size={14} />
                        View Details
                    </button>
                    <div className="flex flex-col items-end border-l border-gray-200 pl-4">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Status</span>
                        <OrderItemStatusBadge status={(order.orderStatus as any) || 'PENDING'} />
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
                {order.items.map((item) => {
                    // SELLERS ONLY SEE PENDING_APPROVAL ITEMS
                    if (item.status !== 'PENDING_APPROVAL') return null;

                    // Defensive check for missing ID
                    if (!item.id) {
                        console.warn(`OrderItem missing ID for product: ${item.productName}`);
                        return null;
                    }

                    return (
                        <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-gray-50/30 transition-colors">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden shadow-inner border border-gray-50">
                                    {item.productImage ? (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FiPackage size={28} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-[#1d2d1f] tracking-tight">{item.productName}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-bold">Qty: {item.quantity}</span>
                                        <span className="text-sm font-bold text-emerald-600">{(item.priceAtPurchase).toFixed(2)} ₪</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                {/* Delivery Info */}
                                <div className="text-right text-xs pr-4 border-r border-gray-100 hidden md:block">
                                    <p className="font-bold text-gray-700">Delivery To</p>
                                    <p className="text-gray-500">{order.city || (order as any).order?.city || order.customer?.city || "N/A"}</p>
                                    <p className="text-gray-400">{order.address || (order as any).order?.address || order.customer?.address || "No address"}</p>
                                    <p className="text-gray-400 font-mono mt-1">{order.phone || (order as any).order?.phone || order.customer?.phone || "No phone"}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleApproveClick(item.id)}
                                        disabled={processingItems.includes(item.id)}
                                        className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center gap-2 disabled:opacity-50 text-xs font-bold"
                                        title="Approve"
                                    >
                                        <FiCheck size={16} />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => onReject(item.id)}
                                        disabled={processingItems.includes(item.id)}
                                        className="h-10 px-4 bg-white text-rose-600 border border-rose-100 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 text-xs font-bold"
                                        title="Reject"
                                    >
                                        <FiX size={16} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
