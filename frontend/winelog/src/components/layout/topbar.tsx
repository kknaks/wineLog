'use client';

import { usePathname } from 'next/navigation';

export default function Topbar() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/diary')) {
      return 'Diary';
    }

    switch (pathname) {
      case '/discover':
        return 'Discover';
      case '/images':
        return 'Images';
      case '/my':
        return 'My Page';
      default:
        return 'Wine Log';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 mt-10 mb-3">
      <div className="flex items-center justify-center h-14 px-4">
        {/* Center: Title */}
        <h1 className="font-coustard text-xl font-[400] tracking-wider">
          {getPageTitle()}
        </h1>
      </div>
    </header>
  );
}
