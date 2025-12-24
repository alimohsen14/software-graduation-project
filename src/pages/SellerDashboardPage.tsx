import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
    getMyStore,
    getMyProducts,
    getMyOrders,
    SellerStore,
    SellerProduct,
} from "../services/seller.service";
import SellerStoreHeader from "../components/seller/SellerStoreHeader";
import SellerProductsTable from "../components/seller/SellerProductsTable";
import SellerOrdersPreview from "../components/seller/SellerOrdersPreview";
import AddSellerProductModal from "../components/seller/AddSellerProductModal";
import { FiPackage, FiAlertCircle } from "react-icons/fi";

export default function SellerDashboardPage() {
    const navigate = useNavigate();
    const [store, setStore] = useState<SellerStore | null>(null);
    const [products, setProducts] = useState<SellerProduct[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/");
            return;
        }

        setLoading(true);
        try {
            const storeData = await getMyStore(token);
            setStore(storeData);

            if (storeData) {
                const [productsData, ordersData] = await Promise.all([
                    getMyProducts(token),
                    getMyOrders(token),
                ]);
                setProducts(productsData);
                setOrders(ordersData);
            }
        } catch (err) {
            console.error("Failed to load seller data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!store) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertCircle className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1F2933] mb-2">
                            No Store Found
                        </h2>
                        <p className="text-gray-500 mb-6">
                            You haven't created a seller store yet. Apply to become a seller first.
                        </p>
                        <button
                            onClick={() => navigate("/become-seller")}
                            className="w-full px-6 py-3 bg-[#4A6F5D] text-white rounded-xl font-bold hover:bg-[#3d5c4d] transition"
                        >
                            Become a Seller
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!store.isApproved) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-[#1F2933] mb-2">
                            Application Pending
                        </h2>
                        <p className="text-gray-500 mb-4">
                            Your store "{store.name}" is awaiting approval. We'll notify you once it's reviewed.
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <>
                <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <SellerStoreHeader
                            store={store}
                            productCount={products.length}
                            onAddProduct={() => setIsModalOpen(true)}
                        />

                        <SellerOrdersPreview orders={orders} />

                        <SellerProductsTable
                            products={products}
                            onRefresh={fetchData}
                        />
                    </div>
                </div>

                {isModalOpen && (
                    <AddSellerProductModal
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            fetchData();
                        }}
                    />
                )}
            </>
        </DashboardLayout>
    );
}
