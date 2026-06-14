import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";

const LINKS = [
  { to: "/search", label: "Opportunities" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/company-profile", label: "Company Profile" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container">
        <Logo />
        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
        <nav className={`nav ${open ? "open" : ""}`}>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
