import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import DiscoverMoreModal from "../components/home/DiscoverMoreModal";
import Palestine3DLogo from "../components/common/Palestine3DLogo";
import { useTranslation } from "react-i18next";

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, i18n } = useTranslation("home");
  const direction = i18n.dir();

  const mainCards = [
    {
      title: t("cards.marketplace_title"),
      subtitle: t("cards.marketplace_desc"),
      buttonText: t("cards.marketplace_btn"),
      image: "/assets/home/card-marketplace.jpeg",
      path: "/marketplace",
      accentColor: "amber",
    },
    {
      title: t("cards.soap_title"),
      subtitle: t("cards.soap_desc"),
      buttonText: t("cards.soap_btn"),
      image: "/assets/home/card-soap-story.jpeg",
      path: "/soap-story",
      accentColor: "stone",
    },
    {
      title: t("cards.tour_title"),
      subtitle: t("cards.tour_desc"),
      buttonText: t("cards.tour_btn"),
      image: "/assets/home/card-3d-tour.jpeg",
      path: "/soap-3d",
      accentColor: "olive",
      is3D: true,
    },
  ];

  const handleCardClick = (card: typeof mainCards[0]) => {
    navigate(card.path);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen pb-6 md:pb-10 space-y-6 sm:space-y-8">
        <section className="flex-1 flex flex-col items-center justify-center text-center py-4 sm:py-8 md:py-20 relative min-h-[40vh] md:min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full"
          >
            <Palestine3DLogo size="lg" className="scale-[0.6] sm:scale-90 md:scale-100 transition-transform" />
            <div className="max-w-4xl mx-auto mb-6 mt-2 text-center px-4" dir={direction}>
              {/* السطر الأول: نرحّب بك + الاسم */}
              <p className="text-lg sm:text-2xl md:text-3xl text-white/85 font-medium mb-1">
                {user ? (
                  <>
                    {t("welcome")}{" "}
                    <span className="text-white font-semibold">
                      {user.name}
                    </span>
                  </>
                ) : (
                  t("welcome_guest")
                )}
              </p>

              {/* السطر الثاني: الوصف */}
              <p className="text-sm sm:text-lg md:text-xl text-white/60 leading-tight md:leading-relaxed">
                {t("hero_subtitle_1")}
              </p>
              <p className="text-sm sm:text-lg md:text-xl text-white/60 leading-tight md:leading-relaxed">
                {t("hero_subtitle_2")}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-6 sm:px-10 py-2.5 sm:py-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full font-bold text-sm sm:text-lg text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95 overflow-hidden min-h-[44px]"
            >
              <div className="relative z-10 flex items-center gap-3">
                <span className="tracking-wide">{t("discover_more")}</span>
                <FiArrowRight className={`group-hover:${direction === 'rtl' ? '-translate-x-1' : 'translate-x-1'} transition-transform ${direction === 'rtl' ? 'rotate-180' : ''}`} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </motion.div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 pb-4 md:pb-10">
          {mainCards.map((card, idx) => {
            const styles = ({
              amber: {
                bg: "bg-amber-950/20 backdrop-blur-md border-amber-500/10",
                btn: "bg-amber-600/20 hover:bg-amber-600/40 border-amber-500/20",
              },
              stone: {
                bg: "bg-stone-900/20 backdrop-blur-md border-stone-500/10",
                btn: "bg-stone-600/20 hover:bg-stone-600/40 border-stone-500/20",
              },
              olive: {
                bg: "bg-emerald-950/20 backdrop-blur-md border-emerald-900/10",
                btn: "bg-emerald-600/20 hover:bg-emerald-600/40 border-emerald-500/20",
              }
            } as Record<string, { bg: string; btn: string }>)[card.accentColor || "stone"];

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.15, duration: 0.8 }}
                onClick={() => handleCardClick(card)}
                className="group relative h-[380px] sm:h-[480px] rounded-3xl sm:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl border border-white/5 bg-black/20"
              >
                {/* Background Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Inner Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                {/* Glass Info Container */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-[1.75rem] border transition-all duration-500 ${styles.bg}`}>
                    <div className={direction === 'rtl' ? "text-right" : "text-left"} dir={direction}>
                      <h3 className="text-lg sm:text-xl font-medium text-white mb-0.5 sm:mb-1 tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-[11px] sm:text-[13px] text-white/40 font-normal mb-3 sm:mb-4 leading-relaxed">
                        {card.subtitle}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(card);
                        }}
                        className={`px-4 sm:px-5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-white border transition-all duration-300 active:scale-95 ${styles.btn}`}
                      >
                        {card.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        <DiscoverMoreModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}