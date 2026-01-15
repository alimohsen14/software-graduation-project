import React, { useEffect, useRef, useState } from "react";

function Soap3DModelViewer() {
    const mvRef = useRef<any>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const [showHelp, setShowHelp] = useState(false);
    const [progress, setProgress] = useState(0); // 0..1
    const [loaded, setLoaded] = useState(false);
    const [showImage, setShowImage] = useState(false);

    const [doorState, setDoorState] = useState<"OPEN" | "CLOSED">("CLOSED");
    const [showDoorMenu, setShowDoorMenu] = useState(false);

    const [isDoorAnimating, setIsDoorAnimating] = useState(false);
    const [potFade, setPotFade] = useState<"strong" | "faded">("strong");

    const [boxPos, setBoxPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const [activeImagePoint, setActiveImagePoint] = useState<string | null>(null);

    const [hotspot1Fade, setHotspot1Fade] = useState(false);

    // Theme
    const [isDarkBox, setIsDarkBox] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);


    const DEFAULT_BOX_POSITIONS: Record<string, { x: number; y: number }> = {
        "1": { x: -200, y: -20 },   // قريب من الآلة – عدّلي لاحقًا
        "2.1": { x: -200, y: 0 },
        "pot": { x: -300, y: 10 },
    };


    const onBoxMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        dragStart.current = {
            x: e.clientX - boxPos.x,
            y: e.clientY - boxPos.y,
        };
    };

    const onBoxMouseMove = (e: MouseEvent) => {
        if (!dragging) return;
        setBoxPos({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
        });
    };

    const onBoxMouseUp = () => {
        setDragging(false);
    };

    const toggleDoor = (state: "OPEN" | "CLOSED") => {
        const mv = mvRef.current;
        if (!mv || isDoorAnimating) return;

        if (state === doorState) return; // 🔒 يمنع إعادة نفس الحركة

        mv.animationName = "Door_Open";
        mv.pause();

        setIsDoorAnimating(true);

        const duration = mv.duration;
        const end = state === "OPEN" ? duration : 0;
        const direction = state === "OPEN" ? 1 : -1;

        let current = mv.currentTime;
        const step = duration / 40;

        const animate = () => {
            // 🛑 شرط الإنهاء الواضح
            if (
                (direction === 1 && current >= end) ||
                (direction === -1 && current <= end)
            ) {
                mv.currentTime = end; // ✅ تثبيت دقيق
                mv.pause();
                setDoorState(state);
                setIsDoorAnimating(false);
                return;
            }

            current += step * direction;
            mv.currentTime = current;

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    };



    const focusOnPot = () => {
        const mv = mvRef.current;
        if (!mv) return;

        // 🎯 مكان الحِلّة (X Y Z)
        mv.cameraTarget = "-124.47m -49.57m 36.60m";


        // 🎥 زاوية الكاميرا
        mv.cameraOrbit = "-3.37rad 0.47rad 70.15m";

        // 🚀 انتقال مباشر
        mv.jumpCameraToGoal();
    };

    useEffect(() => {
        document.addEventListener("mousemove", onBoxMouseMove);
        document.addEventListener("mouseup", onBoxMouseUp);
        return () => {
            document.removeEventListener("mousemove", onBoxMouseMove);
            document.removeEventListener("mouseup", onBoxMouseUp);
        };
    });


    // منع سكرول الصفحة أثناء zoom داخل الموديول
    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const onWheel = (e: WheelEvent) => e.preventDefault();
        const onMouseDown = (e: MouseEvent) => {
            if (e.button === 1) e.preventDefault();
        };
        const onAuxClick = (e: MouseEvent) => {
            if (e.button === 1) e.preventDefault();
        };

        wrap.addEventListener("wheel", onWheel, { passive: false });
        wrap.addEventListener("mousedown", onMouseDown, { capture: true });
        wrap.addEventListener("auxclick", onAuxClick, { capture: true });

        return () => {
            wrap.removeEventListener("wheel", onWheel as any);
            wrap.removeEventListener("mousedown", onMouseDown as any, {
                capture: true,
            } as any);
            wrap.removeEventListener("auxclick", onAuxClick as any, {
                capture: true,
            } as any);
        };
    }, []);

    // تحميل الموديول + ضبط الكاميرا
    useEffect(() => {
        const el = mvRef.current;
        if (!el) return;

        const onProgress = (e: any) => {
            const p = e?.detail?.totalProgress ?? 0;
            setProgress(p);
            if (p >= 1) setLoaded(true);
        };





        const onLoad = () => {

            const mv = mvRef.current;
            if (!mv) return;

            mv.animationName = "Door_Open";
            mv.currentTime = 0; // الباب مسكّر بالبداية
            mv.pause();


            setLoaded(true);
        };



        el.addEventListener("progress", onProgress);
        el.addEventListener("load", onLoad);

        return () => {
            el.removeEventListener("progress", onProgress);
            el.removeEventListener("load", onLoad);
        };
    }, []
    );


    useEffect(() => {
        const mv = mvRef.current;
        if (!mv) return;

        const onCameraChange = () => {
            const orbit = mv.getCameraOrbit();

            // للحِلّة
            if (orbit.radius > 80) {
                setPotFade("faded");
            } else {
                setPotFade("strong");
            }

            // 🔥 للنقطة 1
            if (orbit.radius > 90) {
                setHotspot1Fade(true);
            } else {
                setHotspot1Fade(false);
            }
        };

        mv.addEventListener("camera-change", onCameraChange);
        return () => mv.removeEventListener("camera-change", onCameraChange);
    }, []);



    useEffect(() => {
        const mv = mvRef.current;
        if (!mv) {
            console.log("NO MV");
            return;
        }

        console.log("MV READY", mv);

        const interval = setInterval(() => {
            if (mv.model) {
                console.log("MODEL IS READY");
                clearInterval(interval);
            }
        }, 200);

        return () => clearInterval(interval);
    }, []);




    // إغلاق قائمة الثيم عند الضغط خارجها
    useEffect(() => {
        if (!showThemeMenu) return;

        const onDocClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest("[data-theme-menu]")) {
                setShowThemeMenu(false);
            }
        };

        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [showThemeMenu]);





    const handleHotspotClick = (id: string) => {
        const mv = mvRef.current;
        if (!mv) return;

        // 1️⃣ فعّل الهوتسبوت (يبطل باهت + يظهر النص)
        setBoxPos(DEFAULT_BOX_POSITIONS[id] || { x: 0, y: 0 });
        setActiveHotspot(id);


        // 2️⃣ حرّك الكاميرا على مكان الرقم
        mv.cameraTarget = "-115.4401m -25.6445m 42.5528m";

        // 3️⃣ زاوية مناسبة (عدّليها لاحقًا براحتك)
        mv.cameraOrbit = "-2.8rad 0.6rad 55m";

        // 4️⃣ انتقال ناعم
        mv.jumpCameraToGoal();
    };
    const handleHotspot1Click = () => {
        const mv = mvRef.current;
        if (!mv) return;

        // 🔁 رجّع البوكس لمكانه الافتراضي كل مرة
        setBoxPos(DEFAULT_BOX_POSITIONS["1"]);

        // فعّل البوكس
        setActiveHotspot("1");

        // خذ مكان الهوتسبوت نفسه
        const hotspot = mv.querySelector('[slot="hotspot-1"]') as any;

        if (hotspot) {
            const pos = hotspot.getAttribute("data-position");
            if (pos) {
                const [x, y, z] = pos.replaceAll("m", "").split(" ").map(Number);

                const fixedY = y - 15;
                // const fixedX = x + 2; // لو بدك يمين/شمال عدّلي هون

                mv.cameraTarget = `${x}m ${fixedY}m ${z}m`;

            }
        }

        mv.cameraOrbit = "-9.5rad 1.5rad 55m";
        mv.jumpCameraToGoal();
    };



    return (
        <div className="w-full max-w-6xl mx-auto">
            <div
                ref={wrapRef}
                className={
                    "relative rounded-2xl overflow-hidden shadow-lg h-[82vh] min-h-[560px] border " +
                    (isDarkBox
                        ? "bg-black/70 border-white/10"
                        : "bg-black/5 border-gray-200")
                }
            >
                {/* Loading */}
                {!loaded && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                        <p className="text-white/90 text-sm mb-3">Loading 3D model…</p>
                        <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sky-400 transition-all"
                                style={{ width: `${Math.round(progress * 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Help Popup */}
                {showHelp && (
                    <div className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm flex flex-col justify-center items-center">

                        {/* Close button */}
                        <button
                            onClick={() => setShowHelp(false)}
                            className="absolute top-6 right-6 text-white text-2xl opacity-70 hover:opacity-100 transition"
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        {/* Title */}
                        <div className="absolute top-6 text-white text-sm tracking-widest opacity-80">
                            NAVIGATION BASICS
                        </div>

                        {/* Controls */}
                        <div className="flex gap-24 text-white text-center">

                            <div>
                                <div className="text-4xl mb-4">🔄</div>
                                <h4 className="font-semibold mb-2">Orbit</h4>
                                <p className="text-xs opacity-70">
                                    Left click + drag<br />
                                    One finger drag (touch)
                                </p>
                            </div>

                            <div>
                                <div className="text-4xl mb-4">🔍</div>
                                <h4 className="font-semibold mb-2">Zoom</h4>
                                <p className="text-xs opacity-70">
                                    Scroll wheel<br />
                                    Pinch (touch)
                                </p>
                            </div>

                            <div>
                                <div className="text-4xl mb-4">✋</div>
                                <h4 className="font-semibold mb-2">Pan</h4>
                                <p className="text-xs opacity-70">
                                    Right click + drag<br />
                                    Two fingers (touch)
                                </p>
                            </div>

                        </div>



                    </div>
                )}



                <model-viewer
                    ref={mvRef}
                    src="/models/soap-factory.glb"
                    alt="Nablus Soap Factory 3D Model"
                    camera-controls
                    data-visibility-attribute="data-visible"
                    autoplay={false}
                    animation-loop={false}
                    shadow-intensity="1"
                    exposure="1"
                    environment-image="neutral"
                    interaction-prompt="none"
                    orbit-sensitivity="0.6"
                    touch-action="none"
                    min-camera-orbit="auto auto 0.12m"
                    max-camera-orbit="auto auto 200m"
                    min-field-of-view="5deg"
                    max-field-of-view="65deg"
                    style={{ width: "100%", height: "100%" }}
                >


                    {/* ✅ HOTSPOT على الحِلّة */}

                    <button
                        slot="hotspot-pot"
                        data-position="-115.4401m -25.6445m 42.5528m"
                        data-normal="0.1575m 0.9469m -0.2801m"
                        className={`hotspot-pot
  ${activeHotspot === "pot" ? "active" : ""}
  ${potFade === "faded" && activeHotspot !== "pot" ? "hotspot-faded" : ""}
`}

                        onClick={() => handleHotspotClick("pot")}
                    >
                        2
                    </button>

                    <button
                        slot="hotspot-1"
                        data-position="-17.0898m -16.4857m 37.7480m"
                        data-normal="0.9927m 0.0436m -0.1125m"
                        className={`
    hotspot-pot
    ${activeHotspot === "1" ? "active" : ""}
    ${hotspot1Fade && activeHotspot !== "1" ? "hotspot-faded" : ""}
  `}
                        onClick={() => handleHotspot1Click()}
                    >
                        1
                    </button>

                </model-viewer>


                {activeHotspot === "1" && (
                    <div
                        style={{
                            transform: `translate(${boxPos.x}px, ${boxPos.y}px)`,
                        }}
                        className="
    absolute z-40 bottom-28 left-1/2 -translate-x-1/2
    bg-black/85 backdrop-blur-md
    text-white rounded-2xl
    w-64 max-w-[90vw]
    shadow-2xl
    border border-white/10
    animate-fade-in
    select-none
    flex flex-col
  "
                    >

                        {/* ===== Header ===== */}
                        <div
                            dir="rtl"
                            onMouseDown={onBoxMouseDown}
                            className="
    flex items-center justify-between
    px-3 py-1.5
    border-b border-white/15
    text-sm font-semibold
    cursor-grab
  "
                        >

                            <span>الطابق الأرضي </span>

                            <button
                                onClick={() => setActiveHotspot(null)}
                                className="text-white/45 hover:text-white transition text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        {/* ===== Content ===== */}
                        <div
                            dir="rtl"
                            className="
        px-4 py-3
        text-[13px] leading-relaxed
        text-right
        opacity-90
        max-h-28
        overflow-y-auto
        hotspot-scroll
      "
                        >
                            <p className="mb-2">
                                هو مكان العمل الرئيسي في المصبنة، حيث تتم عملية{" "}
                                <span className="font-semibold">طبخ الصابون داخل الحِلّة</span>.
                            </p>

                            <p className="mb-2">
                                يتميّز بفراغ واسع وسقف مرتفع تحمله{" "}
                                <span className="font-semibold">أعمدة حجرية ضخمة</span>، مع مدخل مباشر
                                من الشارع لتسهيل إدخال المواد وإخراج الصابون.
                            </p>

                            <p className="mb-2">
                                كما يحتوي على مخازن للوقود وفتحات تؤدي إلى{" "}
                                <span className="font-semibold">آبار الزيت في الأسفل</span>، ودرج
                                يُنقل عبره الصابون إلى الطابق العلوي للتجفيف.
                            </p>
                        </div>

                        {/* ===== Scroll Indicator ===== */}
                        <div
                            className="
        pointer-events-none
        absolute bottom-1 left-0 w-full
        flex justify-center
      "
                        >
                            <span className="text-white/50 text-sm animate-bounce">⌄</span>
                        </div>
                    </div>
                )}


                {activeHotspot === "pot" && (
                    <div
                        style={{
                            transform: `translate(${boxPos.x}px, ${boxPos.y}px)`,
                        }}
                        className="absolute z-40 bottom-28 left-1/2 -translate-x-1/2
           bg-black/80 text-white rounded-xl px-4 py-3 w-64 shadow-lg
           flex flex-col
           animate-fade-in select-none"
                    >

                        {/* العنوان */}
                        <div
                            dir="rtl"
                            className="text-sm font-semibold mb-2 pb-1 text-right
             border-b border-white/20 cursor-grab"
                            onMouseDown={onBoxMouseDown}
                        >
                            حِلّة طبخ الصابون
                        </div>
                        {/* النص مع رول */}
                        <div className="relative">

                            {/* محتوى قابل للتمرير */}
                            <div className="hotspot-scroll text-[13px] leading-snug opacity-90 text-right pr-2
                max-h-32 overflow-y-auto mb-2">

                                <p className="mb-2">


                                    تُعدّ <span className="font-semibold">حِلّة طبخ الصابون</span> العنصر الأهم في المصبنة،
                                    إذ كانت تُستخدم لغلي زيت الزيتون مع المواد الطبيعية لبدء عملية تصنيع
                                    الصابون النابلسي.
                                </p>

                                <p className="mb-2">
                                    صُنعت هذه الحِلّة من النحاس السميك لتحمّل درجات الحرارة العالية،
                                    وكانت تُسخَّن من الأسفل بواسطة النار القادمة من القميم.
                                </p>

                                <p className="mb-1">
                                    وقد صُمّمت لتتّسع لكميات كبيرة من زيت الزيتون، تكفي لإنتاج دفعة
                                    كاملة من الصابون، مما جعل التحكم بعملية الطبخ فيها أمرًا دقيقًا
                                    ويتطلّب خبرة عالية.
                                </p>
                            </div>


                            {/* مؤشر التمرير */}
                            <div className="scroll-indicator">
                                ⌄
                            </div>

                        </div>


                        {/* 🖼️ الصورة 
<img
  src="/images/pot.jpg"
  alt="Pot"
  className="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer"
  onClick={() => setShowImage(true)}
  draggable={false}
/>


*/}


                        <img
                            src="/images/pot.jpg"
                            alt="Pot"
                            className="w-full h-32 object-cover rounded-lg cursor-pointer mt-auto"
                            onClick={() => setShowImage(true)}
                            draggable={false}
                        />



                        {/* زر الإغلاق */}
                        <button
                            onClick={() => setActiveHotspot(null)}
                            className="absolute top-2 right-2 text-xs opacity-60"
                        >
                            ✕
                        </button>
                    </div>
                )}
                {showImage && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm
                  flex items-center justify-center">

                        {/* زر إغلاق */}
                        <button
                            onClick={() => {
                                setShowImage(false);
                                setActiveImagePoint(null);
                            }}
                            className="absolute top-6 right-6 text-white text-2xl z-50"
                        >
                            ✕
                        </button>

                        {/* الكونتينر الصح */}
                        <div className="relative 
                bg-black/60 
                p-4 
                rounded-2xl 
                shadow-2xl 
                border border-white/10
                w-[75vw] 
                h-[70vh] 
                max-w-[1000px] 
                max-h-[650px]"   >


                            <img
                                src="/images/pot.jpg"
                                alt="Pot"
                                className="w-full h-full object-contain rounded-xl cursor-default"
                                draggable={false}
                            />


                            {/* 🔴 نقطة رقم 1 */}

                            <button
                                className="hotspot-pot absolute"
                                style={{
                                    left: "55.9%",
                                    top: "31.2%",
                                    transform: "translate(-50%, -50%)",
                                }}
                                onClick={() => {
                                    setBoxPos(DEFAULT_BOX_POSITIONS["2.1"]);
                                    setActiveImagePoint("2.1");
                                }}

                            >
                                2.1
                            </button>
                            {activeImagePoint === "2.1" && (
                                <div
                                    dir="rtl"
                                    style={{
                                        transform: `translate(${boxPos.x}px, ${boxPos.y}px)`,
                                    }}
                                    className="
      absolute z-[60]
      bottom-24 left-1/2 -translate-x-1/2
      bg-black/90 text-white
      rounded-xl
      w-60
      shadow-2xl
      animate-fade-in
      select-none
      flex flex-col
      overflow-hidden
    "
                                >
                                    {/* ===== الهيدر (قابل للسحب) ===== */}
                                    <div
                                        onMouseDown={onBoxMouseDown}
                                        className="
        flex items-center justify-between
        text-sm font-semibold
        px-4 py-2
        border-b border-white/20
        cursor-grab
      "
                                    >
                                        <span>2.1 — المخاضة والدكشّاب</span>

                                        <button
                                            onClick={() => setActiveImagePoint(null)}
                                            className="text-white/60 hover:text-white text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* ===== النص مع تمرير ===== */}
                                    <div className="relative px-4 pt-3 flex-1">
                                        <div
                                            className="
          hotspot-scroll
          text-xs leading-snug opacity-90 text-right
          max-h-25 overflow-y-auto
          pr-2
        "
                                        >
                                            <p className="mb-2">
                                                تُستخدم <span className="font-semibold">المخاضة</span> في بداية طبخ
                                                الصابون لتحريك خليط الزيت والمحاليل داخل الحِلّة،
                                                حيث تساعد على بدء عملية التصبّن بشكل متوازن.
                                            </p>

                                            <p>
                                                أما <span className="font-semibold">الدكشّاب</span> فهو أداة خشبية أطول
                                                وأعرض، تشبه الملعقة الكبيرة، ويُستخدم خلال مراحل
                                                الطبخ اللاحقة لتحريك الخليط باستمرار، وضمان تجانسه
                                                . ومنع التصاقه أو احتراقه
                                            </p>
                                        </div>

                                        {/* 🔻 مؤشر التمرير */}
                                        <div
                                            className="
          pointer-events-none
          absolute bottom-0 left-0 w-full h-6
          bg-gradient-to-t from-black/90 to-transparent
          flex justify-center items-end
        "
                                        >
                                            <span className="text-white/60 text-sm animate-bounce">⌄</span>
                                        </div>
                                    </div>

                                    {/* ===== الصورة (ثابتة، بدون قص) ===== */}
                                    <div className="px-4 pb-4 pt-2 border-t border-white/10">
                                        <img
                                            src="/images/tools.jpg"
                                            alt="أدوات تحريك الصابون"
                                            className="
          w-full
          h-28
          object-contain
          rounded-lg
          bg-black/30
        "
                                            draggable={false}
                                        />
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>
                )}




                {/* Bottom buttons */}
                <div className="absolute z-30 bottom-3 left-1/2 -translate-x-1/2 flex gap-2 items-center">

                    {/* Help */}
                    <button
                        onClick={() => setShowHelp(true)}
                        className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow hover:bg-white transition"
                    >
                        Help ?
                    </button>

                    {/* Focus */}
                    <button
                        onClick={focusOnPot}
                        className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs shadow hover:bg-emerald-700 transition"
                    >
                        Focus on Pot
                    </button>

                    {/* Door */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDoorMenu(v => !v)}
                            className="bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-medium text-gray-800 shadow flex items-center gap-2"
                        >
                            Door
                            <span className="text-gray-500">•</span>
                            <span className="font-semibold">
                                {doorState === "OPEN" ? "Open" : "Closed"}
                            </span>
                            <span className="text-[10px]">▼</span>
                        </button>


                        {showDoorMenu && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-black/10 overflow-hidden text-xs w-40">
                                <button
                                    onClick={() => {
                                        if (doorState !== "OPEN") toggleDoor("OPEN");
                                        setShowDoorMenu(false);
                                    }}
                                    className={`w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 ${doorState === "OPEN" ? "bg-emerald-50" : ""
                                        }`}
                                >
                                    <span>Open</span>
                                    {doorState === "OPEN" && <span className="text-emerald-600 font-bold">✓</span>}
                                </button>

                                <button
                                    onClick={() => {
                                        if (doorState !== "CLOSED") toggleDoor("CLOSED");
                                        setShowDoorMenu(false);
                                    }}
                                    className={`w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 ${doorState === "CLOSED" ? "bg-emerald-50" : ""
                                        }`}
                                >
                                    <span>Close</span>
                                    {doorState === "CLOSED" && <span className="text-emerald-600 font-bold">✓</span>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Theme */}
                    <div className="relative" data-theme-menu>
                        <button
                            onClick={() => setShowThemeMenu(v => !v)}
                            className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow flex items-center gap-2"
                        >
                            Theme:
                            <span className="font-semibold">{isDarkBox ? "Dark" : "Light"}</span>
                            <span className="text-[10px]">▼</span>
                        </button>

                        {showThemeMenu && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-44 rounded-xl bg-white shadow-lg border border-black/10 overflow-hidden text-xs">
                                <button
                                    onClick={() => {
                                        setIsDarkBox(false);
                                        setShowThemeMenu(false);
                                    }}
                                    className={`w-full px-3 py-2 flex justify-between hover:bg-gray-50 ${!isDarkBox ? "bg-emerald-50" : ""
                                        }`}
                                >
                                    <span>Light</span>
                                    {!isDarkBox && <span className="text-emerald-600 font-bold">✓</span>}
                                </button>

                                <button
                                    onClick={() => {
                                        setIsDarkBox(true);
                                        setShowThemeMenu(false);
                                    }}
                                    className={`w-full px-3 py-2 flex justify-between hover:bg-gray-50 ${isDarkBox ? "bg-emerald-50" : ""
                                        }`}
                                >
                                    <span>Dark</span>
                                    {isDarkBox && <span className="text-emerald-600 font-bold">✓</span>}
                                </button>
                            </div>
                        )}
                    </div>

                </div>


            </div>
        </div>
    );
}

export default Soap3DModelViewer;