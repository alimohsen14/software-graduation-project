import "../../styles/cities.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CITY_BG = "/images/city_main.png";
const FLAG = "/images/pal-flag.png";

const CITIES = [
    { id: "qalqilya", name: "قلقيلية" },
    { id: "tulkarm", name: "طولكرم" },
    { id: "ramallah", name: "رام الله" },
    { id: "salfit", name: "سلفيت" },
    { id: "nablus", name: "نابلس" },
    { id: "nazareth", name: "الناصرة" },
    { id: "akka", name: "عكا" },
    { id: "ramla", name: "الرملة" },
    { id: "tiberias", name: "طبريا" },
    { id: "haifa", name: "حيفا" },
    { id: "tubas", name: "طوباس" },
    { id: "jenin", name: "جنين" },
    { id: "lydd", name: "اللد" },
    { id: "jaffa", name: "يافا" },
    { id: "jerusalem", name: "القدس" },
    { id: "hebron", name: "الخليل" },
    { id: "gaza", name: "غزة" },
    { id: "bethlehem", name: "بيت لحم" },
    { id: "jericho", name: "أريحا" },
    { id: "bisan", name: "بيسان" },
    { id: "safad", name: "صفد" },
];

export default function CitiesPage() {
    const { t, i18n } = useTranslation("cities");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const filtered = CITIES.filter((city) =>
        t(`cities.${city.id}`).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            className="cities-root"
            style={{ backgroundImage: `url(${CITY_BG})` }}
            dir={i18n.dir()}
        >
            <div className="cities-panel">

                <h1 className="cities-title">
                    <span className="title-wrap">
                        {t("title")}
                        <img src={FLAG} className="title-flag" alt="Palestine Flag" />
                    </span>
                </h1>

                <input
                    className="cities-search"
                    placeholder={t("searchPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="cities-list">
                    {filtered.map((city) => (
                        <button
                            key={city.id}
                            className="city-btn"
                            onClick={() => navigate(`/heritage/cities/${city.id}`)}
                        >
                            <img src={FLAG} className="city-flag" alt="" />
                            <span>{t(`cities.${city.id}`)}</span>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
