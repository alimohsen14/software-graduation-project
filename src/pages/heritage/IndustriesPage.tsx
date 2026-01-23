import "../../styles/industries.css";

import { industriesData } from "../../data/industriesData";
import IndustryCard from "../../ui/IndustryCard";

const BG = "/images/city_main.png";

export default function IndustriesPage() {
    return (
        <div
            className="industries-root"
            style={{ backgroundImage: `url(${BG})` }}
        >
            <h1 className="industries-title">الصناعات والحرف الفلسطينية</h1>

            <div className="industries-container">
                <div className="industries-scroll-box">
                    <div className="industries-grid">
                        {industriesData.map((item, i) => (
                            <IndustryCard
                                key={i}
                                title={item.title}
                                image={item.image}
                                text={item.text}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
