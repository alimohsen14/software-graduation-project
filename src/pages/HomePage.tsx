import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  country?: string;
  gender?: string;
  age?: number;
}

export function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          console.warn("⚠️ No token found — redirecting to login");
          navigate("/");
          return;
        }

        const res = await axios.get<{ message: string; user: UserProfile }>(
          "http://localhost:3000/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data.user);
        console.log("✅ Loaded user profile:", res.data.user);
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800">
        🇵🇸 Welcome {user ? user.name : "Guest"} to Palestine 3D
      </h1>

      <p className="mt-4 text-gray-600 text-lg">
        Explore our heritage and culture in 3D.
      </p>

      <button
        onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/");
        }}
        className="mt-6 px-5 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
