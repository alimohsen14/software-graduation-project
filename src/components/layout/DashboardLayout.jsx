import React from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#3e6347]">
      {/* Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="fixed top-0 left-0 md:left-60 right-0 z-50 bg-[#e8f2e5] shadow-sm">
          <Navbar />
        </div>

        {/* Page content container */}
        <main className="mt-16 px-4 md:px-8 lg:px-10">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
