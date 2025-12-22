import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

export default function LowStockAlerts({ items }: { items: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-5">
        <FiAlertTriangle className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-gray-800">Low Stock Alerts</h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-amber-50/50 border border-amber-100 rounded-xl"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900">{item.name}</p>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Only {item.remaining} remaining
                </p>
              </div>
            </div>
            <button className="text-sm font-bold text-[#3e6347] hover:underline px-3 py-1">
              Restock
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
