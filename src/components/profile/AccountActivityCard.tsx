import { FiCalendar, FiClock } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";

interface AccountActivityCardProps {
  createdAt?: string;
  updatedAt?: string;
}

export default function AccountActivityCard({
  createdAt,
  updatedAt
}: AccountActivityCardProps) {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);

      const formatPattern =
        i18n.language === "ar" ? "d MMMM yyyy" : "MMMM d, yyyy";

      return format(date, formatPattern);
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden group animate-in slide-in-from-right-4 duration-700 delay-300" dir={i18n.dir()}>
      <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-white/5 flex items-center gap-4">
        <div className="w-10 h-10 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-xl">
          <FiCalendar className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          {t("profile.accountActivity")}
        </h3>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
              {t("profile.createdAt")}
            </span>
            <div className="flex items-center text-white/80 font-bold gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <FiCalendar className="w-5 h-5 text-indigo-400" />
              <span className="text-sm tracking-tight">{formatDate(createdAt)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
              {t("profile.updatedAt")}
            </span>
            <div className="flex items-center text-white/80 font-bold gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <FiClock className="w-5 h-5 text-indigo-400" />
              <span className="text-sm tracking-tight">{formatDate(updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
