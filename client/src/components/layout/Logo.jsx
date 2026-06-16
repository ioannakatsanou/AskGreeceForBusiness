import { useNavigate } from "react-router-dom";

// Brand mark: an ascending colonnade (Greece + business growth) on a stylobate
// (trust/foundation), crowned by an opportunity/AI decision node.
function BrandMark() {
  return (
    <svg
      className="logo-mark"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="agfbLogoGrad" x1="29" y1="31" x2="29" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <rect x="5" y="31" width="30" height="3.6" rx="1.8" fill="#1E293B" />
      <rect x="8.5" y="22" width="5" height="9" rx="2.5" fill="#2563EB" />
      <rect x="17.5" y="16" width="5" height="15" rx="2.5" fill="#2563EB" />
      <rect x="26.5" y="12" width="5" height="19" rx="2.5" fill="url(#agfbLogoGrad)" />
      <circle cx="29" cy="7.6" r="3.3" fill="#60A5FA" />
      <circle cx="29" cy="7.6" r="1.25" fill="#ffffff" />
    </svg>
  );
}

// Logo always returns to Home (requirement). Rendered as a button so it can't
// open a new tab and works identically on every page.
export default function Logo() {
  const navigate = useNavigate();
  return (
    <button
      className="logo"
      onClick={() => navigate("/")}
      aria-label="Ask Greece For Business — go to home"
    >
      <BrandMark />
      <span className="logo-word">
        <span className="logo-word-main">Ask Greece</span>
        <span className="logo-word-sub">For Business</span>
      </span>
    </button>
  );
}
