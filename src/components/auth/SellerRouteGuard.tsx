import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';

export default function SellerRouteGuard() {
    const { user, loading } = useAuth();
    const location = useLocation();

    // We don't need useEffect here, we can rely on context

    if (loading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-500">Verifying authorization...</p>
                </div>
            </DashboardLayout>
        );
    }

    const isAuthorized = user?.store?.type === 'SELLER';

    if (!isAuthorized) {
        return <Navigate to="/profile" replace state={{ error: "You are not authorized to access this page." }} />;
    }

    return <Outlet />;
}
