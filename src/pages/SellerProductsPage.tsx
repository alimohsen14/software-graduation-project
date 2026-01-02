import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getMyProducts, SellerProduct } from "../services/seller.service";
import SellerProductsTable from "../components/seller/SellerProductsTable";
import AddSellerProductModal from "../components/seller/AddSellerProductModal";
import ImportProductsModal from "../components/seller/ImportProductsModal";
import { FiPlus, FiUpload } from "react-icons/fi";

export default function SellerProductsPage() {
    const [products, setProducts] = useState<SellerProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getMyProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to load products", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (product: SellerProduct) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <DashboardLayout>
            <div className="p-6 sm:p-10 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1d2d1f]">My Products</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage your catalog and stock levels.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#4A6F5D] border border-emerald-100 rounded-xl font-bold hover:bg-emerald-50 transition shadow-sm"
                            >
                                <FiUpload />
                                Import from Excel
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#4A6F5D] text-white rounded-xl font-bold hover:bg-[#3d5c4d] transition shadow-md shadow-emerald-50"
                            >
                                <FiPlus />
                                Add Product
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <p className="text-gray-400 font-medium">Syncing products...</p>
                        </div>
                    ) : (
                        <SellerProductsTable
                            products={products}
                            onRefresh={fetchProducts}
                            onEdit={handleEdit}
                            onDelete={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
                        />
                    )}
                </div>

                {isModalOpen && (
                    <AddSellerProductModal
                        onClose={handleClose}
                        onSuccess={() => {
                            handleClose();
                            fetchProducts();
                        }}
                        initialData={editingProduct}
                    />
                )}

                <ImportProductsModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onSuccess={() => {
                        fetchProducts();
                    }}
                />
            </div>
        </DashboardLayout>
    );
}
