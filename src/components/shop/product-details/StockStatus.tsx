import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type Props = {
  stock: number;
};

export default function StockStatus({ stock }: Props) {
  const inStock = stock > 0;

  return (
    <div className="flex items-center gap-1.5 text-xs">
      {inStock ? (
        <>
          <FiCheckCircle className="text-[#4A6F5D]" size={14} />
          <span className="text-[#4A6F5D] font-medium">
            In Stock ({stock} available)
          </span>
        </>
      ) : (
        <>
          <FiXCircle className="text-[#A33A2B]" size={14} />
          <span className="text-[#A33A2B] font-medium">Out of Stock</span>
        </>
      )}
    </div>
  );
}

