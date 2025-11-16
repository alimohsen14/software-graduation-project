import React, { useState, useEffect } from "react";
import { resetPassword } from "../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";

export function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ تلقائيًا يسحب التوكن من الرابط بعد ?token=
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">
          Reset Your Password 🔒
        </h2>

        {error && (
          <div className="text-red-500 text-center text-sm font-medium mb-3">
            {error}
          </div>
        )}
        {message && (
          <div className="text-green-600 text-center text-sm font-medium mb-3">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-200 bg-gray-50"
          />

          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Go back to{" "}
          <span
            className="text-red-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
