import React from "react";
import { FiPackage, FiMapPin, FiExternalLink } from "react-icons/fi";

type AdminOrder = {
  id: string;
  customerName: string;
  products: string;
  total: number;
  location: string;
  status: "PENDING" | "PAID" | "CANCELED" | "SHIPPED";
};

interface CustomerOrdersPreviewProps {
  orders: AdminOrder[];
}

export default function CustomerOrdersPreview({
  orders,
}: CustomerOrdersPreviewProps) {
  const getBadge = (status: string) => {
    const base =
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ";
    if (status === "PAID") return base + "bg-blue-100 text-blue-700";
    if (status === "SHIPPED") return base + "bg-green-100 text-green-700";
    if (status === "PENDING") return base + "bg-amber-100 text-amber-700";
    if (status === "CANCELED") return base + "bg-red-100 text-red-700";
    return base + "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/10">
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3 text-left">
          <FiPackage className="w-6 h-6 text-[#4A6F5D]" />
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            Customer Orders
          </h2>
          <span className="bg-[#4A6F5D] text-white text-xs font-bold px-2 py-1 rounded-full">
            {orders.length}
          </span>
        </div>
        <button className="text-sm font-bold text-[#4A6F5D] hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
          View All Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="px-8 py-12 text-center">
          <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No orders yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Orders will appear here when customers place them
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-gray-400 text-[11px] font-black uppercase tracking-tighter">
                <th className="px-8 py-4">Order ID</th>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Products</th>
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
                  <td className="px-8 py-5 text-gray-500 max-w-[200px] truncate">
                    {o.products}
                  </td>
                  <td className="px-8 py-5 font-black text-[#4A6F5D]">
                    {o.total.toFixed(2)}₪
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
                    <button className="text-[#4A6F5D] font-bold text-xs flex items-center gap-1 ml-auto hover:underline">
                      Details <FiExternalLink className="w-3 h-3" />
                    </button>
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
