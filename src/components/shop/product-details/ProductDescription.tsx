import React from "react";

type Props = {
  description?: string;
};

export default function ProductDescription({ description }: Props) {
  if (!description) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 border-l-2 border-emerald-500/30 pl-4">
        Archive Documentation
      </h3>

      <div className="prose prose-invert max-w-none">
        <p className="text-white/50 text-lg md:text-xl leading-[1.8] font-medium max-w-4xl italic">
          {description}
        </p>
      </div>
    </section>
  );
}

