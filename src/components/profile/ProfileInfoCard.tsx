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
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  return (
    <div
      dir={direction}
      className="bg-white shadow-lg rounded-xl overflow-hidden p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-bold text-gray-900">
          {t("profile.infoTitle")}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t("profile.infoSubtitle")}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {user.provider !== "GOOGLE" && (
          <button
            type="button"
            onClick={onChangePasswordClick}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2f5c3f] text-[#FBF7EF] text-sm md:text-base font-semibold shadow-md hover:bg-[#274b34] focus:outline-none focus:ring-2 focus:ring-[#CDA15A]/30 transition"
          >
            <KeyIcon className="w-5 h-5" />
            {t("profile.changePassword")}
          </button>
        )}

        <button
          type="button"
          onClick={onEditClick}
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2f5c3f] text-[#FBF7EF] text-sm md:text-base font-semibold shadow-md hover:bg-[#274b34] focus:outline-none focus:ring-2 focus:ring-[#CDA15A]/30 transition"
        >
          <PencilIcon className="w-5 h-5" />
          {t("profile.editProfile")}
        </button>
      </div>
    </div>
  );
}
