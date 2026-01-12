import React from "react";

interface HeritageHeroProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

export default function HeritageHero({
    title,
    subtitle,
    backgroundImage,
}: HeritageHeroProps) {
    return (
        <div className="relative h-[300px] md:h-[400px] w-full rounded-2xl overflow-hidden mb-12 shadow-xl group">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: `url(${backgroundImage ||
                        "https://images.unsplash.com/photo-1597330377319-3544579c231e?auto=format&fit=crop&q=80"
                        })`,
                }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl max-w-2xl font-medium opacity-90 drop-shadow-md">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Decorative Palestine Flag Stripe */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 flex transition-opacity duration-300 opacity-80 group-hover:opacity-100">
                <div className="flex-1 bg-black" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#007A3D]" />
                <div className="flex-1 bg-[#CE1126]" />
            </div>
        </div>
    );
}
