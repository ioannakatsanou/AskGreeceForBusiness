import { Link } from "react-router-dom";

// Polymorphic button: renders an internal <Link> when `to` is provided,
// otherwise a native <button>. Keeps all navigation internal (no new tabs).
export default function Button({
  to,
  variant = "primary",
  size,
  block,
  className = "",
  children,
  ...props
}) {
  const classes = [
    "btn",
    `btn-${variant}`,
    size === "lg" ? "btn-lg" : "",
    block ? "btn-block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
