import React, { useState } from "react";
import { forgotPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.includes("@")) {
      setError("⚠️ Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);

      if (res.data.resetToken) {
        setMessage(
          `✅ Reset link sent successfully!\n(Dev Mode) Token:\n${res.data.resetToken}`
        );
      } else {
        setMessage("✅ Reset link sent to your email!");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "❌ Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-emerald-400">Forgot Password?</h2>
          <p className="text-sm text-white/40 mt-2 leading-relaxed">Enter your email to receive a password reset link.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-2xl text-center font-medium">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm rounded-2xl text-center font-medium whitespace-pre-line leading-relaxed">
            {message}
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
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#CE1126] text-white rounded-2xl font-bold shadow-xl shadow-red-900/40 hover:bg-[#e6122a] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            <span className="text-lg">{loading ? "Sending..." : "Send Reset Link"}</span>
            {!loading && <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-white/40">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
          >
            <FiArrowLeft size={16} /> Back to Login
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
