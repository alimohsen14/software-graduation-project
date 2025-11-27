import React, { useState, useRef } from "react";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const [active, setActive] = useState("Profile");
  const touchStartX = useRef<number | null>(null);

  const items = [
    { key: "Profile", label: "Profile", icon: ProfileIcon },
    { key: "AI", label: "AI System", icon: AiIcon },
    { key: "Official", label: "Official Store", icon: StoreIcon },
    { key: "Community", label: "Community Store", icon: CommunityIcon },
    { key: "Library", label: "Heritage Library", icon: LibraryIcon },
  ];

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      closeSidebar();
    }

    touchStartX.current = null;
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/30 z-30"
        />
      )}

      <aside
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`
          fixed top-0 left-0 h-screen w-60 z-40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          bg-[#eaf5ea]
          shadow-lg
        `}
      >
        {/* Palestine flag line */}
        <div
          className="absolute left-0 top-0 bottom-4 w-2 rounded-r-2xl"
          style={{
            background:
              "linear-gradient(to bottom, black 0%, white 33%, #007A3D 66%, #CE1126 100%)",
          }}
        />

        <div className="h-full pl-5 pr-4 py-6 flex flex-col">
          <div className="text-xl font-extrabold text-[#2f5c3f] mb-6">
            Palestine3D
          </div>

          <nav className="flex flex-col gap-2">
            {items.map((it) => {
              const Icon = it.icon;
              const isActive = active === it.key;

              return (
                <button
                  key={it.key}
                  onClick={() => {
                    setActive(it.key);
                    closeSidebar();
                  }}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg ${
                    isActive
                      ? "bg-[#dff3e8] text-[#21492f]"
                      : "text-[#2f5c3f] hover:bg-[#f1fbf4]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{it.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto text-xs text-[#2f5c3f] opacity-80">
            © Palestine3D
          </div>
        </div>
      </aside>
    </>
  );
}

/* Icons */

function ProfileIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M4 20a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function AiIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M8 12h8M8 8h8M8 16h8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function StoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9.5h18v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M3 9.5l2-4h14l2 4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function CommunityIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 11a4 4 0 100-8 4 4 0 000 8z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function LibraryIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19.5V5.5h6v14M14 19.5V3.5h6v16"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
