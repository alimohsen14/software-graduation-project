export type PriceRange = {
    id: string;
    label: string;
    min: number;
    max: number | null;
};

export const PRICE_RANGES: PriceRange[] = [
    { id: "less-100", label: "marketplace.priceRanges.less100", min: 0, max: 99 },
    { id: "100-200", label: "marketplace.priceRanges.between100_200", min: 100, max: 200 },
    { id: "200-300", label: "marketplace.priceRanges.between200_300", min: 200, max: 300 },
    { id: "300-400", label: "marketplace.priceRanges.between300_400", min: 300, max: 400 },
    { id: "more-500", label: "marketplace.priceRanges.more500", min: 500, max: null },
];
