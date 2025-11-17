import React, { useState } from "react";

export default function Sidebar() {
  const [active, setActive] = useState("Profile");

  const items = [
    { key: "Profile", label: "Profile", icon: ProfileIcon },
    { key: "AI", label: "AI System", icon: AiIcon },
    { key: "Official", label: "Official Store", icon: StoreIcon },
    { key: "Community", label: "Community Store", icon: CommunityIcon },
    { key: "Library", label: "Heritage Library", icon: LibraryIcon },
  ];

  return (
    <aside className="hidden md:block h-screen w-60 relative">
      {/* soft flag-inspired vertical gradient stripe on the left */}
      <div
        className="absolute left-0 top-4 bottom-4 w-2 rounded-r-2xl"
        style={{
          background:
            "linear-gradient(to bottom, rgba(47,92,63,0.9) 0%, rgba(255,255,255,0.85) 33%, rgba(0,0,0,0.6) 66%, rgba(217,56,42,0.9) 100%)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        }}
        aria-hidden
      />

      <div className="h-full ml-2 rounded-r-2xl bg-[#eaf5ea] shadow-sm border border-emerald-800/10 overflow-hidden">
        <div className="px-5 py-6">
          <div className="text-xl font-extrabold text-[#2f5c3f] mb-6">
            Palestine3D
          </div>

          <nav className="flex flex-col gap-2" aria-label="Main navigation">
            {items.map((it) => {
              const Icon = it.icon;
              const isActive = active === it.key;
              return (
                <button
                  key={it.key}
                  onClick={() => setActive(it.key)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#dff3e8] text-[#21492f] shadow-sm"
                      : "text-[#2f5c3f] hover:bg-[#f1fbf4]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="w-6 h-6 flex items-center justify-center text-[#2f5c3f]">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-sm font-medium">{it.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-5 pb-6">
          <div className="text-xs text-[#2f5c3f] opacity-80">© Palestine3D</div>
        </div>
      </div>
    </aside>
  );
}

/* ----------------------
   Simple inline SVG icons
   (use these placeholders or replace with your own)
   ---------------------- */

function ProfileIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20a8 8 0 0116 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AiIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M8 12h8M8 8h8M8 16h8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StoreIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 9.5h18v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 9.5l2-4h14l2 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommunityIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 11a4 4 0 100-8 4 4 0 000 8z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LibraryIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19.5V5.5h6v14M14 19.5V3.5h6v16"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
