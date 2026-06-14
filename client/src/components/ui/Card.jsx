// Generic surface container. `hover` adds the lift/elevation interaction.
export default function Card({ hover, className = "", children, ...props }) {
  const classes = ["card", hover ? "card-hover" : "", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
