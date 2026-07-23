export const findSvgElement = (svg: SVGSVGElement, id: string): SVGElement | null => {
  if (!id) return null;
  try {
    const exact = svg.querySelector("#" + CSS.escape(id)) as SVGElement | null;
    if (exact) return exact;
  } catch (e) {}

  const lowerId = id.toLowerCase();
  const cleanId = lowerId.replace(/[-_]/g, "");
  const all = svg.querySelectorAll("[id]");
  for (let i = 0; i < all.length; i++) {
    const item = all[i] as SVGElement;
    if (item.id && item.id !== "svg-selection-overlay") {
      const itemLower = item.id.toLowerCase();
      if (itemLower === lowerId || itemLower.replace(/[-_]/g, "") === cleanId) {
        return item;
      }
    }
  }

  // Index-based fallback ONLY on artwork vector shapes (excluding container <g> and full-bleed background <rect>)
  const numMatch = id.match(/\d+/);
  if (numMatch) {
    const layerIdx = parseInt(numMatch[0], 10) - 1;
    if (layerIdx >= 0) {
      const viewBox = svg.viewBox?.baseVal;
      const svgW = viewBox?.width || svg.clientWidth || 1000;
      const svgH = viewBox?.height || svg.clientHeight || 1000;

      const leafShapes = Array.from(
        svg.querySelectorAll("path, rect, circle, ellipse, polygon, polyline, line")
      ).filter((el) => {
        if (el.id === "svg-selection-overlay" || el.closest("#svg-selection-overlay")) return false;

        const wAttr = el.getAttribute("width");
        const hAttr = el.getAttribute("height");
        if (wAttr === "100%" || hAttr === "100%") return false;
        if (wAttr && parseFloat(wAttr) >= svgW * 0.95 && hAttr && parseFloat(hAttr) >= svgH * 0.95) return false;

        return true;
      });

      if (leafShapes[layerIdx]) {
        return leafShapes[layerIdx] as SVGElement;
      }
    }
  }

  return null;
};
