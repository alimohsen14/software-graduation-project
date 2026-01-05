import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StoreSettingsView from '../../components/market/StoreSettingsView';

export default function ManageMyShopPage() {
    return (
        <DashboardLayout>
            <StoreSettingsView />
        </DashboardLayout>
    );
}
