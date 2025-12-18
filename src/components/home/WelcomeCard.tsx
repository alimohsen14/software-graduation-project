import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface WelcomeCardProps {
  name: string;
}

export default function WelcomeCard({ name }: WelcomeCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full bg-[#FBF7EF] rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-[#E6DFC6] mb-6 pl-6 sm:pl-8 mt-4 overflow-hidden z-0"
      aria-labelledby="welcome-heading"
    >
      {/* Left color flag stripe */}
      <div
        className="absolute left-4 top-4 bottom-4 w-2 rounded-r-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(47,92,63,0.95) 0%, rgba(250,248,243,0.95) 33%, rgba(0,0,0,0.6) 66%, rgba(217,56,42,0.95) 100%)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Text content */}
          <div className="flex-1">
            <h2
              id="welcome-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2f5c3f] leading-tight"
            >
              {t("home.welcome")}, {name} 👋
            </h2>

            <p className="mt-3 text-sm md:text-base text-[#2f5c3f]/85 max-w-xl leading-relaxed">
              {t("home.subtitle")}
            </p>

            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2f5c3f] text-[#FBF7EF] text-sm md:text-base font-semibold shadow-md hover:bg-[#274b34] focus:outline-none focus:ring-2 focus:ring-[#CDA15A]/30 transition"
                onClick={() => navigate("/soap3d")}
              >
                {t("home.exploreButton")}
              </button>
            </div>
          </div>

          {/* 3D preview image */}
          <div className="w-full md:w-40 lg:w-48 flex-shrink-0">
            <div className="w-full h-40 md:h-48 rounded-lg bg-[#F6F1E6] border border-[#E6DFC6] overflow-hidden flex items-center justify-center">
              <img
                src="/assets/3d-preview.jpg"
                alt="3D preview"
                className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
