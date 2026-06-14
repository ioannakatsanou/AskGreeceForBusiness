import { useEffect, useRef, useState } from "react";
import { MOCK_LATENCY } from "../lib/constants.js";

// Simulates an async data fetch with loading/error states and latency.
// `producer` is a sync function returning the data (or throwing to simulate error).
// Re-runs whenever any value in `deps` changes. Mirrors the real useTimeoutFetch
// contract so swapping in the backend later is a drop-in change.
export function useMockFetch(producer, deps = [], { latency = MOCK_LATENCY } = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [nonce, setNonce] = useState(0);
  const producerRef = useRef(producer);
  producerRef.current = producer;

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    const timer = setTimeout(() => {
      if (cancelled) return;
      try {
        const data = producerRef.current();
        setState({ data, loading: false, error: null });
      } catch (err) {
        setState({ data: null, loading: false, error: err.message || "Something went wrong" });
      }
    }, latency);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce, latency]);

  const retry = () => setNonce((n) => n + 1);
  return { ...state, retry };
}
