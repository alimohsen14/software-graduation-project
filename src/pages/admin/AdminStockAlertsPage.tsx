import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StockAlertsManagementView from "../../components/market/StockAlertsManagementView";
import { getStockAlerts } from "../../services/admin.service";

// Reuse the StockAlertsManagementView for admin
export default function AdminStockAlertsPage() {
    return (
        <DashboardLayout>
            <StockAlertsManagementView />
        </DashboardLayout>
    );
}
