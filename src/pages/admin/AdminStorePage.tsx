import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StoreSettingsView from "../../components/market/StoreSettingsView";
import { getStore } from "../../services/admin.service";

// Reuse the StoreSettingsView for admin store settings
export default function AdminStorePage() {
    return (
        <DashboardLayout>
            <StoreSettingsView />
        </DashboardLayout>
    );
}
