import React from "react";

interface HeritageGridProps {
    children: React.ReactNode;
}

export default function HeritageGrid({ children }: HeritageGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {children}
        </div>
    );
}
