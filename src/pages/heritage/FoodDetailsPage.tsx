import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { foodsData } from "../../data/foodsData";
import HeritageBackground from "../../ui/HeritageBackground";

export default function FoodDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const food = foodsData.find((f) => f.id === id);

    if (!food) {
        return <div className="text-white text-center mt-20 text-2xl font-bold">الطبق غير موجود</div>;
    }

    // Scrollbar styles
    const scrollbarStyles = "scrollbar-thin scrollbar-track-[#d3bda7]/95 scrollbar-thumb-amber-500 hover:scrollbar-thumb-amber-600 [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-[#d3bda7]/95 [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-[#e0b874] [&::-webkit-scrollbar-thumb]:to-[#b37a36]";

    return (
        <HeritageBackground>
            <main
                className="relative z-[2] min-h-[calc(100vh-165px)] flex flex-col items-center w-full px-4"
                dir="rtl"
            >
                {/* Header / Title */}
                <header className="mt-12 md:mt-[100px] mb-8 md:mb-[40px] text-center w-full max-w-[800px]">
                    <h1 className="m-0 text-[#f5e7c6] text-3xl md:text-[clamp(28px,4vw,42px)] drop-shadow-[0_8px_25px_rgba(0,0,0,0.8)] font-bold px-2">
                        {food.title}
                    </h1>
                </header>

                {/* Content Panel */}
                <div className="w-full max-w-[800px] flex flex-col gap-6 md:gap-8 mb-20 animate-fadeIn">

                    {/* Big Image Section */}
                    <div className="w-full rounded-[24px] md:rounded-[30px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10">
                        <img
                            src={food.image}
                            alt={food.title}
                            className="w-full h-64 md:h-[400px] object-cover"
                        />
                    </div>

                    {/* Description Section */}
                    <div className={`bg-[rgba(30,22,14,0.85)] backdrop-blur-md border border-[rgba(255,255,255,0.15)] p-6 md:p-10 rounded-[24px] shadow-2xl ${scrollbarStyles} max-h-[400px] overflow-y-auto`}>
                        <h2 className="text-[#f3dca4] text-xl md:text-[24px] mb-4 md:mb-6 font-bold flex items-center gap-3">
                            📜 عن الطبق
                        </h2>
                        <div className="text-white/90 text-base md:text-[18px] leading-[1.8] text-justify whitespace-pre-wrap">
                            {food.fullDesc}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 md:justify-between items-center mt-4 pb-10">
                        <button
                            onClick={() => navigate("/heritage/foods")}
                            className="w-full md:w-auto px-10 py-3 rounded-full bg-amber-600/20 border border-amber-600/40 text-[#f3dca4] hover:bg-amber-600/30 transition-all font-bold min-h-[44px]"
                        >
                            العودة لقائمة الأطباق
                        </button>

                        <button
                            onClick={() => navigate("/heritage")}
                            className="w-full md:w-auto px-10 py-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all min-h-[44px]"
                        >
                            المكتبة الرئيسية
                        </button>
                    </div>
                </div>
            </main>
        </HeritageBackground>
    );
}
