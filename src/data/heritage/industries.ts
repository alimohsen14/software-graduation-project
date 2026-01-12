export interface Industry {
    id: string;
    name: string;
    shortDescription: string;
    fullDescription: string;
    image: string;
}

export const industries: Industry[] = [
    {
        id: "soap",
        name: "صناعة الصابون النابلسي",
        shortDescription: "صناعة تقليدية عريقة تميزت بها مدينة نابلس",
        fullDescription: "يعد الصابون النابلسي من أجود أنواع الصابون الطبيعي في العالم، حيث يُصنع من زيت الزيتون الصافي والماء والصودا الكاوية. تعود جذور هذه الصناعة إلى قرون مضت، ولا تزال التصابن (المصانع التقليدية) في نابلس تحافظ على طريقة الإنتاج اليدوية الأصيلة.",
        image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80"
    },
    {
        id: "embroidery",
        name: "التطريز الفلسطيني",
        shortDescription: "فن وهوية ولغة تحكي تاريخ فلسطين",
        fullDescription: "يُعتبر التطريز الفلسطيني جزءاً لا يتجزأ من الهوية الثقافية للفلسطينيين. لكل منطقة أنماط وغرز خاصة بها تميز أثوابها. تم إدراج فن التطريز الفلسطيني مؤخراً في قائمة اليونسكو للتراث الثقافي غير المادي، مما يؤكد على قيمته العالمية.",
        image: "https://plus.unsplash.com/premium_photo-1663100650992-0b796495146c?auto=format&fit=crop&q=80"
    },
    {
        id: "glass",
        name: "صناعة الزجاج والخزف",
        shortDescription: "إبداع يدوي يتوارثه الأجيال في مدينة الخليل",
        fullDescription: "تشتهر مدينة الخليل منذ العصور القديمة بصناعة الزجاج والخزف يدوياً. يتميز الزجاج الخليلي بألوانه الزاهية وتصاميمه الفريدة، وتعتمد هذه الحرفة على مهارة عالية في نفخ الزجاج وتشكيله في أفران خاصة تحافظ على هذا التراث الحي.",
        image: "https://images.unsplash.com/photo-1541810574704-36171589c362?auto=format&fit=crop&q=80"
    },
    {
        id: "olive-oil",
        name: "عصر زيت الزيتون",
        shortDescription: "ذهب فلسطين الأخضر ورمز الصمود",
        fullDescription: "تعتبر شجرة الزيتون رمزاً للصمود الفلسطيني وارتباط الإنسان بأرضه. موسم قطاف الزيتون هو عرس وطني، وزيت الزيتون الفلسطيني معروف بجودته العالية وطعمه الفريد، ويستخدم في الغذاء والدواء والصناعات المختلفة.",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80"
    }
];
