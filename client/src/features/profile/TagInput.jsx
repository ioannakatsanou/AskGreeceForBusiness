import { useState } from "react";

// Lightweight tag editor for keywords / certifications / regions.
// Add with Enter or the Add button; remove with the × on each tag.
// `suggestions` render as quick-add chips.
export default function TagInput({ value = [], onChange, placeholder, suggestions = [] }) {
  const [draft, setDraft] = useState("");

  const add = (raw) => {
    const tag = (raw ?? draft).trim();
    if (!tag) return;
    if (!value.some((v) => v.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag]);
    }
    setDraft("");
  };

  const remove = (tag) => onChange(value.filter((v) => v !== tag));

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  const remaining = suggestions.filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="stack" style={{ gap: "var(--s-2)" }}>
      <div className="row" style={{ gap: "var(--s-2)" }}>
        <input
          className="input"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="btn btn-secondary" onClick={() => add()}>
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="row-wrap">
          {value.map((tag) => (
            <span key={tag} className="badge badge-info" style={{ paddingRight: 6 }}>
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                aria-label={`Remove ${tag}`}
                style={{ border: 0, background: "none", cursor: "pointer", color: "inherit", fontWeight: 800 }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {remaining.length > 0 && (
        <div className="row-wrap">
          <span className="faint" style={{ fontSize: "0.8rem" }}>
            Quick add:
          </span>
          {remaining.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => add(s)}>
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
