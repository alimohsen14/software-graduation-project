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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition disabled:opacity-50"
        >
          <FiX size={22} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-extrabold text-[#1d2d1f] mb-2">
          Checkout
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your delivery details to complete the order
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Country */}
          <div className="relative">
            <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={country}
              onChange={handleCountryChange}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A6F5D] appearance-none disabled:opacity-50"
            >
              <option value="Palestine">Palestine</option>
            </select>
          </div>

          {/* City */}
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A6F5D] appearance-none disabled:opacity-50"
            >
              <option value="">Select city</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="relative">
            <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A6F5D] disabled:opacity-50"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              type="tel"
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4A6F5D] disabled:opacity-50"
            />
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center justify-between bg-[#eaf5ea] rounded-xl px-4 py-3 border border-[#E5E7EB]">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-xl font-bold text-[#4A6F5D]">{total} ₪</span>
          </div>

          {/* Confirm */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#4A6F5D] text-white font-bold hover:bg-[#A33A2B] transition shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                <FiCreditCard size={18} />
                Confirm & Pay
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
