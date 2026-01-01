/* eslint-disable */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) return setError("❌ Invalid email");
    if (password.length < 6)
      return setError("❌ Password must be at least 6 characters");

    try {
      setLoading(true);
      setError("");

      await login({ email, password });

      // Update global auth state before navigating
      const userData = await refreshUser();

      if (userData) {
        navigate("/home", { replace: true });
      } else {
        setError("Login successful, but session failing. Please ensure cookies are enabled.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "❌ Invalid credentials or server error.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Google Login
  const handleGoogleLogin = () => {
    const GOOGLE_CLIENT_ID =
      "553195983261-00uvqi0ur841q0urmjakc87abu40ql0r.apps.googleusercontent.com";
    const REDIRECT_URI = "http://localhost:3000/auth/google/callback";
    const SCOPE = "email profile";
    const RESPONSE_TYPE = "code";

    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`;

    window.location.href = googleAuthURL;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="relative z-10 w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">
            Palestine 3D | فلسطين ثلاثية الأبعاد
          </h1>
        </header>

        <div className="rounded-2xl p-1 bg-gradient-to-r from-green-200/60 via-transparent to-red-200/40 shadow-xl">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setTab("login")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${tab === "login"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign Up
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-gray-50"
                placeholder="you@example.com"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md bg-gray-50"
                placeholder="********"
              />

              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all shadow-sm"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span>Log in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
