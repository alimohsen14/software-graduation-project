import React, { useEffect, useState, useCallback } from "react";
import { toast } from 'react-toastify';
import * as sellerService from "../../services/seller.service";
import * as adminService from "../../services/admin.service";
import SellerOrderCard from "../seller/SellerOrderCard";
import RejectOrderItemModal from "../seller/RejectOrderItemModal";
import OrderDetailsModal from "../seller/OrderDetailsModal";
import { FiLoader, FiInbox } from "react-icons/fi";

const getService = () => window.location.pathname.startsWith('/admin') ? adminService : sellerService;

export default function OrdersManagementView() {
    const service = getService();
    const [orders, setOrders] = useState<sellerService.SellerOrder[]>([]);
    const [loading, setLoading] = useState(true);

    // Rejection Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [itemToReject, setItemToReject] = useState<{ id: number; name: string } | null>(null);

    // Details Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<sellerService.SellerOrder | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const res = await service.getOrders();
            const ordersList = Array.isArray(res.orders) ? res.orders : [];
            setOrders(ordersList);
        } catch (err) {
            console.error("Failed to load orders", err);
            toast.error("Failed to load orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // FILTER LOGIC: Only show items that are PENDING_APPROVAL
    const visibleOrders = orders
        .map((order: sellerService.SellerOrder) => ({
            ...order,
            items: order.items.filter((item: sellerService.SellerOrderItem) => item.status === 'PENDING_APPROVAL')
        }))
        .filter((order: any) => order.items.length > 0);

    const handleApprove = async (itemId: number) => {
        const id = Number(itemId);
        if (!id || isNaN(id)) {
            toast.error("Invalid item data. Please refresh.");
            return;
        }

        try {
            await service.approveOrderItem(id);
            toast.success("Item approved successfully");

            // REMOVE ITEM FROM UI: Instant removal
            setOrders((prevOrders: sellerService.SellerOrder[]) =>
                prevOrders.map((order: sellerService.SellerOrder) => ({
                    ...order,
                    items: order.items.filter((item: sellerService.SellerOrderItem) => item.id !== id)
                })).filter((order: any) => order.items.length > 0)
            );

            window.dispatchEvent(new Event('seller:refresh-notifications'));
        } catch (err) {
            console.error("Failed to approve item", err);
            toast.error("Failed to approve item");
        }
    };

    const handleRejectRequest = (itemId: number) => {
        const id = Number(itemId);
        if (!id || isNaN(id)) return;

        // Find product name for the modal
        let productName = "this item";
        for (const order of orders) {
            const item = order.items.find((i: sellerService.SellerOrderItem) => i.id === id);
            if (item) {
                productName = item.productName;
                break;
            }
        }
        setItemToReject({ id, name: productName });
        setIsRejectModalOpen(true);
    };

    const handleRejectConfirm = async (reason: string) => {
        if (!itemToReject) return;
        const id = itemToReject.id;

        try {
            await service.rejectOrderItem(id, reason.trim());
            toast.error("Item rejected", {
                icon: "❌" as any,
                style: { backgroundColor: '#FEF2F2', color: '#991B1B' }
            });

            // REMOVE ITEM FROM UI: Instant removal
            setOrders((prevOrders: sellerService.SellerOrder[]) =>
                prevOrders.map((order: sellerService.SellerOrder) => ({
                    ...order,
                    items: order.items.filter((item: sellerService.SellerOrderItem) => item.id !== id)
                })).filter((order: any) => order.items.length > 0)
            );

            window.dispatchEvent(new Event('seller:refresh-notifications'));
        } catch (err: any) {
            console.error("Failed to reject item", err);
            const msg = err.response?.data?.message || "Failed to reject item";
            toast.error(msg);
            throw err;
        }
    };

    const handleShowDetails = (order: sellerService.SellerOrder) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="p-6 sm:p-10 min-h-screen bg-[#FDFCFB]">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1d2d1f]">Manage Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">Review and approve incoming requests from customers.</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 text-sm font-medium text-[#4A6F5D] hover:bg-emerald-50 rounded-xl transition border border-emerald-100"
                    >
                        Refresh List
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <FiLoader className="w-12 h-12 text-[#4A6F5D] animate-spin mb-4 opacity-20" />
                        <p className="text-gray-400 font-medium tracking-tight">Syncing orders...</p>
                    </div>
                ) : visibleOrders.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="mx-auto w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-300">
                            <FiInbox size={40} />
                        </div>
                        <h3 className="text-lg font-bold text-[#1d2d1f]">All clear!</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                            No pending items waiting for approval right now.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {visibleOrders.map((order) => (
                            <SellerOrderCard
                                key={order.orderId}
                                order={order}
                                onApprove={handleApprove}
                                onReject={handleRejectRequest}
                                onShowDetails={() => handleShowDetails(order)}
                            />
                        ))}
                    </div>
                )}

                <RejectOrderItemModal
                    isOpen={isRejectModalOpen}
                    onClose={() => setIsRejectModalOpen(false)}
                    onConfirm={handleRejectConfirm}
                    productName={itemToReject?.name || ""}
                />

                <OrderDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    order={selectedOrder}
                />
            </div>
        </div>
    );
}
