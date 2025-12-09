import { FiCalendar, FiClock } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";

interface AccountActivityCardProps {
  createdAt: string;
  updatedAt: string;
}

export default function AccountActivityCard({
  createdAt,
  updatedAt
}: AccountActivityCardProps) {
  const { t, i18n } = useTranslation();

  const formatDate = (dateString: string) => {
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
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="px-6 py-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-[#21492f]">
          {t("profile.accountActivity")}
        </h3>
      </div>

      <div className="px-6 py-6">
        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          dir={i18n.dir()}
        >
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">
              {t("profile.createdAt")}
            </span>
            <div className="flex items-center text-[#21492f] font-medium gap-2">
              <FiCalendar className="w-5 h-5 text-[#2f5c3f]" />
              {formatDate(createdAt)}
            </div>
          </div>

          <div className="flex flex-col sm:text-right">
            <span className="text-sm text-gray-500 mb-1">
              {t("profile.updatedAt")}
            </span>
            <div className="flex items-center sm:justify-end text-[#21492f] font-medium gap-2">
              <FiClock className="w-5 h-5 text-[#2f5c3f]" />
              {formatDate(updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
