import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function GoogleRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/home");
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-lg text-gray-700">Loading...</h1>
    </div>
  );
}
