import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
    const { t, i18n } = useTranslation("heritage");

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
                dir={i18n.dir()}
            >
                {/* ===== Header ===== */}
                <header className="mt-[130px] mb-[200px] text-center">
                    <h1 className="m-0 text-[#f5e7c6] text-2xl md:text-[clamp(24px,3vw,34px)] drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)] font-bold px-2">
                        {t("title")}
                    </h1>
                </header>

                {/* ===== Cards Grid ===== */}
                <section
                    className="
    w-full
    max-w-[1000px]
    grid
    grid-cols-1
    md:grid-cols-3
    gap-x-[50px]
    gap-y-[30px]
    mb-[40px]
    px-30
    md:px-0
  "
                >
                    <LibraryCard
                        image="/images/card-cities.png"
                        title={t("cards.cities.title")}
                        subtitle={t("cards.cities.subtitle")}
                        onClick={() => navigate("/heritage/cities")}
                    />

                    <LibraryCard
                        image="/images/card-industries.png"
                        title={t("cards.industries.title")}
                        subtitle={t("cards.industries.subtitle")}
                        onClick={() => navigate("/heritage/industries")}
                    />

                    <LibraryCard
                        image="/images/card-landmarks.png"
                        title={t("cards.traditions.title")}
                        subtitle={t("cards.traditions.subtitle")}
                        onClick={() => navigate("/heritage/traditions")}
                    />

                </section>
            </main>
        </div>
    );
}
