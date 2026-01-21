import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  description?: string;
};

export default function ProductDescription({ description }: Props) {
  const { t } = useTranslation();
  if (!description) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/40 mb-4 border-r-2 border-emerald-500/30 pr-3">
        {t("marketplace.productDescription") || "Product Description"}
      </h3>

      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </section>
  );
}

