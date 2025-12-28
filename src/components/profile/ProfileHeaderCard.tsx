import { useTranslation } from "react-i18next";

interface ProfileHeaderCardProps {
  name: string;
  email: string;
  country?: string | null;
  age?: number | null;
  gender?: string;
  provider?: string;
}

export default function ProfileHeaderCard({
  name,
  email,
  country,
  age,
  gender,
  provider,
}: ProfileHeaderCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <div
      className="bg-white shadow-lg rounded-xl overflow-hidden p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex flex-col sm:flex-row items-center gap-4
          ${isRTL ? "text-right sm:text-right" : "text-left sm:text-left"}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="h-24 w-24 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-3xl font-bold border-2 border-green-300">
            {name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User Information */}
        <div className={`${isRTL ? "sm:mr-6" : "sm:ml-6"} flex-1`}>
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-600 mt-1">{email}</p>

          <div
            className={`mt-5 grid grid-cols-2 gap-x-6 gap-y-4 ${isRTL ? "text-right" : "text-left"
              }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500">
                {t("profile.country")}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {country || t("profile.notSpecified")}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">
                {t("profile.age")}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {age || t("profile.notSpecified")}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">
                {t("profile.gender")}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
                {gender || t("profile.notSpecified")}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500">
                {t("profile.provider")}
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
                {provider || t("profile.notSpecified")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
