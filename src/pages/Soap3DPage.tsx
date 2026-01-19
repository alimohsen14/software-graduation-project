import React from "react";
import Soap3DModelViewer from "../components/soap3d/hero/Soap3DModelViewer";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function Soap3DPage() {
  return (
    <DashboardLayout>
      <div className="w-full min-h-[calc(100vh-64px)] bg-[#0a0a0a] flex flex-col p-4 md:p-8 overflow-y-auto custom-scrollbar">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto w-full mb-8" dir="rtl">
          <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />

            <div className="relative z-10">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
                التجربة <span className="text-emerald-400">ثلاثية الأبعاد</span>
              </h1>
              <p className="text-sm md:text-lg text-white/50 max-w-2xl font-medium leading-relaxed uppercase tracking-widest">
                استكشف التراث الفلسطيني بأدق تفاصيله عبر تقنيات العرض الثلاثية الأبعاد المتقدمة. تجول داخل المعالم التاريخية واختبر عبق الماضي برؤية مستقبلية.
              </p>
            </div>
          </div>
        </div>

        {/* 3D Viewer Section */}
        <div className="flex-1 flex items-center justify-center relative min-h-[500px] mb-10">
          <Soap3DModelViewer />
        </div>
      </div>
    </DashboardLayout>
  );
}
