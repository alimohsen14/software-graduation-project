import { FiShield, FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

interface SecurityCardProps {
  provider: string;
}

export default function SecurityCard({ provider }: SecurityCardProps) {
  const { t } = useTranslation();
  const isGoogleAuth = provider === "GOOGLE";

  return (
    <div className="bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-bold text-[#21492f] mb-4">
        {t("profile.securityTitle")}
      </h3>

      <div className="bg-green-50 rounded-lg p-4 flex items-center gap-3 text-[#21492f]">
        <FiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />

        <span className="text-sm font-medium leading-relaxed">
          {isGoogleAuth
            ? t("profile.securityGoogle")
            : t("profile.securityPassword")}
        </span>
      </div>
    </div>
  );
}
