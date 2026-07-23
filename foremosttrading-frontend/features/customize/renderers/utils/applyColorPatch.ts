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

export const applyTextPatches = (svgEl: SVGSVGElement, playerText: Record<string, any>) => {
  if (!playerText) return;

  const fontFam = playerText.fontFamily || playerText.font;
  const fontSize = playerText.fontSize;
  const textColor = playerText.color || playerText.fill;
  const fontWeight = playerText.fontWeight;

  const applyTextStylesToNode = (el: SVGElement, textValue?: string) => {
    if (textValue !== undefined && textValue !== null) {
      // If element has tspans, update first tspan or textContent
      const tspans = el.querySelectorAll("tspan");
      if (tspans && tspans.length > 0) {
        tspans[0].textContent = textValue;
      } else {
        el.textContent = textValue;
      }
    }

    if (fontFam) {
      el.style.fontFamily = fontFam;
      el.setAttribute("font-family", fontFam);
    }
    if (fontSize) {
      const sizeStr = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
      el.style.fontSize = sizeStr;
      el.setAttribute("font-size", sizeStr);
    }
    if (fontWeight) {
      el.style.fontWeight = fontWeight;
      el.setAttribute("font-weight", fontWeight);
    }
    if (textColor) {
      el.style.fill = textColor;
      el.setAttribute("fill", textColor);
    }
  };

  // Standard Name / Number patches
  if (playerText.name !== undefined) {
    const nameElements = [
      findSvgElement(svgEl, "jerseyName"),
      findSvgElement(svgEl, "name"),
      findSvgElement(svgEl, "player_name"),
      findSvgElement(svgEl, "text_name"),
    ].filter(Boolean) as SVGElement[];

    if (nameElements.length === 0) {
      // Search all text/tspan nodes matching category or name
      const allTexts = Array.from(svgEl.querySelectorAll("text, tspan"));
      allTexts.forEach((t) => {
        const id = (t.getAttribute("id") || t.getAttribute("data-name") || "").toLowerCase();
        if (id.includes("name") || id.includes("player")) {
          nameElements.push(t as SVGElement);
        }
      });
    }

    nameElements.forEach((el) => applyTextStylesToNode(el, playerText.name));
  }

  if (playerText.number !== undefined) {
    const numElements = [
      findSvgElement(svgEl, "jerseyNumber"),
      findSvgElement(svgEl, "number"),
      findSvgElement(svgEl, "player_number"),
      findSvgElement(svgEl, "text_number"),
    ].filter(Boolean) as SVGElement[];

    if (numElements.length === 0) {
      const allTexts = Array.from(svgEl.querySelectorAll("text, tspan"));
      allTexts.forEach((t) => {
        const id = (t.getAttribute("id") || t.getAttribute("data-name") || "").toLowerCase();
        if (id.includes("number") || id.includes("num") || id.includes("digit")) {
          numElements.push(t as SVGElement);
        }
      });
    }

    numElements.forEach((el) => applyTextStylesToNode(el, String(playerText.number)));
  }

  // Dynamic backend text element IDs or dictionary of text objects
  Object.entries(playerText).forEach(([elementId, textVal]) => {
    if (["name", "number", "fontFamily", "font", "fontSize", "color", "fill", "fontWeight"].includes(elementId)) return;
    const el = findSvgElement(svgEl, elementId);
    if (!el) return;

    if (typeof textVal === "string" || typeof textVal === "number") {
      applyTextStylesToNode(el, String(textVal));
    } else if (typeof textVal === "object" && textVal !== null) {
      if (textVal.value !== undefined) applyTextStylesToNode(el, String(textVal.value));
      if (textVal.fontFamily) el.style.fontFamily = textVal.fontFamily;
      if (textVal.fontSize) el.style.fontSize = typeof textVal.fontSize === "number" ? `${textVal.fontSize}px` : textVal.fontSize;
      if (textVal.fontWeight) el.style.fontWeight = textVal.fontWeight;
      if (textVal.color || textVal.fill) {
        const color = textVal.color || textVal.fill;
        el.style.fill = color;
        el.setAttribute("fill", color);
      }
      if (textVal.x !== undefined) el.setAttribute("x", String(textVal.x));
      if (textVal.y !== undefined) el.setAttribute("y", String(textVal.y));
      if (textVal.transform !== undefined) el.setAttribute("transform", textVal.transform);
    }
  });
};
