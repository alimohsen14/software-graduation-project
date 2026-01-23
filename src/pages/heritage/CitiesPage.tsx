import "../../styles/cities.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const filtered = CITIES.filter((c) => c.name.includes(search));

    return (
        <div
            className="cities-root"
            style={{ backgroundImage: `url(${CITY_BG})` }}
        >
            <div className="cities-panel">

                <h1 className="cities-title">
                    <span className="title-wrap">
                        مدن فلسطين
                        <img src={FLAG} className="title-flag" alt="Palestine Flag" />
                    </span>
                </h1>

                <input
                    className="cities-search"
                    placeholder="ابحث عن مدينة..."
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
                            <span>{city.name}</span>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
