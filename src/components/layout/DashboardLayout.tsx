import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onToggleAISidebar?: () => void;
  isFullWidth?: boolean;
}

export default function DashboardLayout({
  children,
  onToggleAISidebar,
  isFullWidth = false,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isHeritagePage = location.pathname.startsWith("/heritage");

  return (
    <div className="relative min-h-screen flex overflow-x-hidden">
      {/* Background image only – NO overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/backgrounds/site-bg.png')" }}
      />

      {/* Sidebar - HIDDEN on Heritage Page */}
      {!isHeritagePage && (
        <>
          <Sidebar
            isOpen={isSidebarOpen}
            closeSidebar={() => setIsSidebarOpen(false)}
          />

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main content */}
      <div className="relative z-20 flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* Navbar - HIDDEN on Heritage Page */}
        {!isHeritagePage && (
          <div className="fixed top-0 left-0 right-0 z-50 w-full h-14 md:h-20">
            <Navbar
              onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
              onToggleAISidebar={onToggleAISidebar}
            />
          </div>
        )}

        {/* Page content */}
        <main className={`flex-1 ${!isHeritagePage ? 'mt-14 md:mt-20' : ''} scrollbar-hide w-full ${isFullWidth ? "h-[calc(100vh-3.5rem)] md:h-[calc(100vh-5rem)] overflow-hidden" : ""}`}>
          {isFullWidth ? (
            <div className="h-full w-full relative">
              {React.isValidElement(children) && typeof children.type !== "string"
                ? React.cloneElement(children as React.ReactElement<any>, {
                  setIsSidebarOpen,
                })
                : children}
            </div>
          ) : (
            <div className="px-3 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-6">
              <div className="max-w-[1400px] mx-auto w-full">
                {React.isValidElement(children) && typeof children.type !== "string"
                  ? React.cloneElement(children as React.ReactElement<any>, {
                    setIsSidebarOpen,
                  })
                  : children}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
