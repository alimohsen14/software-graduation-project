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
    const { t, i18n } = useTranslation();
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
        <div className={`py-6 md:py-10 px-4 md:px-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 ${isAr ? "text-right" : "text-left"}`}>
            <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl ${isAr ? "md:flex-row-reverse" : ""}`}>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-1">
                        {window.location.pathname.startsWith('/admin') ? t("seller.products.adminTitle") : t("seller.products.title")}
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[9px]">{t("seller.products.subtitle")}</p>
                </div>
                <div className={`flex flex-wrap items-center gap-3 shrink-0 ${isAr ? "justify-start" : "justify-end"}`}>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/50 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shadow-lg"
                    >
                        <FiUpload size={14} className={isAr ? "order-last" : ""} />
                        {t("seller.products.uploadFile")}
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600/30 transition-all shadow-xl"
                    >
                        <FiPlus size={16} className={isAr ? "order-last" : ""} />
                        {t("seller.products.addProduct")}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-xl">
                    <div className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="mt-6 font-black text-white/20 uppercase tracking-widest text-[10px]">{t("seller.products.loading")}</p>
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
