import { useTranslation } from "react-i18next";
import { COUNTRIES } from "../../constants/countries";

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
  const { t, i18n } = useTranslation("profile");
  const isRtl = i18n.dir() === "rtl";
  const currentLang = i18n.language;

  const getLocalizedCountryName = (code: string | null | undefined) => {
    if (!code) return t("notSpecified");
    const found = COUNTRIES.find((c) => c.code === code);
    if (!found) return code;
    return currentLang === "ar" ? found.name_ar : currentLang === "fr" ? found.name_fr : found.name_en;
  };

  const getLocalizedGender = (g: string | undefined) => {
    if (!g) return t("notSpecified");
    return t(g.toLowerCase());
  };

  return (
    <div
      className="bg-white/5 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl p-5 sm:p-10 relative overflow-hidden group animate-in slide-in-from-top-4 duration-700"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background decorative glow */}
      <div className={`absolute -top-40 ${isRtl ? "-left-40" : "-right-40"} w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-1000`} />

      <div className={`flex flex-col items-center sm:items-start ${isRtl ? "sm:flex-row-reverse" : "sm:flex-row"} gap-5 md:gap-8 relative z-10`}>
        {/* Avatar Section */}
        <div className="relative group/avatar">
          <div className="h-20 w-20 sm:h-32 sm:w-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl sm:text-5xl font-black text-white shadow-2xl backdrop-blur-xl relative z-10 overflow-hidden transition-transform duration-500 group-hover/avatar:scale-105">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">{name?.charAt(0).toUpperCase()}</span>
          </div>
          {/* Avatar Ring Glow */}
          <div className="absolute -inset-2 bg-emerald-500/20 rounded-full blur-xl opacity-50 group-hover/avatar:opacity-100 transition-all duration-1000 animate-pulse" />
          <div className="absolute -inset-0.5 border border-emerald-500/30 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 scale-110 group-hover/avatar:scale-100" />
        </div>

        {/* User Info Section */}
        <div className={`flex-1 text-center ${isRtl ? "sm:text-right" : "sm:text-left"} flex flex-col justify-center`}>
          <div className="flex flex-col mb-3 md:mb-4">
            <span className="text-emerald-500/40 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] mb-1 sm:mb-2 leading-none">
              {t("userProfile")}
            </span>
            <h2 className="text-xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-none">
              {name}
            </h2>
          </div>
          <p className="text-white/40 text-xs sm:text-base font-medium">
            {email}
          </p>

          <div className={`mt-6 md:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${isRtl ? "text-right" : "text-left"}`}>
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                {t("country")}
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-tight">
                {getLocalizedCountryName(country)}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                {t("age")}
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-tight">
                {age || t("notSpecified")}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                {t("gender")}
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-tight">
                {getLocalizedGender(gender)}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">
                {t("provider")}
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-tight">
                {provider || t("notSpecified")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
