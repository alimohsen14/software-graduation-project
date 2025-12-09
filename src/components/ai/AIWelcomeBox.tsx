import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  userName?: string;
};

export default function AIWelcomeBox({ userName }: Props): React.ReactElement {
  const { t, i18n } = useTranslation();
  const displayName = userName
    ? i18n.language === "ar"
      ? `يا ${userName}`
      : userName
    : i18n.language === "ar"
    ? "بك"
    : "";

  return (
    <section
      aria-label="AI welcome box"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="mx-auto max-w-[700px] p-6 md:p-8 bg-[#FBF7EF] rounded-[24px] shadow-lg text-[#21492f]"
    >
      <h3 className="text-lg md:text-2xl font-extrabold mb-3 leading-tight">
        {t("ai.welcomeTitle")} {displayName} 🤍
      </h3>

      <p className="text-sm md:text-base leading-relaxed">
        {t("ai.welcomeIntro")}
      </p>

      <ul className="mt-3 space-y-2 list-inside list-disc marker:text-[#21492f] text-sm md:text-base">
        <li>{t("ai.topicHeritage")}</li>
        <li>{t("ai.topicSoapNablus")}</li>
        <li>{t("ai.topicTraditions")}</li>
        <li>{t("ai.topicCities")}</li>
        <li>{t("ai.topicPalestineCause")}</li>
      </ul>

      <p className="mt-4 text-sm md:text-base leading-relaxed">
        {t("ai.welcomeFooter")}
      </p>
    </section>
  );
}
