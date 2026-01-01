import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PublicOnly({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    // 1. Undefined = Check in progress -> Render NOTHING (Silent)
    if (user === undefined) {
        return null;
    }

    // 2. Authenticated -> Redirect to home
    if (user) {
        return <Navigate to="/home" replace />;
    }

    // 3. Unauthenticated -> Render Page
    return <>{children}</>;
}
