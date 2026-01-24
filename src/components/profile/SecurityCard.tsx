import { FiShield, FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface SecurityCardProps {
  provider?: string;
}

export default function SecurityCard({ provider }: SecurityCardProps) {
  const { t, i18n } = useTranslation("profile");
  const isGoogleAuth = provider === "GOOGLE";
  const direction = i18n.dir();

  return (
    <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl p-6 sm:p-8 relative overflow-hidden group animate-in slide-in-from-left-4 duration-700 delay-200" dir={direction}>
      <div className={`flex items-center gap-4 mb-6 relative z-10 ${direction === "rtl" ? "flex-row-reverse text-right" : ""}`}>
        <div className="w-10 h-10 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-xl transition-transform duration-500 group-hover:scale-110">
          <FiShield className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          {t("securityTitle")}
        </h3>
      </div>

      <div className={`bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 flex items-center gap-4 text-emerald-400 relative z-10 ${direction === "rtl" ? "flex-row-reverse text-right" : ""}`}>
        <FiCheckCircle className="w-6 h-6 flex-shrink-0 animate-pulse" />

        <span className="text-xs sm:text-sm font-bold uppercase tracking-tight leading-relaxed">
          {isGoogleAuth
            ? t("securityGoogle")
            : t("securityPassword")}
        </span>
      </div>
    </div>
  );
}
