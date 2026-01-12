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
        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl group transition-all duration-500 hover:border-emerald-500/20">
            {/* Header */}
            <div className="px-8 py-6 bg-white/5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <FiPackage className="text-emerald-400 w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white tracking-tight uppercase">
                            Package Request <span className="text-emerald-400/50 ml-2">#{order.orderId}</span>
                        </h3>
                        <div className="flex items-center gap-4 mt-1.5">
                            <span className="flex items-center gap-1.5 text-[10px] text-white/30 font-black uppercase tracking-widest">
                                <FiCalendar size={14} className="opacity-50" /> {formattedDate}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] text-white/30 font-black uppercase tracking-widest">
                                <FiClock size={14} className="opacity-50" /> {formattedTime}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onShowDetails}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-[10px] font-black text-white/70 uppercase tracking-widest rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-lg"
                    >
                        <FiEye size={16} />
                        Audit Trail
                    </button>
                    <div className="flex flex-col items-end border-l border-white/5 pl-6">
                        <span className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-black mb-1.5">Consignment Status</span>
                        <OrderItemStatusBadge status={(order.orderStatus as any) || 'PENDING'} />
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-white/5">
                {order.items.map((item) => {
                    // SELLERS ONLY SEE PENDING_APPROVAL ITEMS
                    if (item.status !== 'PENDING_APPROVAL') return null;

                    // Defensive check for missing ID
                    if (!item.id) return null;

                    return (
                        <div key={item.id} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-white/5 transition-all duration-300">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-stone-900/40 rounded-3xl flex-shrink-0 overflow-hidden shadow-inner border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                                    {item.productImage ? (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/5">
                                            <FiPackage size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-base font-black text-white/90 tracking-tight uppercase leading-tight">{item.productName}</h4>
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 bg-white/5 text-white/40 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5">VOL: {item.quantity} units</span>
                                        <span className="text-lg font-black text-emerald-400 tracking-tighter">{(item.priceAtPurchase ?? 0).toFixed(2)} ₪</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 self-end lg:self-auto">
                                {/* Delivery Info */}
                                <div className="text-right text-[10px] pr-6 border-r border-white/5 hidden md:block">
                                    <p className="font-black text-white/40 uppercase tracking-widest mb-1.5">Destination Data</p>
                                    <p className="text-white font-bold mb-0.5">{order.city || (order as any).order?.city || order.customer?.city || "Unknown City"}</p>
                                    <p className="text-white/40 font-medium truncate max-w-[150px]">{order.address || (order as any).order?.address || order.customer?.address || "No Address"}</p>
                                    <p className="text-emerald-400/40 font-mono mt-1 font-bold">{order.phone || (order as any).order?.phone || order.customer?.phone || "NO_TEL"}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleApproveClick(item.id)}
                                        disabled={processingItems.includes(item.id)}
                                        className="h-12 px-6 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-2xl transition-all shadow-xl flex items-center gap-2.5 disabled:opacity-30 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        {processingItems.includes(item.id) ? (
                                            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <FiCheck size={18} />
                                        )}
                                        Authorize
                                    </button>
                                    <button
                                        onClick={() => onReject(item.id)}
                                        disabled={processingItems.includes(item.id)}
                                        className="h-12 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl transition-all flex items-center gap-2.5 disabled:opacity-30 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <FiX size={18} />
                                        Inhibit
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
