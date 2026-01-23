import React from "react";

interface HeritageBackgroundProps {
    children: React.ReactNode;
}

const cityBg = "/images/city_main.png";

const HeritageBackground: React.FC<HeritageBackgroundProps> = ({ children }) => {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed box-border pt-[45px] px-4 md:px-[40px] pb-20 md:pb-[120px]"
            style={{
                backgroundImage: `url(${cityBg})`,
                backgroundSize: "cover" // More robust for responsive
            }}
        >
            {children}
        </div>
    );
};

export default HeritageBackground;
