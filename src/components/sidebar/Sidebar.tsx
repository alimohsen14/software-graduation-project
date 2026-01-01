import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiCpu, FiShoppingBag, FiUsers, FiBook } from "react-icons/fi";
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
};

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [active, setActive] = useState("Profile");
  const touchStartX = useRef<number | null>(null);
  const navigate = useNavigate();

  const items: SidebarItem[] = [
    { key: "Profile", label: t("sidebar.profile"), Icon: FiUser },
    { key: "AI", label: t("sidebar.aiSystem"), Icon: FiCpu },
    { key: "Official", label: t("sidebar.officialStore"), Icon: FiShoppingBag },
    { key: "Community", label: t("sidebar.communityForum"), Icon: FiUsers },
    { key: "Library", label: t("sidebar.heritageLibrary"), Icon: FiBook },
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

  return (
    <>
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/30 z-30"
        />
      )}

      <aside
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`
          fixed top-0
          ${direction === "rtl" ? "right-0" : "left-0"}
          h-screen w-60 z-40 transform transition-transform duration-300
          ${isOpen
            ? "translate-x-0"
            : direction === "rtl"
              ? "translate-x-full"
              : "-translate-x-full"
          }
          bg-[#eaf5ea] shadow-lg
        `}
        dir={direction}
      >
        {/* Flag stripe */}
        <div
          className={`
            absolute ${direction === "rtl" ? "right-0 rounded-l-2xl" : "left-0 rounded-r-2xl"}
            top-0 bottom-4 w-2
          `}
          style={{
            background:
              "linear-gradient(to bottom, black 0%, white 33%, #007A3D 66%, #CE1126 100%)",
          }}
        />

        <div className="h-full px-5 py-6 flex flex-col">
          <div className="text-xl font-extrabold text-[#2f5c3f] mb-6">
            Palestine3D
          </div>

          <nav className="flex flex-col gap-2">
            {items.map(({ key, label, Icon }) => {
              const isActive = active === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    if (key === "Profile") navigate("/profile");
                    if (key === "AI") navigate("/palestine-ai");
                    if (key === "Official") navigate("/shop"); // Assuming Official Store is Shop
                    setActive(key);
                    closeSidebar();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                    ? "bg-[#dff3e8] text-[#21492f]"
                    : "text-[#2f5c3f] hover:bg-[#f1fbf4]"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              );
            })}

            {/* Admin Links */}
            {user?.isAdmin && (
              <>
                <div className="my-2 border-t border-[#2f5c3f]/10"></div>
                <div className="px-3 text-xs font-bold text-[#2f5c3f]/60 uppercase tracking-wider mb-1">Admin</div>
                <button
                  onClick={() => {
                    navigate("/admin/market");
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#2f5c3f] hover:bg-[#f1fbf4]"
                >
                  <FiShoppingBag className="w-5 h-5" />
                  <span className="text-sm font-medium">Market Admin</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/admin/seller-requests");
                    closeSidebar();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#2f5c3f] hover:bg-[#f1fbf4]"
                >
                  <FiUsers className="w-5 h-5" />
                  <span className="text-sm font-medium">Seller Requests</span>
                </button>
              </>
            )}
          </nav>

          <div className="mt-auto text-xs text-[#2f5c3f] opacity-80">
            © Palestine3D
          </div>
        </div>
      </aside>
    </>
  );
}
