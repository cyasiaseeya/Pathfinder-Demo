'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Star, FileText } from 'lucide-react';

const links = [
  { href: '/',         label: 'Home',     Icon: Home },
  { href: '/progress', label: 'Progress', Icon: Star },
  { href: '/report',   label: 'Report',   Icon: FileText },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#09071F]/80 backdrop-blur-md border-t border-white/10">
      <div className="max-w-lg mx-auto flex">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 relative"
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.5 : 1.8}
                className={`transition-colors ${active ? 'text-[#A79FFF]' : 'text-white/35'}`}
              />
              <span className={`text-[11px] font-bold transition-colors ${
                active ? 'text-[#A79FFF]' : 'text-white/35'
              }`}>
                {label}
              </span>
              {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#A79FFF] rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
