import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleRedirect = async () => {
      // With cookie-based auth, the backend should have already set the cookie 
      // before redirecting the user back to the frontend.
      // We just need to refresh our local state.
      try {
        await refreshUser();
        navigate("/");
      } catch (error) {
        console.error("Google Auth Refresh failed:", error);
        navigate("/login");
      }
    };

    handleRedirect();
  }, [location, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-lg text-gray-700">Authenticating...</h1>
    </div>
  );
}
