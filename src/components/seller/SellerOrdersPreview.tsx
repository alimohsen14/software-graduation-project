import React from "react";
import { FiShoppingBag, FiPackage } from "react-icons/fi";

type Props = {
    orders: any[];
};

export default function SellerOrdersPreview({ orders }: Props) {
    const pendingOrders = orders.filter((o) => o.status === "PENDING");

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-emerald-400 shadow-inner">
                        <FiShoppingBag size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Global Log</h2>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">Historical transaction data stream</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ml-4 shadow-lg shadow-emerald-500/5">
                        {orders.length} TOTAL
                    </span>
                </div>
                {pendingOrders.length > 0 && (
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-amber-500/5">
                        {pendingOrders.length} REQUIRED_ACTION
                    </span>
                )}
            </div>

            {orders.length === 0 ? (
                <div className="px-10 py-24 text-center relative z-10 group">
                    <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-white/10 border border-white/5 transition-transform duration-700 group-hover:scale-110 shadow-inner">
                        <FiPackage size={48} />
                    </div>
                    <p className="text-sm font-black text-white/40 uppercase tracking-widest mb-2">Zero Matrix Events</p>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest max-w-[280px] mx-auto leading-loose">Waiting for initial consortium acquisition triggers</p>
                </div>
            ) : (
                <div className="overflow-x-auto relative z-10 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-10 py-6 border-b border-white/5">Session_ID</th>
                                <th className="px-10 py-6 border-b border-white/5">Consignment_Entity</th>
                                <th className="px-10 py-6 border-b border-white/5">SKU_Count</th>
                                <th className="px-10 py-6 border-b border-white/5">Capital_Inflow</th>
                                <th className="px-10 py-6 border-b border-white/5">Status_Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[11px] font-bold uppercase tracking-widest">
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-10 py-6 font-black text-white/80">
                                        <span className="text-white/20 mr-1">#</span>{order.id}
                                    </td>
                                    <td className="px-10 py-6 text-white/50 group-hover:text-white transition-colors">
                                        {order.customerName || "ANONYMOUS_GUEST"}
                                    </td>
                                    <td className="px-10 py-6 text-indigo-400">
                                        {order.itemCount || 1} <span className="text-[9px] opacity-40">UNITS</span>
                                    </td>
                                    <td className="px-10 py-6 font-black text-emerald-400 text-sm tracking-tighter">
                                        {(order.total ?? 0).toFixed(2)}<span className="text-[10px] ml-1 opacity-60">₪</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span
                                            className={`px-4 py-1.5 rounded-xl border backdrop-blur-md text-[9px] font-black tracking-widest shadow-lg ${order.status === "PAID"
                                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5"
                                                : order.status === "SHIPPED"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
                                                    : order.status === "PENDING"
                                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5"
                                                        : "bg-white/5 text-white/30 border-white/10"
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
