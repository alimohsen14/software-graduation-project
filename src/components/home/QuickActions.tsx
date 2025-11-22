import React from "react";
import { useNavigate } from "react-router-dom";

// ...existing code...
type Action = {
  key: string;
  title: string;
  subtitle: string;
  Icon: (props: { className?: string }) => React.ReactElement;
};

const ACTIONS: Action[] = [
  {
    key: "ai",
    title: "AI System",
    subtitle: "Ask anything",
    Icon: BotIcon,
  },
  {
    key: "museum",
    title: "3D Museum",
    subtitle: "Explore models",
    Icon: CubeIcon,
  },
  {
    key: "official",
    title: "Official Store",
    subtitle: "Find products",
    Icon: ShopIcon,
  },
  {
    key: "community",
    title: "Community Forum",
    subtitle: "Join discussions",
    Icon: UsersIcon,
  },
];

export default function QuickAction(): React.ReactElement {
  const navigate = useNavigate();
  return (
    <section
      aria-label="Quick actions"
      className="w-full  rounded-2xl p-4 sm:p-6 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => {
                if (a.key === "ai") {
                  navigate("/palestine-ai");
                }
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

/* -------------------------
   Simple inline SVG icons
   keep colors via currentColor
   ------------------------- */

function BotIcon({
  className = "",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="3" y="7" width="18" height="11" rx="2" strokeWidth="1.5" />
      <path
        d="M8 7V5a4 4 0 018 0v2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13h.01M15 13h.01"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CubeIcon({
  className = "",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21 16V8a2 2 0 00-1-1.732L13 3l-7 3.268A2 2 0 005 8v8a2 2 0 001 1.732L11 21l7-3.268A2 2 0 0021 16z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7.5l5 2.5 5-2.5"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12v6"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShopIcon({
  className = "",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3 7h18"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 7l1.8 10.5A2 2 0 008.8 19.5h6.4a2 2 0 001.99-1.99L19 7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 3l-1 4H9L8 3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon({
  className = "",
}: {
  className?: string;
}): React.ReactElement {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 20a6 6 0 0112 0M12 20a6 6 0 0112 0"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-6 0)"
      />
    </svg>
  );
}
// ...existing code...
