import React from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * OptionalAuth Wrapper
 * 
 * Purpose: Allow pages to render for both visitors and authenticated users
 * without forcing a redirect. This enables "preview mode" experiences.
 * 
 * Use cases:
 * - Market page (browse products without login)
 * - AI page (view interface without login)
 * - Explore/3D page (public access)
 * 
 * The component provides auth context to children so they can conditionally
 * render features based on authentication state.
 */
export default function OptionalAuth({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    // 1. Undefined = Auth check in progress
    // Still render children to avoid flash of missing content
    // Children should handle their own loading states if needed

    // 2. Null = Visitor (unauthenticated)
    // Allow them to see the page

    // 3. User object = Authenticated
    // Allow them full access

    // Always render children regardless of auth state
    return <>{children}</>;
}
