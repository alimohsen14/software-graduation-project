import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import HeritageHero from "../../components/heritage/HeritageHero";
import HeritageSection from "../../components/heritage/HeritageSection";
import HeritageGrid from "../../components/heritage/HeritageGrid";
import HeritageCard from "../../components/heritage/HeritageCard";

export default function HeritageHomePage() {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="py-10" dir="rtl">
                <HeritageHero
                    title="مكتبة التراث الفلسطيني"
                    subtitle="استكشف عبق التاريخ وتراثنا الفلسطيني الأصيل عبر المدن والحرف والتقاليد."
                    backgroundImage="https://images.unsplash.com/photo-1597330377319-3544579c231e?auto=format&fit=crop&q=80"
                />

                <HeritageSection
                    title="أقسام المكتبة"
                    subtitle="اختر القسم الذي ترغب في استكشافه"
                >
                    <HeritageGrid>
                        <HeritageCard
                            title="المدن الفلسطينية"
                            description="تعرف على تاريخ المدن الفلسطينية العريقة، من القدس ونابلس إلى حيفا وغزة."
                            image="https://images.unsplash.com/photo-1596489390292-945763261642?auto=format&fit=crop&q=80"
                            onClick={() => navigate("/heritage/cities")}
                        />
                        <HeritageCard
                            title="الصناعات التقليدية"
                            description="اكتشف الحرف اليدوية والصناعات التي توارثها الأجداد وحافظت على الهوية الفلسطينية."
                            image="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80"
                            onClick={() => navigate("/heritage/industries")}
                        />
                        <HeritageCard
                            title="المعالم التاريخية"
                            description="رحلة عبر الزمان لاستكشاف القلاع والمساجد والكنائس التي تؤكد تجذرنا في هذه الأرض."
                            image="https://images.unsplash.com/photo-1597330377319-3544579c231e?auto=format&fit=crop&q=80"
                            onClick={() => { }} // Placeholder for now or just info
                        />
                    </HeritageGrid>
                </HeritageSection>

                {/* Call to Action or Footer Section */}
                <div className="bg-emerald-50 rounded-3xl p-8 md:p-12 text-center border border-emerald-100 mb-16 shadow-inner">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#2f5c3f] mb-4">
                        تراثنا هو هويتنا
                    </h2>
                    <p className="text-[#2f5c3f]/80 max-w-2xl mx-auto leading-relaxed font-medium">
                        تأسست هذه المكتبة لتكون نافذة للعالم على الجمال والثقافة الفلسطينية.
                        نحن نعتز بتاريخنا ونسعى لنقله للأجيال القادمة بكل فخر.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
