import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ================= Data =================
const cards = [
    {
        image: "/images/tradition-wedding.png",
        title: "العرس الفلسطيني",
        subtitle: "طقوس الزواج والدبكة والأزياء التراثية",
    },
    {
        image: "/images/tradition-eid.png",
        title: "الأعياد في فلسطين",
        subtitle: "الفرح والكعك وزيارات العائلة",
    },
    {
        image: "/images/tradition-condolence.png",
        title: "العزاء في فلسطين",
        subtitle: "مجالس العزاء والعادات الاجتماعية",
    },
    {
        image: "/images/tradition-daily-life.png",
        title: "العادات اليومية الفلسطينية",
        subtitle: "الطابون والزراعة والحياة الريفية",
    },
];

// ================= Library Card (Modified for Carousel) =================
const LibraryCard = ({
    title,
    subtitle,
    image,
    isActive,
}: {
    title: string;
    subtitle: string;
    image: string;
    isActive: boolean;
}) => {
    return (
        <div
            className={`
                w-full max-w-[400px]
                bg-[rgba(30,22,14,0.78)]
                border border-[rgba(255,255,255,0.18)]
                rounded-[20px]
                p-[16px]
                text-center
                text-white
                shadow-[0_15px_40px_rgba(0,0,0,0.5)]
                transition-all duration-300
                ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-0 absolute pointer-events-none"}
            `}
        >
            {/* Image */}
            <div className="rounded-[16px] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-[250px] object-cover"
                />
            </div>

            {/* Title */}
            <h3 className="mt-[20px] text-[22px] text-[#f3dca4] font-bold">
                {title}
            </h3>

            {/* Subtitle */}
            <p className="mt-[10px] text-[15px] text-white/90 leading-relaxed">
                {subtitle}
            </p>
        </div>
    );
};

// ================= Traditions Page =================
export default function TraditionsPage() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    return (
        <div
            className="min-h-screen flex justify-center bg-no-repeat bg-[center_top]"
            style={{
                backgroundImage: "url('/images/library-bg.png')",
                backgroundSize: "100% 112%",
                backgroundColor: "#000",
            }}
        >
            <main
                className="relative z-[2] min-h-screen flex flex-col items-center w-full"
                dir="rtl"
            >
                {/* ===== Header ===== */}
                <header className="mt-[100px] mb-[80px] text-center">
                    <h1 className="m-0 text-[#f5e7c6] text-[clamp(24px,3vw,34px)] drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)] font-bold">
                        العادات والتقاليد الفلسطينية
                    </h1>
                </header>

                {/* ===== Carousel Section ===== */}
                <section className="relative w-full max-w-[600px] flex items-center justify-center px-4">

                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-[-20px] md:left-0 z-10 w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white transition-all hover:bg-black/60 active:scale-95"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>

                    {/* Card Container */}
                    <div className="relative w-full flex justify-center items-center h-[450px]">
                        {cards.map((card, index) => (
                            <LibraryCard
                                key={index}
                                {...card}
                                isActive={index === currentIndex}
                            />
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-[-20px] md:right-0 z-10 w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white transition-all hover:bg-black/60 active:scale-95"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>

                </section>

                {/* Navigation Dots (Optional but good for UX) */}
                <div className="flex gap-2 mt-4">
                    {cards.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#f3dca4] w-6" : "bg-white/20"
                                }`}
                        />
                    ))}
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate("/heritage")}
                    className="mt-12 px-8 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    العودة للمكتبة
                </button>
            </main>
        </div>
    );
}
