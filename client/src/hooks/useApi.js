import { useEffect, useRef, useState } from "react";

// Runs an async producer (typically an api/client.js call) and exposes
// { data, loading, error, retry }. Drop-in replacement for useMockFetch, but
// promise-based so it works with the real backend (or its mock fallback).
export function useApi(producer, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [nonce, setNonce] = useState(0);
  const producerRef = useRef(producer);
  producerRef.current = producer;

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    Promise.resolve()
      .then(() => producerRef.current())
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err?.message || "Something went wrong" });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const retry = () => setNonce((n) => n + 1);
  return { ...state, retry };
}
