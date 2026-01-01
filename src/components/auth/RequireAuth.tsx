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

    // 3. Authenticated -> Render Page
    return <>{children}</>;
}
