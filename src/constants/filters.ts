export type PriceRange = {
    id: string;
    label: string;
    min: number;
    max: number | null;
};

export const PRICE_RANGES: PriceRange[] = [
    { id: "less-100", label: "أقل من 100", min: 0, max: 99 },
    { id: "100-200", label: "بين 100 و 200", min: 100, max: 200 },
    { id: "200-300", label: "بين 200 و 300", min: 200, max: 300 },
    { id: "300-400", label: "بين 300 و 400", min: 300, max: 400 },
    { id: "more-500", label: "500 وما فوق", min: 500, max: null },
];
