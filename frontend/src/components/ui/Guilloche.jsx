import { useMemo } from "react";

// Security-print linework (as on banknotes and cheques), drawn as hypotrochoid curves.
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

function hypotrochoid(R, r, d, scale, steps) {
  const turns = r / gcd(R, r);
  const total = Math.PI * 2 * turns;
  const count = Math.round(steps * turns);
  let path = "";
  for (let i = 0; i <= count; i += 1) {
    const t = (i / count) * total;
    const x = ((R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t)) * scale;
    const y = ((R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t)) * scale;
    path += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return path;
}

const ringSets = {
  hero: [[90, 33, 62, 2.2], [90, 33, 48, 2.2], [75, 28, 44, 2.6], [60, 23, 30, 2.7]],
  card: [[50, 19, 34, 1], [50, 19, 26, 1]],
  mark: [[30, 11, 20, 1]],
};

function Guilloche({ variant = "hero", className = "", animate = false }) {
  const paths = useMemo(() => ringSets[variant].map(([R, r, d, s]) => hypotrochoid(R, r, d, s, variant === "mark" ? 60 : 140)), [variant]);
  const size = variant === "hero" ? 520 : variant === "card" ? 120 : 64;

  return (
    <svg className={className} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} aria-hidden="true" focusable="false">
      {paths.map((d, index) => (
        <path key={index} d={d} pathLength="1" className={animate ? "guilloche-draw" : undefined} style={animate ? { animationDelay: `${index * 0.18}s` } : undefined} />
      ))}
    </svg>
  );
}

export default Guilloche;
