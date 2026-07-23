import { useState, useEffect, RefObject } from "react";
import { ProductColors } from "../../types";
import { HoveredBadgeState } from "../types/svg";

interface UseSvgListenersProps {
  svgContainerRef: RefObject<HTMLDivElement | null>;
  svgContent: string | null;
  colors: ProductColors;
  activeSelectedIds: string[];
  onLayerSelect?: (elementId: string, isMultiSelect?: boolean, isRangeSelect?: boolean) => void;
}

export function useSvgListeners({
  svgContainerRef,
  svgContent,
  colors,
  activeSelectedIds,
  onLayerSelect,
}: UseSvgListenersProps) {
  const [hoveredBadge, setHoveredBadge] = useState<HoveredBadgeState | null>(null);

  useEffect(() => {
    if (!svgContainerRef.current) return;
    const svgEl = svgContainerRef.current.querySelector("svg");
    if (!svgEl) return;

    const handleClick = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      while (target && target !== svgEl) {
        const id = target.getAttribute("id");
        if (id && colors.hasOwnProperty(id)) {
          try {
            (target as HTMLElement).animate(
              [
                { opacity: 0.6, transform: "scale(0.99)" },
                { opacity: 1, transform: "scale(1)" },
              ],
              { duration: 200, easing: "ease-out" }
            );
          } catch (err) {}

          if (onLayerSelect) {
            const isMulti = e.ctrlKey || e.metaKey;
            const isRange = e.shiftKey;
            onLayerSelect(id, isMulti, isRange);
          }
          break;
        }
        target = target.parentElement;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      while (target && target !== svgEl) {
        const id = target.getAttribute("id");
        if (id && colors.hasOwnProperty(id)) {
          if (!activeSelectedIds.includes(id)) {
            (target as HTMLElement).style.filter = "drop-shadow(0 0 6px rgba(59, 130, 246, 0.75)) brightness(1.08)";
            (target as HTMLElement).style.transition = "filter 0.15s ease-in-out";
          }
          if (svgContainerRef.current) {
            const rect = svgContainerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setHoveredBadge({ label: id, x, y });
          }
          return;
        }
        target = target.parentElement;
      }
      setHoveredBadge(null);
    };

    const handleMouseOut = (e: MouseEvent) => {
      let target: Element | null = e.target as Element;
      while (target && target !== svgEl) {
        const id = target.getAttribute("id");
        if (id && colors.hasOwnProperty(id)) {
          if (!activeSelectedIds.includes(id)) {
            (target as HTMLElement).style.filter = "";
          }
          break;
        }
        target = target.parentElement;
      }
      setHoveredBadge(null);
    };

    svgEl.addEventListener("click", handleClick);
    svgEl.addEventListener("mousemove", handleMouseMove);
    svgEl.addEventListener("mouseout", handleMouseOut);

    return () => {
      svgEl.removeEventListener("click", handleClick);
      svgEl.removeEventListener("mousemove", handleMouseMove);
      svgEl.removeEventListener("mouseout", handleMouseOut);
    };
  }, [svgContainerRef, svgContent, colors, activeSelectedIds, onLayerSelect]);

  return { hoveredBadge };
}
