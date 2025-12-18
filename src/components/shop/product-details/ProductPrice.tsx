import React from "react";

type Props = {
  price: number;
};

export default function ProductPrice({ price }: Props) {
  return <div className="text-3xl font-bold text-[#3e6347]">{price}₪</div>;
}
