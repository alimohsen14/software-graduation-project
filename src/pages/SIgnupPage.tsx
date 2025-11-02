import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    country: "",
    age: "",
    gender: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("⚠️ Please fill all required fields");
      return;
    }
    if (!form.email.includes("@")) {
      setError("⚠️ Please enter a valid email");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("⚠️ Passwords do not match");
      return;
    }

    setError("");
    console.log("✅ User Created:", form);

    // navigate to home page after successful signup
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {/* Background kufiyah pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e6f7ef_1px,transparent_1px)] bg-[length:24px_24px] opacity-40"></div>

      <div className="relative z-10 w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">
            Create New Account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join{" "}
            <span className="text-red-600 font-semibold">Palestine 3D</span> and
            preserve our heritage with technology.
          </p>
        </header>

        {/* Outer gradient border */}
        <div className="rounded-2xl p-1 bg-gradient-to-r from-green-200/60 via-transparent to-red-200/40 shadow-xl">
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-100 bg-gray-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-100 bg-gray-50"
                />
              </div>

              {/* Country + Age */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-100 bg-gray-50"
                  >
                    <option value="">Select</option>
                    <option value="Palestine">Palestine</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2 mt-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-100 bg-gray-50"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="flex items-center gap-4 mt-1">
                  {["Male", "Female", "Other"].map((gender) => (
                    <label
                      key={gender}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={form.gender === gender}
                        onChange={handleChange}
                      />
                      {gender}
                    </label>
                  ))}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="flex flex-col gap-1 mt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="role"
                      value="SELLER"
                      checked={form.role === "SELLER"}
                      onChange={handleChange}
                    />
                    I am a Seller
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="role"
                      value="USER"
                      checked={form.role === "USER"}
                      onChange={handleChange}
                    />
                    I am a Regular User
                  </label>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-100 bg-gray-50"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-md focus:ring-2 focus:ring-red-100 bg-gray-50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold shadow-sm hover:bg-red-700 transition-transform hover:scale-[1.01]"
              >
                Create Account
              </button>

              {/* Footer */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/")}
                  className="text-red-600 hover:underline cursor-pointer font-medium"
                >
                  Login here
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
