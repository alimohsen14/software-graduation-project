interface Palestine3DLogoProps {
    size?: "sm" | "lg";
    className?: string;
}

const Palestine3DLogo = ({ size = "lg", className = "" }: Palestine3DLogoProps) => {
    const isSm = size === "sm";

    return (
        <div className={`flex flex-col items-center select-none ${className}`}>
            {/* النص */}
            <div className="flex items-end gap-1">
                <span
                    className={`${isSm ? "text-xl md:text-2xl" : "text-[44px] md:text-[58px]"} font-serif font-bold`}
                    style={{
                        color: "#e9e4d6", // سكري دافئ مش أبيض فاقع
                        textShadow: isSm ? "0 1px 3px rgba(0,0,0,0.6)" : "0 2px 6px rgba(0,0,0,0.6)",
                    }}
                >
                    Palestine
                </span>

                <span
                    className={`${isSm ? "text-xl md:text-2xl" : "text-[44px] md:text-[58px]"} font-extrabold`}
                    style={{
                        color: "#3e6347",
                        textShadow: isSm ? "0 1px 3px rgba(0,0,0,0.7)" : "0 2px 6px rgba(0,0,0,0.7)",
                    }}
                >
                    3D
                </span>
            </div>

            {/* الخط تحت النص */}
            <div
                className={`${isSm ? "mt-0.5 h-[2px]" : "mt-0.5 h-[4px]"} rounded-full`}
                style={{
                    width: isSm ? "120px" : "350px",
                    background:
                        "linear-gradient(to right, #7a1f1f 0%, #7a1f1f 28%, #f2f2f2 45%, #f2f2f2 55%, #000000 72%, #000000 100%)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.6)",
                }}
            />
        </div>
    );
};

export default Palestine3DLogo;