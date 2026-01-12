import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowRight, FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import HeritageHero from "../../components/heritage/HeritageHero";
import HeritageSection from "../../components/heritage/HeritageSection";
import HeritageGrid from "../../components/heritage/HeritageGrid";
import HeritageCard from "../../components/heritage/HeritageCard";
import { cities } from "../../data/heritage/cities";

export default function CitiesPage() {
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
                    <span className="text-[#2f5c3f]">المدن الفلسطينية</span>
                </nav>

                <HeritageHero
                    title="المدن الفلسطينية"
                    subtitle="من الساحل إلى الجبل، مدننا تحكي تاريخاً لا ينسى."
                    backgroundImage="https://images.unsplash.com/photo-1596489390292-945763261642?auto=format&fit=crop&q=80"
                />

                <HeritageSection
                    title="استكشف مدننا"
                    subtitle="انقر على أي مدينة لمعرفة المزيد عن تاريخها ومعالمها"
                >
                    <HeritageGrid>
                        {cities.map((city) => (
                            <HeritageCard
                                key={city.id}
                                title={city.name}
                                description={city.shortDescription}
                                image={city.image}
                                onClick={() => navigate(`/heritage/cities/${city.id}`)}
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
