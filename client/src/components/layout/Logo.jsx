import { useNavigate } from "react-router-dom";

// Logo always returns to Home (requirement). Rendered as a button so it can't
// open a new tab and works identically on every page.
export default function Logo() {
  const navigate = useNavigate();
  return (
    <button className="logo" onClick={() => navigate("/")} aria-label="TenderFit AI — go to home">
      <span className="logo-mark">TF</span>
      <span className="logo-text">
        Tender<span>Fit</span> AI
      </span>
    </button>
  );
}
