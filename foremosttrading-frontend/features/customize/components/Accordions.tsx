"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

export function Accordions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open "Important Info" by default

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const accordionItems = [
    {
      title: "Important Information",
      icon: <Info className="w-4 h-4 text-[#EF892A]" />,
      content: (
        <ul className="list-disc pl-4 text-[11px] text-gray-500 font-medium leading-relaxed  flex flex-col gap-2.5">
          <li>
            Do not upload, copy/paste or write any logos that are protected by copyright and related laws or penalties or charges and fines or any custom customizations. Read our guidelines.
          </li>
          <li>
            USMSF logos must always be visible and outstanding, not minor the signs or change the colors of our logos for visual check (without notice).
          </li>
          <li>
            It is not possible to place logos, text settings on the collar, cuffs, borders, seams or near the hem.
          </li>
          <li>
            Non-customisable models: you will only be able to change the color.
          </li>
          <li>
            Carefully check the orders details as the limitations relating to color customisation and sizes.
          </li>
        </ul>
      ),
    },
    {
      title: "Minimum Order",
      content: (
        <p className="text-[11px] text-gray-500 font-semibold">
          Our minimum order quantity is 10 kits per design style. For team-wide distributions or bulk custom pricing, please request a quote.
        </p>
      ),
    },
    {
      title: "Color Variants",
      content: (
        <p className="text-[11px] text-gray-500 font-semibold">
          Jersey bodies, collars, borders, shorts, and socks colors can be matched exactly to your club's Pantone values or hex specifications.
        </p>
      ),
    },
    {
      title: "Size Guide",
      content: (
        <p className="text-[11px] text-gray-500 font-semibold">
          Refer to the measurements table below. Sizing measures width (chest), length (shirt height), and waist height in centimeters.
        </p>
      ),
    },
    {
      title: "Delivery Timing",
      content: (
        <p className="text-[11px] text-gray-500 font-semibold">
          Production takes 7-10 business days after digital layout approval. Fast shipping options are coordinated dynamically during checkout.
        </p>
      ),
    },
    {
      title: "Print On Demand",
      content: (
        <p className="text-[11px] text-gray-500 font-semibold">
          All custom kit orders are printed on-demand with premium dye-sublimation to guarantee colors will never wash out or peel.
        </p>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2.5 mt-6">
      {accordionItems.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="border border-gray-100 rounded-xl bg-white overflow-hidden shadow-2xs"
          >
            <button
              onClick={() => toggleIndex(i)}
              className="w-full flex items-center justify-between p-4 text-left select-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-xs font-black uppercase tracking-wider text-gray-800">
                  {item.title}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#EF892A]" : ""
                  }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-50 bg-white animate-in fade-in slide-in-from-top-1 duration-200">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
