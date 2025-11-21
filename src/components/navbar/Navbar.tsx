import React from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="w-full bg-[#eaf5ea] border-b-2 border-emerald-700/30 shadow-sm">
      <div className="w-full px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Left side: Hamburger + Brand */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu (mobile only) */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md hover:bg-emerald-100 focus:outline-none"
              aria-label="Open Sidebar"
            >
              <svg
                className="w-6 h-6 text-[#2f5c3f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <span className="text-2xl sm:text-3xl font-extrabold text-[#2f5c3f] tracking-tight">
              Palestine3D
            </span>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/60 border border-emerald-200">
                <svg
                  className="w-5 h-5 text-[#2f5c3f]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405
                    A2.032 2.032 0 0118 14.158V11
                    a6.002 6.002 0 00-4-5.659V4
                    a2 2 0 10-4 0v1.341
                    C7.67 7.165 6 9.388 6 12v2.159
                    c0 .538-.214 1.055-.595 1.436
                    L4 17h11z"
                  />
                  <path
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.5 20a2.5 2.5 0 005 0"
                  />
                </svg>
              </span>
            </button>

            {/* Globe Icon */}
            <button
              type="button"
              aria-label="Select language"
              className="p-2 rounded-full hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/60 border border-emerald-200 text-[#2f5c3f]">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 6.486 2 12s4.477 10 10 10 10-4.486 10-10S17.523 2 12 2zM9.5 12a10.5 10.5 0 01.69-3.5h3.62A10.5 10.5 0 0114.5 12a10.5 10.5 0 01-.69 3.5H10.19A10.5 10.5 0 019.5 12z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
