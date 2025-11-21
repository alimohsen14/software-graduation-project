import React, { useState, ReactNode } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#3e6347]">
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <div className="fixed top-0 left-0 md:left-60 right-0 z-50 bg-[#e8f2e5] shadow-sm">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        </div>

        <main className="mt-16 px-4 md:px-8 lg:px-10">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
