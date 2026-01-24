import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  description?: string;
};

export default function ProductDescription({ description }: Props) {
  const { t, i18n } = useTranslation("marketplace");
  const isRtl = i18n.language === "ar";

  if (!description) return null;

  return (
    <section className={`animate-in fade-in slide-in-from-bottom-4 duration-1000 ${isRtl ? "text-right" : "text-left"}`}>
      <h3 className={`text-[8px] font-black uppercase tracking-[0.4em] text-emerald-500/40 mb-3 border-emerald-500/30 ${isRtl ? "border-l-2 pl-2" : "border-r-2 pr-2"}`}>
        {t("product.descriptionTitle")}
      </h3>

      <div className="prose prose-invert max-w-none">
        <p className="text-white/50 text-xs md:text-sm leading-relaxed font-medium whitespace-pre-wrap">
          {description}
        </p>
      </div>
    </section>
  );
}

