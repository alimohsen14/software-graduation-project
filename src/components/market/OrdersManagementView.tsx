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
        <div className="py-10 px-6 max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Order Management</h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Review and fulfill incoming specialized inventory requests</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all shadow-lg backdrop-blur-md"
                >
                    Synchronize Queue
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-xl">
                    <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="mt-6 font-black text-white/20 uppercase tracking-widest text-[10px]">Accessing Secure Records...</p>
                </div>
            ) : visibleOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-xl text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-white/5 border border-white/5 shadow-inner">
                        <FiInbox size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white/40 uppercase tracking-tight">System Optimized</h3>
                    <p className="mt-2 font-bold text-white/20 uppercase tracking-widest text-[10px] max-w-xs leading-relaxed">
                        No pending approvals found in your distribution network.
                    </p>
                </div>
            ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
    );
}
