import React from "react";

type Props = {
  description?: string;
};

export default function ProductDescription({ description }: Props) {
  if (!description) return null;

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold text-[#1d2d1f] mb-4">
        Product Description
      </h3>

      <p className="text-gray-700 leading-relaxed max-w-3xl">{description}</p>
    </section>
  );
}
