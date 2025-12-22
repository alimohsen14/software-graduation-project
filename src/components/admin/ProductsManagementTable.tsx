import React from "react";
import { FiEdit2, FiTrash2, FiSearch, FiLayers } from "react-icons/fi";

export default function ProductsManagementTable({
  products,
}: {
  products: any[];
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-white/10">
      <div className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
        <div className="flex items-center gap-3 text-left">
          <FiLayers className="w-6 h-6 text-[#3e6347]" />
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            Products Management
          </h2>
        </div>
        <div className="relative w-full md:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by product name..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3e6347]/20 font-medium"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-400 text-[11px] font-black uppercase tracking-tighter">
              <th className="px-8 py-4">Product Info</th>
              <th className="px-8 py-4">Price</th>
              <th className="px-8 py-4">Stock</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <span className="font-bold text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 font-black text-gray-900">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-8 py-5 text-gray-700">{p.stock} units</td>
                <td className="px-8 py-5">
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-black border ${
                      p.status === "IN_STOCK"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {p.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-5">
                    <button
                      title="Edit Product"
                      className="text-[#1a3020] hover:scale-110 transition-transform"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      title="Delete Product"
                      className="text-[#be1e2d] hover:scale-110 transition-transform"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
