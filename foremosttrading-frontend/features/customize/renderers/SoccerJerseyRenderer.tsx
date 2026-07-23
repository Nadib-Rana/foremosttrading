"use client";

import React from "react";
import { SoccerJerseyRendererProps, DynamicSvgRendererProps } from "./types/svg";
import { PresetJerseyViews } from "./components/PresetJerseyViews";
import { SvgCanvas } from "./components/SvgCanvas";

export function SoccerJerseyRenderer(props: SoccerJerseyRendererProps) {
  return <PresetJerseyViews {...props} />;
}

export function DynamicSvgRenderer(props: DynamicSvgRendererProps) {
  return <SvgCanvas {...props} />;
}
