"use client";

interface JerseyPreviewProps {
  colors: {
    body: string;
    sleeves: string;
    collar: string;
    borders: string;
  };
}

export function JerseyPreview({ colors }: JerseyPreviewProps) {
  return (
    <div className="w-full max-w-md mx-auto aspect-square relative">
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Shadow/Base layer to give 3D feel */}
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodOpacity="0.1" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          {/* Main Body */}
          <path
            d="M 120 50 C 150 50, 180 80, 200 80 C 220 80, 250 50, 280 50 L 320 80 L 320 180 C 320 180, 290 190, 280 180 L 280 350 L 120 350 L 120 180 C 110 190, 80 180, 80 180 L 80 80 Z"
            fill={colors.body}
            stroke="#e5e7eb"
            strokeWidth="2"
          />

          {/* Left Sleeve */}
          <path
            d="M 120 50 L 80 80 L 80 180 C 110 190, 120 180, 120 180 Z"
            fill={colors.sleeves}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Right Sleeve */}
          <path
            d="M 280 50 L 320 80 L 320 180 C 290 190, 280 180, 280 180 Z"
            fill={colors.sleeves}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Collar */}
          <path
            d="M 170 50 C 180 70, 220 70, 230 50 Z"
            fill={colors.collar}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Sleeve Borders */}
          <path
            d="M 80 170 C 110 180, 120 170, 120 170 L 120 180 C 110 190, 80 180, 80 180 Z"
            fill={colors.borders}
          />
          <path
            d="M 280 170 C 290 180, 320 170, 320 170 L 320 180 C 290 190, 280 180, 280 180 Z"
            fill={colors.borders}
          />
        </g>

        {/* Dummy 3D Shading Overlay using mix-blend-mode multiply */}
        <path
          d="M 120 50 C 150 50, 180 80, 200 80 C 220 80, 250 50, 280 50 L 320 80 L 320 180 C 320 180, 290 190, 280 180 L 280 350 L 120 350 L 120 180 C 110 190, 80 180, 80 180 L 80 80 Z"
          fill="url(#shading)"
          style={{ mixBlendMode: "multiply" }}
          opacity="0.3"
        />
        <defs>
          <linearGradient id="shading" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Fabric.js Canvas Placeholder Overlay */}
      <div className="absolute top-[25%] left-[30%] w-[40%] h-[40%] border-2 border-dashed border-gray-300 rounded-sm flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
        <span className="text-gray-400 text-xs text-center font-semibold">Printable Area<br/>(Fabric.js Canvas here)</span>
      </div>
    </div>
  );
}
