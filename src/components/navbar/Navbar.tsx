import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiUser, FiGlobe } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../context/AuthContext";
import Palestine3DLogo from "../common/Palestine3DLogo";

interface NavbarProps {
  onMenuClick: () => void;
  onToggleAISidebar?: () => void;
}

export default function Navbar({
  onMenuClick,
  onToggleAISidebar,
}: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
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
    <header className="w-full border-b border-white/15 shadow-md shadow-black/20 backdrop-blur-sm">



      <div className="w-full px-4 md:px-10">
        <div className="h-14 md:h-20 flex items-center justify-between">

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onMenuClick}
              className="p-1.5 md:p-2 rounded-xl text-white/60 hover:text-white/90 hover:bg-white/5 transition-all active:scale-95"
            >
              <FiMenu className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <div className="flex flex-col scale-90 md:scale-100 origin-left">
              <Palestine3DLogo size="sm" className="!items-start" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-5 relative" ref={dropdownRef}>
            <NotificationBell />

            <div className="relative">
              <button
                onClick={toggleLanguageMenu}
                aria-label={t("navbar.changeLanguage")}
                className="p-1.5 md:p-2 text-white/60 hover:text-white/90 hover:bg-white/5 rounded-xl transition-all active:scale-95 group"
              >
                <FiGlobe className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {showLanguageMenu && (
                <div
                  className={`absolute mt-3 ${i18n.language === "ar" ? "left-0" : "right-0"
                    } bg-[#1a130f]/90 backdrop-blur-xl shadow-2xl border border-white/10 rounded-xl w-40 p-1.5 z-[60] overflow-hidden`}
                >
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all ${i18n.language === "en"
                      ? "bg-emerald-600/20 text-emerald-400 font-bold"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">English</span>
                  </button>
                  <button
                    onClick={() => changeLanguage("ar")}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all ${i18n.language === "ar"
                      ? "bg-emerald-600/20 text-emerald-400 font-bold"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider font-arabic">العربية</span>
                  </button>
                </div>
              )}
            </div>

            <button className="relative group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white/90 group-hover:border-white/20 transition-all overflow-hidden">
                <FiUser className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-emerald-500 border-2 border-[#1a130f] rounded-full shadow-sm" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}