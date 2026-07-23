export const applyVisibilityPatches = (svgEl: SVGSVGElement, visibleParts: Record<string, boolean>) => {
  if (!visibleParts) return;
  Object.entries(visibleParts).forEach(([elementId, visible]) => {
    const el = svgEl.querySelector("#" + CSS.escape(elementId)) as HTMLElement | null;
    if (!el) return;
    el.style.display = visible ? "" : "none";
  });
};

export const setupSvgDimensions = (svgEl: SVGSVGElement) => {
  svgEl.setAttribute("width", "100%");
  svgEl.setAttribute("height", "100%");
  svgEl.style.width = "100%";
  svgEl.style.height = "100%";
  svgEl.style.maxWidth = "100%";
  svgEl.style.maxHeight = "100%";
};
