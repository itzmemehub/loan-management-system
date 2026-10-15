import { useEffect } from "react";

// The drifting colour behind every page, plus the pointer-following
// highlight on glass panels.
function Aurora() {
  useEffect(() => {
    const trackLight = (e) => {
      const panel = e.target.closest?.(".glass");
      if (!panel) return;
      const box = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${e.clientX - box.left}px`);
      panel.style.setProperty("--my", `${e.clientY - box.top}px`);
    };
    window.addEventListener("pointermove", trackLight, { passive: true });
    return () => window.removeEventListener("pointermove", trackLight);
  }, []);

  return <div className="aurora" aria-hidden="true"><span /><span /><span /><span /></div>;
}

export default Aurora;
