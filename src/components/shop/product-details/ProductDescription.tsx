import React from "react";

type Props = {
  description?: string;
};

export default function ProductDescription({ description }: Props) {
  if (!description) return null;

  return (
    <section className="mt-10 pt-8 border-t border-[#E5E7EB]">
      <h3 className="text-lg font-bold text-[#1F2933] mb-3">
        Product Description
      </h3>

      <p className="text-[#6B7280] text-sm leading-relaxed max-w-2xl">
        {description}
      </p>
    </section>
  );
}

