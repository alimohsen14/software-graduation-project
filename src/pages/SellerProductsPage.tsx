import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductManagementView from "../components/market/ProductManagementView";

export default function SellerProductsPage() {
    return (
        <DashboardLayout>
            <ProductManagementView />
        </DashboardLayout>
    );
}
