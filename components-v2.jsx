// Shared components: Radar, Sparkline, Icons, Avatar, NameLabel

const { useState, useMemo, useEffect, useRef } = React;

// ---------- Icons (24x24, outline) ----------
const Icon = ({ name, size = 16, className = "" }) => {
  const paths = {
    today:   <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    roster:  <><path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/><path d="M3 21c1-4 4.5-6 9-6s8 2 9 6"/></>,
    student: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-3.5 3.6-5.5 7-5.5s6.3 2 7 5.5"/></>,
    coach:   <><path d="M3 6h18M5 6v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6"/><path d="m10 12 3 2-3 2v-4Z" fill="currentColor"/></>,
    library: <><path d="M4 5h6v14H4zM10 5h4v14h-4zM14 7l4-1 2 13-4 1z"/></>,
    parents: <><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.5-.7L3 21l1.7-5A8.4 8.4 0 1 1 21 11.5Z"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.1-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2.1 1.2L10 21h4l.5-2.6c.8-.3 1.5-.7 2.1-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"/></>,
    bell:    <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16Z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
    search:  <><circle cx="11" cy="11" r="6"/><path d="m20 20-4-4"/></>,
    chevron: <><path d="m9 6 6 6-6 6"/></>,
    chevronDown: <><path d="m6 9 6 6 6-6"/></>,
    spark:   <><path d="M3 17l4-6 4 3 5-8 5 6"/></>,
    arrowUp: <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrowDown: <><path d="M12 5v14M5 12l7 7 7-7"/></>,
    plus:    <><path d="M12 5v14M5 12h14"/></>,
    filter:  <><path d="M4 5h16M7 12h10M10 19h4"/></>,
    flag:    <><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></>,
    audio:   <><path d="M12 3v18M8 8v8M16 8v8M4 11v2M20 11v2"/></>,
    text:    <><path d="M5 5h14M12 5v14M9 19h6"/></>,
    drawing: <><path d="M3 17.5V21h3.5L18 9.5 14.5 6 3 17.5Z"/><path d="m13 7 4 4"/></>,
    code:    <><path d="m9 9-4 3 4 3M15 9l4 3-4 3M14 6l-4 12"/></>,
    send:    <><path d="m4 12 16-8-4 16-4-7-8-1Z"/></>,
    schedule:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    sparkle: <><path d="m12 3 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z"/></>,
    pin:     <><path d="M12 2v8M5 10h14l-2 5H7l-2-5ZM12 15v6"/></>,
    check:   <><path d="m5 12 4 4 10-10"/></>,
    eye:     <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    note:    <><path d="M5 4h11l4 4v12H5V4ZM16 4v4h4"/></>,
    arrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    close:   <><path d="m6 6 12 12M18 6 6 18"/></>,
  };
  return (
    <svg className={`nav-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
};

// ---------- Avatar ----------
const Avatar = ({ name, hue = 30, size = 32 }) => {
  const initial = name && name[0] || "?";
  return (
    <div
      className="avatar"
      style={{
        width: size, height: size, fontSize: size * 0.38,
        background: `oklch(0.82 0.07 ${hue})`,
        color: `oklch(0.30 0.05 ${hue})`,
      }}
    >{initial}</div>
  );
};

// ---------- Bilingual name ----------
const NameLabel = ({ ko, ro, size = "md", inline = false }) => {
  if (inline) {
    return (
      <span style={{ display: "inline-flex", gap: 6, alignItems: "baseline" }}>
        <span className="ko-name">{ko}</span>
        <span className="romanized" style={{ fontSize: "0.85em" }}>· {ro}</span>
      </span>
    );
  }
  const sz = size === "lg" ? { ko: 22, ro: 13 } : size === "sm" ? { ko: 13, ro: 11 } : { ko: 15, ro: 12 };
  return (
    <div style={{ lineHeight: 1.15 }}>
      <div className="ko-name" style={{ fontSize: sz.ko }}>{ko}</div>
      <div className="romanized" style={{ fontSize: sz.ro }}>{ro}</div>
    </div>
  );
};

// ---------- Sparkline ----------
const Sparkline = ({ data, width = 120, height = 28, stroke = "currentColor", fill = "none", showDot = true, accent }) => {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = Math.max(1, max - min);
  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const last = pts[pts.length - 1];
  const first = pts[0];
  const trend = data[data.length - 1] - data[0];
  const color = accent && trend > 0 ? "var(--accent)" : stroke;
  const areaPath = `${path} L${last[0]},${height - pad} L${first[0]},${height - pad} Z`;
  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }}>
      {fill !== "none" && <path d={areaPath} fill={fill} opacity="0.15" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      {showDot && <circle cx={last[0]} cy={last[1]} r="2.2" fill={color} />}
    </svg>
  );
};

// ---------- Arketype Radar ----------
// Variants: 'hex' (default polygon), 'circle' (radial rings), 'spokes' (dots on axes)
const ArketypeRadar = ({
  values,
  dims = window.ARK_DATA.ARKETYPE_DIMS,
  size = 240,
  variant = "hex",
  showLabels = false,
  highlight = null,
  showAffectiveSpine = false,
  glow = true,
  thin = false,
}) => {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.42;
  const N = dims.length;
  const angle = (i) => (-Math.PI / 2) + (i / N) * Math.PI * 2;
  const point = (i, v) => {
    const a = angle(i);
    const radius = (v / 100) * r;
    return [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius];
  };
  const axisPoint = (i, scale = 1) => {
    const a = angle(i);
    return [cx + Math.cos(a) * r * scale, cy + Math.sin(a) * r * scale];
  };

  // Polygon path
  const polyPath = values.map((v, i) => {
    const [x, y] = point(i, v);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";

  // Web rings
  const ringValues = [25, 50, 75, 100];
  const ringPaths = ringValues.map(rv => {
    if (variant === "circle") return null;
    const path = dims.map((_, i) => {
      const [x, y] = point(i, rv);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + " Z";
    return path;
  });

  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
      {glow && (
        <div style={{
          position: "absolute", inset: -size * 0.1, borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.78 0.13 50 / 0.18), transparent 65%)",
          pointerEvents: "none",
        }} />
      )}
      <svg width={size} height={size} style={{ position: "relative", display: "block" }}>
        <defs>
          <radialGradient id={`fill-${size}-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DCC9F4" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#A989DD" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6B4FA8" stopOpacity="0.18" />
          </radialGradient>
        </defs>

        {/* Rings */}
        {variant === "circle" && ringValues.map((rv, k) => (
          <circle key={k} cx={cx} cy={cy} r={(rv / 100) * r} fill="none" stroke="var(--line-strong)" strokeWidth={thin ? 0.3 : 0.5} strokeDasharray={k === ringValues.length - 1 ? "none" : "2 3"} opacity="0.6" />
        ))}
        {variant !== "circle" && ringPaths.map((p, k) => (
          <path key={k} d={p} fill="none" stroke="var(--line-strong)" strokeWidth={thin ? 0.3 : 0.5} opacity={k === ringPaths.length - 1 ? 0.8 : 0.4} strokeDasharray={k === ringPaths.length - 1 ? "none" : "2 3"} />
        ))}

        {/* Axes */}
        {dims.map((d, i) => {
          const [x, y] = axisPoint(i);
          const isSpine = showAffectiveSpine && d.spine;
          return (
            <line
              key={d.key}
              x1={cx} y1={cy} x2={x} y2={y}
              stroke={isSpine ? "var(--accent)" : "var(--line-strong)"}
              strokeWidth={isSpine ? 1.0 : (thin ? 0.3 : 0.5)}
              opacity={isSpine ? 0.55 : 0.4}
            />
          );
        })}

        {/* Group separator: cognitive vs affective halves */}
        {/* (visual seam at index 8 boundary) */}
        {(() => {
          const splitIdx = dims.findIndex(d => d.group === "affective");
          if (splitIdx <= 0) return null;
          const [x1, y1] = axisPoint(splitIdx, 1.05);
          const [x2, y2] = axisPoint(0, 1.05);
          return null; // handled by axes; keeping hook for future
        })()}

        {/* Main polygon */}
        <path d={polyPath} fill={`url(#fill-${size}-${variant})`} stroke="#8E6BCC" strokeWidth="1.2" strokeLinejoin="round" />

        {/* Dots on each axis at value */}
        {values.map((v, i) => {
          const [x, y] = point(i, v);
          const isHi = highlight === dims[i].key;
          const isSpine = showAffectiveSpine && dims[i].spine;
          return (
            <circle
              key={i}
              cx={x} cy={y}
              r={isHi || isSpine ? 3.2 : 1.8}
              fill={isHi || isSpine ? "var(--accent)" : "#6B4FA8"}
              stroke={(isHi || isSpine) ? "white" : "none"}
              strokeWidth={(isHi || isSpine) ? 1.2 : 0}
            />
          );
        })}

        {/* Labels */}
        {showLabels && dims.map((d, i) => {
          const [x, y] = axisPoint(i, 1.18);
          const a = angle(i);
          const anchor = Math.abs(Math.cos(a)) < 0.2 ? "middle" : (Math.cos(a) > 0 ? "start" : "end");
          const dy = Math.sin(a) > 0.5 ? "0.9em" : Math.sin(a) < -0.5 ? "0.1em" : "0.35em";
          return (
            <text
              key={d.key}
              x={x} y={y}
              fontSize="9.5"
              fill={d.spine && showAffectiveSpine ? "var(--accent-ink)" : "var(--ink-3)"}
              fontWeight={d.spine && showAffectiveSpine ? 600 : 500}
              fontFamily="Inter, sans-serif"
              textAnchor={anchor}
              dy={dy}
              style={{ letterSpacing: "0.02em" }}
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

Object.assign(window, { Icon, Avatar, NameLabel, Sparkline, ArketypeRadar });
