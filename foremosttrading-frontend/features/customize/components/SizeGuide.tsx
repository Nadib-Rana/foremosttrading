"use client";

import { SIZE_CHART } from "../constants";

export function SizeGuide() {
  return (
    <section className="mt-16 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xs max-w-7xl mx-auto w-full">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-heading text-2xl md:text-3xl font-black uppercase text-gray-900 tracking-tight">
          Size Guide
        </h2>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
          Kit "Evolution"
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Measurement Graphic illustration */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center max-w-[340px] mx-auto w-full">
          <svg viewBox="0 0 200 240" className="w-full h-auto text-gray-700 fill-none" xmlns="http://www.w3.org/2000/svg">
            {/* T-Shirt Drawing with double sleeve line and detailed collar */}
            {/* Outer body */}
            <path d="M50 45 L70 30 C80 32, 120 32, 130 30 L150 45 L158 85 L142 90 L140 135 L60 135 L58 90 L42 85 Z" stroke="#374151" strokeWidth="1.2" />
            {/* Collar detailed double lines */}
            <path d="M70 30 C75 42, 125 42, 130 30" stroke="#374151" strokeWidth="1.2" />
            <path d="M72 32 C77 44, 123 44, 128 32" stroke="#374151" strokeWidth="0.8" />
            {/* Sleeve double hems */}
            <line x1="42" y1="85" x2="58" y2="90" stroke="#374151" strokeWidth="1.2" />
            <line x1="40" y1="83" x2="56" y2="88" stroke="#374151" strokeWidth="0.8" />
            <line x1="158" y1="85" x2="142" y2="90" stroke="#374151" strokeWidth="1.2" />
            <line x1="160" y1="83" x2="144" y2="88" stroke="#374151" strokeWidth="0.8" />

            {/* Shorts Drawing with elastic details */}
            <path d="M60 148 L140 148 L146 205 L112 205 L100 188 L88 205 L54 205 Z" stroke="#374151" strokeWidth="1.2" />
            {/* Waistband double line and elastic ribs */}
            <line x1="60" y1="148" x2="140" y2="148" stroke="#374151" strokeWidth="1.2" />
            <line x1="60" y1="156" x2="140" y2="156" stroke="#374151" strokeWidth="1" />
            {/* Drawstrings */}
            <path d="M97 156 L93 175" stroke="#374151" strokeWidth="1" />
            <path d="M103 156 L107 175" stroke="#374151" strokeWidth="1" />

            {/* Arrow W (Chest Width) */}
            <line x1="58" y1="80" x2="142" y2="80" stroke="#EAB308" strokeWidth="1.8" />
            <polygon points="58,80 64,76 64,84" fill="#EAB308" />
            <polygon points="142,80 136,76 136,84" fill="#EAB308" />
            <text x="100" y="74" fill="#111111" fontSize="12" fontWeight="900" textAnchor="middle">W</text>

            {/* Arrow H (Shirt Length) */}
            <line x1="126" y1="32" x2="126" y2="135" stroke="#EAB308" strokeWidth="1.8" />
            <polygon points="126,32 122,38 130,38" fill="#EAB308" />
            <polygon points="126,135 122,129 130,129" fill="#EAB308" />
            <text x="135" y="87" fill="#111111" fontSize="12" fontWeight="900" textAnchor="start">H</text>

            {/* Arrow S (Shorts Length) */}
            <line x1="145" y1="148" x2="145" y2="205" stroke="#EAB308" strokeWidth="1.8" />
            <polygon points="145,148 141,154 149,154" fill="#EAB308" />
            <polygon points="145,205 141,199 149,199" fill="#EAB308" />
            <text x="136" y="180" fill="#111111" fontSize="12" fontWeight="900" textAnchor="middle">S</text>
          </svg>
          <span className="text-xs font-bold uppercase text-gray-800 tracking-wider mt-4">
            Tolerance: 2cm
          </span>
          {/* Instructions */}
          <div className="border-t pt-4 mt-8">
            <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider mb-2">Instructions:</h4>
            <p className="text-[10px] text-gray-400 font-semibold leading-relaxed ">
              Compare the measurements you see in the table with a garment of your size that you already own. Spread it out on a flat surface, take the measurements as indicated by the arrows and choose the size that's right for you.
            </p>
          </div>
        </div>

        {/* Right Side: Size Chart Table */}
        <div className="lg:col-span-7 w-full overflow-x-auto border border-black rounded-[24px]">
          <table className="min-w-full text-center text-sm font-semibold uppercase tracking-wider text-gray-900 border-collapse">
            <thead>
              <tr className="bg-[#222222] text-white">
                <th className="py-4 px-3 text-left pl-6 w-1/4">
                  <span className="text-[11px] font-black tracking-widest block">SIZE</span>
                  <span className="text-[9px] font-bold text-gray-300 block lowercase tracking-wider mt-0.5">(euro)</span>
                </th>
                <th className="py-4 px-3 w-1/4">
                  <span className="text-[11px] font-black tracking-widest block">W</span>
                  <span className="text-[9px] font-bold text-gray-300 block lowercase tracking-wider mt-0.5">(cm)</span>
                </th>
                <th className="py-4 px-3 w-1/4">
                  <span className="text-[11px] font-black tracking-widest block">H</span>
                  <span className="text-[9px] font-bold text-gray-300 block lowercase tracking-wider mt-0.5">(cm)</span>
                </th>
                <th className="py-4 px-3 w-1/4">
                  <span className="text-[11px] font-black tracking-widest block">S</span>
                  <span className="text-[9px] font-bold text-gray-300 block lowercase tracking-wider mt-0.5">(cm)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {SIZE_CHART.map((row) => (
                <tr key={row.size} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-3 text-left pl-6">
                    <span className="font-black text-gray-900 block leading-tight">{row.size}</span>
                    {row.age && (
                      <span className="text-[10px] font-semibold text-gray-400 block lowercase tracking-wider mt-0.5">
                        {row.age}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-black text-gray-900">{row.chest}</td>
                  <td className="py-3 px-3 font-black text-gray-900">{row.length}</td>
                  <td className="py-3 px-3 font-black text-gray-900">{row.waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


    </section>
  );
}
