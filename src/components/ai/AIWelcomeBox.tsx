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
      className="mx-auto max-w-[750px] p-10 md:p-14 bg-white/5 backdrop-blur-2xl rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group"
    >
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-1000" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />

      <div className="relative z-10">
        <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-none tracking-tighter uppercase">
          {t("ai.welcomeTitle")} <span className="text-emerald-400">{displayName}</span> <span className="opacity-50">🤍</span>
        </h3>

        <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium mb-8">
          {t("ai.welcomeIntro")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            t("ai.topicHeritage"),
            t("ai.topicSoapNablus"),
            t("ai.topicTraditions"),
            t("ai.topicCities"),
            t("ai.topicPalestineCause")
          ].map((topic, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group/item hover:bg-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] group-hover/item:scale-125 transition-transform" />
              <span className="text-sm font-black uppercase tracking-widest text-white/40 group-hover/item:text-white/80 transition-colors">{topic}</span>
            </div>
          ))}
        </div>

        <p className="text-xs md:text-sm text-white/30 leading-loose uppercase tracking-[0.2em] font-bold border-t border-white/5 pt-8">
          {t("ai.welcomeFooter")}
        </p>
      </div>
    </section>
  );
}
