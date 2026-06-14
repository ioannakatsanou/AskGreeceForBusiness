// Circular score indicator (0–100). Colour shifts by band.
export default function ScoreRing({ value, size = 56 }) {
  const color =
    value >= 80 ? "var(--c-success)" : value >= 60 ? "var(--c-brand)" : value >= 45 ? "var(--c-warning)" : "var(--c-danger)";
  const style = {
    width: size,
    height: size,
    background: `conic-gradient(${color} ${value * 3.6}deg, var(--c-surface-2) 0deg)`,
  };
  const innerSize = size - 12;
  return (
    <div className="score-ring" style={style}>
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: "50%",
          background: "var(--c-surface)",
          display: "grid",
          placeItems: "center",
          color: "var(--c-text)",
          fontSize: size > 60 ? "1.1rem" : "0.9rem",
        }}
      >
        {value}
      </div>
    </div>
  );
}
