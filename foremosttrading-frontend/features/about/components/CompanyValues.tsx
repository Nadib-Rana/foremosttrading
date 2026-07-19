"use client";

import { Award, Cpu, ShieldAlert } from "lucide-react";

export function CompanyValues() {
  const values = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Uncompromising Craftsmanship",
      desc: "We select only premium grade wools, genuine cowhide leathers, heavy performance poly knits, and detail-rich embroidery to ensure durability and high aesthetic appeal.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Customizer Technology",
      desc: "Our real-time online 3D customizer visualizes designs, color combinations, dynamic layers, and custom player specs instantly in the browser.",
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: "On-Demand Fabrication",
      desc: "By focusing entirely on a made-to-order manufacturing workflow, we eliminate unnecessary warehouse inventory excess and minimize environment fabric waste.",
    },
  ];

  return (
    <section className="w-full py-12 bg-white border-y border-gray-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-heading font-black tracking-[0.25em] text-[#EF892A] uppercase mt-0.5 italic">
            OUR CORE PILLARS
          </span>
          <h2 className="font-heading text-3xl font-black text-gray-900 tracking-tight mt-3">
            What Drives Foremost
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {values.map((val, i) => (
            <div
              key={i}
              className="bg-[#F9F9F9] border border-gray-50 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-3xs"
            >
              {/* Icon round backdrop */}
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#EF892A] mb-5 flex-shrink-0">
                {val.icon}
              </div>
              
              <h3 className="font-heading text-sm font-black text-gray-900 mb-2.5 uppercase tracking-wide">
                {val.title}
              </h3>
              
              <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-sm">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
