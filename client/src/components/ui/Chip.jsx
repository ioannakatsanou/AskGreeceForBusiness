// Clickable chip used for search examples and tag-style multi-selects.
export default function Chip({ children, onClick, active, type = "button" }) {
  return (
    <button
      type={type}
      className="chip"
      onClick={onClick}
      style={active ? { borderColor: "var(--c-brand)", color: "var(--c-brand)", background: "var(--c-brand-tint)" } : undefined}
    >
      {children}
    </button>
  );
}
