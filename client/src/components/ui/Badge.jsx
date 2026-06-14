// Small status pill. tone: default | info | success | warning | danger
export default function Badge({ tone = "default", children, className = "" }) {
  const cls = tone === "default" ? "badge" : `badge badge-${tone}`;
  return <span className={`${cls} ${className}`.trim()}>{children}</span>;
}
