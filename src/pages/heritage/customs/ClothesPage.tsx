import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clothesData } from "../../../data/clothesData";
import HeritageBackground from "../../../ui/HeritageBackground";

// ================= Clothes Card (Same as StageCard/FoodCard) =================
const ClothesCard = ({
    title,
    shortDesc,
    image,
    isActive,
    onClick,
}: {
    title: string;
    shortDesc: string;
    image: string;
    isActive: boolean;
    onClick?: () => void;
}) => {
    return (
        <div
            onClick={onClick}
            className={`
                w-full max-w-[400px] shrink-0
                bg-[rgba(30,22,14,0.78)]
                border border-[rgba(255,255,255,0.18)]
                rounded-[20px]
                p-4 md:p-[16px]
                text-center
                text-white
                shadow-[0_15px_40px_rgba(0,0,0,0.5)]
                transition-all duration-300
                cursor-pointer
                snap-center
                md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                ${isActive ? "scale-100 opacity-100 z-10" : "md:scale-95 md:opacity-0 md:pointer-events-none z-0"}
            `}
        >
            {/* Image */}
            <div className="rounded-[16px] overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 md:h-[250px] object-cover"
                />
            </div>

            {/* Title */}
            <h3 className="mt-4 md:mt-[20px] text-xl md:text-[22px] text-[#f3dca4] font-bold">
                {title}
            </h3>

            {/* Subtitle */}
            <p className="mt-2 md:mt-[10px] text-sm md:text-[15px] text-white/90 leading-relaxed">
                {shortDesc}
            </p>
        </div>
    );
};

export default function ClothesPage() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % clothesData.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + clothesData.length) % clothesData.length);
    };

    return (
        <HeritageBackground>
            <main
                className="relative z-[2] min-h-[calc(100vh-165px)] flex flex-col items-center w-full"
                dir="rtl"
            >
                {/* ===== Header ===== */}
                <header className="mt-16 md:mt-[100px] mb-10 md:mb-[80px] text-center px-4">
                    <h1 className="m-0 text-[#f5e7c6] text-2xl md:text-[clamp(24px,3vw,34px)] drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)] font-bold">
                        اللباس الفلسطيني التراثي
                    </h1>
                </header>

                {/* ===== Carousel Section ===== */}
                <section className="relative w-full max-w-[900px] flex items-center justify-center px-4 md:px-12">

                    {/* Left Arrow (Desktop Only) */}
                    <button
                        onClick={prevSlide}
                        className="hidden md:flex absolute left-0 z-10 w-12 h-12 rounded-full bg-black/40 border border-white/20 items-center justify-center text-white transition-all hover:bg-black/60 active:scale-95"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>

                    {/* Card Container */}
                    <div className="relative w-full flex md:block overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar gap-4 py-8 md:h-[450px]">
                        {clothesData.map((card: any, index: number) => (
                            <ClothesCard
                                key={card.id}
                                title={card.title}
                                shortDesc={card.shortDesc}
                                image={card.image}
                                isActive={index === currentIndex}
                                onClick={() => navigate(`/heritage/customs/clothes/${card.id}`)}
                            />
                        ))}
                    </div>

                    {/* Right Arrow (Desktop Only) */}
                    <button
                        onClick={nextSlide}
                        className="hidden md:flex absolute right-0 z-10 w-12 h-12 rounded-full bg-black/40 border border-white/20 items-center justify-center text-white transition-all hover:bg-black/60 active:scale-95"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>

                </section>

                {/* Navigation Dots */}
                <div className="flex gap-2 mt-4">
                    {clothesData.map((_: any, index: number) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#f3dca4] w-6" : "bg-white/20"
                                }`}
                        />
                    ))}
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate("/heritage/traditions")}
                    className="mt-12 mb-20 px-8 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    العودة للتقاليد
                </button>
            </main>
        </HeritageBackground>
    );
}
