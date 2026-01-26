import "../../styles/industries.css";
import { useTranslation } from "react-i18next";
import { industriesData } from "../../data/industriesData";
import IndustryCard from "../../ui/IndustryCard";

const BG = "/images/city_main.png";

export default function IndustriesPage() {
    const { t } = useTranslation("heritage");

    return (
        <div
            className="industries-root"
            style={{ backgroundImage: `url(${BG})` }}
        >
            <h1 className="industries-title">
                {t("heritage:industriesPage.title", "الصناعات والحرف الفلسطينية")}
            </h1>

            <div className="industries-container">
                <div className="industries-scroll-box">
                    <div className="industries-grid">
                        {industriesData.map((item, i) => (
                            <IndustryCard
                                key={i}
                                title={t(`heritage:industriesPage.items.${item.id}.title`)}
                                image={item.image}
                                text={t(`heritage:industriesPage.items.${item.id}.text`)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
