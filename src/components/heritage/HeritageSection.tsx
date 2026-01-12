import React from "react";

interface HeritageSectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function HeritageSection({
    title,
    subtitle,
    children,
}: HeritageSectionProps) {
    return (
        <section className="mb-16">
            <div className="mb-8 border-r-4 border-emerald-700 pr-5">
                <h2 className="text-3xl font-extrabold text-[#2f5c3f] mb-2">{title}</h2>
                {subtitle && (
                    <p className="text-[#2f5c3f]/60 text-lg font-medium">{subtitle}</p>
                )}
            </div>
            {children}
        </section>
    );
}
