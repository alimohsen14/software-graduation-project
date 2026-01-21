import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const location = useLocation();

    // 1. Undefined = Check in progress -> Render NOTHING (Silent)
    if (user === undefined) {
        return null;
    }

    // 2. Null = Unauthenticated -> Redirect to login
    if (user === null) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Role-Based Redirection
    const path = location.pathname;

    // Admin hitting Seller routes
    if (user.isAdmin && path.startsWith("/seller")) {
        console.warn("RequireAuth: Admin attempted to access Seller route, redirecting to Admin Market");
        return <Navigate to="/admin/market" replace />;
    }

    // Seller hitting Admin routes
    if (user.isSeller && path.startsWith("/admin")) {
        console.warn("RequireAuth: Seller attempted to access Admin route, redirecting to Seller Dashboard");
        return <Navigate to="/seller" replace />;
    }

    // Non-Admin hitting Admin routes (security guard)
    if (!user.isAdmin && path.startsWith("/admin")) {
        return <Navigate to="/" replace />;
    }

    // Non-Seller hitting Seller routes (security guard)
    if (!user.isSeller && path.startsWith("/seller")) {
        return <Navigate to="/become-seller" replace />;
    }

    // 4. Authenticated & Authorized -> Render Page
    return <>{children}</>;
}
