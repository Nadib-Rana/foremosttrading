import { findSvgElement } from "./findSvgElement";

export const applySelectionPatch = (svgEl: SVGSVGElement, activeSelectedIds: string[]) => {
  // Create or reset top-level SVG selection overlay group
  let overlay = svgEl.querySelector("#svg-selection-overlay");
  if (overlay) {
    overlay.remove();
  }
  overlay = document.createElementNS("http://www.w3.org/2000/svg", "g");
  overlay.setAttribute("id", "svg-selection-overlay");
  (overlay as HTMLElement).style.pointerEvents = "none";
  svgEl.appendChild(overlay);

  if (activeSelectedIds.length === 0) return;

  activeSelectedIds.forEach((id) => {
    const selectedEl = findSvgElement(svgEl, id);
    if (!selectedEl) return;

    // Non-destructive filter glow indicator
    selectedEl.style.filter = "drop-shadow(0 0 6px rgba(37, 99, 235, 0.9)) brightness(1.1)";
    selectedEl.style.transition = "filter 0.15s ease-in-out";

    // Non-destructive bounding box selection indicator overlay on <g id="svg-selection-overlay">
    if ("getBBox" in selectedEl) {
      try {
        const bbox = (selectedEl as SVGGraphicsElement).getBBox();
        if (bbox && bbox.width > 0 && bbox.height > 0) {
          const pad = Math.max(3, Math.min(bbox.width, bbox.height) * 0.04);
          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", String(bbox.x - pad));
          rect.setAttribute("y", String(bbox.y - pad));
          rect.setAttribute("width", String(bbox.width + pad * 2));
          rect.setAttribute("height", String(bbox.height + pad * 2));
          rect.setAttribute("rx", "4");
          rect.setAttribute("ry", "4");
          rect.setAttribute("fill", "rgba(59, 130, 246, 0.15)");
          rect.setAttribute("stroke", "#2563eb");
          rect.setAttribute("stroke-width", "2");
          rect.setAttribute("stroke-dasharray", "4,3");
          (rect as HTMLElement).style.pointerEvents = "none";
          overlay?.appendChild(rect);
        }
      } catch (err) {
        // Ignore if getBBox is unavailable
      }
    }
  });
};
