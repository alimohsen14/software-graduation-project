import React from "react";

export default function AIWelcomeBox(): React.ReactElement {
  return (
    <section
      aria-label="AI welcome box"
      dir="rtl"
      className="mx-auto max-w-[700px] p-6 md:p-8 bg-[#FBF7EF] rounded-[24px] shadow-lg text-[#21492f]"
    >
      <h3 className="text-lg md:text-2xl font-extrabold mb-3 leading-tight">
        أهلًا يا علي <span aria-hidden>🤍</span>
      </h3>

      <p className="text-sm md:text-base leading-relaxed">
        أنا Palestine AI، مساعدك الذكي من منصة Palestine3D. بقدر أساعدك في:
      </p>

      <ul className="mt-3 space-y-2 list-inside list-disc marker:text-[#21492f] text-sm md:text-base">
        <li>التراث الفلسطيني</li>
        <li>تاريخ الصبّانات في نابلس</li>
        <li>العادات والتقاليد</li>
        <li>المدن والقرى الفلسطينية</li>
        <li>القضية الفلسطينية</li>
      </ul>

      <p className="mt-4 text-sm md:text-base leading-relaxed">
        اختر أحد الاقتراحات أو اكتب سؤالك.
      </p>
    </section>
  );
}
