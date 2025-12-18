import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type Props = {
  stock: number;
};

export default function StockStatus({ stock }: Props) {
  const inStock = stock > 0;

  return (
    <div className="flex items-center gap-2 text-sm">
      {inStock ? (
        <>
          <FiCheckCircle className="text-green-600" />
          <span className="text-green-700 font-medium">
            In Stock ({stock} items available)
          </span>
        </>
      ) : (
        <>
          <FiXCircle className="text-red-600" />
          <span className="text-red-600 font-medium">Out of Stock</span>
        </>
      )}
    </div>
  );
}
