// Labelled form field wrapper with optional hint + error text.
export function Field({ label, hint, error, htmlFor, children }) {
  return (
    <div className="field">
      {label && <label htmlFor={htmlFor}>{label}</label>}
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="err">{error}</span>}
    </div>
  );
}

// Convenience text/number input bound to the Field label.
export function TextInput({ invalid, ...props }) {
  return <input className={`input ${invalid ? "input-invalid" : ""}`.trim()} {...props} />;
}

export function Select({ invalid, children, ...props }) {
  return (
    <select className={`select ${invalid ? "input-invalid" : ""}`.trim()} {...props}>
      {children}
    </select>
  );
}

export function TextArea({ invalid, ...props }) {
  return <textarea className={`textarea ${invalid ? "input-invalid" : ""}`.trim()} {...props} />;
}
