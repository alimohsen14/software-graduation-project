import React, { useState, useEffect } from "react";
import { resetPassword } from "../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { FiLock, FiArrowRight } from "react-icons/fi";

export function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("⚠️ Invalid or missing token");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("⚠️ Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("⚠️ Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(token, newPassword);
      setMessage(res.data.message || "✅ Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "❌ Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-emerald-400">Reset Password</h2>
          <p className="text-sm text-white/40 mt-2">Enter your new password below.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-2xl text-center font-medium">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-2xl text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white"
              placeholder="New Password"
              required
            />
          </div>

          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white"
              placeholder="Confirm Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#CE1126] text-white rounded-2xl font-bold shadow-xl shadow-red-900/40 hover:bg-[#e6122a] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            <span className="text-lg">{loading ? "Resetting..." : "Reset Password"}</span>
            {!loading && <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-white/40 font-medium">
          Go back to{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
          >
            Login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
