import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowRight, FiHome, FiTool } from "react-icons/fi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { industries } from "../../data/heritage/industries";

export default function IndustryDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const industry = industries.find((i) => i.id === id);

    if (!industry) {
        return (
            <DashboardLayout>
                <div className="py-20 text-center" dir="rtl">
                    <h2 className="text-3xl font-bold text-[#2f5c3f] mb-4">الصناعة غير موجودة</h2>
                    <button
                        onClick={() => navigate("/heritage/industries")}
                        className="text-emerald-600 font-bold hover:underline"
                    >
                        العودة إلى قائمة الصناعات
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="py-10" dir="rtl">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-sm font-medium text-[#2f5c3f]/60">
                    <Link to="/heritage" className="hover:text-emerald-700 flex items-center gap-1">
                        <FiHome size={14} />
                        الرئيسية
                    </Link>
                    <FiArrowRight size={14} />
                    <Link to="/heritage/industries" className="hover:text-emerald-700">
                        الصناعات التقليدية
                    </Link>
                    <FiArrowRight size={14} />
                    <span className="text-[#2f5c3f]">{industry.name}</span>
                </nav>

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-emerald-50 mb-12">
                    {/* Hero Image */}
                    <div className="relative h-[300px] md:h-[500px]">
                        <img
                            src={industry.image}
                            alt={industry.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-8 right-8 text-white">
                            <div className="flex items-center gap-2 mb-2 bg-amber-600/80 backdrop-blur-sm px-3 py-1 rounded-full w-fit text-sm">
                                <FiTool size={16} />
                                حرفة تقليدية
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
                                {industry.name}
                            </h1>
                        </div>
                    </div>

                    {/* Content Wrapper */}
                    <div className="p-8 md:p-12 lg:p-16">
                        <div className="max-w-4xl">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#2f5c3f] mb-6 relative inline-block">
                                عن هذه الحرفة
                                <div className="absolute -bottom-2 right-0 w-1/2 h-1 bg-emerald-600 rounded-full" />
                            </h2>

                            <p className="text-[#2f5c3f]/80 text-lg md:text-xl leading-relaxed font-medium mb-10">
                                {industry.fullDescription}
                            </p>

                            {/* Back Button */}
                            <div className="flex justify-start">
                                <button
                                    onClick={() => navigate("/heritage/industries")}
                                    className="flex items-center gap-2 px-8 py-4 bg-[#2f5c3f] text-white rounded-2xl font-bold hover:bg-emerald-800 transition shadow-lg hover:shadow-emerald-900/20"
                                >
                                    <FiArrowRight />
                                    العودة إلى الصناعات
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
