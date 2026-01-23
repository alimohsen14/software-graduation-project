import React from "react";
import { useNavigate } from "react-router-dom";

// ================= Library Card =================
const LibraryCard = ({
    title,
    subtitle,
    image,
    onClick,
}: {
    title: string;
    subtitle: string;
    image: string;
    onClick?: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className="
        w-full
        bg-[rgba(30,22,14,0.78)]
        border border-[rgba(255,255,255,0.18)]
        rounded-[14px]
        p-[12px]
        cursor-pointer
        text-center
        text-white
        shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        transition-all
        hover:-translate-y-1
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.45)]
      "
        >
            {/* Image */}
            <div className="rounded-[14px] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-[120px] object-cover"
                />
            </div>

            {/* Title */}
            <h3 className="mt-[12px] text-[18px] text-[#f3dca4] font-bold">
                {title}
            </h3>

            {/* Subtitle */}
            <p className="mt-[6px] text-[13px] text-white/80">
                {subtitle}
            </p>
        </div>
    );
};

// ================= Page =================
export default function HeritageHomePage() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex justify-center bg-no-repeat bg-cover bg-center md:bg-[center_top]"
            style={{
                backgroundImage: "url('/images/library-bg.png')",
                backgroundColor: "#000",
            }}
        >
            <main
                className="relative z-[2] min-h-screen flex flex-col items-center w-full px-4 md:px-6"
                dir="rtl"
            >
                {/* ===== Header ===== */}
                <header className="mt-16 md:mt-[100px] mb-20 md:mb-[120px] text-center">
                    <h1 className="m-0 text-[#f5e7c6] text-2xl md:text-[clamp(24px,3vw,34px)] drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)] font-bold px-2">
                        المكتبة التراثية الفلسطينية
                    </h1>
                </header>

                {/* ===== Cards Grid ===== */}
                <section
                    className="
                        w-full
                        max-w-[900px]
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        gap-x-[14px]
                        gap-y-[20px]
                        mb-[40px]
                    "
                >
                    <LibraryCard
                        image="/images/card-cities.png"
                        title="المدن والقرى"
                        subtitle="اكتشف مدننا وقرانا العريقة"
                        onClick={() => navigate("/heritage/cities")}
                    />

                    <LibraryCard
                        image="/images/card-industries.png"
                        title="الصناعات الفلسطينية"
                        subtitle="تعرف على الصناعات والحرف"
                        onClick={() => navigate("/heritage/industries")}
                    />

                    <LibraryCard
                        image="/images/card-landmarks.png"
                        title="العادات والتقاليد الفلسطينية"
                        subtitle="الأعراس، العزاء، والأعياد في تراثنا الأصيل"
                        onClick={() => navigate("/heritage/traditions")}
                    />

                </section>
            </main>
        </div>
    );
}
