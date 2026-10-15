import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToId } from "../utils/scroll";

// React Router keeps the old scroll position between pages. This resets it:
// a URL with #section scrolls to that section, anything else starts at the
// top. It runs on every navigation (location.key), so tapping a link to the
// page or section you're already on scrolls back to it, as in an app.
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash && scrollToId(decodeURIComponent(hash.slice(1)))) return;
    window.scrollTo({ top: 0 });
  }, [pathname, hash, key]);

  return null;
}

export default ScrollManager;
