import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  price: number;
};

export default function ProductPrice({ price }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div className={`flex flex-col ${isRtl ? "items-end" : "items-start"}`}>
      <div className={`text-4xl font-black text-white leading-none flex items-baseline ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
        <span className="text-emerald-500 text-2xl mx-1">₪</span>
        {price}
      </div>
    </div>
  );
}

