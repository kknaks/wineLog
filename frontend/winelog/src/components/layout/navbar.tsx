'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'diary', label: '다이어리', icon: '📖', path: '/diary' },
  { id: 'dict', label: '도감', icon: '🍷', path: '/collection' },
  { id: 'share', label: '공유', icon: '📤', path: '/share' },
  { id: 'my', label: '내 정보', icon: '👤', path: '/my' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-wine-dark shadow-lg">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              href={item.path}
              key={item.id}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${isActive
                ? 'text-wine-text'
                : 'text-wine-light/70 hover:text-wine-text'
                }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-2 h-2 bg-wine-light rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
