import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signup, completeGoogleSignup } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import AuthLayout from "../components/auth/AuthLayout";
import { FiUser, FiMail, FiMapPin, FiCalendar, FiLock, FiArrowRight } from "react-icons/fi";

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const isGoogleUser = query.get("google") === "true";
  const googleEmail = query.get("email") ?? "";

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
  const { t } = useTranslation();
  const { refreshUser } = useAuth();

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
        if (!form.password || !form.confirmPassword)
          throw new Error("Please enter and confirm password");
        if (form.password !== form.confirmPassword)
          throw new Error("Passwords do not match");

        payload.password = form.password;
        await signup(payload);
      } else {
        await completeGoogleSignup(payload);
      }

      const userData = await refreshUser();

      if (userData) {
        navigate("/", { replace: true });
      } else {
        setError("Signup successful, but session failing (cookies blocked?).");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Signup failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col">
        {/* Tabs */}
        {!isGoogleUser && (
          <div className="flex border-b border-white/10 mb-6 md:mb-8">
            <button
              onClick={() => navigate("/login")}
              className="flex-1 pb-3 md:pb-4 text-center border-b-2 border-transparent font-semibold text-white/40 hover:text-white/70 transition-colors"
            >
              {t("auth.login")}
            </button>
            <button
              className="flex-1 pb-3 md:pb-4 text-center border-b-2 border-emerald-500 font-bold text-emerald-500"
            >
              {t("auth.signup")}
            </button>
          </div>
        )}

        {isGoogleUser && (
          <div className="mb-6 md:mb-8 text-center px-4">
            <h2 className="text-lg md:text-xl font-bold text-emerald-400">{t("auth.completeAccount")}</h2>
            <p className="text-xs md:text-sm text-white/40 mt-1">{t("auth.fillRemainingDetails")}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl md:rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3.5 md:gap-5">
          <div className="relative group">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white min-h-[44px]"
              placeholder={t("auth.fullName")}
              required
            />
          </div>

          {!isGoogleUser && (
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white min-h-[44px]"
                placeholder={t("auth.email")}
                required
              />
            </div>
          )}

          {isGoogleUser && (
            <div className="relative opacity-60">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={googleEmail}
                disabled
                className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white/10 border border-white/10 rounded-xl md:rounded-2xl cursor-not-allowed text-white/70 min-h-[44px]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-5">
            <div className="relative group">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white min-h-[44px]"
                placeholder={t("auth.country")}
                required
              />
            </div>
            <div className="relative group">
              <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white min-h-[44px]"
                placeholder={t("auth.age")}
                required
              />
            </div>
          </div>

          <div className="relative">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer text-white min-h-[44px]"
            >
              <option value="MALE" className="bg-[#1a130f]">{t("auth.male")}</option>
              <option value="FEMALE" className="bg-[#1a130f]">{t("auth.female")}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-white/30">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          {!isGoogleUser && (
            <div className="grid grid-cols-1 gap-3.5 md:gap-5">
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white min-h-[44px]"
                  placeholder={t("auth.password")}
                  required
                />
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-white/20 text-white min-h-[44px]"
                  placeholder={t("auth.confirmPassword")}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 md:py-4 bg-[#CE1126] text-white rounded-xl md:rounded-2xl font-bold shadow-xl shadow-red-900/40 hover:bg-[#e6122a] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-1 md:mt-2 min-h-[44px]"
          >
            <span className="text-base md:text-lg">
              {loading
                ? t("auth.processing") || "Processing..."
                : isGoogleUser
                  ? t("auth.completeSignup")
                  : t("auth.createAccount")}
            </span>
            {!loading && <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {!isGoogleUser && (
          <p className="mt-8 md:mt-10 text-center text-xs md:text-sm text-white/40">
            {t("auth.alreadyHaveAccount")}{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              {t("auth.login")}
            </button>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
