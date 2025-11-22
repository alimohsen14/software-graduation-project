import React, { useState } from "react";

export default function AISidebar(): React.ReactElement {
  const [active, setActive] = useState<string | null>(null);

  const items = [
    "تاريخ صبّانات نابلس",
    "العادات والتقاليد الفلسطينية",
    "مدن فلسطينية قديمة",
    "القضية الفلسطينية",
  ];

  return (
    <aside
      aria-label="AI Sidebar"
      className="hidden md:block fixed top-0 right-0 h-screen z-40 w-[180px] flex flex-col"
    >
      {/* outer rounded container to match Sidebar shape */}
      <div
        className="h-full rounded-l-2xl overflow-hidden shadow-lg"
        style={{ background: "#3e6347" }}
      >
        <div className="px-4 py-6 flex flex-col h-full text-white">
          {/* Header: flag circle + title */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-white/15"
              style={{ background: "#fff" }}
              aria-hidden
            >
              {/* simple circular Palestinian flag (visual only) */}
              <svg
                className="w-8 h-8 rounded-full"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <clipPath id="c">
                    <circle cx="12" cy="12" r="12" />
                  </clipPath>
                </defs>
                <g clipPath="url(#c)">
                  <rect width="24" height="24" fill="#fff" />
                  <path d="M0 0v24h24V0H0z" fill="#fff" />
                  <path d="M0 0h24v8H0z" fill="#000" />
                  <path d="M0 8h24v8H0z" fill="#fff" />
                  <path d="M0 16h24v8H0z" fill="#d9392a" />
                  <path d="M0 0l9.7 12L0 24z" fill="#2f5c3f" />
                </g>
              </svg>
            </div>

            <div>
              <div className="text-sm font-semibold leading-none">
                Palestine AI
              </div>
            </div>
          </div>

          {/* New Chat button */}
          <div className="mb-4">
            <button
              type="button"
              className="w-full px-3 py-2 rounded-full text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            >
              + New Chat
            </button>
          </div>

          {/* divider */}
          <div className="border-t border-white/10 my-3" />

          {/* list */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="flex flex-col gap-2">
              {items.map((label) => {
                const isActive = active === label;
                return (
                  <li key={label}>
                    <button
                      onClick={() => setActive(label)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition focus:outline-none`}
                      // active bg & hover use subtle transparent green to match requirement
                      // tailwind arbitrary color for hover/bg
                      // active state uses inline style fallback for older setups
                      style={
                        isActive
                          ? {
                              backgroundColor: "rgba(127,179,123,0.14)",
                              color: "#fff",
                            }
                          : { color: "#fff" }
                      }
                    >
                      <span
                        className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md"
                        aria-hidden
                      >
                        {/* small chat icon (stroke uses currentColor which is white here) */}
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>

                      <span className="text-sm truncate">{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto text-xs text-white/80 pt-4">
            {/* small footer text to match Sidebar style */}
            Palestine3D AI
          </div>
        </div>
      </div>
    </aside>
  );
}
