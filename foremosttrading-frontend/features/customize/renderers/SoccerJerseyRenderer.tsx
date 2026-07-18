"use client";

import React from "react";
import { ProductColors, PlayerText } from "../types";

interface SoccerJerseyRendererProps {
  colors: ProductColors;
  pattern: string;
  playerText: PlayerText;
  visibleParts: Record<string, boolean>;
}

export function SoccerJerseyRenderer({
  colors,
  pattern,
  playerText,
  visibleParts,
}: SoccerJerseyRendererProps) {
  const getStyle = (part: string) => {
    return visibleParts[part] ? {} : { display: "none" };
  };

  const renderPattern = (view: "front" | "back") => {
    if (!visibleParts.borders) return null;
    if (pattern === "striped") {
      return (
        <g opacity="0.3" style={getStyle("jerseyBody")}>
          <rect x="110" y="70" width="15" height="150" fill={colors.borders} />
          <rect x="145" y="70" width="15" height="150" fill={colors.borders} />
          <rect x="180" y="70" width="15" height="150" fill={colors.borders} />
        </g>
      );
    }
    if (pattern === "sash") {
      return (
        <path
          d="M 90 70 L 195 210 L 210 210 L 110 70 Z"
          fill={colors.borders}
          opacity="0.5"
          style={getStyle("jerseyBody")}
        />
      );
    }
    if (pattern === "gradients") {
      return (
        <rect
          x="80"
          y="70"
          width="140"
          height="140"
          fill="url(#grad)"
          style={{ mixBlendMode: "overlay", ...getStyle("jerseyBody") }}
        />
      );
    }
    if (pattern === "modern") {
      return (
        <path
          d="M 80 70 L 150 70 L 80 180 Z"
          fill={colors.borders}
          opacity="0.25"
          style={getStyle("jerseyBody")}
        />
      );
    }
    return null;
  };

  return (
    <>
      {/* 1. LEFT SIDE VIEW */}
      <svg viewBox="0 0 300 400" className="w-[22%] min-w-[70px] max-h-[300px] h-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Side Jersey */}
        <path d="M 120 70 L 160 70 L 170 210 L 110 210 Z" fill={colors.jerseyBody} style={getStyle("jerseyBody")} />
        {/* Sleeve side */}
        <path d="M 105 85 L 135 70 L 125 140 Z" fill={colors.borders} style={getStyle("borders")} />
        {/* Shorts side */}
        <path d="M 115 210 L 165 210 L 170 280 L 110 280 Z" fill={colors.pantBody} style={getStyle("pantBody")} />
        <rect x="135" y="210" width="8" height="70" fill={colors.borders} style={getStyle("borders")} />
        {/* Sock side */}
        <rect x="130" y="290" width="18" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="130" y="290" width="18" height="8" fill={colors.borders} style={getStyle("borders")} />
      </svg>

      {/* 2. FRONT VIEW */}
      <svg viewBox="0 0 300 400" className="w-[22%] min-w-[70px] max-h-[300px] h-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Jersey Sleeves */}
        <path d="M 60 90 L 90 70 L 110 110 L 80 130 Z" fill={colors.borders} style={getStyle("borders")} />
        <path d="M 240 90 L 210 70 L 190 110 L 220 130 Z" fill={colors.borders} style={getStyle("borders")} />
        {/* Jersey Body */}
        <path d="M 90 70 C 120 70, 180 70, 210 70 L 220 210 L 80 210 Z" fill={colors.jerseyBody} style={getStyle("jerseyBody")} />
        {renderPattern("front")}
        {/* Collar */}
        <path d="M 130 70 C 140 85, 160 85, 170 70 Z" fill={colors.collar} style={getStyle("collar")} />
        
        {/* Text/Number Overlay */}
        {visibleParts.jerseyBody && (
          <text x="150" y="160" fill={playerText.textColor} fontFamily={playerText.fontFamily} fontSize="28" fontWeight="bold" textAnchor="middle" className="italic">
            {playerText.number}
          </text>
        )}

        {/* Shorts */}
        <path d="M 95 210 L 205 210 L 215 280 L 155 280 L 150 250 L 145 280 L 85 280 Z" fill={colors.pantBody} style={getStyle("pantBody")} />
        <path d="M 85 270 L 120 270 L 120 280 L 85 280 Z" fill={colors.borders} style={getStyle("borders")} />
        <path d="M 180 270 L 215 270 L 215 280 L 180 280 Z" fill={colors.borders} style={getStyle("borders")} />

        {/* Socks */}
        <rect x="100" y="290" width="16" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="184" y="290" width="16" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="100" y="290" width="16" height="8" fill={colors.borders} style={getStyle("borders")} />
        <rect x="184" y="290" width="16" height="8" fill={colors.borders} style={getStyle("borders")} />
      </svg>

      {/* 3. BACK VIEW */}
      <svg viewBox="0 0 300 400" className="w-[22%] min-w-[70px] max-h-[300px] h-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Jersey Sleeves */}
        <path d="M 60 90 L 90 70 L 110 110 L 80 130 Z" fill={colors.borders} style={getStyle("borders")} />
        <path d="M 240 90 L 210 70 L 190 110 L 220 130 Z" fill={colors.borders} style={getStyle("borders")} />
        {/* Jersey Body */}
        <path d="M 90 70 C 120 70, 180 70, 210 70 L 220 210 L 80 210 Z" fill={colors.jerseyBody} style={getStyle("jerseyBody")} />
        {renderPattern("back")}
        {/* Collar Back */}
        <path d="M 130 70 C 140 73, 160 73, 170 70 Z" fill={colors.collar} style={getStyle("collar")} />
        
        {visibleParts.jerseyBody && (
          <>
            <text x="150" y="110" fill={playerText.textColor} fontFamily={playerText.fontFamily} fontSize="12" fontWeight="black" textAnchor="middle" className="uppercase italic tracking-widest">
              {playerText.name}
            </text>
            <text x="150" y="165" fill={playerText.textColor} fontFamily={playerText.fontFamily} fontSize="46" fontWeight="black" textAnchor="middle" className="italic">
              {playerText.number}
            </text>
          </>
        )}

        {/* Shorts */}
        <path d="M 95 210 L 205 210 L 215 280 L 155 280 L 150 250 L 145 280 L 85 280 Z" fill={colors.pantBody} style={getStyle("pantBody")} />
        {/* Socks */}
        <rect x="100" y="290" width="16" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="184" y="290" width="16" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="100" y="290" width="16" height="8" fill={colors.borders} style={getStyle("borders")} />
        <rect x="184" y="290" width="16" height="8" fill={colors.borders} style={getStyle("borders")} />
      </svg>

      {/* 4. RIGHT SIDE VIEW */}
      <svg viewBox="0 0 300 400" className="w-[22%] min-w-[70px] max-h-[300px] h-auto flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Side Jersey */}
        <path d="M 120 70 L 160 70 L 170 210 L 110 210 Z" fill={colors.jerseyBody} style={getStyle("jerseyBody")} />
        {/* Sleeve side */}
        <path d="M 175 85 L 145 70 L 155 140 Z" fill={colors.borders} style={getStyle("borders")} />
        {/* Shorts side */}
        <path d="M 115 210 L 165 210 L 170 280 L 110 280 Z" fill={colors.pantBody} style={getStyle("pantBody")} />
        <rect x="135" y="210" width="8" height="70" fill={colors.borders} style={getStyle("borders")} />
        {/* Sock side */}
        <rect x="130" y="290" width="18" height="80" fill={colors.socks} rx="3" style={getStyle("socks")} />
        <rect x="130" y="290" width="18" height="8" fill={colors.borders} style={getStyle("borders")} />
      </svg>
    </>
  );
}
