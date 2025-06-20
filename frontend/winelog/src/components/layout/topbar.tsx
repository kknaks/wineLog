'use client';

import Link from 'next/link';

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-wine-dark text-wine-text shadow-lg z-10">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Menu Icon */}
        <button className="p-2 text-xl hover:bg-wine-hover rounded-full">
          <span>☰</span>
        </button>

        {/* Center: Title */}
        <h1 className="text-xl font-semibold tracking-wider">
          Wine Log
        </h1>

        {/* Right: Write Icon */}
        <Link href="/diary/new" className="p-2 text-xl hover:bg-wine-hover rounded-full">
          <span>✍️</span>
        </Link>
      </div>
    </header>
  );
}
