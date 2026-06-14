import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position on route change (but not on back/forward, where the
// browser restores position naturally for a better UX).
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
