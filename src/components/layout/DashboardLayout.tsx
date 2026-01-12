import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onToggleAISidebar?: () => void;
}

export default function DashboardLayout({
  children,
  onToggleAISidebar,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex">
      {/* Background image only – NO overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/backgrounds/site-bg.png')" }}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="relative z-20 flex-1 flex flex-col min-h-screen">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar
            onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
            onToggleAISidebar={onToggleAISidebar}
          />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto mt-16 scrollbar-hide">
          <div className="px-4 md:px-8 lg:px-10 py-6">
            <div className="max-w-[1400px] mx-auto">
              {React.isValidElement(children) && typeof children.type !== "string"
                ? React.cloneElement(children as React.ReactElement<any>, {
                  setIsSidebarOpen,
                })
                : children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
