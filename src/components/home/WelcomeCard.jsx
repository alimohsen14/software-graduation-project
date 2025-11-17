import React from "react";

export default function WelcomeCard({ name }) {
  return (
    <div className="w-full bg-[#eaf5ea] rounded-2xl p-6 shadow-sm border border-emerald-700/10 mb-6">
      <h2 className="text-2xl font-bold text-[#2f5c3f]">
        Welcome back, {name} 👋
      </h2>

      <p className="text-[#2f5c3f]/80 mt-2 text-sm">
        Explore the latest 3D models, historical collections, and store updates.
      </p>

      <button className="mt-4 px-5 py-2 rounded-lg bg-[#2f5c3f] text-white text-sm font-medium hover:bg-[#244d33] transition">
        Explore 3D Models
      </button>
    </div>
  );
}
