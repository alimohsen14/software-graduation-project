import { FiLogOut } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  return (
    <div className="mt-6" dir={direction}>
      <button
        type="button"
        onClick={onLogout}
        aria-label={t("profile.logout")}
        className="
          w-full flex items-center justify-center gap-2
          px-6 py-4 rounded-xl text-base font-semibold shadow-lg
          bg-red-600 text-white
          hover:bg-red-700 focus:outline-none
          focus:ring-2 focus:ring-offset-2 focus:ring-red-500
          transition-colors duration-200
        "
      >
        <FiLogOut className="w-5 h-5" />
        {t("profile.logout")}
      </button>
    </div>
  );
}
