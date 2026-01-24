import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";

type Props = {
  stock: number;
};

export default function StockStatus({ stock }: Props) {
  const { t } = useTranslation("marketplace");
  const inStock = stock > 0;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em] leading-none">{t("product.inventory")}</span>
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest shadow ${inStock
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
        <div className={`w-1 h-1 rounded-full animate-pulse ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
        {inStock ? `${t("product.availableUnits")}: ${stock}` : t("product.depleted")}
      </div>
    </div>
  );
}

