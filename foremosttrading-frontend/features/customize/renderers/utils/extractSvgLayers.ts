export interface SvgLayerResult {
  id: string;
  label: string;
  defaultColor: string;
  layerType: string;
}

const svgLayerCache = new Map<string, SvgLayerResult[]>();

function formatLabel(raw: string): string {
  return raw
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function isUtilityNode(el: Element): boolean {
  return Boolean(el.closest("defs, clipPath, mask, pattern, symbol"));
}

function isFullBleedBackground(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  const elId = (el.getAttribute("id") || "").toLowerCase();
  if (elId === "background" || elId === "bg" || elId === "canvas-bg") return true;
  if (tag === "rect") {
    const wAttr = el.getAttribute("width");
    const hAttr = el.getAttribute("height");
    if (wAttr === "100%" && hAttr === "100%") return true;
  }
  return false;
}

export function extractSvgLayers(svg: SVGSVGElement, cacheKey?: string): SvgLayerResult[] {
  if (cacheKey && svgLayerCache.has(cacheKey)) {
    return svgLayerCache.get(cacheKey)!;
  }

  const results: SvgLayerResult[] = [];
  const processedIds = new Set<string>();

  const namedElements = Array.from(svg.querySelectorAll("[id], [data-name], [inkscape\\:label]")).filter((el) => {
    if (el.id === "svg-selection-overlay" || el.closest("#svg-selection-overlay")) return false;
    if (isUtilityNode(el)) return false;
    if (isFullBleedBackground(el)) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === "svg" || tag === "style" || tag === "script" || tag === "metadata") return false;
    if (tag === "g" && el.children.length === 0) return false;
    return true;
  });

  namedElements.forEach((node) => {
    const id = node.getAttribute("id") || node.getAttribute("data-name");
    if (!id || processedIds.has(id)) return;

    const lowerId = id.toLowerCase();
    if (lowerId === "svg" || lowerId === "root" || lowerId === "canvas" || lowerId === "viewport" || lowerId === "g") return;

    processedIds.add(id);

    const tagName = node.tagName.toLowerCase();
    let layerType = "FILL";
    if (tagName === "text") layerType = "TEXT";
    else if (tagName === "image") layerType = "IMAGE";
    else if (tagName === "g") layerType = "GROUP";

    const rawLabel = node.getAttribute("data-name") || node.getAttribute("inkscape:label") || id;
    const fillAttr = node.getAttribute("fill") || (node as HTMLElement).style?.fill || "#FFFFFF";

    results.push({
      id,
      label: formatLabel(rawLabel) || id,
      defaultColor: fillAttr.startsWith("url") ? "#FFFFFF" : fillAttr,
      layerType,
    });
  });

  const standaloneShapes = Array.from(
    svg.querySelectorAll("path, rect, circle, ellipse, polygon, polyline, line, text, image")
  ).filter((el) => {
    if (el.id === "svg-selection-overlay" || el.closest("#svg-selection-overlay")) return false;
    if (isUtilityNode(el)) return false;
    if (isFullBleedBackground(el)) return false;
    const existingId = el.getAttribute("id");
    if (existingId && processedIds.has(existingId)) return false;

    let parent = el.parentElement;
    while (parent && parent !== svg) {
      const parentId = parent.getAttribute("id") || parent.getAttribute("data-name");
      if (parentId && processedIds.has(parentId)) return false;
      parent = parent.parentElement;
    }
    return true;
  });

  let shapeCounter = 1;
  standaloneShapes.forEach((node) => {
    let id = node.getAttribute("id");
    const tagName = node.tagName.toLowerCase();

    if (!id) {
      id = `${tagName}_${shapeCounter++}`;
      node.setAttribute("id", id);
    }

    if (processedIds.has(id)) return;
    processedIds.add(id);

    let layerType = "FILL";
    if (tagName === "text") layerType = "TEXT";
    else if (tagName === "image") layerType = "IMAGE";

    const rawLabel = node.getAttribute("data-name") || node.getAttribute("inkscape:label") || id;
    const fillAttr = node.getAttribute("fill") || (node as HTMLElement).style?.fill || "#FFFFFF";
    const strokeAttr = node.getAttribute("stroke") || (node as HTMLElement).style?.stroke;
    const effectiveColor = fillAttr !== "none" ? fillAttr : strokeAttr || "#FFFFFF";

    results.push({
      id,
      label: formatLabel(rawLabel) || id,
      defaultColor: effectiveColor,
      layerType,
    });
  });

  if (cacheKey) {
    svgLayerCache.set(cacheKey, results);
  }

  return results;
}
