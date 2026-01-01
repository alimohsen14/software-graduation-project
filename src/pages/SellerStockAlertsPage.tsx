import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getStockAlerts, SellerProduct } from "../services/seller.service";
import { FiAlertTriangle } from "react-icons/fi";

export default function SellerStockAlertsPage() {
    const [products, setProducts] = useState<SellerProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await getStockAlerts();
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
        <DashboardLayout>
            <div className="p-6 sm:p-10 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    <h1 className="text-2xl font-bold text-[#1d2d1f]">Stock Alerts</h1>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
                            <div className="flex items-center gap-2 text-amber-800">
                                <FiAlertTriangle />
                                <span className="font-bold">Low Stock Items (≤ 5)</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="p-10 text-center text-gray-500">Loading alerts...</div>
                        ) : products.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">Good news! No stock alerts.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr className="text-gray-400 text-xs font-bold uppercase">
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Stock</th>
                                        <th className="px-6 py-3">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {products.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 font-medium">{p.name}</td>
                                            <td className="px-6 py-4 text-red-600 font-bold">{p.stock}</td>
                                            <td className="px-6 py-4">{p.price}₪</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
