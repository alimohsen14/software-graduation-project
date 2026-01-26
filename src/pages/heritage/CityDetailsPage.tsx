import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { citiesData } from "../../data/citiesData";
import "../../styles/cityDetails.css";

const BG = "/images/city_main.png";

export default function CityDetailsPage() {
    const { id } = useParams();
    const { t, i18n } = useTranslation("cityDetails");
    const city = id ? (citiesData as any)[id] : null;

    if (!city) {
        return <div style={{ color: "white" }}>{t("cityDetails:labels.cityNotFound", "المدينة غير موجودة")}</div>;
    }

    const isRTL = i18n.language === 'ar';

    // Helper to render sections consistently from the "sections" object in JSON
    const renderSection = (icon: string, labelKey: string, contentKey: string, fallback: string) => {
        const content = t(`cityDetails:cities.${id}.sections.${contentKey}`, fallback) as string;
        if (!content || content.includes(`cities.${id}.sections.${contentKey}`)) return null;

        return (
            <section className="info-section">
                <h3>{icon} {t(`cityDetails:labels.${labelKey}`)}</h3>
                <ul className="info-list">
                    {content
                        .split("\n")
                        .filter((l: string) => l.trim())
                        .map((l: string, i: number) => <li key={i}>{l}</li>)}
                </ul>
            </section>
        );
    };

    const cityName = t(`cityDetails:cities.${id}.name`, city.name) as string;

    // Handle villages from JSON if they exist as an array of objects
    const villages = (t(`cityDetails:cities.${id}.villages`, { returnObjects: true }) as any);
    const displayVillages = Array.isArray(villages) ? villages : city.villages;

    return (
        <div
            className="city-details-root"
            style={{ backgroundImage: `url(${BG})`, direction: isRTL ? 'rtl' : 'ltr' }}
        >
            <div className="city-details-panel">

                <h1 className="city-name">{cityName}</h1>

                <div className="city-info-box">
                    {renderSection("📍", "location", "location", city.location)}
                    {renderSection("🗺️", "area", "area", city.area)}
                    {renderSection("🏷️", "naming", "naming", city.naming)}
                    {renderSection("📜", "history", "history", city.history)}
                    {renderSection("🏛️", "landmarks", "landmarks", city.landmarks)}
                    {renderSection("🌤️", "climate", "climate", city.climate)}
                    {renderSection("💧", "water", "water", city.water)}
                    {renderSection("👘", "heritage", "heritage", city.heritage)}
                    {renderSection("⚠️", "occupation", "occupation", city.occupation)}
                    {renderSection("👥", "population", "population", city.population)}
                    {renderSection("👨‍👩‍👧‍👦", "families", "families", city.families)}
                    {renderSection("🕌", "mosques", "mosques", city.mosques)}
                    {renderSection("⭐", "notableFigures", "notableFigures", city.notableFigures)}
                    {renderSection("🏭", "industry", "industry", city.industry)}
                    {renderSection("🌿", "agriculture", "agriculture", city.agriculture)}
                    {renderSection("🏺", "ruins", "ruins", city.ruins)}
                    {renderSection("💰", "economy", "economy", city.economy)}
                </div>

                <h2 className="villages-title">{(t("cityDetails:labels.villages") as string)}</h2>

                <div className="villages-line">
                    {displayVillages.map((v: any, index: number) => (
                        <div key={v.id || index} className="village-card">
                            {v.name}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
