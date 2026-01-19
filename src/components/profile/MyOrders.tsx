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
        return (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-white/20">
                <FiRefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Pipeline</span>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-12 border border-white/10 shadow-2xl text-center relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
                <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 text-white/20">
                    <FiPackage size={32} />
                </div>
                <h3 className="text-white font-black text-2xl tracking-tighter uppercase mb-2">No Assets found</h3>
                <p className="text-white/40 text-sm font-medium">Your acquisition history is currently empty.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-10">
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-xl">
                    <FiPackage className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase leading-none">Acquisition History</h2>
            </div>

            <div className="grid gap-6 md:gap-8">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white/5 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Order Header */}
                        <div className="bg-white/5 p-4 md:p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 md:gap-6">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-0.5 md:mb-1">Entry ID</span>
                                    <span className="text-xs md:text-sm font-bold text-white tracking-widest">#{order.id}</span>
                                </div>
                                <div className="w-px h-6 md:h-8 bg-white/5" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-0.5 md:mb-1">Timestamp</span>
                                    <span className="text-xs md:text-sm font-bold text-white/60">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 md:gap-8">
                                <div className="flex flex-col text-right">
                                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-0.5 md:mb-1">Valuation</span>
                                    <p className="text-lg md:text-xl font-black text-emerald-400 tracking-tighter">{safeNumber(order.total).toFixed(2)}₪</p>
                                </div>

                                <div className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border shadow-lg ${getContentForStatus(order.status).class}`}>
                                    {getContentForStatus(order.status).label}
                                </div>

                                {/* Retry Payment Button */}
                                {order.status === "PENDING" && (
                                    <button
                                        onClick={() => handleRetryPayment(order.id)}
                                        disabled={payingOrderId === order.id}
                                        className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 bg-emerald-600/10 text-emerald-400 border border-emerald-500/10 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-emerald-600/20 hover:border-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 min-h-[44px]"
                                    >
                                        {payingOrderId === order.id ? (
                                            <FiRefreshCw className="animate-spin" />
                                        ) : (
                                            <>
                                                <FiRefreshCw /> <span>Authorize</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 md:p-8 space-y-4 md:space-y-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-4 md:gap-6 py-4 md:py-6 border-b border-white/5 last:border-0">
                                    <div className="flex gap-4 md:gap-6 flex-1">
                                        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:border-white/20 transition-colors shadow-2xl relative">
                                            {item.product.image ? (
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/10"><FiPackage size={20} /></div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="text-base md:text-lg font-black text-white tracking-tight uppercase mb-0.5 md:mb-1 truncate max-w-[200px] md:max-w-none">{item.product.name}</h4>
                                            <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/20">Source</span>
                                                <span className="text-[9px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-tight">{item.store.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <div className="flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 bg-white/5 rounded-lg border border-white/10">
                                                    <span className="text-[8px] md:text-[9px] font-black text-white/30 uppercase">Qty</span>
                                                    <span className="text-[10px] md:text-xs font-bold text-white">{item.quantity}</span>
                                                </div>
                                                <span className="text-white/10">|</span>
                                                <span className="text-sm md:text-base font-black text-emerald-400 tracking-tight">{safeNumber(item.price).toFixed(2)}₪</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Item Status */}
                                    <div className="flex flex-col justify-center sm:items-end gap-2 md:gap-3 px-2 sm:px-0">
                                        <div className="scale-90 md:scale-100 origin-left md:origin-right">
                                            <ItemStatusBadge status={item.status} />
                                        </div>

                                        {/* Refund Info */}
                                        {item.refund && (
                                            <div className="bg-red-500/5 text-red-400 border border-red-500/10 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl flex flex-col gap-0.5 md:gap-1 max-w-[180px] md:max-w-[200px]">
                                                <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Reversal</span>
                                                <span className="text-[10px] md:text-xs font-bold leading-tight flex items-center gap-1.5 md:gap-2">
                                                    <FiAlertCircle size={10} /> {safeNumber(item.refund.amount).toFixed(2)}₪ Accounted
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment Info Footer */}
                        {order.payments && order.payments.length > 0 && (
                            <div className="bg-white/[0.02] px-4 md:px-6 py-3 md:py-4 border-t border-white/5">
                                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Audit Trail</span>
                                    <div className="flex-1 h-px bg-white/5" />
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    {order.payments.map(p => (
                                        <div key={p.id} className="flex justify-between items-center text-[9px] md:text-[10px] font-bold tracking-tight">
                                            <span className="text-white/30 uppercase">{new Date(p.createdAt).toLocaleString()}</span>
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <span className={p.status === 'SUCCESS' ? 'text-emerald-400/80' : 'text-red-400/80'}>
                                                    {p.status}
                                                </span>
                                                <span className="text-white/60">{safeNumber(p.amount).toFixed(2)}₪</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
            return { label: status, class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5" };
        case "PENDING":
            return { label: "Awaiting Auth", class: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5" };
        case "CANCELED":
            return { label: "Terminated", class: "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5" };
        default:
            return { label: status, class: "bg-white/5 text-white/40 border-white/10" };
    }
}

function ItemStatusBadge({ status }: { status: string }) {
    let colorClass = "bg-white/5 text-white/30 border-white/10";
    let icon = null;
    let label = status;

    if (status === "APPROVED" || status === "SHIPPED" || status === "DELIVERED") {
        colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        icon = <FiCheckCircle size={14} />;
    } else if (status === "REJECTED") {
        colorClass = "bg-red-500/10 text-red-500 border-red-500/20";
        icon = <FiXCircle size={14} />;
        label = "Rejected";
    } else if (status === "PENDING_APPROVAL") {
        colorClass = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
        icon = <FiClock size={14} />;
        label = "Reviewing";
    }

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors shadow-sm ${colorClass}`}>
            {icon}
            {label}
        </span>
    );
}
