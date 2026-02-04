import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiInfo } from 'react-icons/fi';
import Palestine3DLogo from '../common/Palestine3DLogo';

export default function Footer() {
    const { i18n } = useTranslation();
    const direction = i18n.dir();

    return (
        <footer className="w-full mt-auto px-4 md:px-10 pb-6 md:pb-10">
            <div className="max-w-[1400px] mx-auto">
                {/* Main Glassmorphism Container */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                    {/* Subtle Ambient Background */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12 md:gap-8">
                        {/* Left Section: Info & Logo */}
                        <div className="flex-1 space-y-6 max-w-md">
                            <div className="scale-90 origin-left">
                                <Palestine3DLogo size="sm" />
                            </div>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed font-medium">
                                Palestine 3D – A digital platform to preserve and showcase Palestinian heritage through immersive experiences.
                            </p>
                            <div className="flex items-center gap-3 py-2 px-4 rounded-2xl bg-white/5 border border-white/5 w-fit">
                                <FiInfo className="text-emerald-400 w-5 h-5" />
                                <span className="text-white/80 text-xs md:text-sm font-semibold tracking-wide uppercase">
                                    Graduation Project
                                </span>
                            </div>
                            <p className="text-white/40 text-[13px] italic">
                                Prepared by <span className="text-white/70 font-bold not-italic">Ali Mohsen & Jamila Suwan</span>
                            </p>
                        </div>

                        {/* Right Section: Contact Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
                            {/* Emails */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em]">
                                    <FiMail className="text-emerald-400" />
                                    Emails
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-white/60 hover:text-white transition-colors text-sm font-medium cursor-default">
                                        alimohsen142003@gmail.com
                                    </p>
                                    <p className="text-white/60 hover:text-white transition-colors text-sm font-medium cursor-default">
                                        jamilasuwan2018@gmail.com
                                    </p>
                                </div>
                            </div>

                            {/* Phones */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em]">
                                    <FiPhone className="text-emerald-400" />
                                    Contact Numbers
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-white/60 text-sm font-medium cursor-default" dir="ltr">
                                        +972 59 778 7058
                                    </p>
                                    <p className="text-white/60 text-sm font-medium cursor-default" dir="ltr">
                                        +970 59 248 4959
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Divider & Copyright */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-white/30 text-[11px] md:text-xs font-bold uppercase tracking-[0.3em]">
                            © 2026 Palestine 3D • All rights reserved
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-white/10 text-[10px] font-black italic select-none">Preserving Heritage Step by Step 🍉</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
