import React, { useState } from "react";
import { FiPackage, FiMapPin, FiCheck, FiX, FiEye, FiLoader } from "react-icons/fi";
import RejectOrderModal from "./RejectOrderModal";
import OrderDetailsModal from "./OrderDetailsModal";

export type AdminStatus = "ADMIN_PENDING" | "ADMIN_APPROVED" | "ADMIN_REJECTED";

type OrderItem = {
  quantity: number;
  product: {
    name: string;
  };
};

type AdminOrder = {
  id: string;
  customerName: string;
  customerEmail?: string;
  phone: string;
  city: string;
  address: string;
  products: string;
  items: OrderItem[];
  total: number;
  location: string;
  status: "PENDING" | "PAID" | "CANCELED" | "SHIPPED" | "COMPLETED";
  adminStatus: AdminStatus;
  rejectionReason?: string;
};

interface CustomerOrdersPreviewProps {
  orders: AdminOrder[];
  onApprove: (orderId: string) => Promise<void>;
  onReject: (orderId: string, reason: string) => Promise<void>;
  isRefreshing?: boolean;
}

type TabType = AdminStatus;

export default function CustomerOrdersPreview({
  orders,
  onApprove,
  onReject,
  isRefreshing = false,
}: CustomerOrdersPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ADMIN_PENDING");
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [viewingOrder, setViewingOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((o) => o.adminStatus === activeTab);

  const tabs: { key: TabType; label: string; count: number }[] = [
    {
      key: "ADMIN_PENDING",
      label: "Pending",
      count: orders.filter((o) => o.adminStatus === "ADMIN_PENDING").length,
    },
    {
      key: "ADMIN_APPROVED",
      label: "Approved",
      count: orders.filter((o) => o.adminStatus === "ADMIN_APPROVED").length,
    },
    {
      key: "ADMIN_REJECTED",
      label: "Rejected",
      count: orders.filter((o) => o.adminStatus === "ADMIN_REJECTED").length,
    },
  ];

  const handleApprove = async (orderId: string) => {
    if (loadingOrderId) return; // Prevent double requests
    setLoadingOrderId(orderId);
    try {
      await onApprove(orderId);
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectingOrderId || loadingOrderId) return;
    setLoadingOrderId(rejectingOrderId);
    try {
      await onReject(rejectingOrderId, reason);
      setRejectingOrderId(null);
    } finally {
      setLoadingOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const base =
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ";
    if (status === "PAID") return base + "bg-blue-100 text-blue-700";
    if (status === "SHIPPED") return base + "bg-green-100 text-green-700";
    if (status === "PENDING") return base + "bg-amber-100 text-amber-700";
    if (status === "CANCELED") return base + "bg-red-100 text-red-700";
    return base + "bg-gray-100 text-gray-600";
  };

  const getAdminStatusText = (adminStatus: string) => {
    if (adminStatus === "ADMIN_APPROVED") return "Approved – sent to delivery";
    if (adminStatus === "ADMIN_REJECTED") return "Rejected";
    return "Pending";
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
          {isRefreshing && (
            <FiLoader className="w-4 h-4 text-[#4A6F5D] animate-spin" />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 py-3 border-b border-gray-100 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === tab.key
              ? "bg-[#4A6F5D] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-1.5 py-0.5 rounded text-xs ${activeTab === tab.key
                ? "bg-white/20 text-white"
                : "bg-gray-200 text-gray-500"
                }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="px-8 py-12 text-center">
          <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            No {activeTab.replace("ADMIN_", "").toLowerCase()} orders
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
              {filteredOrders.map((o) => (
                <tr
                  key={o.id}
                  className={`hover:bg-gray-50/50 transition-colors ${loadingOrderId === o.id ? "opacity-50" : ""
                    }`}
                >
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
                    {activeTab === "ADMIN_APPROVED" ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700">
                        {getAdminStatusText(o.adminStatus)}
                      </span>
                    ) : (
                      <span className={getStatusBadge(o.status)}>{o.status}</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Details Button - Always visible */}
                      <button
                        onClick={() => setViewingOrder(o)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                      >
                        <FiEye size={14} /> Details
                      </button>

                      {activeTab === "ADMIN_PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(o.id)}
                            disabled={loadingOrderId !== null}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingOrderId === o.id ? (
                              <FiLoader className="animate-spin" size={14} />
                            ) : (
                              <FiCheck size={14} />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingOrderId(o.id)}
                            disabled={loadingOrderId !== null}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiX size={14} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingOrderId && (
        <RejectOrderModal
          orderId={rejectingOrderId}
          onClose={() => setRejectingOrderId(null)}
          onConfirm={handleRejectConfirm}
          isLoading={loadingOrderId === rejectingOrderId}
        />
      )}

      {/* Order Details Modal */}
      {viewingOrder && (
        <OrderDetailsModal
          order={viewingOrder}
          onClose={() => setViewingOrder(null)}
        />
      )}
    </div>
  );
}


