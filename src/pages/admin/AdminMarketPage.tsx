import React, { useEffect, useState } from "react";
import AdminMarketHeader from "../../components/admin/AdminMarketHeader";
import LowStockAlerts from "../../components/admin/LowStockAlerts";
import CustomerOrdersPreview from "../../components/admin/CustomerOrdersPreview";
import ProductsManagementTable from "../../components/admin/ProductsManagementTable";
import AddProductModal from "../../components/admin/AddProductModal";

import { getAllProducts, Product } from "../../services/shopService";
import { getAllOrders } from "../../services/order.service";
import { createProduct } from "../../services/shopService";

type ProductStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

type AdminOrder = {
  id: string;
  customerName: string;
  products: string;
  total: number;
  location: string;
  status: "PENDING" | "PAID" | "CANCELED" | "SHIPPED";
};

export default function AdminMarketPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // 🟢 Add Product Modal
  const [isAddOpen, setIsAddOpen] = useState(false);

  // =========================
  // Fetch Products
  // =========================
  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProducts();
  }, []);

  // =========================
  // Fetch Orders (Admin)
  // =========================
  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const data = await getAllOrders(token);

        const mappedOrders: AdminOrder[] = data.map((order) => ({
          id: String(order.id),
          customerName: order.user.name,
          products: order.items
            .map((item) => `${item.product.name} (x${item.quantity})`)
            .join(", "),
          total: order.total,
          location: order.city,
          status: order.status,
        }));

        setOrders(mappedOrders);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoadingOrders(false);
      }
    }

    fetchOrders();
  }, []);

  // =========================
  // Low stock alerts
  // =========================
  const lowStockItems = products
    .filter((p) => p.stock > 0 && p.stock <= 10)
    .map((p) => ({
      id: String(p.id),
      name: p.name,
      remaining: p.stock,
    }));

  // =========================
  // Products table mapping
  // =========================
  const mappedProducts = products.map((p) => {
    let status: ProductStatus = "IN_STOCK";

    if (p.stock === 0) status = "OUT_OF_STOCK";
    else if (p.stock <= 10) status = "LOW_STOCK";

    return {
      id: String(p.id),
      image: p.image,
      name: p.name,
      price: p.price,
      stock: p.stock,
      status,
    };
  });

  return (
    <div className="min-h-screen w-full px-6 pt-6 pb-12 bg-[#3e6347]">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <AdminMarketHeader onAddProduct={() => setIsAddOpen(true)} />

        {/* Low stock alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {loadingProducts ? (
            <div className="w-full bg-white rounded-xl shadow-sm px-6 py-5">
              Loading low stock alerts...
            </div>
          ) : (
            <LowStockAlerts items={lowStockItems} />
          )}
        </div>

        {/* Orders */}
        {loadingOrders ? (
          <div className="w-full bg-white rounded-xl shadow-sm px-6 py-5">
            Loading orders...
          </div>
        ) : (
          <CustomerOrdersPreview orders={orders} />
        )}

        {/* Products */}
        {loadingProducts ? (
          <div className="w-full bg-white rounded-xl shadow-sm px-6 py-5">
            Loading products...
          </div>
        ) : (
          <ProductsManagementTable products={mappedProducts} />
        )}
      </div>

      {/* =========================
          Add Product Modal
      ========================= */}
      {isAddOpen && (
        <AddProductModal
          onClose={() => setIsAddOpen(false)}
          onSubmit={(data) => {
            console.log("NEW PRODUCT DATA:", data);
            setIsAddOpen(false);
          }}
        />
      )}
    </div>
  );
}
