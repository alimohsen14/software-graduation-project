import React, { useEffect, useState } from "react";
import * as sellerService from "../../services/seller.service";
import * as adminService from "../../services/admin.service";
import { FiAlertTriangle } from "react-icons/fi";

const getService = () => window.location.pathname.startsWith('/admin') ? adminService : sellerService;

export default function StockAlertsManagementView() {
    const service = getService();
    const [products, setProducts] = useState<sellerService.SellerProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await service.getStockAlerts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to load alerts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div className="py-10 px-6 max-w-5xl mx-auto space-y-12">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Critical Alerts</h1>
                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Strategic monitoring of depleted distribution units</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
                <div className="px-10 py-6 bg-amber-500/10 border-b border-amber-500/10">
                    <div className="flex items-center gap-3 text-amber-500 uppercase tracking-widest font-black text-xs">
                        <FiAlertTriangle size={18} />
                        Priority Depletion (Threshold ≤ 5 Units)
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-10 h-10 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="font-black text-white/20 uppercase tracking-widest text-[10px]">Scanning Inventory Matrix...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6 mx-auto border border-emerald-500/20">
                            <FiAlertTriangle className="text-emerald-400" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white/40 uppercase tracking-tight">System Optimized</h3>
                        <p className="mt-2 font-bold text-white/20 uppercase tracking-widest text-[10px]">All SKU stock levels are currently within safe parameters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] bg-white/5">
                                    <th className="px-10 py-5">Consignment Descriptor</th>
                                    <th className="px-10 py-5">Residual Stock</th>
                                    <th className="px-10 py-5">Consignment Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm font-medium">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-10 py-6 text-white font-black uppercase tracking-tight group-hover:text-amber-500 transition-colors">{p.name}</td>
                                        <td className="px-10 py-6 text-red-500 font-black tracking-widest">
                                            <span className="px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
                                                {p.stock} Units
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-white/40 font-bold">{p.price} ₪</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
