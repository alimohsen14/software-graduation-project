import React, { useState } from "react";

interface Props {
  isOpen: boolean;
  toggle: () => void;
}

export default function AISidebar({
  isOpen,
  toggle,
}: Props): React.ReactElement {
  const [active, setActive] = useState<string | null>(null);

  const items = [
    "تاريخ صبّانات نابلس",
    "العادات والتقاليد الفلسطينية",
    "مدن فلسطينية قديمة",
    "القضية الفلسطينية",
  ];

  return (
    <>
      {/* Optional: Backdrop for mobile only when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggle}
        />
      )}

      <aside
        aria-label="AI Sidebar"
        className={`
        fixed right-0 top-16 h-[calc(100vh-64px)] w-[240px] sm:w-[260px] md:w-[190px]
        bg-[#3e6347] shadow-lg
        transform transition-transform duration-300 ease-in-out border-l border-emerald-800/20
        ${
          isOpen
            ? "translate-x-0 z-40 pointer-events-auto"
            : "translate-x-full z-10 pointer-events-none"
        }
        md:translate-x-0 md:pointer-events-auto md:z-30 md:border-none
      `}
      >
        <div className="h-full overflow-hidden px-4 py-6 flex flex-col text-white">
          {/* Header: title + mobile close button */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">Palestine AI</span>

            {/* Close shown on mobile */}
            <button
              onClick={toggle}
              aria-label="Close AI sidebar"
              className="md:hidden text-white hover:bg-white/10 w-7 h-7 rounded-full flex items-center justify-center transition"
            >
              ✕
            </button>
          </div>

          {/* New Chat */}
          <button
            type="button"
            className="w-full mb-4 px-3 py-2 rounded-full text-sm font-medium text-white transition hover:bg-white/10"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            + New Chat
          </button>

          <div className="border-t border-white/10 my-3" />

          {/* Navigation list */}
          {/* التعديل هون: ضفت overflow-x-hidden عشان يمنع السكرول اللي بالعرض */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden">
            <ul className="flex flex-col gap-2">
              {items.map((label) => {
                const isActive = active === label;
                return (
                  <li key={label}>
                    <button
                      onClick={() => setActive(label)}
                      className="w-full text-right px-3 py-2 rounded-lg transition"
                      style={
                        isActive
                          ? {
                              backgroundColor: "rgba(127,179,123,0.14)",
                              color: "#fff",
                            }
                          : { color: "#fff" }
                      }
                    >
                      <span className="text-sm truncate block">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto text-xs text-white/80 pt-4 text-center">
            Palestine3D AI
          </div>
        </div>
      </aside>
    </>
  );
}
