import React, { useEffect, useState } from "react";
import * as sellerService from "../../services/seller.service";
import * as adminService from "../../services/admin.service";
import SellerProductsTable from "../seller/SellerProductsTable";
import AddSellerProductModal from "../seller/AddSellerProductModal";
import ImportProductsModal from "../seller/ImportProductsModal";
import { useTranslation } from "react-i18next";
import { FiPlus, FiUpload } from "react-icons/fi";

const getService = () => window.location.pathname.startsWith('/admin') ? adminService : sellerService;

export default function ProductManagementView() {
    const { t, i18n } = useTranslation("seller");
    const service = getService();
    const [products, setProducts] = useState<sellerService.SellerProduct[]>([]);
    // ...
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<sellerService.SellerProduct | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await service.getProducts();
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

    const handleEdit = (product: sellerService.SellerProduct) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const isAr = i18n.language === "ar";

    return (
        <div className={`py-10 px-6 max-w-[900px] mx-auto space-y-10 animate-in fade-in duration-700 ${isAr ? "text-right" : "text-left"}`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${isAr ? "sm:flex-row-reverse" : ""}`}>
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">
                        {window.location.pathname.startsWith('/admin') ? t("products.adminTitle") : t("products.title")}
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[9px]">{t("products.subtitle")}</p>
                </div>
                <div className={`flex items-center gap-3 shrink-0 ${isAr ? "flex-row-reverse" : ""}`}>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white/50 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-lg backdrop-blur-md"
                    >
                        <FiUpload size={14} />
                        {t("products.uploadFile")}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/10"
                    >
                        <FiPlus size={16} />
                        {t("products.addProduct")}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-xl">
                    <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="mt-6 font-black text-white/20 uppercase tracking-widest text-[10px]">{t("products.loading")}</p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <SellerProductsTable
                        products={products}
                        onRefresh={fetchProducts}
                        onEdit={handleEdit}
                        deleteProductFn={service.deleteProduct}
                    />
                </div>
            )}

            {isModalOpen && (
                <AddSellerProductModal
                    onClose={handleClose}
                    onSuccess={() => {
                        handleClose();
                        fetchProducts();
                    }}
                    initialData={editingProduct}
                    createProductFn={service.createProduct}
                    updateProductFn={service.updateProduct}
                />
            )}

            <ImportProductsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onSuccess={() => {
                    fetchProducts();
                }}
                importProductsFn={service.importProductsFromExcel}
            />
        </div>
    );
}
