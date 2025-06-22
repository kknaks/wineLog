'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-lg border-t border-gray-200">
      <div className="frame-17 py-4 mb-5 mt-3">
        <div className="flex justify-between items-center max-w-screen-sm mx-auto px-8">
          <Link href="/diary" className="flex flex-col items-center gap-1">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-all ${pathname === '/diary' ? 'stroke-[2]' : 'stroke-[1.5]'}`}
              stroke="currentColor"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <path d="M4 8h16" />
              <path d="M8 4v4" />
              <path d="M16 4v4" />
            </svg>
            <span className={`text-xs font-roboto ${pathname === '/diary' ? 'font-bold' : ''}`}>DIARY</span>
          </Link>

          <Link href="/discover" className="flex flex-col items-center gap-1">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-all ${pathname === '/discover' ? 'stroke-[2]' : 'stroke-[1.5]'}`}
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className={`text-xs font-roboto ${pathname === '/discover' ? 'font-bold' : ''}`}>DISCOVER</span>
          </Link>

          <Link href="/diary/new" className="flex flex-col items-center">
            <div className="w-16 h-10 rounded-[30px] bg-[#D25B5B] flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-light">+</span>
            </div>
          </Link>

          <Link href="/images" className="flex flex-col items-center gap-1">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-all ${pathname === '/images' ? 'stroke-[2]' : 'stroke-[1.5]'}`}
              stroke="currentColor"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className={`text-xs font-roboto ${pathname === '/images' ? 'font-bold' : ''}`}>IMGAGES</span>
          </Link>

          <Link href="/my" className="flex flex-col items-center gap-1">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-all ${pathname === '/my' ? 'stroke-[2]' : 'stroke-[1.5]'}`}
              stroke="currentColor"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21a8 8 0 10-16 0" />
            </svg>
            <span className={`text-xs font-roboto ${pathname === '/my' ? 'font-bold' : ''}`}>MY PAGE</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
