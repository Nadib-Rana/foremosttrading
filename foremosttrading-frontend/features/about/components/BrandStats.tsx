"use client";

export function BrandStats() {
  const stats = [
    {
      value: "50K+",
      label: "Teams Outfitted",
      desc: "Outfitting amateur clubs to professional school leagues nationwide.",
    },
    {
      value: "100%",
      label: "Custom Tailored",
      desc: "Every jersey and pattern is generated to your exact customizations.",
    },
    {
      value: "10+ Yrs",
      label: "Fabrication Expert",
      desc: "A decade of experience crafting high-quality athletic merchandise.",
    },
    {
      value: "99.8%",
      label: "Satisfaction Score",
      desc: "Client support checks and custom design proofs guarantee zero errors.",
    },
  ];

  return (
    <section className="w-full py-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 text-center shadow-3xs flex flex-col items-center justify-center min-h-[160px]"
            >
              {/* Stat number with brand accent color */}
              <span className="font-heading text-3xl sm:text-4xl font-black text-[#EF892A]">
                {stat.value}
              </span>
              
              <h4 className="font-heading text-xs font-black text-gray-900 mt-2 uppercase tracking-wide">
                {stat.label}
              </h4>
              
              <p className="text-[10px] font-semibold text-gray-400 mt-1.5 leading-normal max-w-[180px]">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
