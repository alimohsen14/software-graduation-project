import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function Soap3DModelViewer() {
    const { t, i18n } = useTranslation();
    const mvRef = useRef<any>(null);
    const wrapRef = useRef<HTMLDivElement | null>(null);

    const [showHelp, setShowHelp] = useState(false);
    const [progress, setProgress] = useState(0); // 0..1
    const [loaded, setLoaded] = useState(false);
    const [showImage, setShowImage] = useState(false);

    const [doorState, setDoorState] = useState<"OPEN" | "CLOSED">("CLOSED");
    const [showDoorMenu, setShowDoorMenu] = useState(false);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [modelSrc, setModelSrc] = useState<string>(
        window.innerWidth <= 768 ? "/models/soap-factory1.glb" : "/models/soap-factory.glb"
    );

    const [isDoorAnimating, setIsDoorAnimating] = useState(false);
    const [hotspot3Fade, setHotspot3Fade] = useState<"strong" | "faded">("strong");

    const [boxPos, setBoxPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });

    const [activeImagePoint, setActiveImagePoint] = useState<string | null>(null);

    const [hotspot1Fade, setHotspot1Fade] = useState(false);

    const HOTSPOT_ORDER = ["1", "2", "3", "4", "5"];
    const [currentStep, setCurrentStep] = useState(0);

    const [showSettings, setShowSettings] = useState(false);

    // Theme
    const [isDarkBox, setIsDarkBox] = useState(false);
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

    const [hotspot5Fade, setHotspot5Fade] = useState(false);
    const [hotspot4Fade, setHotspot4Fade] = useState(false);
    const [hotspot2Fade, setHotspot2Fade] = useState(false);

    const [settingsPage, setSettingsPage] = useState<"main" | "theme">("main");

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showMobileControls, setShowMobileControls] = useState(false);

    const DEFAULT_BOX_POSITIONS: Record<string, { x: number; y: number }> = {
        "1": { x: -200, y: -20 },   // قريب من الآلة – عدّلي لاحقًا
        "3.1": { x: -200, y: 0 },
        "5": { x: -90, y: -30 },
        "3": { x: -300, y: 10 },
        "4": { x: 60, y: -20 },
        "2": { x: 30, y: -30 },

    };

    const HOTSPOT_ZONES = [
        { id: "1", pos: [-17.08, -16.48, 37.74] },   // الطابق الأرضي
        { id: "3", pos: [-115.44, -25.64, 42.55] },  // الحِلّة
        { id: "5", pos: [-68.37, 20.39, 10.15] },    // الطابق العلوي
        { id: "4", pos: [-108.67, -62.56, 33.49] },  // المبزل
        { id: "2", pos: [-167.29, -42.74, 79.02] },  // القِمّيم
    ];

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

    const handleZoom = (direction: "in" | "out") => {
        const mv = mvRef.current;
        if (!mv) return;

        // Get current orbit
        const orbit = mv.getCameraOrbit();
        const r = orbit.radius;
        const step = r * 0.2; // Zoom by 20% of current radius

        let newRadius = direction === "in" ? r - step : r + step;

        // Clamp values
        newRadius = Math.max(0.2, Math.min(400, newRadius));

        mv.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${newRadius}m`;
    };

    const restartModel = () => {
        const mv = mvRef.current;
        if (!mv) return;

        // 🔁 سكّر كل الواجهات
        setActiveHotspot(null);
        setActiveImagePoint(null);
        setShowImage(false);

        // 🔁 رجّع الخطوات
        setCurrentStep(0);

        // 🔁 رجّع البوكس لمكانه
        setBoxPos({ x: 0, y: 0 });

        // 🔁 سكّر القوائم
        setShowSettings(false);
        setSettingsPage("main");

        // 🔁 رجّع الكاميرا الافتراضية
        mv.cameraTarget = "auto auto auto";
        mv.cameraOrbit = "auto auto auto";
        mv.jumpCameraToGoal();

        // 🔁 سكّر الباب
        mv.animationName = "Door_Open";
        mv.currentTime = 0;
        mv.pause();
        setDoorState("CLOSED");
    };


    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const mobileMode = width <= 768;
            setIsMobile(mobileMode);

            const newSrc = mobileMode ? "/models/soap-factory1.glb" : "/models/soap-factory.glb";
            if (newSrc !== modelSrc) {
                setModelSrc(newSrc);
                setLoaded(false); // Reset loaded state for new model
                setProgress(0);  // Reset progress bar
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check

        document.addEventListener("mousemove", onBoxMouseMove);
        document.addEventListener("mouseup", onBoxMouseUp);
        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("mousemove", onBoxMouseMove);
            document.removeEventListener("mouseup", onBoxMouseUp);
        };
    }, [modelSrc]);


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
            // Don't setLoaded(true) here, let onLoad handle it for a smoother transition
        };

        const onLoad = () => {
            const mv = mvRef.current;
            if (!mv) return;

            mv.animationName = "Door_Open";
            mv.currentTime = 0; // الباب مسكّر بالبداية
            mv.pause();

            setProgress(1);
            setLoaded(true);
        };

        el.addEventListener("progress", onProgress);
        el.addEventListener("load", onLoad);

        // If it's already loaded for some reason
        if (el.complete) {
            onLoad();
        }

        return () => {
            el.removeEventListener("progress", onProgress);
            el.removeEventListener("load", onLoad);
        };
    }, [modelSrc]); // Re-attach if src changes


    const getCameraPosition = (mv: any) => {
        // إذا مكتبتك بتدعمها مباشرة
        if (mv.getCameraPosition) return mv.getCameraPosition();

        // fallback: احسبها من orbit + target
        const t = mv.getCameraTarget?.();
        const o = mv.getCameraOrbit?.();

        if (!t || !o) return null;

        const theta = o.theta;   // rad
        const phi = o.phi;       // rad
        const r = o.radius;      // meters (number)

        const x = t.x + r * Math.sin(phi) * Math.sin(theta);
        const y = t.y + r * Math.cos(phi);
        const z = t.z + r * Math.sin(phi) * Math.cos(theta);

        return { x, y, z };
    };

    useEffect(() => {
        const mv = mvRef.current;
        if (!mv) return;

        const onCameraChange = () => {

            const mv = mvRef.current;
            if (!mv) return;

            const cam = getCameraPosition(mv);
            if (!cam) return;

            let closestId: string | null = null;
            let minCamDist = Infinity;

            for (const h of HOTSPOT_ZONES) {
                const dx = cam.x - h.pos[0];
                const dy = cam.y - h.pos[1];
                const dz = cam.z - h.pos[2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < minCamDist) {
                    minCamDist = dist;
                    closestId = h.id;
                }
            }

            // ✅ هون السحر: إذا ابتعدتِ بالكاميرا عن الهوتسبوت النشط، سكّريه
            if (activeHotspot) {
                const a = HOTSPOT_ZONES.find(z => z.id === activeHotspot);
                if (a) {
                    const dx = cam.x - a.pos[0];
                    const dy = cam.y - a.pos[1];
                    const dz = cam.z - a.pos[2];
                    const activeDist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (activeDist > 90) {   // جرّبي 70 / 90 / 110 حسب موديلك
                        setActiveHotspot(null);
                    }
                }
            }
            const FADE_DISTANCE = 85; // عدّليها لو بدك

            // 👇 الأقرب واضح — الباقي باهت
            const isNear = (id: string) => {
                const h = HOTSPOT_ZONES.find(z => z.id === id);
                if (!h) return false;

                const dx = cam.x - h.pos[0];
                const dy = cam.y - h.pos[1];
                const dz = cam.z - h.pos[2];
                const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

                return d < FADE_DISTANCE;
            };

            setHotspot1Fade(!isNear("1"));
            setHotspot2Fade(!isNear("2"));
            setHotspot4Fade(!isNear("4"));
            setHotspot5Fade(!isNear("5"));
            setHotspot3Fade(isNear("3") ? "strong" : "faded");

        };

        mv.addEventListener("camera-change", onCameraChange);
        return () => mv.removeEventListener("camera-change", onCameraChange);
    }, [activeHotspot]);



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

    const toggleFullscreen = () => {
        const el = wrapRef.current;
        if (!el) return;

        if (!document.fullscreenElement) {
            el.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    const handleHotspot3Click = () => {
        const mv = mvRef.current;
        if (!mv) return;

        setBoxPos(DEFAULT_BOX_POSITIONS["3"]);
        setActiveHotspot("3");

        const hotspot = mv.querySelector('[slot="hotspot-3"]') as any;

        if (hotspot) {
            const pos = hotspot.getAttribute("data-position");
            if (pos) {
                const [x, y, z] = pos.replaceAll("m", "").split(" ").map(Number);
                const fixedY = y - 10;
                mv.cameraTarget = `${x}m ${fixedY}m ${z}m`;
            }
        }

        mv.cameraOrbit = "-3.3rad 0.6rad 60m";
        mv.jumpCameraToGoal();
    };


    {/* 
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
*/}
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


    const handleHotspot5Click = () => {
        const mv = mvRef.current;
        if (!mv) return;

        // رجّع البوكس لمكانه الافتراضي
        setBoxPos(DEFAULT_BOX_POSITIONS["5"]);

        // فعّل البوكس
        setActiveHotspot("5");

        // خذ مكان الهوتسبوت نفسه
        const hotspot = mv.querySelector('[slot="hotspot-5"]') as any;

        if (hotspot) {
            const pos = hotspot.getAttribute("data-position");
            if (pos) {
                const [x, y, z] = pos.replaceAll("m", "").split(" ").map(Number);

                const fixedY = y - 12; // عدّلي حسب اللزوم
                mv.cameraTarget = `${x}m ${fixedY}m ${z}m`;
            }
        }

        mv.cameraOrbit = "-5rad 1.3rad 90m";
        mv.jumpCameraToGoal();
    };


    const handleHotspot4Click = () => {
        const mv = mvRef.current;
        if (!mv) return;

        setBoxPos(DEFAULT_BOX_POSITIONS["4"]);
        setActiveHotspot("4");

        const hotspot = mv.querySelector('[slot="hotspot-4"]') as any;

        if (hotspot) {
            const pos = hotspot.getAttribute("data-position");
            if (pos) {
                const [x, y, z] = pos.replaceAll("m", "").split(" ").map(Number);

                const fixedY = y + 2; // عدّلي حسب المكان
                mv.cameraTarget = `${x}m ${fixedY}m ${z}m`;
            }
        }

        mv.cameraOrbit = "-3.6rad .6rad 70m"; // قربنا الكاميرا
        mv.jumpCameraToGoal();
    };


    const handleHotspot2Click = () => {


        const mv = mvRef.current;
        if (!mv) return;

        // رجّع البوكس لمكانه الافتراضي
        setBoxPos(DEFAULT_BOX_POSITIONS["2"]);
        setActiveHotspot("2");

        // خذ مكان الهوتسبوت نفسه
        const hotspot = mv.querySelector('[slot="hotspot-2"]') as any;

        if (hotspot) {
            const pos = hotspot.getAttribute("data-position");
            if (pos) {
                const [x, y, z] = pos.replaceAll("m", "").split(" ").map(Number);

                const fixedY = y + 6; // نطلع شوي لفوق
                mv.cameraTarget = `${x}m ${fixedY}m ${z}m`;
            }
        }

        // قرّب الكاميرا
        mv.cameraOrbit = "-2.7rad .5rad 30m";
        mv.jumpCameraToGoal();
    };


    const goToHotspotById = (id: string) => {
        switch (id) {
            case "1":
                handleHotspot1Click();
                break;
            case "2":
                handleHotspot2Click();
                break;
            case "3":
                handleHotspot3Click();
                break;
            case "4":
                handleHotspot4Click();
                break;
            case "5":
                handleHotspot5Click();
                break;
        }
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
                        <p className="text-white/90 text-sm mb-1">{t("module3d.loading")}</p>
                        <p className="text-white/60 text-[11px] font-mono mb-3">{Math.round(progress * 100)}%</p>
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
                            {t("module3d.navBasics")}
                        </div>

                        {/* Controls */}
                        <div className="flex gap-24 text-white text-center">

                            <div>
                                <div className="text-4xl mb-4">🔄</div>
                                <h4 className="font-semibold mb-2">{t("module3d.orbit")}</h4>
                                <p className="text-xs opacity-70 whitespace-pre-line">
                                    {t("module3d.orbitDesc")}
                                </p>
                            </div>

                            <div>
                                <div className="text-4xl mb-4">🔍</div>
                                <h4 className="font-semibold mb-2">{t("module3d.zoom")}</h4>
                                <p className="text-xs opacity-70 whitespace-pre-line">
                                    {t("module3d.zoomDesc")}
                                </p>
                            </div>

                            <div>
                                <div className="text-4xl mb-4">✋</div>
                                <h4 className="font-semibold mb-2">{t("module3d.pan")}</h4>
                                <p className="text-xs opacity-70 whitespace-pre-line">
                                    {t("module3d.panDesc")}
                                </p>
                            </div>

                        </div>



                    </div>
                )}



                <model-viewer
                    ref={mvRef}
                    src={modelSrc}
                    alt={t("module3d.loading")}
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
                    max-camera-orbit="auto auto 400m"
                    min-field-of-view="5deg"
                    max-field-of-view="80deg"
                    style={{ width: "100%", height: "100%" }}
                >


                    {/* ✅ HOTSPOT على الحِلّة */}

                    <button
                        slot="hotspot-3"
                        data-position="-115.4401m -25.6445m 42.5528m"
                        data-normal="0.1575m 0.9469m -0.2801m"
                        className={`hotspot-pot
  ${activeHotspot === "3" ? "active" : ""}
  ${hotspot3Fade === "faded" && activeHotspot !== "3" ? "hotspot-faded" : ""}
`}
                        onClick={() => handleHotspot3Click()}
                    >
                        3
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


                    <button
                        slot="hotspot-5"
                        data-position="-68.37616m 20.39752m 10.15579m"
                        data-normal="-0.01864m 0.99982m -0.00162m"
                        className={`
    hotspot-pot
    ${activeHotspot === "5" ? "active" : ""}
    ${hotspot5Fade && activeHotspot !== "5" ? "hotspot-faded" : ""}
  `}
                        onClick={handleHotspot5Click}
                    >
                        5
                    </button>


                    <button
                        slot="hotspot-4"
                        data-position="-108.67245m -62.56668m 33.49942m"
                        data-normal="0.74721m -0.08638m -0.65895m"
                        className={`
  hotspot-pot
  ${activeHotspot === "4" ? "active" : ""}
  ${hotspot4Fade && activeHotspot !== "4" ? "hotspot-faded" : ""}
`}

                        onClick={handleHotspot4Click}
                    >
                        4
                    </button>


                    <button
                        slot="hotspot-2"
                        data-position="-167.29368m -42.74940m 79.02331m"
                        data-normal="-0.08312m 0.00451m -0.99653m"
                        className={`
  hotspot-pot
  ${activeHotspot === "2" ? "active" : ""}
  ${hotspot2Fade && activeHotspot !== "2" ? "hotspot-faded" : ""}
`}

                        onClick={handleHotspot2Click}
                    >
                        2
                    </button>


                </model-viewer>


                {activeHotspot === "1" && (
                    <div
                        style={!isMobile ? {
                            transform: `translate(${boxPos.x}px, ${boxPos.y}px)`,
                        } : {}}
                        className={`
    z-40 ${isMobile ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-h-[40vh]" : "absolute bottom-28 left-1/2 -translate-x-1/2 w-64"}
    bg-black/85 backdrop-blur-md
    text-white rounded-2xl
    shadow-2xl
    border border-white/10
    animate-fade-in
    select-none
    flex flex-col
    overflow-hidden
  `}
                    >

                        {/* ===== Header ===== */}
                        <div
                            dir="rtl"
                            onMouseDown={!isMobile ? onBoxMouseDown : undefined}
                            className={`
    flex items-center justify-between
    px-3 py-1.5
    border-b border-white/15
    text-sm font-semibold
    ${!isMobile ? "cursor-grab" : ""}
  `}
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
                            dir="auto"
                            className="
        px-4 py-3
        text-[13px] leading-relaxed
        opacity-90
        overflow-y-auto
        hotspot-scroll
      "
                        >
                            <p className="mb-2 break-words">
                                {t("module3d.hotspots.groundFloor.desc")}
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


                {activeHotspot === "3" && (
                    <div
                        style={!isMobile ? {
                            transform: `translate(${boxPos.x}px, ${boxPos.y}px)`,
                        } : {}}
                        className={`
           z-40 ${isMobile ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-h-[40vh]" : "absolute bottom-28 left-1/2 -translate-x-1/2 w-64"}
           bg-black/80 text-white rounded-xl px-4 py-3 shadow-lg overflow-hidden
           flex flex-col
           animate-fade-in select-none`}
                    >

                        {/* العنوان */}
                        <div
                            dir="auto"
                            className={`text-sm font-semibold mb-2 pb-1 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}
             border-b border-white/20 ${!isMobile ? "cursor-grab" : ""}`}
                            onMouseDown={!isMobile ? onBoxMouseDown : undefined}
                        >
                            {t("module3d.hotspots.halla.title")}
                        </div>
                        {/* النص مع رول */}
                        <div className="relative flex-1 overflow-hidden flex flex-col">

                            {/* محتوى قابل للتمرير */}
                            <div className={`hotspot-scroll text-[13px] leading-snug opacity-90 ${i18n.language === 'ar' ? 'text-right pr-2' : 'text-left pl-2'}
                overflow-y-auto mb-2`}>

                                <p className="mb-2">
                                    {t("module3d.hotspots.halla.desc")}
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
                            className="w-full h-32 md:h-32 object-cover rounded-lg cursor-pointer mt-auto shrink-0"
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


                {activeHotspot === "5" && (
                    <div
                        style={!isMobile ? {
                            transform: `translate(${boxPos.x}px, ${boxPos.y}px)`,
                        } : {}}
                        className={`
      z-40 ${isMobile ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-h-[40vh]" : "absolute bottom-28 left-1/2 -translate-x-1/2 w-64"}
      bg-black/85 backdrop-blur-md
      text-white rounded-2xl
      shadow-2xl
      border border-white/10
      animate-fade-in
      select-none
      flex flex-col
      overflow-hidden
    `}
                    >
                        <div
                            dir="auto"
                            onMouseDown={!isMobile ? onBoxMouseDown : undefined}
                            className={`
        flex items-center justify-between
        px-3 py-1.5
        border-b border-white/15
        text-sm font-semibold
        ${!isMobile ? "cursor-grab" : ""}
      `}
                        >
                            <span>{t("module3d.hotspots.mafrash.title")}</span>
                            <button
                                onClick={() => setActiveHotspot(null)}
                                className="text-white/45 hover:text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            dir="auto"
                            className={`
        px-4 py-3
        text-[13px] leading-relaxed
        ${i18n.language === 'ar' ? 'text-right' : 'text-left'}
        opacity-90
        max-h-37
        overflow-y-auto
        hotspot-scroll
      `}
                        >
                            <p className="mb-2">
                                {t("module3d.hotspots.mafrash.desc")}
                            </p>

                            <img
                                src="/images/tnaneer.jpeg"
                                alt={t("module3d.hotspots.mafrash.title")}
                                className="w-full h-24 object-cover rounded-lg mt-2 opacity-90"
                            />

                        </div>
                    </div>
                )}


                {activeHotspot === "4" && (
                    <div
                        style={!isMobile ? { transform: `translate(${boxPos.x}px, ${boxPos.y}px)` } : {}}
                        className={`
      z-40 ${isMobile ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-h-[40vh]" : "absolute bottom-28 left-1/2 -translate-x-1/2 w-64"}
      bg-black/85 backdrop-blur-md
      text-white rounded-2xl
      shadow-2xl
      border border-white/10
      animate-fade-in
      select-none
      flex flex-col
      overflow-hidden
    `}
                    >
                        {/* Header */}
                        <div
                            dir="auto"
                            onMouseDown={!isMobile ? onBoxMouseDown : undefined}
                            className={`
        flex items-center justify-between
        px-3 py-1.5
        border-b border-white/15
        text-sm font-semibold
        ${!isMobile ? "cursor-grab" : ""}
      `}
                        >
                            <span>{t("module3d.hotspots.mazbal.title")}</span>
                            <button
                                onClick={() => setActiveHotspot(null)}
                                className="text-white/45 hover:text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            dir="auto"
                            className={`
        px-4 py-3
        text-[13px] leading-relaxed
        ${i18n.language === 'ar' ? 'text-right' : 'text-left'}
        opacity-90
        max-h-25
        overflow-y-auto
        hotspot-scroll
      `}
                        >
                            <p className="mb-2">
                                {t("module3d.hotspots.mazbal.desc")}
                            </p>
                        </div>
                    </div>
                )}


                {activeHotspot === "2" && (
                    <div
                        style={!isMobile ? { transform: `translate(${boxPos.x}px, ${boxPos.y}px)` } : {}}
                        className={`
      z-40 ${isMobile ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-h-[40vh]" : "absolute bottom-28 left-1/2 -translate-x-1/2 w-64"}
      bg-black/85 backdrop-blur-md
      text-white rounded-2xl
      shadow-2xl
      border border-white/10
      animate-fade-in
      select-none
      flex flex-col
      overflow-hidden
    `}
                    >
                        {/* Header */}
                        <div
                            dir="auto"
                            onMouseDown={!isMobile ? onBoxMouseDown : undefined}
                            className={`
        flex items-center justify-between
        px-3 py-1.5
        border-b border-white/15
        text-sm font-semibold
        ${!isMobile ? "cursor-grab" : ""}
      `}
                        >
                            <span>{t("module3d.hotspots.qammim.title")}</span>
                            <button
                                onClick={() => setActiveHotspot(null)}
                                className="text-white/45 hover:text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div
                            dir="auto"
                            className={`
        px-4 py-3
        text-[13px] leading-relaxed
        ${i18n.language === 'ar' ? 'text-right' : 'text-left'}
        opacity-90
        max-h-28
        overflow-y-auto
        hotspot-scroll
      `}
                        >
                            <p className="mb-2">
                                {t("module3d.hotspots.qammim.desc")}
                            </p>
                        </div>
                    </div>
                )}


                {
                    showImage && (
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
                                    alt={t("module3d.hotspots.halla.title")}
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
                                        setBoxPos(DEFAULT_BOX_POSITIONS["3.1"]);
                                        setActiveImagePoint("3.1");
                                    }}

                                >
                                    3.1
                                </button>
                                {activeImagePoint === "3.1" && (
                                    <div
                                        dir="rtl"
                                        style={!isMobile ? {
                                            transform: `translate(${boxPos.x}px, ${boxPos.y}px)`,
                                        } : {}}
                                        className={`
      z-[60]
      ${isMobile ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-h-[40vh]" : "absolute bottom-24 left-1/2 -translate-x-1/2 w-60"}
      bg-black/90 text-white
      rounded-xl
      shadow-2xl
      animate-fade-in
      select-none
      flex flex-col
      overflow-hidden
    `}
                                    >
                                        {/* ===== الهيدر (قابل للسحب) ===== */}
                                        <div
                                            dir="auto"
                                            onMouseDown={!isMobile ? onBoxMouseDown : undefined}
                                            className={`
        flex items-center justify-between
        text-sm font-semibold
        px-4 py-2
        border-b border-white/20
        ${!isMobile ? "cursor-grab" : ""}
      `}
                                        >
                                            <span>{t("module3d.hotspots.hallaImage.title")}</span>

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
                                                dir="auto"
                                                className={`
          hotspot-scroll
          text-xs leading-snug opacity-90 ${i18n.language === 'ar' ? 'text-right pr-2' : 'text-left pl-2'}
          max-h-25 overflow-y-auto
        `}
                                            >
                                                <p className="mb-2">
                                                    {t("module3d.hotspots.hallaImage.desc")}
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
                                                alt={t("module3d.hotspots.hallaImage.title")}
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
                    )
                }



                {/* ===== Bottom Control Bar ===== */}
                <div
                    className={
                        isMobile
                            ? `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] flex flex-col gap-3 px-4 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ease-out ${showMobileControls ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"}`
                            : "absolute z-30 bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl flex items-center justify-between px-4 py-3 rounded-2xl"
                    }
                >
                    {/* ===== Left Side / Top Row on Mobile ===== */}
                    <div className={`flex items-center gap-1 ${isMobile ? "justify-center overflow-x-auto no-scrollbar pb-1" : ""}`}>
                        {/* Zoom buttons (Mobile Only) */}
                        {isMobile && (
                            <>
                                <button onClick={() => handleZoom("out")} className="mv-gear-btn px-3">
                                    <span className="mv-icon">−</span>
                                </button>
                                <button onClick={() => handleZoom("in")} className="mv-gear-btn px-3">
                                    <span className="mv-icon text-lg">+</span>
                                </button>
                                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                            </>
                        )}

                        {/* Fullscreen */}
                        <button onClick={toggleFullscreen} className="mv-gear-btn">
                            <span className="mv-icon">{isFullscreen ? "⤡" : "⤢"}</span>
                        </button>

                        {/* Settings */}
                        <div className="relative">
                            <button onClick={() => setShowSettings(v => !v)} className="ui-btn text-xs px-2">
                                ⚙
                            </button>
                            {showSettings && (
                                <div className={`mv-settings-panel ${isMobile ? "bottom-12 left-0" : ""}`}>
                                    {settingsPage === "main" && (
                                        <>
                                            <div className="mv-settings-row" onClick={() => setSettingsPage("theme")}>
                                                <span>{t("module3d.settings.theme")}</span>
                                                <span className="mv-settings-value">
                                                    {isDarkBox ? t("module3d.settings.dark") : t("module3d.settings.light")} ›
                                                </span>
                                            </div>
                                            <div className="mv-settings-divider" />
                                            <div className="mv-settings-row" onClick={restartModel}>
                                                <span>{t("module3d.settings.restart")}</span>
                                                <span>🔄</span>
                                            </div>
                                        </>
                                    )}
                                    {settingsPage === "theme" && (
                                        <>
                                            <div className="mv-settings-row" onClick={() => setSettingsPage("main")}>
                                                ← {t("module3d.settings.back")}
                                            </div>
                                            <div className={`mv-settings-sub-row ${!isDarkBox ? "active" : ""}`} onClick={() => setIsDarkBox(false)}>
                                                {t("module3d.settings.light")}
                                            </div>
                                            <div className={`mv-settings-sub-row ${isDarkBox ? "active" : ""}`} onClick={() => setIsDarkBox(true)}>
                                                {t("module3d.settings.dark")}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Door */}
                        <div className="relative">
                            <button onClick={() => setShowDoorMenu(v => !v)} className="ui-btn flex items-center gap-1">
                                {isMobile ? t("module3d.door") : `${t("module3d.door")} :${doorState === "OPEN" ? t("module3d.doorOpen") : t("module3d.doorClosed")}`} ▼
                            </button>
                            {showDoorMenu && (
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 ui-menu">
                                    <button
                                        onClick={() => {
                                            if (doorState !== "OPEN") toggleDoor("OPEN");
                                            setShowDoorMenu(false);
                                        }}
                                        className="ui-menu-item"
                                    >
                                        {t("module3d.doorOpen")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (doorState !== "CLOSED") toggleDoor("CLOSED");
                                            setShowDoorMenu(false);
                                        }}
                                        className="ui-menu-item"
                                    >
                                        {t("module3d.doorClosed")}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Help */}
                        <button onClick={() => setShowHelp(true)} className="ui-btn">
                            {t("module3d.help")}
                        </button>
                    </div>

                    {/* ===== Right Side / Bottom Row on Mobile ===== */}
                    <div className={`annotation-nav ${isMobile ? "self-center scale-95" : ""}`}>
                        <button
                            onClick={() => {
                                const next = (currentStep - 1 + HOTSPOT_ORDER.length) % HOTSPOT_ORDER.length;
                                setCurrentStep(next);
                                goToHotspotById(HOTSPOT_ORDER[next]);
                            }}
                            className="annotation-arrow"
                        >
                            ‹
                        </button>
                        <div className="annotation-center">
                            <div className="annotation-title">{t("module3d.selectAnnotation")}</div>
                            <div className="annotation-count">
                                {currentStep + 1} / {HOTSPOT_ORDER.length}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                const next = (currentStep + 1) % HOTSPOT_ORDER.length;
                                setCurrentStep(next);
                                goToHotspotById(HOTSPOT_ORDER[next]);
                            }}
                            className="annotation-arrow"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* ===== Mobile Toggle Button ===== */}
                {
                    isMobile && (
                        <button
                            onClick={() => setShowMobileControls(prev => !prev)}
                            className="fixed right-6 bottom-6 z-[60] w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center text-white text-xl active:scale-90 transition-all duration-300"
                            aria-label="Toggle controls"
                        >
                            {showMobileControls ? "✕" : "⚙️"}
                        </button>
                    )
                }
            </div >
        </div >
    );
}

export default Soap3DModelViewer;