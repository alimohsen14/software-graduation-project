import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HeritageBackground from "../../ui/HeritageBackground";

export default function CondolenceDetailsPage() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("condolence");

    // Scrollbar styles
    const scrollbarStyles = "scrollbar-thin scrollbar-track-[#d3bda7]/95 scrollbar-thumb-amber-500 hover:scrollbar-thumb-amber-600 [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#d3bda7]/95 [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-[#e0b874] [&::-webkit-scrollbar-thumb]:to-[#b37a36]";

    return (
        <HeritageBackground>
            <main
                className="relative z-[2] min-h-[calc(100vh-165px)] flex flex-col items-center w-full px-4"
                dir={i18n.dir()}
            >
                {/* Header / Title */}
                <header className="mt-[100px] mb-[40px] text-center w-full max-w-[800px]">
                    <h1 className="m-0 text-[#f5e7c6] text-[clamp(28px,4vw,42px)] drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)] font-bold">
                        {t("title")}
                    </h1>
                </header>

                {/* Content Panel */}
                <div className="w-full max-w-[800px] flex flex-col gap-8 mb-20">

                    {/* Top Image Section */}
                    <div className="w-full rounded-[30px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10">
                        <img
                            src="/images/tradition-condolence.png"
                            alt={t("title")}
                            className="w-full h-[400px] object-cover"
                        />
                    </div>

                    {/* Description Section */}
                    <div className={`bg-[rgba(30,22,14,0.85)] backdrop-blur-md border border-[rgba(255,255,255,0.15)] p-8 md:p-10 rounded-[24px] shadow-2xl ${scrollbarStyles} max-h-[500px] overflow-y-auto`}>
                        <h2 className="text-[#f3dca4] text-[24px] mb-6 font-bold flex items-center gap-3">
                            {t("subtitle")}
                        </h2>
                        <div className="text-white/90 text-[18px] leading-[2] text-justify whitespace-pre-line">
                            {t("content")}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-4 pb-10">
                        <button
                            onClick={() => navigate("/heritage/traditions")}
                            className="px-10 py-3 rounded-full bg-amber-600/20 border border-amber-600/40 text-[#f3dca4] hover:bg-amber-600/30 transition-all font-bold"
                        >
                            {t("backButton")}
                        </button>

                        <button
                            onClick={() => navigate("/heritage")}
                            className="px-10 py-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                        >
                            {t("homeButton")}
                        </button>
                    </div>
                </div>
            </main>
        </HeritageBackground>
    );
}

