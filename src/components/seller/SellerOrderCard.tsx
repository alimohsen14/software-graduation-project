import React from 'react';
import { useTranslation } from 'react-i18next';
import { SellerOrder } from '../../services/seller.service';
import { FiCheck, FiX, FiPackage, FiCalendar, FiClock, FiEye, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import OrderItemStatusBadge from './OrderItemStatusBadge';

interface SellerOrderCardProps {
    order: SellerOrder;
    onApprove: (itemId: number) => Promise<void>;
    onReject: (itemId: number) => void;
    onShowDetails: () => void;
}

export default function SellerOrderCard({ order, onApprove, onReject, onShowDetails }: SellerOrderCardProps) {
    const { t, i18n } = useTranslation("seller");
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

    const currentLang = i18n.language === 'ar' ? 'ar-SA' : (i18n.language === 'fr' ? 'fr-FR' : 'en-US');
    const isRtl = i18n.language === 'ar';

    const formattedDate = new Date(order.createdAt).toLocaleDateString(currentLang, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = new Date(order.createdAt).toLocaleTimeString(currentLang, {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl transition-all duration-300 hover:border-emerald-500/20 group">
            {/* Header - Compact */}
            <div className={`px-5 py-3 bg-white/5 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <FiPackage className="text-emerald-400 w-4 h-4" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                        <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                            {t("orders.packageRequest")} <span className="text-emerald-400/50">#{order.orderId}</span>
                        </h3>
                        <div className={`flex items-center gap-3 mt-0.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <span className="flex items-center gap-1 text-[9px] text-white/30 font-bold uppercase tracking-wider">
                                <FiCalendar size={10} /> {formattedDate}
                            </span>
                            <span className="flex items-center gap-1 text-[9px] text-white/30 font-bold uppercase tracking-wider">
                                <FiClock size={10} /> {formattedTime}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <button
                        onClick={onShowDetails}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-[9px] font-bold text-white/50 uppercase tracking-wider rounded-lg border border-white/5 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <FiEye size={12} />
                        {t("orders.auditTrail")}
                    </button>
                    <div className={`flex flex-col border-white/5 ${isRtl ? 'items-end border-r pr-3' : 'items-start border-l pl-3'}`}>
                        <OrderItemStatusBadge status={(order.orderStatus as any) || 'PENDING'} />
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-white/5">
                {order.items.map((item) => {
                    if (item.status !== 'PENDING_APPROVAL' || !item.id) return null;

                    return (
                        <div key={item.id} className={`p-5 grid grid-cols-1 md:grid-cols-3 gap-5 items-center hover:bg-white/[0.02] transition-colors ${isRtl ? 'md:flex-row-reverse' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
                            {/* Product Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-stone-900 rounded-xl flex-shrink-0 overflow-hidden border border-white/5 shadow-inner">
                                    {item.productImage ? (
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/5">
                                            <FiPackage size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-white leading-tight">{item.productName}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-white/5 text-white/40 rounded-md text-[9px] font-bold border border-white/5">
                                            {t("orders.vol", { count: item.quantity })}
                                        </span>
                                        <span className="text-base font-black text-emerald-400">{(item.priceAtPurchase ?? 0).toFixed(2)} ₪</span>
                                    </div>
                                </div>
                            </div>

                            {/* Destination Info */}
                            <div className="hidden md:flex flex-col justify-center border-x border-white/5 px-5">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-white/40">
                                        <FiMapPin size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{t("orders.destination")}</span>
                                    </div>
                                    <p className="text-white text-[11px] font-medium leading-tight line-clamp-2">
                                        {order.city || order.customer?.city || t("orders.unknownCity")}, {order.address || order.customer?.address || t("orders.noAddress")}
                                    </p>
                                    <div className="flex items-center gap-2 text-emerald-400/60 mt-1">
                                        <FiPhone size={10} />
                                        <span className="text-[10px] font-mono font-bold tracking-tight">{order.phone || order.customer?.phone || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className={`flex flex-col sm:flex-row md:justify-end gap-2 items-stretch sm:items-center`}>
                                <button
                                    onClick={() => handleApproveClick(item.id)}
                                    disabled={processingItems.includes(item.id)}
                                    className="flex-1 md:flex-none h-10 px-5 bg-emerald-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-emerald-500/10"
                                >
                                    {processingItems.includes(item.id) ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <FiCheck size={14} />
                                    )}
                                    {t("orders.authorize")}
                                </button>
                                <button
                                    onClick={() => onReject(item.id)}
                                    disabled={processingItems.includes(item.id)}
                                    className="flex-1 md:flex-none h-10 px-5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                                >
                                    <FiX size={14} />
                                    {t("orders.reject")}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
