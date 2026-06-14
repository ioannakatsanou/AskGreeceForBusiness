import Button from "../ui/Button.jsx";

// Loading spinner state.
export function Loading({ label = "Loading…" }) {
  return (
    <div className="state">
      <div className="spinner" />
      <p className="muted">{label}</p>
    </div>
  );
}

// Error state with a retry action.
export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="state">
      <div className="state-icon">⚠️</div>
      <h3>We hit a snag</h3>
      <p className="muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

// Empty state with optional call-to-action.
export function EmptyState({ icon = "🔍", title = "Nothing here yet", message, action }) {
  return (
    <div className="state">
      <div className="state-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p className="muted">{message}</p>}
      {action}
    </div>
  );
}

// Skeleton placeholder block.
export function Skeleton({ height = 16, width = "100%", style }) {
  return <div className="skeleton" style={{ height, width, ...style }} />;
}

// A skeleton stand-in for a result/opportunity card.
export function CardSkeleton() {
  return (
    <div className="card stack">
      <Skeleton height={22} width="70%" />
      <Skeleton height={14} width="45%" />
      <div className="row-wrap">
        <Skeleton height={28} width={90} />
        <Skeleton height={28} width={110} />
        <Skeleton height={28} width={80} />
      </div>
      <Skeleton height={52} />
    </div>
  );
}
