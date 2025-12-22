import React from "react";
import { FiPackage, FiMapPin, FiExternalLink } from "react-icons/fi";

export default function CustomerOrdersPreview({ orders }: { orders: any[] }) {
  const getBadge = (status: string) => {
    const base =
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ";
    if (status === "PAID") return base + "bg-blue-100 text-blue-700";
    if (status === "PENDING") return base + "bg-amber-100 text-amber-700";
    return base + "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/10">
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3 text-left">
          <FiPackage className="w-6 h-6 text-[#3e6347]" />
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            Customer Orders
          </h2>
        </div>
        <button className="text-sm font-bold text-[#3e6347] hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
          View All Orders
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-tighter">
              <th className="px-8 py-4">Order ID</th>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Total</th>
              <th className="px-8 py-4">Location</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5 font-extrabold text-gray-900">
                  #{o.id}
                </td>
                <td className="px-8 py-5 text-gray-600 font-medium">
                  {o.customerName}
                </td>
                <td className="px-8 py-5 font-black text-gray-900">
                  ${o.total.toFixed(2)}
                </td>
                <td className="px-8 py-5 text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="shrink-0" /> {o.location}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className={getBadge(o.status)}>{o.status}</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="text-[#3e6347] font-bold text-xs flex items-center gap-1 ml-auto hover:underline">
                    Details <FiExternalLink className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
