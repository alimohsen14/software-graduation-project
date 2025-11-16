import React, { useState } from "react";
import { forgotPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
          Forgot Password 🔑
        </h2>

        {error && (
          <div className="text-red-500 text-center text-sm font-medium mb-3">
            {error}
          </div>
        )}
        {message && (
          <div className="text-green-600 text-sm font-medium whitespace-pre-line text-center mb-3">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter your email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 bg-gray-50"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-lg font-semibold shadow-sm transition-transform hover:scale-[1.01] ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Remember your password?{" "}
          <span
            className="text-red-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
