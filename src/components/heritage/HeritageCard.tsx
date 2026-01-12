import React from "react";

interface HeritageCardProps {
    title: string;
    description: string;
    image: string;
    onClick?: () => void;
}

export default function HeritageCard({
    title,
    description,
    image,
    onClick,
}: HeritageCardProps) {
    return (
        <div
            onClick={onClick}
            className="
        group relative overflow-hidden rounded-2xl bg-white 
        border border-emerald-100 shadow-sm cursor-pointer
        transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
        hover:border-emerald-200
      "
        >
            {/* Image Container */}
            <div className="h-52 w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-[#2f5c3f] mb-2 transition-colors group-hover:text-emerald-700">
                    {title}
                </h3>
                <p className="text-[#2f5c3f]/70 text-sm line-clamp-3 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Hover Highlight Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
        </div>
    );
}
