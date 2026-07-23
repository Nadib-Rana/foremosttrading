import { findSvgElement } from "./findSvgElement";

export const applyColorToNode = (node: SVGElement, color: string, svgEl: SVGSVGElement) => {
  node.style.cursor = "pointer";

  const fillAttr = node.getAttribute("fill") || node.style.fill;
  const strokeAttr = node.getAttribute("stroke") || node.style.stroke;

  // Protect url() gradients
  if (fillAttr && fillAttr.startsWith("url(")) return;

  if (fillAttr && fillAttr !== "none") {
    node.style.setProperty("fill", color, "important");
    node.setAttribute("fill", color);
  } else if (strokeAttr && strokeAttr !== "none") {
    node.style.setProperty("stroke", color, "important");
    node.setAttribute("stroke", color);
  }

  if (node.children && node.children.length > 0) {
    Array.from(node.children).forEach((child) => {
      if (child instanceof SVGElement && child.id !== "svg-selection-overlay") {
        applyColorToNode(child, color, svgEl);
      }
    });
  }
};

export const applyColorPatches = (svgEl: SVGSVGElement, colors: Record<string, string>) => {
  if (!colors) return;
  Object.entries(colors).forEach(([elementId, color]) => {
    if (!color) return;
    const el = findSvgElement(svgEl, elementId);
    if (!el) return;

    // Skip applying if color is white default and element already has a valid dark/colored fill
    const currentFill = el.getAttribute("fill") || el.style.fill;
    if (
      (color === "#FFFFFF" || color === "#ffffff") &&
      currentFill &&
      currentFill !== "#FFFFFF" &&
      currentFill !== "#ffffff" &&
      currentFill !== "none"
    ) {
      return;
    }

    applyColorToNode(el, color, svgEl);
  });
};
