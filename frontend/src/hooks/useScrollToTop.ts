import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll position whenever the route changes — the scroll container
// itself (e.g. the private layout's <main>) if a ref is attached, and the
// window as a fallback for layouts that scroll natively (e.g. public pages).
export function useScrollToTop<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname]);

  return ref;
}
