// src/components/home/QuickAction.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCpu, FiBox, FiShoppingBag, FiUsers } from "react-icons/fi";
import type { IconType } from "react-icons";
import { useTranslation } from "react-i18next";

// Action type for icons + text
type Action = {
  key: string;
  title: string;
  subtitle: string;
  Icon: IconType;
};

export default function QuickAction(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Localized actions
  const ACTIONS: Action[] = [
    {
      key: "ai",
      title: t("quickActions.ai.title"),
      subtitle: t("quickActions.ai.subtitle"),
      Icon: FiCpu,
    },
    {
      key: "museum",
      title: t("quickActions.museum.title"),
      subtitle: t("quickActions.museum.subtitle"),
      Icon: FiBox,
    },
    {
      key: "marketplace",
      title: "Marketplace",
      subtitle: "Buy from multiple stores",
      Icon: FiShoppingBag,
    },
    {
      key: "store",
      title: t("quickActions.store.title"),
      subtitle: t("quickActions.store.subtitle"),
      Icon: FiShoppingBag,
    },
  ];

  return (
    <section
      aria-label="Quick actions"
      className="w-full rounded-2xl p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => {
                if (a.key === "ai") navigate("/palestine-ai");
                if (a.key === "museum") navigate("/museum");
                if (a.key === "marketplace") navigate("/marketplace");
                if (a.key === "store") navigate("/shop");
              }}
              className="w-full text-left bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#CDA15A]/20"
              aria-label={a.title}
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#F6F1E6] border border-[#E6DFC6] text-[#2f5c3f]">
                  <a.Icon className="w-6 h-6" />
                </span>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#21492f]">
                    {a.title}
                  </div>
                  <div className="mt-1 text-xs text-[#2f5c3f]/70">
                    {a.subtitle}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
