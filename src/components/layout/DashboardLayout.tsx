import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

type WithSidebarControl = {
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

interface DashboardLayoutProps {
  children: React.ReactElement<WithSidebarControl>;

  onToggleAISidebar?: () => void;
}

export default function DashboardLayout({
  children,
  onToggleAISidebar,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen ">

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#e8f2e5] shadow-sm">
          <Navbar
            onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
            onToggleAISidebar={onToggleAISidebar}
          />
        </div>


        <main className="mt-16 px-4 md:px-8 lg:px-10">
          <div className="max-w-6xl mx-auto">
            {React.isValidElement(children) && typeof children.type !== 'string'
              ? React.cloneElement(children as React.ReactElement<any>, { setIsSidebarOpen })
              : children}
          </div>
        </main>
      </div>
    </div>
  );
}
