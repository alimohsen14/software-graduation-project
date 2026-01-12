import React from "react";
import { motion } from "framer-motion";
import Palestine3DLogo from "../common/Palestine3DLogo";

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
            {/* Full-screen Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/backgrounds/site-bg.png')",
                }}
            />

            {/* Subtle Blur Overlay */}
            <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px]" />

            {/* Centered Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-20 w-full max-w-[440px]"
            >
                <div className="mb-10 text-center">
                    {/* Logo / Branding */}
                    <div className="inline-block group">
                        <Palestine3DLogo />
                        <p className="mt-4 text-white/90 font-bold text-xl drop-shadow-lg tracking-wide">
                            فلسطين ثلاثية الأبعاد
                        </p>
                    </div>
                </div>

                {/* glassmorphism Card - No White Background */}
                <div className="bg-[#1a130f]/60 backdrop-blur-xl rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden ring-1 ring-white/5">
                    <div className="px-8 pt-10 pb-12">
                        {children}
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Palestine3D Heritage Library
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
