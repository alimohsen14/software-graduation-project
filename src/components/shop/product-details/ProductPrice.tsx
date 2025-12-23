import React from "react";

type Props = {
  price: number;
};

export default function ProductPrice({ price }: Props) {
  return <div className="text-2xl font-bold text-[#4A6F5D]">{price}₪</div>;
}

