import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ⭐ Har route change pe top pe scroll karo
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",   // Smooth nahi, instant
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;