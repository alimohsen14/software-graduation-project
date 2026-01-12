import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

export function LoginPage() {
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
    <AuthLayout>
      <div className="flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            className="flex-1 pb-4 text-center border-b-2 border-emerald-500 font-bold text-emerald-500"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="flex-1 pb-4 text-center border-b-2 border-transparent font-semibold text-white/40 hover:text-white/70 transition-colors"
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white"
              placeholder="Password"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-white/40 hover:text-emerald-400 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#CE1126] text-white rounded-2xl font-bold shadow-xl shadow-red-900/40 hover:bg-[#e6122a] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            <span className="text-lg">{loading ? "Logging in..." : "Login"}</span>
            {!loading && <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1a130f] text-white/30 font-bold tracking-widest uppercase">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-5 h-5 opacity-90"
          />
          <span>Continue with Google</span>
        </button>

        <p className="mt-10 text-center text-sm text-white/40">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
