import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowRight, FiHome, FiTool } from "react-icons/fi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { industriesData as industries } from "../../data/industriesData";
import HeritageBackground from "../../ui/HeritageBackground";
import HeritageNavButtons from "../../ui/HeritageNavButtons";

export default function IndustryDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const industry = industries.find((i) => i.id === id);

    if (!industry) {
        return (
            <HeritageBackground>
                <div className="py-20 text-center" dir="rtl">
                    <h2 className="text-3xl font-bold text-[#ecd5be] mb-4">الصناعة غير موجودة</h2>
                    <button
                        onClick={() => navigate("/heritage/industries")}
                        className="text-amber-500 font-bold hover:underline"
                    >
                        العودة إلى قائمة الصناعات
                    </button>
                </div>
            </HeritageBackground>
        );
    }

    return (
        <HeritageBackground>
            <div className="py-2 px-4 md:px-0" dir="rtl">
                <HeritageNavButtons
                    backLabel="العودة للصناعات"
                    backPath="/heritage/industries"
                />
                {/* Breadcrumbs (Hidden on very small mobile) */}
                <nav className="hidden sm:flex items-center gap-2 mb-6 text-sm font-medium text-[#2f5c3f]/60">
                    <Link to="/heritage" className="hover:text-emerald-700 flex items-center gap-1">
                        <FiHome size={14} />
                        الرئيسية
                    </Link>
                    <FiArrowRight size={14} />
                    <Link to="/heritage/industries" className="hover:text-emerald-700">
                        الصناعات التقليدية
                    </Link>
                    <FiArrowRight size={14} />
                    <span className="text-[#2f5c3f]">{industry.title}</span>
                </nav>

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-emerald-50 mb-12">
                    {/* Hero Image */}
                    <div className="relative h-[250px] md:h-[500px]">
                        <img
                            src={industry.image}
                            alt={industry.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 text-white left-4 md:left-auto">
                            <div className="flex items-center gap-2 mb-2 bg-amber-600/80 backdrop-blur-sm px-3 py-1 rounded-full w-fit text-xs md:text-sm">
                                <FiTool size={16} />
                                حرفة تقليدية
                            </div>
                            <h1 className="text-2xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
                                {industry.title}
                            </h1>
                        </div>
                    </div>

                    {/* Content Wrapper */}
                    <div className="p-6 md:p-12 lg:p-16">
                        <div className="max-w-4xl">
                            <h2 className="text-xl md:text-3xl font-bold text-[#2f5c3f] mb-4 md:mb-6 relative inline-block">
                                عن هذه الحرفة
                                <div className="absolute -bottom-2 right-0 w-1/2 h-1 bg-emerald-600 rounded-full" />
                            </h2>

                            <p className="text-[#2f5c3f]/80 text-base md:text-xl leading-relaxed font-medium mb-10 text-justify">
                                {industry.text}
                            </p>

                            {/* Back Button */}
                            <div className="flex justify-start">
                                <button
                                    onClick={() => navigate("/heritage/industries")}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#2f5c3f] text-white rounded-2xl font-bold hover:bg-emerald-800 transition shadow-lg hover:shadow-emerald-900/20 min-h-[44px]"
                                >
                                    <FiArrowRight className="rotate-180 md:rotate-0" />
                                    العودة إلى الصناعات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HeritageBackground>
    );
}
