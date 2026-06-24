export default function WaveIndicator() {
  return (
    <div className="flex items-end gap-[3px] h-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="wave-bar w-1 bg-[#534AB7] rounded-full"
          style={{ height: '100%', animationDelay: `${(i - 1) * 0.12}s` }}
        />
      ))}
    </div>
  );
}
