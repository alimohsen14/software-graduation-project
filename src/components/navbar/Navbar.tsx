// src/components/Navbar/Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiBell, FiUser, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  onMenuClick: () => void;
  onToggleAISidebar?: () => void;
}

export default function Navbar({
  onMenuClick,
  onToggleAISidebar,
}: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguageMenu = () => {
    setShowLanguageMenu((prev) => !prev);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.body.dir = lng === "ar" ? "rtl" : "ltr";
    setShowLanguageMenu(false);
  };

  // closes dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLanguageMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-[#eaf5ea] border-b-2 border-emerald-700/30 shadow-sm">
      <div className="w-full px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Menu + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-emerald-100 transition"
            >
              <FiMenu className="w-6 h-6 text-[#2f5c3f]" />
            </button>

            <span className="text-2xl sm:text-3xl font-extrabold text-[#2f5c3f]">
              Palestine3D
            </span>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            {/* Notifications */}
            <button className="p-2 hover:bg-emerald-100 rounded-full transition">
              <span className="inline-flex items-center justify-center w-9 h-9 bg-white/60 border border-emerald-200 rounded-full">
                <FiBell className="w-5 h-5 text-[#2f5c3f]" />
              </span>
            </button>

            {/* Language Selector */}
            <button
              onClick={toggleLanguageMenu}
              aria-label={t("navbar.changeLanguage")}
              className="p-2 hover:bg-emerald-100 rounded-full transition focus:ring-2 focus:ring-emerald-300"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 bg-white/60 border border-emerald-200 rounded-full">
                <FiGlobe className="w-5 h-5 text-[#2f5c3f]" />
              </span>
            </button>

            {/* Dropdown Menu */}
            {showLanguageMenu && (
              <div
                className={`absolute mt-12 ${i18n.language === "ar" ? "left-0" : "right-0"
                  } bg-white shadow-lg border rounded-lg w-32 p-2 z-50`}
              >
                <button
                  onClick={() => changeLanguage("en")}
                  className={`block w-full text-left px-3 py-2 rounded ${i18n.language === "en"
                    ? "bg-emerald-100 font-semibold"
                    : "hover:bg-gray-100"
                    }`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage("ar")}
                  className={`block w-full text-left px-3 py-2 rounded ${i18n.language === "ar"
                    ? "bg-emerald-100 font-semibold"
                    : "hover:bg-gray-100"
                    }`}
                >
                  العربية
                </button>
              </div>
            )}

            {/* Profile */}
            <button className="p-2 hover:bg-emerald-100 rounded-full transition">
              <span className="inline-flex items-center justify-center w-9 h-9 bg-white/60 border border-emerald-200 rounded-full">
                <FiUser className="w-5 h-5 text-[#2f5c3f]" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
