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
    <section className="w-full py-8 md:py-12 bg-[#F4F5F7]">
      <div className="container mx-auto px-4 sm:px-6 ">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-black mb-10">
          THREE STEPS. ZERO COMPROMISE.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col bg-white rounded-xl p-6 md:p-8 shadow-sm">
              <span className="text-2xl md:text-3xl font-bold text-[#EF892A] mb-4">
                {step.number}
              </span>
              <h3 className="text-sm md:text-base font-bold text-black uppercase mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
