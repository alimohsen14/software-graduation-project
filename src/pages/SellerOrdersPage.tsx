import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import OrdersManagementView from "../components/market/OrdersManagementView";

export default function SellerOrdersPage() {
    return (
        <DashboardLayout>
            <OrdersManagementView />
        </DashboardLayout>
    );
}
