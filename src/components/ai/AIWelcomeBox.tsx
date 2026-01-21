import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  userName?: string;
};

export default function AIWelcomeBox({ userName }: Props): React.ReactElement {
  const { t, i18n } = useTranslation();

  const rawIntro = t("ai.welcomeIntro");

  return (
    <section
      aria-label="AI welcome box"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-[520px] p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-center"
    >
      <div className="text-white/75 leading-relaxed font-medium text-sm md:text-base whitespace-pre-line">
        {rawIntro}
      </div>
    </section>
  );
}
