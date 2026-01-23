export interface Country {
    code: string;
    name_en: string;
    name_ar: string;
    name_fr: string;
}

export const COUNTRIES: Country[] = [
    // ARAB COUNTRIES
    { code: "PS", name_en: "Palestine", name_ar: "فلسطين", name_fr: "Palestine" },
    { code: "JO", name_en: "Jordan", name_ar: "الأردن", name_fr: "Jordanie" },
    { code: "EG", name_en: "Egypt", name_ar: "مصر", name_fr: "Égypte" },
    { code: "SA", name_en: "Saudi Arabia", name_ar: "السعودية", name_fr: "Arabie Saoudite" },
    { code: "AE", name_en: "UAE", name_ar: "الإمارات", name_fr: "Émirats Arabes Unis" },
    { code: "QA", name_en: "Qatar", name_ar: "قطر", name_fr: "Qatar" },
    { code: "KW", name_en: "Kuwait", name_ar: "الكويت", name_fr: "Koweït" },
    { code: "BH", name_en: "Bahrain", name_ar: "البحرين", name_fr: "Bahreïn" },
    { code: "OM", name_en: "Oman", name_ar: "عمان", name_fr: "Oman" },
    { code: "YE", name_en: "Yemen", name_ar: "اليمن", name_fr: "Yémen" },
    { code: "IQ", name_en: "Iraq", name_ar: "العراق", name_fr: "Irak" },
    { code: "SY", name_en: "Syria", name_ar: "سوريا", name_fr: "Syrie" },
    { code: "LB", name_en: "Lebanon", name_ar: "لبنان", name_fr: "Liban" },
    { code: "MA", name_en: "Morocco", name_ar: "المغرب", name_fr: "Maroc" },
    { code: "DZ", name_en: "Algeria", name_ar: "الجزائر", name_fr: "Algérie" },
    { code: "TN", name_en: "Tunisia", name_ar: "تونس", name_fr: "Tunisie" },
    { code: "LY", name_en: "Libya", name_ar: "ليبيا", name_fr: "Libye" },
    { code: "SD", name_en: "Sudan", name_ar: "السودان", name_fr: "Soudan" },
    { code: "SO", name_en: "Somalia", name_ar: "الصومال", name_fr: "Somalie" },
    { code: "DJ", name_en: "Djibouti", name_ar: "جيبوتي", name_fr: "Djibouti" },
    { code: "KM", name_en: "Comoros", name_ar: "جزر القمر", name_fr: "Comores" },
    { code: "MR", name_en: "Mauritania", name_ar: "موريتانيا", name_fr: "Mauritanie" },

    // MAJOR WORLD COUNTRIES
    { code: "US", name_en: "United States", name_ar: "الولايات المتحدة", name_fr: "États-Unis" },
    { code: "CA", name_en: "Canada", name_ar: "كندا", name_fr: "Canada" },
    { code: "GB", name_en: "United Kingdom", name_ar: "المملكة المتحدة", name_fr: "Royaume-Uni" },
    { code: "FR", name_en: "France", name_ar: "فرنسا", name_fr: "France" },
    { code: "DE", name_en: "Germany", name_ar: "ألمانيا", name_fr: "Allemagne" },
    { code: "IT", name_en: "Italy", name_ar: "إيطاليا", name_fr: "Italie" },
    { code: "ES", name_en: "Spain", name_ar: "إسبانيا", name_fr: "Espagne" },
    { code: "TR", name_en: "Turkey", name_ar: "تركيا", name_fr: "Turquie" },
    { code: "IR", name_en: "Iran", name_ar: "إيران", name_fr: "Iran" },
    { code: "PK", name_en: "Pakistan", name_ar: "باكستان", name_fr: "Pakistan" },
    { code: "IN", name_en: "India", name_ar: "الهند", name_fr: "Inde" },
    { code: "CN", name_en: "China", name_ar: "الصين", name_fr: "Chine" },
    { code: "JP", name_en: "Japan", name_ar: "اليابان", name_fr: "Japon" },
    { code: "KR", name_en: "South Korea", name_ar: "كوريا الجنوبية", name_fr: "Corée du Sud" },
    { code: "RU", name_en: "Russia", name_ar: "روسيا", name_fr: "Russie" },
    { code: "BR", name_en: "Brazil", name_ar: "البرازيل", name_fr: "Brésil" },
    { code: "AR", name_en: "Argentina", name_ar: "الأرجنتين", name_fr: "Argentine" },
    { code: "MX", name_en: "Mexico", name_ar: "المكسيك", name_fr: "Mexique" },
    { code: "AU", name_en: "Australia", name_ar: "أستراليا", name_fr: "Australie" },
    { code: "ZA", name_en: "South Africa", name_ar: "جنوب أفريقيا", name_fr: "Afrique du Sud" },
    { code: "NG", name_en: "Nigeria", name_ar: "نيجيريا", name_fr: "Nigéria" },
    { code: "ET", name_en: "Ethiopia", name_ar: "إثيوبيا", name_fr: "Éthiopie" },
    { code: "ID", name_en: "Indonesia", name_ar: "إندونيسيا", name_fr: "Indonésie" },
    { code: "MY", name_en: "Malaysia", name_ar: "ماليزيا", name_fr: "Malaisie" },
];
