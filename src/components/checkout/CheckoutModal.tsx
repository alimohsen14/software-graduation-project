import React, { useState, useEffect } from "react";
import { FiX, FiMapPin, FiHome, FiPhone, FiCreditCard, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface CheckoutModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (data: { city: string; address: string; phone: string }) => void;
  isLoading?: boolean;
}

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  Palestine: ["Nablus", "Ramallah", "Hebron", "Gaza", "Jenin", "Tulkarm"],
};

export default function CheckoutModal({
  total,
  onClose,
  onConfirm,
  isLoading = false,
}: CheckoutModalProps) {
  const { t, i18n: i18nInstance } = useTranslation();
  const isRtl = i18nInstance.language === "ar";

  const [country, setCountry] = useState("Palestine");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const availableCities = CITIES_BY_COUNTRY[country] || [];

  // Prevent background page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCountry(e.target.value);
    setCity("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!city || !address || !phone) {
      setError(t("marketplace.checkout.errorRequired"));
      return;
    }

    if (phone.length < 9) {
      setError(t("marketplace.checkout.errorPhone"));
      return;
    }

    onConfirm({ city, address, phone });
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-500"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="w-full max-h-[90vh] sm:max-h-none sm:h-auto sm:max-w-md bg-[#0d0d0d] sm:bg-[#0d0d0d]/90 sm:backdrop-blur-3xl sm:rounded-[3.5rem] border-t sm:border border-white/10 shadow-2xl p-4 sm:p-6 relative animate-in zoom-in-95 duration-500 group overflow-y-auto flex flex-col">
        {/* Background decorative glows */}
        <div className="hidden sm:block absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
        <div className="hidden sm:block absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />

        {/* Close */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`absolute top-4 ${isRtl ? "left-4" : "right-4"} sm:top-6 sm:${isRtl ? "left-6" : "right-6"} text-white/20 hover:text-white transition-all bg-white/5 p-2.5 rounded-xl border border-white/5 hover:bg-white/10 active:scale-90 disabled:opacity-50 z-20`}
        >
          <FiX size={18} />
        </button>

        {/* Header */}
        <div className="mb-4 sm:mb-6 text-center relative z-10 pt-2 sm:pt-0">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-1 sm:mb-2 block">{t("marketplace.checkout.title")}</span>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
            {t("marketplace.checkout.subtitle")}
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center animate-bounce">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 relative z-10">
          {/* Country */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-xs sm:text-sm font-black uppercase tracking-widest text-white/20 ml-1">{t("marketplace.checkout.origin")}</label>
            <div className="relative group/field">
              <FiGlobe className={`absolute ${isRtl ? "right-4 font-bold" : "left-4"} top-1/2 -translate-y-1/2 text-white/30 group-focus-within/field:text-emerald-500 transition-colors pointer-events-none`} />
              <select
                value={country}
                onChange={handleCountryChange}
                disabled={isLoading}
                className={`w-full ${isRtl ? "pr-10 sm:pr-12 pl-4" : "pl-10 sm:pl-12 pr-4"} py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 transition-all appearance-none disabled:opacity-50 text-sm font-medium`}
              >
                <option value="Palestine">Palestine</option>
              </select>
            </div>
          </div>

          {/* City */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-xs sm:text-sm font-black uppercase tracking-widest text-white/20 ml-1">{t("marketplace.checkout.hub")}</label>
            <div className="relative group/field">
              <FiMapPin className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-white/30 group-focus-within/field:text-emerald-500 transition-colors pointer-events-none`} />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isLoading}
                className={`w-full ${isRtl ? "pr-10 sm:pr-12 pl-4" : "pl-10 sm:pl-12 pr-4"} py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 transition-all appearance-none disabled:opacity-50 text-sm font-medium`}
              >
                <option value="" className="bg-zinc-900">{t("marketplace.checkout.selectCity")}</option>
                {availableCities.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-xs sm:text-sm font-black uppercase tracking-widest text-white/20 ml-1">{t("marketplace.checkout.coordinates")}</label>
            <div className="relative group/field">
              <FiHome className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-white/30 group-focus-within/field:text-emerald-500 transition-colors pointer-events-none`} />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("marketplace.checkout.addressPlaceholder")}
                disabled={isLoading}
                className={`w-full ${isRtl ? "pr-10 sm:pr-12 pl-4" : "pl-10 sm:pl-12 pr-4 text-left"} py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 transition-all disabled:opacity-50 placeholder:text-white/10 text-sm font-medium`}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1 sm:space-y-1.5">
            <label className="text-xs sm:text-sm font-black uppercase tracking-widest text-white/20 ml-1">{t("marketplace.checkout.commLink")}</label>
            <div className="relative group/field">
              <FiPhone className={`absolute ${isRtl ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-white/30 group-focus-within/field:text-emerald-500 transition-colors pointer-events-none`} />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("marketplace.checkout.phonePlaceholder")}
                type="tel"
                disabled={isLoading}
                className={`w-full ${isRtl ? "pr-10 sm:pr-12 pl-4" : "pl-10 sm:pl-12 pr-4 text-left"} py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 transition-all disabled:opacity-50 placeholder:text-white/10 text-sm font-medium`}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-1 sm:mt-2 p-3 sm:p-5 bg-emerald-500/5 rounded-xl sm:rounded-[2rem] border border-emerald-500/10 flex items-center justify-between shadow-inner group/val relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-transparent opacity-0 group-hover/val:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/40 block mb-0.5">{t("marketplace.checkout.settlement")}</span>
              <p className="text-lg sm:text-2xl font-black text-white">{total}<span className="text-emerald-500 text-xs ml-1">₪</span></p>
            </div>
            <FiCreditCard className="text-white/5 relative z-10" size={32} />
          </div>

          {/* Confirm */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 sm:mt-2 w-full sm:w-max sm:self-center sm:px-10 flex items-center justify-center gap-3 py-3.5 sm:py-4 rounded-xl sm:rounded-full bg-emerald-600/20 text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em] border border-emerald-500/20 hover:bg-emerald-600/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all shadow-2xl disabled:opacity-50 active:scale-[0.98] group/btn mb-2 sm:mb-0"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                {t("marketplace.checkout.processing")}
              </>
            ) : (
              <>
                <FiCreditCard size={20} className="group-hover:scale-110 transition-transform" />
                {t("marketplace.checkout.finalize")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
