import React, { useEffect, useState } from "react";
import AdminMarketHeader from "../../components/admin/AdminMarketHeader";
import LowStockAlerts from "../../components/admin/LowStockAlerts";
import CustomerOrdersPreview from "../../components/admin/CustomerOrdersPreview";
import ProductsManagementTable, {
  MappedProduct,
} from "../../components/admin/ProductsManagementTable";
import AddProductModal from "../../components/admin/AddProductModal";

import {
  getAllProducts,
  Product,
  createProduct,
  updateProduct,
  deleteProduct,
  CreateProductPayload,
} from "../../services/shopService";
import {
  getAllOrders,
  approveOrder,
  rejectOrder,
  AdminStatus,
} from "../../services/order.service";

type ProductStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

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
  status: "PENDING" | "PAID" | "CANCELED" | "SHIPPED";
  adminStatus: AdminStatus;
  rejectionReason?: string;
};

export default function AdminMarketPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // Fetch Orders (Admin)
  // =========================
  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError(null);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setOrdersError("Not authenticated. Please log in.");
        setLoadingOrders(false);
        return;
      }

      const data = await getAllOrders(token);
      console.log("Orders fetched:", data);

      if (!data || !Array.isArray(data)) {
        setOrdersError("Invalid response from server");
        setOrders([]);
        return;
      }

      const mappedOrders: AdminOrder[] = data.map((order) => ({
        id: String(order.id),
        customerName: order.user?.name || "Unknown",
        customerEmail: order.user?.email,
        phone: order.phone,
        city: order.city,
        address: order.address,
        products: order.items
          ?.map((item) => `${item.product?.name || "Product"} (x${item.quantity})`)
          .join(", ") || "No items",
        items: order.items || [],
        total: order.total,
        location: order.city,
        status: order.status,
        adminStatus: order.adminStatus || "ADMIN_PENDING",
        rejectionReason: order.rejectionReason,
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrdersError("Failed to load orders. Please try again.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // Handle Add Product
  // =========================
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // =========================
  // Handle Edit Product
  // =========================
  const handleOpenEditModal = (mappedProduct: MappedProduct) => {
    const originalProduct = products.find(
      (p) => String(p.id) === mappedProduct.id
    );
    if (originalProduct) {
      setEditingProduct(originalProduct);
      setIsModalOpen(true);
    }
  };

  // =========================
  // Handle Submit (Add/Edit)
  // =========================
  const handleSubmit = async (data: CreateProductPayload) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(token, editingProduct.id, data);
      } else {
        await createProduct(token, data);
      }

      await fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to save product", err);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // Handle Delete Product
  // =========================
  const handleDelete = async (productId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(token, Number(productId));
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================
  // Handle Approve Order
  // =========================
  const handleApproveOrder = async (orderId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    try {
      await approveOrder(token, Number(orderId));
      await fetchOrders();
    } catch (err) {
      console.error("Failed to approve order", err);
      alert("Failed to approve order. Please try again.");
    }
  };

  // =========================
  // Handle Reject Order
  // =========================
  const handleRejectOrder = async (orderId: string, reason: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to perform this action");
      return;
    }

    try {
      await rejectOrder(token, Number(orderId), reason);
      // Refetch both orders and products (stock restored after reject)
      await Promise.all([fetchOrders(), fetchProducts()]);
    } catch (err) {
      console.error("Failed to reject order", err);
      alert("Failed to reject order. Please try again.");
    }
  };

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
  const mappedProducts: MappedProduct[] = products.map((p) => {
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
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      category: p.category,
      badge: p.badge,
    };
  });

  // =========================
  // Prepare edit data for modal
  // =========================
  const editFormData = editingProduct
    ? {
      name: editingProduct.name,
      shortDescription: editingProduct.shortDescription || "",
      fullDescription: editingProduct.fullDescription || "",
      price: editingProduct.price,
      image: editingProduct.image,
      stock: editingProduct.stock,
      category: editingProduct.category,
      badge: editingProduct.badge || "",
    }
    : null;

  return (
    <div className="min-h-screen w-full px-6 pt-6 pb-12 bg-[#eaf5ea]">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <AdminMarketHeader onAddProduct={handleOpenAddModal} />

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
        ) : ordersError ? (
          <div className="w-full bg-white rounded-xl shadow-sm px-6 py-5">
            <div className="text-red-600 mb-2">{ordersError}</div>
            <button
              onClick={fetchOrders}
              className="text-sm text-[#4A6F5D] font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <CustomerOrdersPreview
            orders={orders}
            onApprove={handleApproveOrder}
            onReject={handleRejectOrder}
          />
        )}

        {/* Products */}
        {loadingProducts ? (
          <div className="w-full bg-white rounded-xl shadow-sm px-6 py-5">
            Loading products...
          </div>
        ) : (
          <ProductsManagementTable
            products={mappedProducts}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <AddProductModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleSubmit}
          initialData={editFormData}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
