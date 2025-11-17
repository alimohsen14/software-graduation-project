import React from "react";

export default function SectionTitle({ text }) {
  return (
    <h2
      className="
      text-xl md:text-2xl font-extrabold 
      text-[#2f5c3f] 
      mb-4 
      tracking-tight
    "
    >
      {text}
    </h2>
  );
}
