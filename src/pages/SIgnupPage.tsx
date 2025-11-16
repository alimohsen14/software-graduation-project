/* eslint-disable */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signup, completeGoogleSignup } from "../services/authService";

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const isGoogleUser = query.get("google") === "true";
  const googleEmail = query.get("email") ?? "";
  const googleToken = query.get("token") ?? "";

  const [form, setForm] = useState({
    name: "",
    email: googleEmail,
    country: "",
    age: "",
    gender: "MALE",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const payload: any = {
        name: form.name.trim(),
        email: form.email.trim(),
        country: form.country,
        age: Number(form.age),
        gender: form.gender as "MALE" | "FEMALE",
      };

      if (!isGoogleUser) {
        // Normal Signup
        if (!form.password || !form.confirmPassword)
          throw new Error("Please enter and confirm password");
        if (form.password !== form.confirmPassword)
          throw new Error("Passwords do not match");

        payload.password = form.password;

        await signup(payload);
      } else {
        // Google Signup — MUST include token
        await completeGoogleSignup({
          ...payload,
          token: googleToken,
        });
      }

      navigate("/home");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Signup failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="relative z-10 w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">
            {isGoogleUser
              ? "Complete Your Google Account"
              : "Create New Account"}
          </h1>
        </header>

        <div className="rounded-2xl p-1 bg-gradient-to-r from-green-200/60 via-transparent to-red-200/40 shadow-xl">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
              />

              {!isGoogleUser && (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
                />
              )}

              {isGoogleUser && (
                <input
                  type="email"
                  value={googleEmail}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-100 cursor-not-allowed"
                />
              )}

              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
              />

              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
              />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>

              {!isGoogleUser && (
                <>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
                  />
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 text-white rounded-lg font-semibold transition-transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading
                  ? "Creating Account..."
                  : isGoogleUser
                  ? "Complete Signup"
                  : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
