import React from "react";

export default function QuickActions() {
  const actions = [
    { label: "3D Museum", icon: MuseumIcon },
    { label: "AI System", icon: AiIcon },
    { label: "Official Store", icon: StoreIcon },
    { label: "Community Store", icon: CommunityIcon },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.label}
            className="
              w-full bg-[#eaf5ea] border border-emerald-800/10 rounded-xl p-4 
              shadow-sm flex flex-col items-center justify-center
              transition-all duration-300 
              hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lg hover:bg-[#dff3e8]
            "
          >
            <Icon className="w-8 h-8 text-[#2f5c3f] mb-2" />
            <span className="text-sm font-semibold text-[#2f5c3f]">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Icons ---------------- */

function MuseumIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-6 9 6" />
      <path d="M4 10h16v10H4z" />
    </svg>
  );
}

function AiIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 12h8M8 8h8M8 16h8" />
    </svg>
  );
}

function StoreIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5h18v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z" />
      <path d="M3 9.5l2-4h14l2 4" />
    </svg>
  );
}

function CommunityIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
    </svg>
  );
}
