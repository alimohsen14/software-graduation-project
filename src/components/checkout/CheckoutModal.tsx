import React, { useState } from "react";
import { FiX, FiMapPin, FiHome, FiPhone, FiCreditCard } from "react-icons/fi";

interface CheckoutModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (data: { city: string; address: string; phone: string }) => void;
}

export default function CheckoutModal({
  total,
  onClose,
  onConfirm,
}: CheckoutModalProps) {
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!city || !address || !phone) return;

    onConfirm({ city, address, phone });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* City */}
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g. Tulkarm)"
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3e6347]"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address"
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3e6347]"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3e6347]"
            />
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center justify-between bg-[#f1f5f3] rounded-xl px-4 py-3">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-xl font-bold text-[#3e6347]">{total} ₪</span>
          </div>

          {/* Confirm */}
          <button
            type="submit"
            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#ce1126] text-white font-bold hover:bg-[#a40e1e] transition shadow-lg"
          >
            <FiCreditCard size={18} />
            Confirm & Pay
          </button>
        </form>
      </div>
    </div>
  );
}
