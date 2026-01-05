import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OrdersManagementView from "../../components/market/OrdersManagementView";
import { getOrders } from "../../services/admin.service";

// Reuse the OrdersManagementView for admin
export default function AdminOrdersPage() {
    return (
        <DashboardLayout>
            <OrdersManagementView />
        </DashboardLayout>
    );
}
