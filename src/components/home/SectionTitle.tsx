// ...existing code...
import React from "react";
interface SectionTitleProps {
  text: string;
}

export default function SectionTitle({ text }: SectionTitleProps) {
  return (
    <h2
      className="
      text-xl md:text-2xl font-extrabold 
      text-white 
      mb-4 
      tracking-tight
    "
    >
      {text}
    </h2>
  );
}
// ...existing code...
