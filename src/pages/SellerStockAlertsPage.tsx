import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import StockAlertsManagementView from "../components/market/StockAlertsManagementView";

export default function SellerStockAlertsPage() {
    return (
        <DashboardLayout>
            <StockAlertsManagementView />
        </DashboardLayout>
    );
}
