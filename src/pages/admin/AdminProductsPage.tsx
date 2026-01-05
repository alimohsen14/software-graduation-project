import DashboardLayout from "../../components/layout/DashboardLayout";
import ProductManagementView from "../../components/market/ProductManagementView";
import { getProducts } from "../../services/admin.service";

export default function AdminProductsPage() {
    return (
        <DashboardLayout>
            <ProductManagementView />
        </DashboardLayout>
    );
}
