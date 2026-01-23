import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  description?: string;
};

export default function ProductDescription({ description }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  if (!description) return null;

  return (
    <section className={`animate-in fade-in slide-in-from-bottom-4 duration-1000 ${isRtl ? "text-right" : "text-left"}`}>
      <h3 className={`text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/40 mb-4 border-emerald-500/30 ${isRtl ? "border-l-2 pl-3" : "border-r-2 pr-3"}`}>
        {t("marketplace.product.description")}
      </h3>

      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">
          {description}
        </p>
      </div>
    </section>
  );
}

