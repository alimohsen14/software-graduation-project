import React, { useState } from "react";
import { FiX, FiMapPin, FiHome, FiPhone, FiCreditCard, FiGlobe } from "react-icons/fi";

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
  const [country, setCountry] = useState("Palestine");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const availableCities = CITIES_BY_COUNTRY[country] || [];

  function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setCountry(e.target.value);
    setCity("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!city || !address || !phone) {
      setError("Please fill in all required fields");
      return;
    }

    if (phone.length < 9) {
      setError("Please enter a valid phone number");
      return;
    }

    onConfirm({ city, address, phone });
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-2xl p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-lg bg-[#0d0d0d]/90 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 shadow-2xl p-12 relative animate-in zoom-in-95 duration-500 group overflow-hidden">
        {/* Background decorative glows */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-1000" />

        {/* Close */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-all bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 active:scale-90 disabled:opacity-50"
        >
          <FiX size={20} />
        </button>

        {/* Header */}
        <div className="mb-10 text-center relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3 block">Resolution Phase</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Finalize Delivery
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-bounce">
            Error: {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
          {/* Country */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Geographical Origin</label>
            <div className="relative group/field">
              <FiGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/field:text-emerald-500 transition-colors" />
              <select
                value={country}
                onChange={handleCountryChange}
                disabled={isLoading}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 transition-all appearance-none disabled:opacity-50 font-medium"
              >
                <option value="Palestine">Palestine</option>
              </select>
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Designated Hub</label>
            <div className="relative group/field">
              <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/field:text-emerald-500 transition-colors" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isLoading}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 transition-all appearance-none disabled:opacity-50 font-medium"
              >
                <option value="" className="bg-zinc-900">Select Segment</option>
                {availableCities.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Precise Coordinates</label>
            <div className="relative group/field">
              <FiHome className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/field:text-emerald-500 transition-colors" />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Secure Location Details..."
                disabled={isLoading}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 transition-all disabled:opacity-50 placeholder:text-white/10 font-medium"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-2">Communication Link</label>
            <div className="relative group/field">
              <FiPhone className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/field:text-emerald-500 transition-colors" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Encrypted Number..."
                type="tel"
                disabled={isLoading}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/30 transition-all disabled:opacity-50 placeholder:text-white/10 font-medium"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 p-8 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 flex items-center justify-between shadow-inner group/val relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-transparent opacity-0 group-hover/val:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40 block mb-1">Final Settlement</span>
              <p className="text-3xl font-black text-white">{total}<span className="text-emerald-500 text-sm ml-1">₪</span></p>
            </div>
            <FiCreditCard className="text-white/5 relative z-10" size={48} />
          </div>

          {/* Confirm */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex items-center justify-center gap-4 py-6 rounded-[2rem] bg-emerald-600/20 text-emerald-400 font-black text-[11px] uppercase tracking-[0.3em] border border-emerald-500/20 hover:bg-emerald-600/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all shadow-2xl disabled:opacity-50 active:scale-[0.98] group/btn"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                Processing Sync...
              </>
            ) : (
              <>
                <FiCreditCard size={20} className="group-hover:scale-110 transition-transform" />
                Finalize Acquisition
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
