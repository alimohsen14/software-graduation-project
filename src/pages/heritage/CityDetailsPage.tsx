import { useParams } from "react-router-dom";
import { citiesData } from "../../data/citiesData";
import "../../styles/cityDetails.css";

const BG = "/images/city_main.png";

export default function CityDetailsPage() {
    const { id } = useParams();
    const city = id ? (citiesData as any)[id] : null;


    if (!city) {
        return <div style={{ color: "white" }}>المدينة غير موجودة</div>;
    }

    return (
        <div
            className="city-details-root"
            style={{ backgroundImage: `url(${BG})` }}
        >
            <div className="city-details-panel">

                <h1 className="city-name">{city.name}</h1>

                {/* ===== INFO BOX WITH SCROLL ===== */}
                <div className="city-info-box">

                    {city.location?.trim() && (
                        <section className="info-section">
                            <h3>📍 الموقع الجغرافي</h3>
                            <ul className="info-list">
                                {city.location
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.area?.trim() && (
                        <section className="info-section">
                            <h3>🗺️ المساحة والأراضي</h3>
                            <ul className="info-list">
                                {city.area
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.naming?.trim() && (
                        <section className="info-section">
                            <h3>🏷️ سبب التسمية</h3>
                            <ul className="info-list">
                                {city.naming
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.history?.trim() && (
                        <section className="info-section">
                            <h3>📜 الأهمية التاريخية</h3>
                            <ul className="info-list">
                                {city.history
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.landmarks?.trim() && (
                        <section className="info-section">
                            <h3>🏛️ المعالم التاريخية</h3>
                            <ul className="info-list">
                                {city.landmarks
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => (
                                        <li key={i}>{l.replace(/^-\s*/, "")}</li>
                                    ))}
                            </ul>
                        </section>
                    )}

                    {city.climate?.trim() && (
                        <section className="info-section">
                            <h3>🌤️ المناخ</h3>
                            <ul className="info-list">
                                {city.climate
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.water?.trim() && (
                        <section className="info-section">
                            <h3>💧 مصادر المياه</h3>
                            <ul className="info-list">
                                {city.water
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.heritage?.trim() && (
                        <section className="info-section">
                            <h3>👘 اللباس التراثي</h3>
                            <ul className="info-list">
                                {city.heritage
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.occupation?.trim() && (
                        <section className="info-section">
                            <h3>⚠️ احتلال المدينة</h3>
                            <ul className="info-list">
                                {city.occupation
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.population?.trim() && (
                        <section className="info-section">
                            <h3>👥 السكان</h3>
                            <ul className="info-list">
                                {city.population
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {Array.isArray(city.families) && city.families.length > 0 && (
                        <section className="info-section">
                            <h3>👨‍👩‍👧‍👦 أبرز العائلات</h3>
                            <ul className="info-list">
                                {city.families.map((f: string, i: number) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {Array.isArray(city.mosques) && city.mosques.length > 0 && (
                        <section className="info-section">
                            <h3>🕌 المساجد</h3>
                            <ul className="info-list">
                                {city.mosques.map((m: string, i: number) => (
                                    <li key={i}>{m}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {city.notableFigures?.trim() && (
                        <section className="info-section">
                            <h3>⭐ شخصيات بارزة</h3>
                            <ul className="info-list">
                                {city.notableFigures
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {city.industry?.trim() && (
                        <section className="info-section">
                            <h3>🏭 الصناعة والاقتصاد</h3>
                            <ul className="info-list">
                                {city.industry
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => (
                                        <li key={i}>{l.replace(/^-\s*/, "")}</li>
                                    ))}
                            </ul>
                        </section>
                    )}

                    {city.agriculture?.trim() && (
                        <section className="info-section">
                            <h3>🌿 الزراعة</h3>
                            <ul className="info-list">
                                {city.agriculture
                                    .split("\n")
                                    .filter((l: string) => l.trim())
                                    .map((l: string, i: number) => <li key={i}>{l}</li>)}
                            </ul>
                        </section>
                    )}

                    {Array.isArray(city.ruins) && city.ruins.length > 0 && (
                        <section className="info-section">
                            <h3>🏺 الآثار والخِرَب</h3>
                            <ul className="info-list">
                                {city.ruins.map((r: string, i: number) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                </div>

                {/* ===== VILLAGES ===== */}
                <h2 className="villages-title">بعض قرى المدينة:</h2>

                <div className="villages-line">
                    {city.villages.map((v: any) => (
                        <div key={v.id} className="village-card">
                            {v.name}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
