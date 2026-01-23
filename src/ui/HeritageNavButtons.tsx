// Reusable Navigation Buttons for Heritage Section
import React from "react";
import { useNavigate } from "react-router-dom";

interface HeritageNavButtonsProps {
    backLabel: string;
    backPath: string;
    homeLabel?: string;
    homePath?: string;
    className?: string;
}

const HeritageNavButtons: React.FC<HeritageNavButtonsProps> = ({
    backLabel,
    backPath,
    homeLabel = "العودة للمكتبة الرئيسية",
    homePath = "/heritage",
    className = ""
}) => {
    const navigate = useNavigate();

    return (
        <div className={`flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-8 ${className}`}>
            <button
                onClick={() => navigate(backPath)}
                className="w-full md:w-auto px-6 md:px-10 py-3 rounded-full bg-amber-600/20 border border-amber-600/40 text-[#f3dca4] hover:bg-amber-600/30 transition-all font-bold min-h-[44px]"
            >
                {backLabel}
            </button>

            <button
                onClick={() => navigate(homePath)}
                className="w-full md:w-auto px-6 md:px-10 py-3 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all min-h-[44px]"
            >
                {homeLabel}
            </button>
        </div>
    );
};

export default HeritageNavButtons;
