export interface City {
    id: string;
    name: string;
    shortDescription: string;
    fullDescription: string;
    image: string;
}

export const cities: City[] = [
    {
        id: "jerusalem",
        name: "القدس",
        shortDescription: "عاصمة فلسطين الأبدية وقلبها الروحي",
        fullDescription: "تعد مدينة القدس واحدة من أقدم المدن في العالم، وهي تحمل قيمة دينية وتاريخية لا مثيل لها. تضم المسجد الأقصى المبارك وكنيسة القيامة، وتتميز بأسوارها التاريخية وحاراتها العتيقة التي تحكي قصص الحضارات التي مرت عليها.",
        image: "https://images.unsplash.com/photo-1597330377319-3544579c231e?auto=format&fit=crop&q=80"
    },
    {
        id: "nablus",
        name: "نابلس",
        shortDescription: "دمشق الصغرى وعاصمة الصناعة والحلويات",
        fullDescription: "تُعرف نابلس بجمالها المعماري وصناعاتها التقليدية مثل الصابون النابلسي والكنافة النابلسية الشهيرة. تقع بين جبلين هما جرزيم وعيبال، وتضم بلدة قديمة نابضة بالحياة تعكس تاريخ فلسطين العريق.",
        image: "https://images.unsplash.com/photo-1627931350106-cf6d03f6f1c7?auto=format&fit=crop&q=80"
    },
    {
        id: "hebron",
        name: "الخليل",
        shortDescription: "مدينة خليل الرحمن ومركز الصناعات التقليدية",
        fullDescription: "تعد الخليل من أقدم المدن المأهولة في العالم، وتشتهر بالحرم الإبراهيمي الشريف. كما تميزت تاريخياً بصناعات الزجاج والخزف والجلود، وهي مركز تجاري واقتصادي هام في الضفة الغربية.",
        image: "https://images.unsplash.com/photo-1596489390292-945763261642?auto=format&fit=crop&q=80"
    },
    {
        id: "haifa",
        name: "حيفا",
        shortDescription: "عروس البحر وجبل الكرمل",
        fullDescription: "مدينة ساحلية تتميز بجمال طبيعي خلاب يجمع بين البحر والجبل. تشتهر بحدائق البهائيين وجبل الكرمل، وهي نموذج للتعايش والتنوع الثقافي في فلسطين التاريخية.",
        image: "https://images.unsplash.com/photo-1545591350-579c3f46f48a?auto=format&fit=crop&q=80"
    },
    {
        id: "gaza",
        name: "غزة",
        shortDescription: "هاشم غزة وبوابة فلسطين الجنوبية",
        fullDescription: "مدينة ساحلية عريقة تقع على ساحل البحر الأبيض المتوسط. تتميز بتاريخها الطويل كمركز تجاري يربط بين آسيا وأفريقيا، وهي رمز للصمود والتحدي.",
        image: "https://images.unsplash.com/photo-1626021147043-3928731f8680?auto=format&fit=crop&q=80"
    }
];
