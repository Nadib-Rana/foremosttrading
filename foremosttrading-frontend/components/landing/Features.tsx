import React from "react";
import { Zap, Shield, Layers, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-[#F97316]" />,
    title: "REAL-TIME PREVIEW",
    description: "Every color, every panel, every text instant feedback.",
  },
  {
    icon: <Shield className="w-6 h-6 text-[#F97316]" />,
    title: "TOURNAMENT-GRADE",
    description:
      "Materials engineered for impact, sweat and stadium lights.",
  },
  {
    icon: <Layers className="w-6 h-6 text-[#F97316]" />,
    title: "FULL CUSTOMIZATION",
    description: "Body, sleeves, pockets, cuffs, stripes, buttons - yours.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-[#F97316]" />,
    title: "MADE ON DEMAND",
    description:
      "Zero inventory. Zero waste. Every piece is yours alone.",
  },
];

export function Features() {
  return (
    <section className="w-full py-8 md:py-12 bg-[#111] text-white">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
        <div className="w-full lg:w-1/3">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[1.1]">
            Built Different.<br />Built For You.
          </h2>
        </div>

        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-[#1C2028] rounded-xl p-6 md:p-8 flex flex-col gap-4"
            >
              <div className="mb-2">{feature.icon}</div>
              <h3 className="font-bold text-lg text-white uppercase tracking-wide">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
