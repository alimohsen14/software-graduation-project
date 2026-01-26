import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiHome, FiTool } from "react-icons/fi";
import { industriesData as industries } from "../../data/industriesData";
import HeritageBackground from "../../ui/HeritageBackground";
import HeritageNavButtons from "../../ui/HeritageNavButtons";

export default function IndustryDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("heritage");
    const industry = industries.find((i) => i.id === id);

    if (!industry) {
        return (
            <HeritageBackground>
                <div className="py-20 text-center" dir={i18n.dir()}>
                    <h2 className="text-3xl font-bold text-[#ecd5be] mb-4">
                        {t("industriesPage.details.notFound", "الصناعة غير موجودة")}
                    </h2>
                    <button
                        onClick={() => navigate("/heritage/industries")}
                        className="text-amber-500 font-bold hover:underline"
                    >
                        {t("industriesPage.details.backToList", "العودة إلى قائمة الصناعات")}
                    </button>
                </div>
            </HeritageBackground>
        );
    }

    const industryTitle = t(`industriesPage.items.${industry.id}.title`);
    const industryText = t(`industriesPage.items.${industry.id}.text`);

    return (
        <HeritageBackground>
            <div className="py-2 px-4 md:px-0" dir={i18n.dir()}>
                <HeritageNavButtons
                    backLabel={t("industriesPage.details.backLabel", "العودة للصناعات")}
                    backPath="/heritage/industries"
                />
                {/* Breadcrumbs (Hidden on very small mobile) */}
                <nav className="hidden sm:flex items-center gap-2 mb-6 text-sm font-medium text-[#2f5c3f]/60">
                    <Link to="/heritage" className="hover:text-emerald-700 flex items-center gap-1">
                        <FiHome size={14} />
                        {t("industriesPage.details.home", "الرئيسية")}
                    </Link>
                    <FiArrowRight className={i18n.dir() === "rtl" ? "rotate-180" : ""} size={14} />
                    <Link to="/heritage/industries" className="hover:text-emerald-700">
                        {t("industriesPage.details.industries", "الصناعات التقليدية")}
                    </Link>
                    <FiArrowRight className={i18n.dir() === "rtl" ? "rotate-180" : ""} size={14} />
                    <span className="text-[#2f5c3f]">{industryTitle}</span>
                </nav>

                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-emerald-50 mb-12">
                    {/* Hero Image */}
                    <div className="relative h-[250px] md:h-[500px]">
                        <img
                            src={industry.image}
                            alt={industryTitle}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className={`absolute bottom-4 ${i18n.dir() === 'rtl' ? 'right-4 md:right-8' : 'left-4 md:left-8'} text-white`}>
                            <div className="flex items-center gap-2 mb-2 bg-amber-600/80 backdrop-blur-sm px-3 py-1 rounded-full w-fit text-xs md:text-sm">
                                <FiTool size={16} />
                                {t("industriesPage.details.category", "حرفة تقليدية")}
                            </div>
                            <h1 className="text-2xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
                                {industryTitle}
                            </h1>
                        </div>
                    </div>

                    {/* Content Wrapper */}
                    <div className="p-6 md:p-12 lg:p-16">
                        <div className="max-w-4xl">
                            <h2 className="text-xl md:text-3xl font-bold text-[#2f5c3f] mb-4 md:mb-6 relative inline-block">
                                {t("industriesPage.details.about", "عن هذه الحرفة")}
                                <div className={`absolute -bottom-2 ${i18n.dir() === 'rtl' ? 'right-0' : 'left-0'} w-1/2 h-1 bg-emerald-600 rounded-full`} />
                            </h2>

                            <p className={`text-[#2f5c3f]/80 text-base md:text-xl leading-relaxed font-medium mb-10 text-justify ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                                {industryText}
                            </p>

                            {/* Back Button */}
                            <div className="flex justify-start">
                                <button
                                    onClick={() => navigate("/heritage/industries")}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[#2f5c3f] text-white rounded-2xl font-bold hover:bg-emerald-800 transition shadow-lg hover:shadow-emerald-900/20 min-h-[44px]"
                                >
                                    <FiArrowRight className={i18n.dir() === "rtl" ? "" : "rotate-180"} />
                                    {t("industriesPage.details.backButton", "العودة إلى الصناعات")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </HeritageBackground>
    );
}
