import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiCpu,
  FiShoppingBag,
  FiBook,
  FiHome,
  FiLogOut,
  FiBox,
  FiShield,
  FiPieChart,
  FiBriefcase,
  FiCheckCircle,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

type SidebarItem = {
  key: string;
  label: string;
  Icon: IconType;
  path: string;
};

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const { i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [active, setActive] = useState("Home");
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();

  const items: SidebarItem[] = [
    { key: "Home", label: "Home", Icon: FiHome, path: "/" },
    { key: "Profile", label: "Profile", Icon: FiUser, path: "/profile" },
    { key: "AI", label: "AI System", Icon: FiCpu, path: "/palestine-ai" },
    { key: "Library", label: "Heritage Library", Icon: FiBook, path: "/heritage" },
    { key: "Marketplace", label: "Marketplace", Icon: FiShoppingBag, path: "/marketplace" },
    { key: "3D", label: "3D Module", Icon: FiBox, path: "/3d-module" },
  ];

  const adminItems: SidebarItem[] = [
    { key: "AdminMarket", label: "Admin Market", Icon: FiBriefcase, path: "/admin/market" },
    { key: "Supervision", label: "Supervision Dashboard", Icon: FiShield, path: "/admin/supervision" },
    { key: "Analytics", label: "Platform Analytics", Icon: FiPieChart, path: "/admin/analytics" },
    { key: "Requests", label: "Seller Requests", Icon: FiCheckCircle, path: "/admin/seller-requests" },
  ];

  const direction = i18n.dir();

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) closeSidebar();
    touchStartX.current = null;
  }

  const handleNavigation = (key: string, path: string) => {
    setActive(key);
    navigate(path);
    closeSidebar();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    closeSidebar();
  };

  return (
    <>
      <aside
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`
            fixed top-16 bottom-0
            ${direction === "rtl" ? "right-0" : "left-0"}
            w-64 z-40
            transform transition-transform duration-500 ease-in-out
            ${isOpen
            ? "translate-x-0"
            : direction === "rtl"
              ? "translate-x-full"
              : "-translate-x-full"
          }
            bg-white/5 backdrop-blur-sm
            border-r border-white/10
            shadow-md shadow-black/20
            flex flex-col
            pointer-events-auto
          `}
        dir={direction}
      >
        <div className="flex-1 overflow-y-auto px-4 py-12 scrollbar-hide">
          <nav className="space-y-1.5">
            {/* Main Items */}
            {items.map(({ key, label, Icon, path }) => {
              const isActive = active === key;
              return (
                <button
                  key={key}
                  onClick={() => handleNavigation(key, path)}
                  className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-xl transition-all duration-300 group ${isActive
                    ? "bg-white/10 text-white shadow-lg"
                    : "text-white/60 hover:text-white/90 hover:bg-white/5"
                    }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
                  <span className={`text-[13px] tracking-wide font-medium`}>{label}</span>
                </button>
              );
            })}

            {/* Admin Section */}
            {user?.isAdmin && (
              <div className="pt-6 mt-6 border-t border-white/5 space-y-1.5">
                <p className="px-5 mb-3 text-[10px] font-bold uppercase tracking-widest text-white/20">Admin Management</p>
                {adminItems.map(({ key, label, Icon, path }) => {
                  const isActive = active === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleNavigation(key, path)}
                      className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-xl transition-all duration-300 group ${isActive
                        ? "bg-white/10 text-white shadow-lg"
                        : "text-white/60 hover:text-white/90 hover:bg-white/5"
                        }`}
                    >
                      <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/80"}`} />
                      <span className={`text-[13px] tracking-wide font-medium`}>{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </nav>
        </div>

        {user && (
          <div className="p-6 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-5 py-3 text-red-500/80 hover:text-red-400 text-[13px] font-bold transition-all duration-300 rounded-xl hover:bg-red-500/5 group"
            >
              <FiLogOut className="w-4.5 h-4.5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}