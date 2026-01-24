import { useTranslation } from "react-i18next";
import { PencilIcon, KeyIcon } from "@heroicons/react/24/outline";

interface ProfileInfoCardProps {
  user: {
    name: string;
    email: string;
    age?: number | null;
    gender?: string;
    country?: string | null;
    provider?: string;
  };
  onEditClick: () => void;
  onChangePasswordClick: () => void;
}

export default function ProfileInfoCard({
  user,
  onEditClick,
  onChangePasswordClick,
}: ProfileInfoCardProps) {
  const { t, i18n } = useTranslation("profile");
  const direction = i18n.dir();

  return (
    <div
      dir={direction}
      className={`bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group animate-in slide-in-from-top-4 duration-700 delay-100 ${direction === "rtl" ? "md:flex-row-reverse" : ""}`}
    >
      <div className={`text-center ${direction === "rtl" ? "md:text-right" : "md:text-left"} relative z-10 w-full md:w-auto`}>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase leading-none mb-2">
          {t("infoTitle")}
        </h3>
        <p className="text-white/40 text-xs sm:text-sm font-medium">
          {t("infoSubtitle")}
        </p>
      </div>

      <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full md:w-auto relative z-10 ${direction === "rtl" ? "sm:flex-row-reverse" : ""}`}>
        {user.provider !== "GOOGLE" && (
          <button
            type="button"
            onClick={onChangePasswordClick}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600/10 text-emerald-400 border border-emerald-500/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-emerald-600/20 hover:border-emerald-500/30 transition-all active:scale-95 group/btn min-h-[48px]"
          >
            <KeyIcon className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-500" />
            <span>{t("changePassword")}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onEditClick}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 group/btn min-h-[48px]"
        >
          <PencilIcon className="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform duration-500" />
          <span>{t("editProfile")}</span>
        </button>
      </div>
    </div>
  );
}
