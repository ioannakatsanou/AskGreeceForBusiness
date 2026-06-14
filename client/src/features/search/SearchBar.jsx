import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";

// Shared search input. Submits by navigating to /search?q=... (internal nav).
export default function SearchBar({ initialValue = "", autoFocus = false }) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  // Keep the box in sync when the URL query changes (e.g. example chips or
  // recent-search navigation), so it never shows a stale term.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <form className="searchbar" onSubmit={submit} role="search">
      <input
        className="input"
        type="text"
        placeholder="Search opportunities — e.g. cybersecurity, ERP, cloud migration"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        aria-label="Search procurement opportunities"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}
