'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props { message: string; onClose: () => void; duration?: number; }

export default function Toast({ message, onClose, duration = 3500 }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#2D2B4E] text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl toast-slide-in max-w-xs">
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0">
        <X size={12} />
      </button>
    </div>
  );
}
