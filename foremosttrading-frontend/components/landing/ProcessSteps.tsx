import React from "react";

const steps = [
  {
    number: "01",
    title: "PICK YOUR SILHOUETTE",
    description:
      "From varsity jackets to pro jerseys, choose a base built for performance.",
  },
  {
    number: "02",
    title: "CUSTOMIZE IN REAL TIME",
    description:
      "Recolor every panel, drop logos, add names, numbers and text. Watch it update live",
  },
  {
    number: "03",
    title: "WE BUILD IT ON DEMAND",
    description:
      "Made-to-order production. No inventory, no waste. Ships in 2-3 weeks.",
  },
];

export function ProcessSteps() {
  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-black mb-16">
          Three Steps. Zero Compromise.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-5xl md:text-6xl font-bold text-[#F97316] mb-6 font-heading tracking-tight">
                {step.number}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-black uppercase mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
