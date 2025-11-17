import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#eaf5ea] border-b-2 border-emerald-700/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          {/* Left - Brand */}
          <div className="flex items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2f5c3f] tracking-tight">
              Palestine3D
            </span>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="p-2 rounded-full hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
            >
              {/* Bell icon */}
              <svg
                className="w-5 h-5 text-[#2f5c3f]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
                />
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.5 20a2.5 2.5 0 005 0"
                />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Language / Select region"
              className="p-2 rounded-full hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
            >
              {/* Globe icon (styled to match navbar color) */}
              <svg
                className="w-5 h-5 text-[#2f5c3f]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.486 2 12s4.477 10 10 10 10-4.486 10-10S17.523 2 12 2zm6.937 10h-2.196a15.92 15.92 0 00-.742-3.541A8.003 8.003 0 0118.937 12zM12 4c1.383 0 2.65.386 3.743 1.058A18.06 18.06 0 0012 9.5 18.06 18.06 0 008.257 5.06C9.35 4.386 10.617 4 12 4zM4.063 12h2.197a15.92 15.92 0 00.742 3.541A8.003 8.003 0 014.063 12zM12 20c-1.383 0-2.65-.386-3.743-1.058A18.06 18.06 0 0012 14.5a18.06 18.06 0 003.743 4.942C14.65 19.614 13.383 20 12 20zM7.29 6.646A16.02 16.02 0 005.5 9.5h2.5a13.5 13.5 0 01-.71-2.854zM16.71 17.354A16.02 16.02 0 0018.5 14.5h-2.5a13.5 13.5 0 00.71 2.854zM9.5 12a10.5 10.5 0 01.69-3.5h3.62A10.5 10.5 0 0114.5 12a10.5 10.5 0 01-.69 3.5H10.19A10.5 10.5 0 019.5 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
