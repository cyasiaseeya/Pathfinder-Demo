'use client';

import { useMemo } from 'react';

export default function SpaceBackground() {
  const stars = useMemo(() => Array.from({ length: 90 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 2 + 2,
    baseOpacity: Math.random() * 0.4 + 0.3,
  })), []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none"
      style={{ background: 'radial-gradient(ellipse at 60% 20%, #2A1F6E 0%, #120E3A 40%, #09071F 100%)' }}>

      {/* Nebula blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(83,74,183,0.28) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-5%] right-[-5%] w-[45vw] h-[45vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(216,90,48,0.12) 0%, transparent 70%)' }} />
      <div className="absolute top-[40%] right-[5%] w-[30vw] h-[30vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(29,158,117,0.10) 0%, transparent 70%)' }} />

      {/* Stars */}
      {stars.map((s) => (
        <div key={s.id} className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            opacity: s.baseOpacity,
            animation: `star-pulse ${s.duration}s ${s.delay}s ease-in-out infinite alternate`,
          }} />
      ))}

      {/* Floating planets */}
      <Planet size={88}  color="#3B2F8F" glow="#534AB7" top="6%"   left="5%"   duration={18} />
      <Planet size={50}  color="#5C1F3A" glow="#D85A30" top="12%"  right="7%"  duration={22} />
      <Planet size={34}  color="#0D4A36" glow="#1D9E75" top="70%"  left="3%"   duration={26} ring />
      <Planet size={22}  color="#3B2F8F" glow="#534AB7" top="78%"  right="9%"  duration={20} />

      <style>{`
        @keyframes star-pulse   { from { transform: scale(0.6); } to { transform: scale(1.6); } }
        @keyframes float-planet { from { transform: translateY(0px) rotate(0deg); } to { transform: translateY(-18px) rotate(8deg); } }
      `}</style>
    </div>
  );
}

function Planet({ size, color, glow, top, left, right, duration, ring }:
  { size: number; color: string; glow: string; top?: string; left?: string; right?: string; duration: number; ring?: boolean }) {
  return (
    <div className="absolute"
      style={{ top, left, right, animation: `float-planet ${duration}s ease-in-out infinite alternate` }}>
      <div className="relative" style={{ width: size, height: size }}>
        <div className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}DD, ${color}66)`,
            boxShadow: `0 0 ${size * 0.6}px ${glow}55, inset -${size * 0.1}px -${size * 0.1}px ${size * 0.2}px rgba(0,0,0,0.4)`,
          }} />
        {ring && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/20"
              style={{ width: size * 1.7, height: size * 0.35, transform: 'rotateX(75deg)', boxShadow: `0 0 8px ${glow}44` }} />
          </div>
        )}
      </div>
    </div>
  );
}
