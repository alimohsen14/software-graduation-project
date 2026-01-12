import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowRight, FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import HeritageHero from "../../components/heritage/HeritageHero";
import HeritageSection from "../../components/heritage/HeritageSection";
import HeritageGrid from "../../components/heritage/HeritageGrid";
import HeritageCard from "../../components/heritage/HeritageCard";
import { industries } from "../../data/heritage/industries";

export default function IndustriesPage() {
    const navigate = useNavigate();

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
                    <span className="text-[#2f5c3f]">الصناعات التقليدية</span>
                </nav>

                <HeritageHero
                    title="الصناعات التقليدية"
                    subtitle="حرف يدوية عريقة تجسد الإبداع والهوية الفلسطينية."
                    backgroundImage="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80"
                />

                <HeritageSection
                    title="اكتشف الحرف اليدوية"
                    subtitle="حرف توارثتها الأجيال لتبقى شاهدة على حضارتنا"
                >
                    <HeritageGrid>
                        {industries.map((industry) => (
                            <HeritageCard
                                key={industry.id}
                                title={industry.name}
                                description={industry.shortDescription}
                                image={industry.image}
                                onClick={() => navigate(`/heritage/industries/${industry.id}`)}
                            />
                        ))}
                    </HeritageGrid>
                </HeritageSection>

                {/* Back Button */}
                <div className="flex justify-start">
                    <button
                        onClick={() => navigate("/heritage")}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-emerald-200 rounded-xl text-[#2f5c3f] font-bold hover:bg-emerald-50 transition shadow-sm"
                    >
                        <FiArrowRight />
                        العودة إلى الرئيسية
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
