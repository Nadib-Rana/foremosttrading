export function injectFabricFilter(svgEl: SVGSVGElement): void {
  let defs = svgEl.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svgEl.insertBefore(defs, svgEl.firstChild);
  }

  let filter = defs.querySelector("#photorealistic-fabric-filter");
  if (!filter) {
    filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "photorealistic-fabric-filter");
    filter.setAttribute("x", "-5%");
    filter.setAttribute("y", "-5%");
    filter.setAttribute("width", "110%");
    filter.setAttribute("height", "110%");

    filter.innerHTML = `
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0 0.1  0 0 0 0.12 0" in="noise" result="fabricNoise" />
      <feDiffuseLighting in="noise" lighting-color="#ffffff" surfaceScale="1.5" result="lightMap">
        <feDistantLight azimuth="45" elevation="60" />
      </feDiffuseLighting>
      <feBlend mode="multiply" in="SourceGraphic" in2="lightMap" result="shaded" />
      <feBlend mode="overlay" in="shaded" in2="fabricNoise" result="finalOutput" />
    `;
    defs.appendChild(filter);
  }
}
