import { useCallback, useState } from "react";
import { readJSON, writeJSON } from "../lib/storage.js";

// State synced to localStorage. Returns [value, setValue] like useState.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readJSON(key, initialValue));

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        writeJSON(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, set];
}
