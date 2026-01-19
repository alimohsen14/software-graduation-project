import { FiLogOut } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  return (
    <div className="mt-8 md:mt-12" dir={direction}>
      <button
        type="button"
        onClick={onLogout}
        aria-label={t("profile.logout")}
        className="
          w-full flex items-center justify-center gap-3
          px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em]
          bg-red-500/10 text-red-500 border border-red-500/20
          hover:bg-red-500/20 hover:border-red-500/30
          focus:outline-none focus:ring-2 focus:ring-red-500/20
          transition-all duration-300 active:scale-95 shadow-xl shadow-red-500/5 min-h-[48px]
        "
      >
        <FiLogOut className="w-5 h-5" />
        {t("profile.logout")}
      </button>
    </div>
  );
}
